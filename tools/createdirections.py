import json
import urllib
import urllib2

key = ""
with open("mqkey.txt","r") as f:
    key = f.read().strip()

def getshapepoints(fromlat,fromlng,tolat,tolng):
    
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
           },
           "options":{
           "shapeFormat":"cmp6"
         }
    }

    jsonobj = json.dumps(obj).replace(' ','').replace('"','%22')
    url = "http://www.mapquestapi.com/directions/v2/route?key={0}&json={1}".format(key,jsonobj)

    headers = {
      'Cache-Control': 'no-cache',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.57 Safari/537.36',
      'Accept-Language': 'en-US,en',
    }

    try:
        req = urllib2.Request(url, urllib.urlencode({}), headers)
        response = urllib2.urlopen(req)
        rawjson = response.read()

        response = json.loads(rawjson)
    
        shapepoints = response['route']['shape']['shapePoints']
        success = True
    except:
        success = False
        shapepoints = ""

    return success,shapepoints

def main():

    print "Reading in routes ..."

    filename = "routes2011geocoded.json"
    routes =[]
    with open(filename,"r") as f:
        routes = json.loads(f.read())

    outputroutes = []

    "Getting directions for %i routes ..." % len(routes)

    f = open("routes2011shapepoints.json","w")
    f.write("[")

    i = 0
    for route in routes:
        #fromlat = route['begin_latitude']
        #fromlng = route['begin_longitude']
        #tolat = route['end_latitude']
        #tolng = route['end_longitude']

        #print route

        shapepoints = ""
        try:
            fromlat = route['begin_latitude']
            fromlng = route['begin_longitude']
            tolat = route['end_latitude']
            tolng = route['end_longitude']
        
            success,shapepoints = getshapepoints(fromlat,fromlng,tolat,tolng)
        except:
            print "[{0}] Warning! Skipping due to lack of data ...".format(i)
            
            route['begin_latitude'] = 0
            route['begin_longitude'] = 0
            route['end_latitude'] = 0
            route['end_longitude'] = 0

            #if success == False:
            #    raise Exception("Something went wrong with getting shape points for '{0}'".format(route['Name']))

        route['shapepoints'] = shapepoints

        print "[{6}] Success! {0} ({1},{2}) -> ({3},{4}) = '{5}'".format(route['Name'],fromlat,fromlng,tolat,tolng,shapepoints,i)

        #outputroutes.append(route)

        # write it out to the file. we are doing this every time because
        # the data is too valuable to loose on the last iteration (read: i don't
        # code good)
        output = "%s," % json.dumps(route)
        if i == len(routes)-1:
            output = output[:-1] # remove the comma for the last one ...
        f.write(output)
        f.flush()
 
        i += 1

    f.write("]")
    f.close()

    print "Writing out route data ..."

    with open("routes2011shapepoints.json","w") as f:
        f.write(json.dumps(outputroutes))

    print "Done."

main()
