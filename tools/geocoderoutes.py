import urllib
import urllib2
import json
import time

def geocodemq(address,key):
    #success = True
    #badkey = False
    #try:
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
        _json = json.loads(rawjson)
        #print _json

        #if len(_json['results'][0]['locations']) == 0:
        #    if _json['info']['statuscode'] == 403:
        #        badkey = True
        #        raise Exception("Bad Key")

        lat = _json['results'][0]['locations'][0]['latLng']['lat']
        lng = _json['results'][0]['locations'][0]['latLng']['lng']
        success = True
    #except:
    #    success = False
    #    lat = 0
    #    lng = 0
        return (success,lat,lng)

def geocoderoutes(routes):

    # if you have a normal mq developers key, you will need two
    # of them because they can only do 5000 a piece.
    keyA = ""
    keyB = ""

    f = open("routes2011geocoded.json","w")
    f.write("[")

    i = 0
    for route in routes:

        #print route

        begin = route['Begin_Description']
        end = route['End_Description']
        name = route['Name']
        city = route['Muncipality']
        state = "NY"

        # leave the lat and lng of begin and end zero if we don't have
        # enough data to do the geo code
        if begin != "" and end != "":

            beginaddress = "{0} and {1}, {2}, {3}".format(begin,name,city,state)
            for j in range(0,10):
                #beginsuccess,beginlat,beginlng = dstkgeocode(beginaddress)
                beginsuccess,beginlat,beginlng = geocodemq(beginaddress,keyA)
                if beginsuccess:
                    break
                else:
                #    print "Warning: datasciencetoolkit.org failed to return a valid response ... trying again."
                #    time.sleep(.5)
                    raise Exception("Unable to GeoCode Address")

            endaddress = "{0} and {1}, {2}, {3}".format(end,name,city,state)
            for j in range(0,10):
                #endsuccess,endlat,endlng = dstkgeocode(endaddress)
                endsuccess,endlat,endlng = geocodemq(endaddress,keyB)
                if endsuccess:
                    break
                else:
                    #print "Warning: datasciencetoolkit.org failed to return a valid response ... trying again."
                    #time.sleep(.5)
                    raise Exception("Unable to GeoCode Address")

            # if successful, then update the fields
            if beginsuccess == False or endsuccess == False:
                raise Exception("Error: geocode failure.")
            else:
                route['begin_latitude'] = beginlat
                route['begin_longitude'] = beginlng
                route['end_latitude'] = endlat
                route['end_longitude'] = endlng

                print "[{8}] Success! {0} and {1}: ({2},{3}) to {4} and {5}: ({6},{7})".format(begin,name,beginlat,beginlng,end,name,endlat,endlng,i)

        # write it out to the file. we are doing this every time because
        # the data is too valuable to loose on the last iteration (read: i don't
        # code good)
        output = "%s," % json.dumps(route)
        if i == len(routes)-1:
            output = output[:-1] # remove the comma for the last one ...
        f.write(output)

        # so we don't get banned from MapQuest ...
        #time.sleep(.25)

        i += 1

        #raise Exception("debug. stop.")

    f.write("]")
    f.close()

    return

def main():

    print "Reading input file ..."

    f = open("routes2011.json","r")
    routes = json.loads(f.read())
    f.close()

    print "Geocoding {0} Routes ...".format(len(routes))

    geocoderoutes(routes)

    print "Done."

main()

