from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import List, Entry

def combineAll():
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
  
  return dataCombined

# ROUTES:

def index(request):
  lists = List.objects.all()
  entries = Entry.objects.all()

  return render(request, "main/index.html", {"lists": lists, "entries": entries})

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
    updatedList.save(update_fields=["archived"])

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
    updatedList.save(update_fields=["collapsed"])

    allData = combineAll()

    return JsonResponse(allData, safe=False)
  else:
    return HttpResponse("no update")

def update_list(request):
  if request.method == "POST":
    list_id = request.POST.get("id")
    title = request.POST.get("title")

    updatedList = List(id=list_id, title=title)
    updatedList.save(update_fields=["title"])

    allData = combineAll()

    return JsonResponse(allData, safe=False)
  else:
    return HttpResponse("no update")

# ENTRIES:

def new_entry(request):
  if request.method == "POST":
    text = request.POST.get("text")
    amount = request.POST.get("amount")
    header_id = request.POST.get("id")
    
    newEntry = Entry(header_id=header_id, text=text, amount=amount)
    newEntry.save()

    allData = combineAll()

    return JsonResponse(allData, safe=False)
  else:
    return HttpResponse("no entry")

def delete_entry(request):
  if request.method == "POST":
    entry_id = request.POST.get("id")
    
    entry = Entry(id=entry_id)
    entry.delete()

    allData = combineAll()

    return JsonResponse(allData, safe=False)
  else:
    return HttpResponse("no entry")

#def check_entry(request):

#def edit_entry(request):

# ALL:

def get_all(request):
  lists = list(List.objects.values())
  entries = list(Entry.objects.values())

  allData = combineAll()

  return JsonResponse(allData, safe=False)