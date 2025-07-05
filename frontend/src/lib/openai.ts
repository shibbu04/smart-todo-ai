import { AIResponse } from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function getAITaskSuggestions(
  taskTitle: string,
  context: string = ''
): Promise<AIResponse> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = `
    You are a smart task management assistant. Analyze the following task and provide suggestions:
    
    Task: ${taskTitle}
    Context: ${context}
    
    Please provide a JSON response with:
    - improved_description: A more detailed and clear description
    - priority_score: A number from 0-100 indicating priority
    - suggested_deadline: A suggested deadline in ISO format (within next 30 days)
    - suggested_category: One of: work, personal, health, learning, finance, shopping, travel
    - confidence: Your confidence level (0-100) in these suggestions
    
    Keep suggestions practical and actionable.
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful task management assistant. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const aiResponse = JSON.parse(data.choices[0].message.content);
    
    return aiResponse;
  } catch (error) {
    console.error('AI suggestion error:', error);
    // Return default suggestions if AI fails
    return {
      improved_description: taskTitle,
      priority_score: 50,
      suggested_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      suggested_category: 'personal',
      confidence: 0,
    };
  }
}