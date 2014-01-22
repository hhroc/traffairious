import json
import urllib
import urllib2
import subprocess
import re

def getshapepoints(fromlat,fromlng,tolat,tolng,key):

    #print "Getting directions for ({0},{1}) -> ({2},{3}) ...".format(fromlat,fromlng,tolat,tolng)

    obj = {
           "locations":[
             {"latLng":{
                 "lat": fromlat,
                 "lng": fromlng}
             },
             {"latLng":{
                 "lat": tolat,
                 "lng": tolng}}
           ],
           "mapState":{
             "center":{
               "lat":42.3482,
               "lng":-75.1890
             },
             "width":3750,
             "height":1400,
             "scale":433342,
           }#,
           #"options":{
           #  "shapeFormat":"cmp6"
           #}
          }

    jsonobj = json.dumps(obj).replace(' ','').replace('"','%22')
    url = "http://www.mapquestapi.com/directions/v2/route?key={0}&json={1}".format(key,jsonobj)

    headers = {
      'Cache-Control': 'no-cache',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.57 Safari/537.36',
      'Accept-Language': 'en-US,en',
    }

    #try:
    if True:
        req = urllib2.Request(url, urllib.urlencode({}), headers)
        response = urllib2.urlopen(req)
        rawjson = response.read()

        print rawjson

        response = json.loads(rawjson)

        shapepoints = response['route']['shape']['shapePoints']

        #shapepoints = []
        #for

        #print shapepoints
        #raise Exception('debug')

        success = True

        #printf "Obtained Shape Points Successfully."

    #except:
    #    success = False
    #    shapepoints = ""
    #    #print "\n\nERROR\n\n"
    #    #print json.dumps(response)
    #    print "\n\tERROR: Unable to get shape points"

    return success,shapepoints


if __name__ == "__main__":

    key = ""
    with open("mqkey.txt","r") as f:
        key = f.read().strip()

    filename = "../data/monroe_loc_data.json"

    with open(filename) as f:
        routes = json.loads(f.read())

    print "Loaded {0} routes successfully.".format(len(routes))

    monroeroutes = []
    count = 0
    for route in routes:
        beginlat = route['begin_loc'].split(',')[0].strip()
        beginlng = route['begin_loc'].split(',')[1].strip()
        endlat = route['end_loc'].split(',')[0].strip()
        endlng = route['end_loc'].split(',')[1].strip()    

        print "Trying to get shape points for ({0},{1}) -> ({2}, {3})".format(beginlat,beginlng,endlat,endlng)

        success,shapepoints = getshapepoints(beginlat,beginlng,endlat,endlng,key)

        if success:

            route['route_path'] = shapepoints

            print "\tSUCCESS"
            count += 1
        else:
            print "\tERROR"

        monroeroutes.append(route)

    print "Shape points decoded for {0} routes successfully.".format(count)

    with open("../data/monroe_final.json","w") as f:
        f.write(json.dumps(monroeroutes))

    print "Done."
