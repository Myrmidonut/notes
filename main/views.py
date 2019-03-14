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

  dataCombined = {}

  for lis in lists:
    dataCombined[lis["id"]] = {
      "id": lis["id"],
      "title": lis["title"],
      "collapsed": lis["collapsed"],
      "archived": lis["archived"],
      "entries": {}
    }

    for entry in entries:
      print(entry)
      
      if entry["header_id"] == lis["id"]:
        dataCombined[lis["id"]]["entries"][entry["id"]] = {
          "id": entry["id"],
          "header_id": entry["header_id"],
          "text": entry["text"],
          "amount": entry["amount"],
          "done": entry["done"]
        }
        
  #print(dataCombined)

  return JsonResponse(dataCombined, safe=False)