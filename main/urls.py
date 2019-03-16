from django.urls import path
from . import views

urlpatterns = [
  path("", views.index, name="index"),
  path("get_all/", views.get_all, name="get_all"),
  path("new_list/", views.new_list, name="new_list"),
  path("update_list/", views.update_list, name="update_list"),
  path("archive_list/", views.archive_list, name="archive_list"),
  path("collapse_list/", views.collapse_list, name="collapse_list"),
  path("new_entry/", views.new_entry, name="new_entry"),
  path("delete_entry/", views.delete_entry, name="delete_entry"),
  path("check_entry/", views.check_entry, name="check_entry"),
  path("update_entry/", views.update_entry, name="update_entry"),
]