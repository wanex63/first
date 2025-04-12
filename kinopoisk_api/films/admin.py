from django.contrib import admin
from .models import Film

@admin.register(Film)
class FilmAdmin(admin.ModelAdmin):
    list_display = ('title', 'year', 'genre', 'rating', 'is_published')
    list_filter = ('genre', 'year', 'is_published')
    search_fields = ('title', 'description')
    list_editable = ('rating', 'is_published')
    fieldsets = (
        ('Main', {
            'fields': ('title', 'description', 'poster_url')
        }),
        ('Details', {
            'fields': ('year', 'genre', 'duration', 'rating')
        }),
        ('Status', {
            'fields': ('is_published',)
        }),
    )