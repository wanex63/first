from django.db import models

class Film(models.Model):
    title = models.CharField(max_length=255)
    year = models.IntegerField()
    rating = models.FloatField()
    genre = models.CharField(max_length=100)
    poster_url = models.URLField()

    def __str__(self):
        return f"{self.title} ({self.year})"