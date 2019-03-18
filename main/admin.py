from django.contrib import admin
from .models import Item, List

class ListAdmin(admin.ModelAdmin):
  list_display = ("title", "collapsed", "archived", "user", "created_at", "updated_at")

class ItemAdmin(admin.ModelAdmin):
  list_display = ("header", "text", "checked")

admin.site.register(List, ListAdmin)
admin.site.register(Item, ItemAdmin)