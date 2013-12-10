import simplejson
import urllib
import urllib2

key = ""

def geocodemq(address):
    vals = {'location': address}
    qstr = urllib.urlencode(vals)
    #print "QSTR = '{0}'".format(qstr)
    reqstr = "http://www.mapquestapi.com/geocoding/v1/address?key={0}&outFormat=json&maxResults=1&{1}".format(key,qstr)
    #print "Sending: {0}".format(reqstr)
    _json = simplejson.loads(urllib.urlopen(reqstr).read())
    lat = _json['results'][0]['locations'][0]['latLng']['lat']
    lng = _json['results'][0]['locations'][0]['latLng']['lng']
    return ({'lat': lat,'lng': lng})

def getjson(frm, to):
    key = ""
    #frm = frm.replace(' ','%20')
    #to = to.replace(' ','%20')
    #url = "http://open.mapquestapi.com/directions/v2/route?key={0}&ambiguities=ignore&from={1}&to={2}".format(key,frm,to)
    

    _from = geocodemq(frm)
    from_lat = _from['lat']
    from_lng = _from['lng']

    #print "From: '{0}' - ({1}, {2})".format(frm,from_lat,from_lng)

    _to = geocodemq(to)
    to_lat = _to['lat']
    to_lng = _to['lng']

    #print "To: '{0}' - ({1}, {2})".format(to,to_lat,to_lng)

  
    obj = {
           "locations":[
             {
               "latLng":{
                 "lat": from_lat,
                 "lng": from_lng,
               }
             },
             {
               "latLng":{
                 "lat": to_lat,
                 "lng": to_lng,
               }
             }
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

    json = simplejson.dumps(obj).replace(' ','').replace('"','%22')
    url = "http://www.mapquestapi.com/directions/v2/route?key={0}&json={1}".format(key,json)
   
    #print url
 
    headers = {
      'Cache-Control': 'no-cache',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.57 Safari/537.36',
      'Accept-Language': 'en-US,en',
    }

    req = urllib2.Request(url, urllib.urlencode({}), headers)
    response = urllib2.urlopen(req)
    rawjson = response.read()

    #json = urllib2.urlopen(url).read()
    response = simplejson.loads(rawjson)
    return response

def main():

    frm = "Crotona Ave & Boston Rd New York ,NY"
    to = "Southern Blvd & Boston Rd New York, NY"
    json = getjson(frm,to)

    #print json

    print json['route']['shape']['shapePoints']

    return

    legs = json['route']['legs']

    points = []

    for leg in legs:
        for maneuver in leg['maneuvers']:
            lat = maneuver['startPoint']['lat']
            lng = maneuver['startPoint']['lng']

            points.append({'lat': lat, 'lng': lng})

    print points
main()
