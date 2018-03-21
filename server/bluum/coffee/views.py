import json
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Roaster, Coffee, Brew


def index(request):
    return HttpResponse("Hello, world. You're at the coffee index.")


def list_coffee(request):
    coffees = Coffee.objects.all()
    data = [c.to_dict() for c in coffees]
    return JsonResponse({'coffees': data})
