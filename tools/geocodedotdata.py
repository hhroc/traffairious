import urllib
import urllib2
import simplejson
import time

key = ""
with open("mqkey.txt","r") as f:
    key = f.read().strip()

stringTypes = ['RC_ID',
               'RoadwayType',
               'Begin_Mile_Point',
               'End_Mile_Point',
               'Begin Description',
               'End Description',
               'Muncipality',
               'Name',
               'GISCode',
              ]

def geocodemq(address):
    success = True
    try:
        # build URL
        vals = {'location': address}
        qstr = urllib.urlencode(vals)
        url = "http://www.mapquestapi.com/geocoding/v2/address?key={0}&outFormat=json&maxResults=1&{1}".format(key,qstr)
 
        # do http request
        headers = { 'User-Agent' : 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.57 Safari/537.36' }
        req = urllib2.Request(url, urllib.urlencode({}), headers)
        response = urllib2.urlopen(req)
        rawjson = response.read()

        # pull out lat/lng from json response
        _json = simplejson.loads(rawjson)
        #print _json
        lat = _json['results'][0]['locations'][0]['latLng']['lat']
        lng = _json['results'][0]['locations'][0]['latLng']['lng']
    except:
        success = False
        lat = 0
        lng = 0
    return (success,lat,lng)

def readdata(filename,delimiter):
    routes = []
    lines = []
    with open(filename,"r") as f:
        lines = f.readlines()
    columns = []
    for i in range(0,len(lines)):
        items = lines[i].split(delimiter)
        # column heads (will be keys in json)
        if i == 0:
            for item in items:
                name = item.strip().replace(' ','_')
                columns.append(name)
        else:
            route = {}
            for j in range(0,len(items)):
                item = items[j]
                if item in stringTypes:
                    item = int(item)
                route[columns[j]] = item
            route['begin_latitude'] = 0
            route['begin_longitude'] = 0
            route['end_latitude'] = 0
            route['end_longitude'] = 0
            routes.append(route)
    return routes

def geocoderoutes(routes):
    
    f = open("routes_geocoded.json","w")
    f.write("[")

    i = 0;
    for route in routes:

        begin = route['Begin_Description']
        end = route['End_Description']
        name = route['Name']
        city = route['Muncipality']
        state = "NY"

        # leave the lat and lng of begin and end zero if we don't have
        # enough data to do the geo code
        if begin != "" and end != "":
            
            # do geocode
            beginaddress = "{0} and {1}, {2}, {3}".format(begin,name,city,state)
            beginsuccess,beginlat,beginlng = geocodemq(beginaddress)
            endaddress = "{0} and {1}, {2}, {3}".format(end,name,city,state)
            endsuccess,endlat,endlng = geocodemq(endaddress)
            
            # if successful, then update the fields
            if beginsuccess == False or endsuccess == False:
                print "Error: geocode failure."
            else:
                route['begin_latitude'] = beginlat
                route['begin_longitude'] = beginlng
                route['end_latitude'] = endlat
                route['end_longitude'] = endlng

                print "Success! {0} and {1}: ({2},{3}) to {4} and {5}: ({6},{7})".format(begin,name,beginlat,beginlng,end,name,endlat,endlng)

        # write it out to the file. we are doing this every time because
        # the data is too valuable to loose on the last iteration (read: i don't
        # code good)
        output = "%s," % simplejson.dumps(route)
        if i == len(routes)-1:
            output = output[:-1] # remove the comma for the last one ...
        f.write(output)

        # so we don't get banned from MapQuest ...
        time.sleep(1)

        i += 1

        #raise Exception("debug. stop.")

    f.write("]")
    f.close()

    return

def main():

    print "Reading DOT data file ..."

    filename = "../data/HistoricTrafficData1977to2011.csv"
    delimiter = '\t'
    routes = readdata(filename,delimiter)

    print "Done."

    print "Geo Coding %i routes ..." % len(routes)

    geocoderoutes(routes)

    print "Done."

main()
