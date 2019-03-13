from django.db import models

class List(models.Model):
  title = models.CharField(max_length=255)
  collapsed = models.BooleanField(default=False)
  archived = models.BooleanField(default=False)

class Entry(models.Model):
  header = models.ForeignKey(List, on_delete=models.CASCADE, null=True)
  text = models.CharField(max_length=255)
  amount = models.FloatField(null=True)
  done = models.BooleanField(default=False)