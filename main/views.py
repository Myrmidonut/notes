from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import List, Entry

def index(request):
  lists = List.objects.all()
  entries = Entry.objects.all()

  return render(request, "main/index.html", {"lists": lists, "entries": entries})

def new_list(request):
  if request.method == "POST":
    print(request.POST.get("title"))

    title = request.POST.get("title")

    newList = List(title=title)
    newList.save()

    return HttpResponse(title)
  else:
    return HttpResponse("no post")

def get_all(request):
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
      if entry["header_id"] == lis["id"]:
        dataCombined[lis["id"]]["entries"][entry["id"]] = {
          "id": entry["id"],
          "header_id": entry["header_id"],
          "text": entry["text"],
          "amount": entry["amount"],
          "done": entry["done"]
        }

  return JsonResponse(dataCombined, safe=False)