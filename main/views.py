from django.shortcuts import render
from django.http import HttpResponse
from .models import List, Entry

def index(request):
  data = "Main View"
  lists = List.objects.all()
  entries = Entry.objects.all()

  return render(request, "main/index.html", {"data": data, "lists": lists, "entries": entries})