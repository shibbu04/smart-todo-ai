import React, { useState } from 'react';
import { Brain, Loader2, Calendar, Star } from 'lucide-react';
import { Task, Category, AIResponse } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface TaskFormProps {
  task?: Task;
  categories: Category[];
  onSubmit: (taskData: Partial<Task>) => void;
  onCancel: () => void;
  onGetAISuggestions: (title: string, context?: string) => Promise<AIResponse>;
}

export function TaskForm({ task, categories, onSubmit, onCancel, onGetAISuggestions }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 50,
    category: task?.category || '',
    due_date: task?.due_date?.split('T')[0] || '',
    status: task?.status || 'pending' as Task['status'],
  });

  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AIResponse | null>(null);

  console.log('TaskForm - Categories received:', categories);
  console.log('TaskForm - Current form data:', formData);

  const handleAIAssist = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a task title first');
      return;
    }

    setIsLoadingAI(true);
    try {
      const suggestions = await onGetAISuggestions(formData.title, formData.description);
      console.log('AI suggestions received:', suggestions);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('AI suggestions failed:', error);
      alert('AI suggestions failed. Please try again.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const applyAISuggestions = () => {
    if (!aiSuggestions) return;

    // Find category by name (case insensitive)
    const suggestedCategory = categories.find(c => 
      c.name.toLowerCase() === aiSuggestions.suggested_category.toLowerCase()
    );

    setFormData(prev => ({
      ...prev,
      description: aiSuggestions.improved_description,
      priority: aiSuggestions.priority_score,
      due_date: aiSuggestions.suggested_deadline?.split('T')[0] || '',
      category: suggestedCategory?.id || prev.category,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }
    
    if (!formData.category) {
      alert('Please select a category');
      return;
    }

    console.log('Submitting task data:', formData);

    onSubmit({
      ...formData,
      ai_suggested: !!aiSuggestions,
    });
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 80) return 'High';
    if (priority >= 60) return 'Medium';
    return 'Low';
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return 'text-red-600';
    if (priority >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              label="Task Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title..."
              required
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAIAssist}
              disabled={isLoadingAI || !formData.title.trim()}
              variant="secondary"
              className="mt-7"
              title="Get AI suggestions"
            >
              {isLoadingAI ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Brain className="w-4 h-4" />
              )}
            </Button>
          </div>

          {aiSuggestions && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-900">AI Suggestions</h4>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    {aiSuggestions.confidence}% confident
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={applyAISuggestions}
                  size="sm"
                  variant="secondary"
                >
                  Apply All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Improved Description:</p>
                  <p className="text-gray-600">{aiSuggestions.improved_description}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Priority Score:</p>
                  <p className={`font-semibold ${getPriorityColor(aiSuggestions.priority_score)}`}>
                    {aiSuggestions.priority_score}/100 ({getPriorityLabel(aiSuggestions.priority_score)})
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Suggested Deadline:</p>
                  <p className="text-gray-600">
                    {new Date(aiSuggestions.suggested_deadline).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Category:</p>
                  <p className="text-gray-600 capitalize">{aiSuggestions.suggested_category}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  console.log('Category selected:', e.target.value);
                  setFormData(prev => ({ ...prev, category: e.target.value }));
                }}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 appearance-none bg-white"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  No categories available. Please create categories first.
                </p>
              )}
            </div>

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Task['status'] }))}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority: {formData.priority}/100 ({getPriorityLabel(formData.priority)})
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: Number(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>

            <Input
              label="Due Date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={!formData.title.trim() || !formData.category}
            className={!formData.title.trim() || !formData.category ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </div>
  );
}