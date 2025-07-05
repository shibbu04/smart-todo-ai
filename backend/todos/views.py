from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.db.models import Q, Count
from django.utils import timezone
from datetime import datetime
import traceback
from .models import Task, Category, ContextEntry
from .serializers import (
    TaskSerializer, CategorySerializer, ContextEntrySerializer,
    AITaskSuggestionSerializer, TaskStatsSerializer, UserSerializer
)
from ai_utils import get_ai_task_suggestions, process_context_for_tasks

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Category.objects.all().order_by('name')

    def perform_create(self, serializer):
        user, created = User.objects.get_or_create(
            username='default_user',
            defaults={'email': 'user@example.com'}
        )
        serializer.save(user=user)

    @action(detail=False, methods=['post'])
    def create_defaults(self, request):
        """Create default categories for the user"""
        user, created = User.objects.get_or_create(
            username='default_user',
            defaults={'email': 'user@example.com'}
        )
        
        default_categories = [
            {'name': 'Work', 'color': '#3B82F6', 'icon': 'briefcase'},
            {'name': 'Personal', 'color': '#10B981', 'icon': 'home'},
            {'name': 'Health', 'color': '#EF4444', 'icon': 'heart'},
            {'name': 'Learning', 'color': '#8B5CF6', 'icon': 'graduation-cap'},
            {'name': 'Finance', 'color': '#F59E0B', 'icon': 'dollar-sign'},
            {'name': 'Shopping', 'color': '#EC4899', 'icon': 'shopping-cart'},
            {'name': 'Travel', 'color': '#06B6D4', 'icon': 'plane'},
        ]
        
        created_categories = []
        for cat_data in default_categories:
            category, created = Category.objects.get_or_create(
                user=user,
                name=cat_data['name'],
                defaults=cat_data
            )
            if created:
                created_categories.append(category)
        
        serializer = CategorySerializer(created_categories, many=True)
        return Response({
            'message': f'Created {len(created_categories)} default categories',
            'categories': serializer.data
        })

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Task.objects.all().select_related('category')
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter and status_filter != 'all':
            queryset = queryset.filter(status=status_filter)
        
        # Filter by category
        category_filter = self.request.query_params.get('category')
        if category_filter and category_filter != 'all':
            queryset = queryset.filter(category_id=category_filter)
        
        # Filter by priority
        priority_filter = self.request.query_params.get('priority')
        if priority_filter and priority_filter != 'all':
            if priority_filter == 'high':
                queryset = queryset.filter(priority__gte=80)
            elif priority_filter == 'medium':
                queryset = queryset.filter(priority__gte=60, priority__lt=80)
            elif priority_filter == 'low':
                queryset = queryset.filter(priority__lt=60)
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
        
        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        user, created = User.objects.get_or_create(
            username='default_user',
            defaults={'email': 'user@example.com'}
        )
        serializer.save(user=user)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get task statistics for the user"""
        user_tasks = Task.objects.all()
        
        stats = {
            'total': user_tasks.count(),
            'pending': user_tasks.filter(status='pending').count(),
            'in_progress': user_tasks.filter(status='in_progress').count(),
            'completed': user_tasks.filter(status='completed').count(),
            'overdue': user_tasks.filter(
                due_date__lt=timezone.now(),
                status__in=['pending', 'in_progress']
            ).count()
        }
        
        serializer = TaskStatsSerializer(stats)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def ai_suggestions(self, request):
        """Get AI suggestions for a task using Gemini"""
        try:
            serializer = AITaskSuggestionSerializer(data=request.data)
            if serializer.is_valid():
                title = serializer.validated_data['title']
                context = serializer.validated_data.get('context', '')
                
                suggestions = get_ai_task_suggestions(title, context)
                return Response(suggestions)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"AI suggestions error: {e}")
            traceback.print_exc()
            return Response({
                'error': 'AI suggestions failed',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['patch'])
    def toggle_status(self, request, pk=None):
        """Toggle task status between pending and completed"""
        try:
            task = self.get_object()
            
            if task.status == 'completed':
                task.status = 'pending'
            else:
                task.status = 'completed'
            
            task.save()
            serializer = self.get_serializer(task)
            return Response(serializer.data)
        except Exception as e:
            print(f"Toggle status error: {e}")
            return Response({
                'error': 'Failed to toggle task status',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ContextEntryViewSet(viewsets.ModelViewSet):
    serializer_class = ContextEntrySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return ContextEntry.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        user, created = User.objects.get_or_create(
            username='default_user',
            defaults={'email': 'user@example.com'}
        )
        serializer.save(user=user)

    def create(self, request, *args, **kwargs):
        """Create context entry with better error handling"""
        try:
            print(f"Context creation request data: {request.data}")
            
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                self.perform_create(serializer)
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            else:
                print(f"Context serializer errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Context creation error: {e}")
            traceback.print_exc()
            return Response({
                'error': 'Failed to create context entry',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def process(self, request, pk=None):
        """Process context entry to extract tasks using Gemini AI"""
        try:
            context_entry = self.get_object()
            print(f"Processing context entry: {context_entry.id}")
            
            if context_entry.processed:
                return Response({
                    'message': 'Context entry already processed'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Process with Gemini AI
            result = process_context_for_tasks(
                context_entry.content, 
                context_entry.type
            )
            print(f"AI processing result: {result}")
            
            # Create tasks from extracted suggestions
            created_tasks = []
            user = context_entry.user
            
            for task_data in result['extracted_tasks']:
                try:
                    # Find or create category
                    category_name = task_data['suggested_category']
                    category, _ = Category.objects.get_or_create(
                        user=user,
                        name=category_name.title(),
                        defaults={
                            'color': '#6B7280',
                            'icon': 'folder'
                        }
                    )
                    
                    # Create task
                    task = Task.objects.create(
                        title=task_data['title'],
                        description=task_data['description'],
                        priority=task_data['priority_score'],
                        category=category,
                        ai_suggested=True,
                        user=user
                    )
                    created_tasks.append(task)
                    print(f"Created task: {task.title}")
                except Exception as task_error:
                    print(f"Error creating task: {task_error}")
                    continue
            
            # Mark context as processed
            context_entry.processed = True
            context_entry.save()
            
            # Serialize created tasks
            task_serializer = TaskSerializer(created_tasks, many=True)
            
            return Response({
                'message': f'Created {len(created_tasks)} tasks from context',
                'tasks': task_serializer.data,
                'summary': result['summary'],
                'confidence': result['confidence']
            })
            
        except Exception as e:
            print(f"Context processing error: {e}")
            traceback.print_exc()
            return Response({
                'error': 'Failed to process context',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return User.objects.all()

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user information"""
        user, created = User.objects.get_or_create(
            username='default_user',
            defaults={'email': 'user@example.com'}
        )
        serializer = self.get_serializer(user)
        return Response(serializer.data)