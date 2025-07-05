import React, { useState, useEffect } from 'react';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';
import { TaskList } from '../components/Tasks/TaskList';
import { TaskForm } from '../components/Tasks/TaskForm';
import { ContextInput } from '../components/Context/ContextInput';
import { Modal } from '../components/ui/Modal';
import { Task, Category, ContextEntry, FilterOptions } from '../types';
import { apiService } from '../lib/api';

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    category: 'all',
    priority: 'all',
    search: '',
  });

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isProcessingContext, setIsProcessingContext] = useState(false);

  // Initialize data
  useEffect(() => {
    initializeData();
  }, []);

  // Fetch tasks when filters change
  useEffect(() => {
    if (categories.length > 0) {
      fetchTasks();
    }
  }, [filters, categories]);

  const initializeData = async () => {
    try {
      setLoading(true);
      console.log('Initializing dashboard data...');
      
      // First, get or create categories
      let categoriesResponse = await apiService.getCategories();
      console.log('Categories response:', categoriesResponse.data);
      
      let categoriesData = categoriesResponse.data.results || categoriesResponse.data;
      
      // If no categories exist, create default ones
      if (!categoriesData || categoriesData.length === 0) {
        console.log('No categories found, creating defaults...');
        await apiService.createDefaultCategories();
        categoriesResponse = await apiService.getCategories();
        categoriesData = categoriesResponse.data.results || categoriesResponse.data;
      }
      
      console.log('Final categories data:', categoriesData);
      setCategories(categoriesData);
      
      // Then fetch tasks
      const tasksResponse = await apiService.getTasks(filters);
      const tasksData = tasksResponse.data.results || tasksResponse.data;
      console.log('Tasks data:', tasksData);
      setTasks(tasksData);
      
    } catch (error) {
      console.error('Error initializing data:', error);
      // Set empty arrays to prevent crashes
      setCategories([]);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      console.log('Fetching tasks with filters:', filters);
      const response = await apiService.getTasks(filters);
      const tasksData = response.data.results || response.data;
      console.log('Fetched tasks:', tasksData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSearchChange = (search: string) => {
    setFilters({ ...filters, search });
  };

  const handleCreateTask = () => {
    console.log('Opening create task modal, categories available:', categories.length);
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = async (taskData: Partial<Task>) => {
    try {
      console.log('Submitting task data:', taskData);
      
      if (editingTask) {
        await apiService.updateTask(editingTask.id, taskData);
        console.log('Task updated successfully');
      } else {
        const response = await apiService.createTask(taskData);
        console.log('Task created successfully:', response.data);
      }
      
      setIsTaskModalOpen(false);
      setEditingTask(null);
      await fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Error saving task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await apiService.deleteTask(taskId);
        await fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error deleting task. Please try again.');
      }
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      await apiService.toggleTaskStatus(taskId);
      await fetchTasks();
    } catch (error) {
      console.error('Error toggling task status:', error);
      alert('Error updating task. Please try again.');
    }
  };

  const handleContextSubmit = async (contextData: Omit<ContextEntry, 'id' | 'created_at' | 'processed'>) => {
    setIsProcessingContext(true);
    try {
      console.log('Submitting context data:', contextData);
      
      // Create context entry
      const response = await apiService.createContextEntry(contextData);
      console.log('Context entry created:', response.data);
      const contextEntry = response.data;

      // Process context to extract tasks
      const processResponse = await apiService.processContext(contextEntry.id);
      console.log('Context processing response:', processResponse.data);
      
      setIsContextModalOpen(false);
      await fetchTasks(); // Refresh tasks to show new AI-generated tasks
      
      if (processResponse.data.tasks && processResponse.data.tasks.length > 0) {
        alert(`Successfully created ${processResponse.data.tasks.length} tasks from context!`);
      } else {
        alert('Context processed but no tasks were extracted. Try with more specific content.');
      }
    } catch (error) {
      console.error('Error processing context:', error);
      alert('Error processing context. Please check your content and try again.');
    } finally {
      setIsProcessingContext(false);
    }
  };

  const getAISuggestions = async (title: string, context: string = '') => {
    try {
      console.log('Getting AI suggestions for:', { title, context });
      const response = await apiService.getAISuggestions({ title, context });
      console.log('AI suggestions response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      throw error;
    }
  };

  const taskCounts = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => 
      t.due_date && 
      new Date(t.due_date) < new Date() && 
      t.status !== 'completed'
    ).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your smart todo dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <Header
        onCreateTask={handleCreateTask}
        searchValue={filters.search}
        onSearchChange={handleSearchChange}
      />

      <div className="flex">
        <Sidebar
          categories={categories}
          filters={filters}
          onFiltersChange={setFilters}
          taskCounts={taskCounts}
        />

        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Smart Tasks
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage your tasks with AI-powered assistance
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsContextModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-colors shadow-lg hover:shadow-xl"
                >
                  Add Context
                </button>
              </div>
            </div>

            <TaskList
              tasks={tasks}
              categories={categories}
              loading={false}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          </div>
        </main>
      </div>

      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        size="lg"
      >
        <TaskForm
          task={editingTask || undefined}
          categories={categories}
          onSubmit={handleTaskSubmit}
          onCancel={() => setIsTaskModalOpen(false)}
          onGetAISuggestions={getAISuggestions}
        />
      </Modal>

      <Modal
        isOpen={isContextModalOpen}
        onClose={() => setIsContextModalOpen(false)}
        title="Add Context for AI Processing"
        size="lg"
      >
        <ContextInput
          onSubmit={handleContextSubmit}
          isProcessing={isProcessingContext}
        />
      </Modal>
    </div>
  );
}