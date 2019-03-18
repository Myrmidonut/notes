from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import List, Item
from datetime import datetime

# MIDDLEWARE:

def combineAll():
  lists = list(List.objects.values())
  items = list(Item.objects.values())

  dataCombined = {}

  for lis in lists:
    dataCombined[lis["id"]] = {
      "id": lis["id"],
      "title": lis["title"],
      "collapsed": lis["collapsed"],
      "archived": lis["archived"],
      "user": lis["user"],
      "created_at": lis["created_at"].strftime("%Y-%m-%d-%H-%M-%S"),
      "updated_at": lis["updated_at"].strftime("%Y-%m-%d-%H-%M-%S"),
      "items": {}
    }

    for item in items:
      if item["header_id"] == lis["id"]:
        dataCombined[lis["id"]]["items"][item["id"]] = {
          "id": item["id"],
          "header_id": item["header_id"],
          "text": item["text"],
          "checked": item["checked"]
        }
  
  return dataCombined

# ROUTES:

def index(request):
  lists = List.objects.all()
  items = Item.objects.all()

  return render(request, "main/index.html", {"lists": lists, "items": items})

# API:

# LISTS:

def new_list(request):
  if request.method == "POST":
    title = request.POST.get("title")

    newList = List(title=title)
    newList.save()

    allData = combineAll()

    return JsonResponse(allData, safe=False)
  else:
    return HttpResponse("post")

def archive_list(request):
  if request.method == "POST":
    list_id = request.POST.get("id")
    archived = False

    if request.POST.get("archived") == "true":
      archived = True
    else:
      archived = False

    updatedList = List(id=list_id, archived=archived)
    updatedList.save(update_fields=["archived", "updated_at"])

    allData = combineAll()

    return JsonResponse(allData, safe=False)
  else:
    return HttpResponse("no update")

def collapse_list(request):
  if request.method == "POST":
    list_id = request.POST.get("id")
    collapsed = False

    if request.POST.get("collapsed") == "true":
      collapsed = True
    else:
      collapsed = False

    updatedList = List(id=list_id, collapsed=collapsed)
    updatedList.save(update_fields=["collapsed", "updated_at"])

    allData = combineAll()

    return JsonResponse(allData, safe=False)
  else:
    return HttpResponse("no update")

def update_list(request):
  if request.method == "POST":
    list_id = request.POST.get("id")
    title = request.POST.get("title")

    updatedList = List(id=list_id, title=title)
    updatedList.save(update_fields=["title", "updated_at"])

    allData = combineAll()

    return JsonResponse(allData, safe=False)
  else:
    return HttpResponse("no update")

# ITEMS:

def new_item(request):
  if request.method == "POST":
    text = request.POST.get("text")
    header_id = request.POST.get("id")
    
    newItem = Item(header_id=header_id, text=text)
    newItem.save()

    allData = combineAll()

    return JsonResponse(allData, safe=False)
  else:
    return HttpResponse("no item")

def delete_item(request):
  if request.method == "POST":
    item_id = request.POST.get("id")
    
    item = Item(id=item_id)
    item.delete()

    allData = combineAll()

    return JsonResponse(allData, safe=False)
  else:
    return HttpResponse("no item")

def check_item(request):
  if request.method == "POST":
    item_id = request.POST.get("id")
    checked = False
    
    if request.POST.get("checked") == "true":
      checked = True
    else:
      checked = False

    updatedItem = Item(id=item_id, checked=checked)
    updatedItem.save(update_fields=["checked"])

    allData = combineAll()

    return JsonResponse(allData, safe=False)
  else:
    return HttpResponse("no item")

def update_item(request):
  if request.method == "POST":
    item_id = request.POST.get("id")
    text = request.POST.get("text")

    updatedItem = Item(id=item_id, text=text)
    updatedItem.save(update_fields=["text"])

    allData = combineAll()

    return JsonResponse(allData, safe=False)
  else:
    return HttpResponse("no update")

# ALL:

def get_all(request):
  lists = list(List.objects.values())
  items = list(Item.objects.values())

  allData = combineAll()

  return JsonResponse(allData, safe=False)