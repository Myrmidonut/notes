from django.contrib import admin
from .models import Entry, List

class ListAdmin(admin.ModelAdmin):
  list_display = ("title", "collapsed", "archived")

class EntryAdmin(admin.ModelAdmin):
  list_display = ("header", "text", "amount", "done")

admin.site.register(List, ListAdmin)
admin.site.register(Entry, EntryAdmin)