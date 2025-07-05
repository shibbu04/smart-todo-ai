from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Task, Category, ContextEntry

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class CategorySerializer(serializers.ModelSerializer):
    task_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'color', 'icon', 'created_at', 'task_count']
        read_only_fields = ['created_at']

    def get_task_count(self, obj):
        return obj.tasks.count()

    def create(self, validated_data):
        # Get or create default user
        user, created = User.objects.get_or_create(
            username='default_user',
            defaults={'email': 'user@example.com'}
        )
        validated_data['user'] = user
        return super().create(validated_data)

class TaskSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)
    priority_label = serializers.CharField(read_only=True)
    
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'priority', 'priority_label',
            'status', 'category', 'category_name', 'category_color',
            'due_date', 'ai_suggested', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        # Get or create default user
        user, created = User.objects.get_or_create(
            username='default_user',
            defaults={'email': 'user@example.com'}
        )
        validated_data['user'] = user
        return super().create(validated_data)

    def validate_category(self, value):
        # For development, allow any category
        return value

class ContextEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContextEntry
        fields = ['id', 'content', 'type', 'processed', 'created_at']
        read_only_fields = ['created_at', 'processed']

    def create(self, validated_data):
        # Get or create default user
        user, created = User.objects.get_or_create(
            username='default_user',
            defaults={'email': 'user@example.com'}
        )
        validated_data['user'] = user
        return super().create(validated_data)

class AITaskSuggestionSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    context = serializers.CharField(required=False, allow_blank=True)

class TaskStatsSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    pending = serializers.IntegerField()
    in_progress = serializers.IntegerField()
    completed = serializers.IntegerField()
    overdue = serializers.IntegerField()