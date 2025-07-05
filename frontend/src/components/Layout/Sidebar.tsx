import React from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Filter,
  Briefcase,
  Home,
  Heart,
  GraduationCap,
  DollarSign,
  ShoppingCart,
  Plane
} from 'lucide-react';
import { Category, FilterOptions, TaskStats } from '../../types';
import { cn } from '../../lib/utils';

interface SidebarProps {
  categories: Category[];
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  taskCounts: TaskStats;
}

const statusIcons = {
  pending: Clock,
  in_progress: AlertCircle,
  completed: CheckCircle,
};

const categoryIcons = {
  work: Briefcase,
  personal: Home,
  health: Heart,
  learning: GraduationCap,
  finance: DollarSign,
  shopping: ShoppingCart,
  travel: Plane,
  briefcase: Briefcase,
  home: Home,
  heart: Heart,
  'graduation-cap': GraduationCap,
  'dollar-sign': DollarSign,
  'shopping-cart': ShoppingCart,
  plane: Plane,
};

export function Sidebar({ categories, filters, onFiltersChange, taskCounts }: SidebarProps) {
  const updateFilter = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-lg border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Status Filters */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Status
            </h3>
          </div>
          <div className="space-y-1">
            <button
              onClick={() => updateFilter('status', 'all')}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                filters.status === 'all' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <span>All Tasks</span>
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                {taskCounts.total}
              </span>
            </button>
            
            {Object.entries(statusIcons).map(([status, Icon]) => (
              <button
                key={status}
                onClick={() => updateFilter('status', status)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                  filters.status === status 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span className="capitalize">{status.replace('_', ' ')}</span>
                </div>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                  {taskCounts[status as keyof TaskStats] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Categories
            </h3>
          </div>
          <div className="space-y-1">
            <button
              onClick={() => updateFilter('category', 'all')}
              className={cn(
                'w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors',
                filters.category === 'all' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              All Categories
            </button>
            
            {categories.map((category) => {
              const Icon = categoryIcons[category.icon as keyof typeof categoryIcons] || Home;
              return (
                <button
                  key={category.id}
                  onClick={() => updateFilter('category', category.id)}
                  className={cn(
                    'w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors',
                    filters.category === category.id 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  />
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority Filters */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <AlertCircle className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Priority
            </h3>
          </div>
          <div className="space-y-1">
            {[
              { key: 'all', label: 'All Priorities' },
              { key: 'high', label: 'High Priority', color: 'text-red-600' },
              { key: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
              { key: 'low', label: 'Low Priority', color: 'text-green-600' },
            ].map((priority) => (
              <button
                key={priority.key}
                onClick={() => updateFilter('priority', priority.key)}
                className={cn(
                  'w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors',
                  filters.priority === priority.key 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <span className={priority.color}>{priority.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}