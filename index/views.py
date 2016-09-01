from django.shortcuts import render, HttpResponse
from urllib import request as req, parse
import json
from index.models import *
# Create your views here.

def index_view(request):
    if request.method == 'POST':
        if 'artist_name' in request.POST:
            artist_name = request.POST['artist_name']
            if artist_name:
                params = parse.urlencode({'q': artist_name, 'type': 'artist'})
                req_obj = req.Request("https://api.spotify.com/v1/search?%s" % params )
                req_obj.add_header('Accept', ' application/json')
                r = req.urlopen(req_obj)
                data = json.loads(r.read().decode("utf-8"))
                output = json.dumps(data['artists']['items'], indent=4, separators=(',', ':'))
                return HttpResponse(output)
            else:
                return HttpResponse('Write at least 1 symbol')
        else:
            try:
                name = request.POST['name']
                if 'image_url' in request.POST:
                    image_url = request.POST['image_url']
                    entry = Artist(name=name, image_url=image_url)
                else:
                    entry = Artist(name=name)
                entry.save()
                return HttpResponse('OK')
            except Exception as e:
                return HttpResponse('Error: ' + str(e))
    db_values = Artist.objects.all().values()
    return render(request, 'index.html', {'db_values': db_values})
