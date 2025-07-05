from django.contrib import admin
from .models import Task, Category, ContextEntry

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'color', 'icon', 'user', 'created_at']
    list_filter = ['user', 'created_at']
    search_fields = ['name', 'user__username']

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'priority', 'status', 'category', 'user', 'due_date', 'ai_suggested', 'created_at']
    list_filter = ['status', 'priority', 'ai_suggested', 'category', 'user', 'created_at']
    search_fields = ['title', 'description', 'user__username']
    date_hierarchy = 'created_at'

@admin.register(ContextEntry)
class ContextEntryAdmin(admin.ModelAdmin):
    list_display = ['type', 'content_preview', 'processed', 'user', 'created_at']
    list_filter = ['type', 'processed', 'user', 'created_at']
    search_fields = ['content', 'user__username']

    def content_preview(self, obj):
        return obj.content[:100] + '...' if len(obj.content) > 100 else obj.content
    content_preview.short_description = 'Content Preview'