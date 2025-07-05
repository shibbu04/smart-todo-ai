import google.generativeai as genai
import json
from datetime import datetime, timedelta
from django.conf import settings
from typing import Dict, Any
import traceback

# Configure Gemini API
try:
    if settings.GEMINI_API_KEY:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        print("Gemini API configured successfully")
    else:
        print("Warning: GEMINI_API_KEY not found in settings")
except Exception as e:
    print(f"Error configuring Gemini API: {e}")

def get_ai_task_suggestions(title: str, context: str = "") -> Dict[str, Any]:
    """
    Get AI-powered task suggestions using Google Gemini
    
    Args:
        title: The task title
        context: Additional context for the task
    
    Returns:
        Dictionary containing AI suggestions
    """
    print(f"Getting AI suggestions for title: '{title}', context: '{context}'")
    
    if not settings.GEMINI_API_KEY:
        print("No Gemini API key found, returning default suggestions")
        return get_default_suggestions(title)
    
    prompt = f"""
    You are a smart task management assistant. Analyze the following task and provide suggestions:
    
    Task: {title}
    Context: {context}
    
    Please provide a JSON response with:
    - improved_description: A more detailed and clear description (max 200 chars)
    - priority_score: A number from 0-100 indicating priority
    - suggested_deadline: A suggested deadline in ISO format (within next 30 days)
    - suggested_category: One of: work, personal, health, learning, finance, shopping, travel
    - confidence: Your confidence level (0-100) in these suggestions
    
    Keep suggestions practical and actionable. Return only valid JSON without any markdown formatting.
    """

    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        
        print(f"Gemini API response: {response.text}")
        
        # Clean the response text
        ai_response = response.text.strip()
        
        # Remove markdown code blocks if present
        if ai_response.startswith('```json'):
            ai_response = ai_response[7:]
        if ai_response.endswith('```'):
            ai_response = ai_response[:-3]
        ai_response = ai_response.strip()
        
        # Parse JSON response
        suggestions = json.loads(ai_response)
        
        # Validate and sanitize the response
        result = {
            'improved_description': suggestions.get('improved_description', title)[:200],
            'priority_score': max(0, min(100, suggestions.get('priority_score', 50))),
            'suggested_deadline': suggestions.get('suggested_deadline', 
                (datetime.now() + timedelta(days=7)).isoformat()),
            'suggested_category': suggestions.get('suggested_category', 'personal'),
            'confidence': max(0, min(100, suggestions.get('confidence', 50)))
        }
        
        print(f"Processed AI suggestions: {result}")
        return result
        
    except Exception as e:
        print(f"Gemini AI suggestion error: {e}")
        traceback.print_exc()
        return get_default_suggestions(title)

def get_default_suggestions(title: str) -> Dict[str, Any]:
    """
    Provide default suggestions when AI is not available
    """
    return {
        'improved_description': f"Complete the task: {title}",
        'priority_score': 50,
        'suggested_deadline': (datetime.now() + timedelta(days=7)).isoformat(),
        'suggested_category': 'personal',
        'confidence': 0
    }

def process_context_for_tasks(content: str, content_type: str) -> Dict[str, Any]:
    """
    Process context content to extract actionable tasks using Gemini
    
    Args:
        content: The context content (email, note, message)
        content_type: Type of content (email, note, message)
    
    Returns:
        Dictionary containing extracted tasks and suggestions
    """
    print(f"Processing context: type='{content_type}', content length={len(content)}")
    
    if not settings.GEMINI_API_KEY:
        print("No Gemini API key found, returning default context processing")
        return get_default_context_processing(content, content_type)
    
    prompt = f"""
    Analyze the following {content_type} content and extract actionable tasks:
    
    Content: {content}
    
    Please provide a JSON response with:
    - extracted_tasks: Array of task objects, each with:
      - title: Clear, actionable task title
      - description: Brief description
      - priority_score: Priority from 0-100
      - suggested_category: One of: work, personal, health, learning, finance, shopping, travel
    - summary: Brief summary of the content
    - confidence: Your confidence level (0-100) in the extraction
    
    Extract 1-5 most important actionable tasks. Return only valid JSON without any markdown formatting.
    """

    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        
        print(f"Gemini context processing response: {response.text}")
        
        # Clean the response text
        ai_response = response.text.strip()
        
        # Remove markdown code blocks if present
        if ai_response.startswith('```json'):
            ai_response = ai_response[7:]
        if ai_response.endswith('```'):
            ai_response = ai_response[:-3]
        ai_response = ai_response.strip()
        
        result = json.loads(ai_response)
        
        # Validate extracted tasks
        extracted_tasks = []
        for task in result.get('extracted_tasks', []):
            if task.get('title'):
                extracted_tasks.append({
                    'title': task.get('title', '')[:200],
                    'description': task.get('description', '')[:500],
                    'priority_score': max(0, min(100, task.get('priority_score', 50))),
                    'suggested_category': task.get('suggested_category', 'personal')
                })
        
        final_result = {
            'extracted_tasks': extracted_tasks,
            'summary': result.get('summary', 'Content processed')[:300],
            'confidence': max(0, min(100, result.get('confidence', 50)))
        }
        
        print(f"Processed context result: {final_result}")
        return final_result
        
    except Exception as e:
        print(f"Gemini context processing error: {e}")
        traceback.print_exc()
        return get_default_context_processing(content, content_type)

def get_default_context_processing(content: str, content_type: str) -> Dict[str, Any]:
    """
    Provide default context processing when AI is not available
    """
    return {
        'extracted_tasks': [{
            'title': f"Review {content_type} content",
            'description': f"Process and act on the {content_type} content provided",
            'priority_score': 50,
            'suggested_category': 'personal'
        }],
        'summary': f"Content from {content_type} needs review",
        'confidence': 0
    }