from django.shortcuts import render
#from django.http import HttpResponse
from django.http import JsonResponse
from .models import List, Entry

def index(request):
  lists = List.objects.all()
  entries = Entry.objects.all()

  return render(request, "main/index.html", {"lists": lists, "entries": entries})

def json(request):
  lists = list(List.objects.values())
  entries = list(Entry.objects.values())

  data = {
    "data": {
      "lists": lists,
      "entries": entries,
    }
  }

  return JsonResponse(data, safe=False)