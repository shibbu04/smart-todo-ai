import React from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MoreHorizontal,
  Edit,
  Trash2,
  Star,
  Brain
} from 'lucide-react';
import { Task, Category } from '../../types';
import { cn } from '../../lib/utils';

interface TaskCardProps {
  task: Task;
  category?: Category;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

export function TaskCard({ task, category, onEdit, onDelete, onToggleComplete }: TaskCardProps) {
  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return 'text-red-600 bg-red-50';
    if (priority >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 80) return 'High';
    if (priority >= 60) return 'Medium';
    return 'Low';
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';

  return (
    <div className={cn(
      'bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 group',
      task.status === 'completed' && 'opacity-75',
      isOverdue && 'border-red-200 bg-red-50/50'
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onToggleComplete(task.id)}
            className="flex-shrink-0 hover:scale-110 transition-transform"
          >
            {getStatusIcon(task.status)}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'text-lg font-semibold text-gray-900 truncate',
              task.status === 'completed' && 'line-through text-gray-500'
            )}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {task.ai_suggested && (
            <div className="flex items-center space-x-1 text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              <Brain className="w-3 h-3" />
              <span className="text-xs font-medium">AI</span>
            </div>
          )}
          
          <div className="relative group">
            <button className="p-1 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
            
            <div className="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-10">
              <button
                onClick={() => onEdit(task)}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          {category && (
            <div className="flex items-center space-x-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-gray-600">{category.name}</span>
            </div>
          )}
          
          <div className={cn(
            'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium',
            getPriorityColor(task.priority)
          )}>
            <Star className="w-3 h-3" />
            <span>{getPriorityLabel(task.priority)}</span>
          </div>
        </div>

        {task.due_date && (
          <div className={cn(
            'flex items-center space-x-1 text-xs',
            isOverdue ? 'text-red-600' : 'text-gray-500'
          )}>
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(task.due_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}