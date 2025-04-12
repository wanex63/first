from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Film(models.Model):
    GENRE_CHOICES = [
        ('action', 'Action'),
        ('comedy', 'Comedy'),
        ('drama', 'Drama'),
        ('horror', 'Horror'),
        ('scifi', 'Science Fiction'),
    ]

    title = models.CharField(max_length=200, db_index=True)
    year = models.IntegerField(
        validators=[
            MinValueValidator(1895),
            MaxValueValidator(2025)
        ]
    )
    description = models.TextField(blank=True)
    genre = models.CharField(max_length=20, choices=GENRE_CHOICES)
    duration = models.PositiveIntegerField(help_text="Duration in minutes")
    rating = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(10.0)]
    )
    poster_url = models.URLField(blank=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['title', 'year']),
        ]

    def __str__(self):
        return f"{self.title} ({self.year})"