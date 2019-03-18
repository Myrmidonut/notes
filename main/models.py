from django.db import models

class List(models.Model):
  title = models.CharField(max_length=255)
  collapsed = models.BooleanField(default=False)
  archived = models.BooleanField(default=False)
  user = models.CharField(max_length=255, default="anonymous")
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

class Item(models.Model):
  header = models.ForeignKey(List, on_delete=models.CASCADE, null=True)
  text = models.CharField(max_length=255)
  checked = models.BooleanField(default=False)