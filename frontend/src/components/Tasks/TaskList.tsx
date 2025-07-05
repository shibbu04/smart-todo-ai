import React from 'react';
import { Task, Category } from '../../types';
import { TaskCard } from './TaskCard';
import { Brain, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  loading: boolean;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

export function TaskList({ 
  tasks, 
  categories, 
  loading, 
  onEditTask, 
  onDeleteTask, 
  onToggleComplete 
}: TaskListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-600 mb-4">
          Create your first task and let AI help you organize it!
        </p>
      </div>
    );
  }

  const getTasksByStatus = () => {
    const pending = tasks.filter(t => t.status === 'pending');
    const inProgress = tasks.filter(t => t.status === 'in_progress');
    const completed = tasks.filter(t => t.status === 'completed');

    return { pending, inProgress, completed };
  };

  const { pending, inProgress, completed } = getTasksByStatus();

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-orange-700">{pending.length}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-700">{inProgress.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-700">{completed.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Task Sections */}
      <div className="space-y-6">
        {pending.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-500" />
              Pending Tasks ({pending.length})
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pending.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  category={categories.find(c => c.id === task.category)}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onToggleComplete={onToggleComplete}
                />
              ))}
            </div>
          </div>
        )}

        {inProgress.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
              In Progress ({inProgress.length})
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {inProgress.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  category={categories.find(c => c.id === task.category)}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onToggleComplete={onToggleComplete}
                />
              ))}
            </div>
          </div>
        )}

        {completed.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Completed Tasks ({completed.length})
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completed.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  category={categories.find(c => c.id === task.category)}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onToggleComplete={onToggleComplete}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}