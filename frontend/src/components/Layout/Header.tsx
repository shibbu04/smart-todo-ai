import React from 'react';
import { Brain, Plus, Search, Bell, User } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  onCreateTask: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function Header({ onCreateTask, searchValue, onSearchChange }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Smart Todo
                </h1>
                <p className="text-xs text-gray-500">AI-Powered Task Management</p>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button onClick={onCreateTask} className="hidden sm:flex">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
            <Button onClick={onCreateTask} variant="primary" className="sm:hidden p-2">
              <Plus className="w-5 h-5" />
            </Button>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Smart User</p>
                <p className="text-xs text-gray-500">Premium Plan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}