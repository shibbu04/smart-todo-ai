import React, { useState } from 'react';
import { Brain, MessageSquare, Mail, FileText, Send, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { ContextEntry } from '../../types';

interface ContextInputProps {
  onSubmit: (context: Omit<ContextEntry, 'id' | 'created_at' | 'processed'>) => void;
  isProcessing?: boolean;
}

export function ContextInput({ onSubmit, isProcessing }: ContextInputProps) {
  const [formData, setFormData] = useState({
    content: '',
    type: 'note' as ContextEntry['type'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      alert('Please enter some content');
      return;
    }

    onSubmit({
      content: formData.content,
      type: formData.type,
    });

    setFormData({ content: '', type: 'note' });
  };

  const typeIcons = {
    note: FileText,
    email: Mail,
    message: MessageSquare,
  };

  const TypeIcon = typeIcons[formData.type];

  const placeholderText = {
    note: 'Enter your notes here...\n\nExample: "Need to prepare presentation for Monday meeting, review quarterly reports, and schedule team lunch"',
    email: 'Paste email content here...\n\nExample: "Hi John, Please review the attached documents and send feedback by Friday. Also, don\'t forget about the client meeting next week."',
    message: 'Paste message content here...\n\nExample: "Remember to buy groceries, pick up dry cleaning, and call mom about weekend plans"'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Context Input</h3>
          <p className="text-sm text-gray-600">
            Add context for AI to generate better task suggestions
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Content Type"
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ContextEntry['type'] }))}
        >
          <option value="note">Note</option>
          <option value="email">Email</option>
          <option value="message">Message</option>
        </Select>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <TypeIcon className="inline w-4 h-4 mr-1" />
            Content
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder={placeholderText[formData.type]}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 resize-none"
            required
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How it works:</p>
              <p>AI will analyze your content and automatically extract actionable tasks with suggested priorities, categories, and deadlines.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            AI will analyze this content to suggest relevant tasks
          </div>
          <Button
            type="submit"
            disabled={!formData.content.trim() || isProcessing}
            className="flex items-center space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Process Context</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}