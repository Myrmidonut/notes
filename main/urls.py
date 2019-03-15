from django.urls import path
from . import views

urlpatterns = [
  path("", views.index, name="index"),
  path("get_all/", views.get_all, name="get_all"),
  path("new_list/", views.new_list, name="new_list"),
  path("update_list/", views.update_list, name="update_list"),
  path("archive_list/", views.archive_list, name="archive_list"),
  path("collapse_list/", views.collapse_list, name="collapse_list"),
  path("new_entry/", views.new_entry, name="new_entry")
]