import json
import urllib
import urllib2
import subprocess

def readcolumns(data):
    columns = []
    #print data[1]
    for i in range(0,len(data[0])):
        name = data[0][i].strip()
        #if len(name.strip()) == 4: #data[1][i].replace('-','').strip():
        #    isnum = True
        #else:
        #    isnum = False
        #print "'{0}' is '{1}'".format(name,isnum)
        columns.append(name.replace(' ','_').lower()) #,isnum))
    return columns

def readdata(infile):
    data = []
    with open(infile,'r') as f:
        lines = f.readlines()
        i = 0
        for line in lines:
            #if i == 0:
            #    columns = []
            #    for item in line.split('\t'):
            #        if item
            #        columns.append((item,isnum))
            #else:
                items = []
                for item in line.split('\t'):
                    items.append(item.strip())
                data.append(items)
        i += 0
    #print data[0][1:10]
    #print data[1][1:10]
    return data

def geocodemq(address,key):
    success = True
    lat = 0.0
    lng = 0.0
    #try:
    if True:
        #vals = json.dumps({'location': address})
        #qstr = urllib.urlencode(address)
        location = address.lower().replace('"','%22').replace(' ','+')
        #print "Address = '{0}'".format(address.replace(' ','+').lower())
        url = "http://www.mapquestapi.com/geocoding/v1/address?key={0}&outFormat=json&maxResults=1&location={1}".format(key,location)

        #print "URL = \n{0}\n".format(url)

        #url = "http:///www.mapquestapi.com/"

        # do http request
        #headers = { 'User-Agent' : 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.57 Safari/537.36' }
        #req = urllib2.Request(url, urllib.urlencode({}), headers)
        #response = urllib2.urlopen(req)
        #rawjson = response.read()

        #print url
        #response = urllib2.urlopen(url)
        #rawjson = response.read()

        p1 = subprocess.Popen(["curl", "-s", url],stdout=subprocess.PIPE)
        rawjson = p1.communicate()[0]

        #print rawjson

        _json = json.loads(rawjson)

        lat = _json['results'][0]['locations'][0]['latLng']['lat']
        lng = _json['results'][0]['locations'][0]['latLng']['lng']
    #except:
    #    success = False
    #    lat = 0
    #    lng = 0
    return (success,lat,lng)

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
    #if True:
        req = urllib2.Request(url, urllib.urlencode({}), headers)
        response = urllib2.urlopen(req)
        rawjson = response.read()

        print rawjson

        response = json.loads(rawjson)

        shapepoints = response['route']['shape']['shapePoints']
        success = True

        #printf "Obtained Shape Points Successfully."

    except:
        success = False
        shapepoints = ""
        print "\n\nERROR\n\n"
        print json.dumps(response)
        print "\n\n\tERROR: Unable to get shape points!\n\n"

    return success,shapepoints

def doDecode(encoded,precision):

    #length = encoded.length
    index = 0;
    points = []
    lat = 0;
    lng = 0;
    
    #try:
    if True:
        while (index < encoded.length):
            b = 0
            shift = 0;
            result = 0;

            while(b >= 0x20):
                index += 1
                b = ord(encoded[index]) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;

            if (result & 1):
                dlat = not (result >> 1)
            else:
                dlat = (result >> 1)

            #dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            shift = 0;
            result = 0;
        
            while( b >= 0x20 ):
                index += 1
                b = ord(encoded[index]) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;

            #var dlng:int = ((result & 1) ? ~(result >> 1) : (result >> 1));
            if (result & 1):
                dlat = not (result >> 1)
            else:
                dlat = (result >> 1)

            lng += dlng;
            #var ll:LatLng;
        
            points.append( {'lat':lat * 1e-6, 'lng':lng * 1e-6} );
                    
    #except:
    #    raise Exception("ERROR!");
    
    return points;


if __name__ == '__main__':

    key = ""
    with open("mqkey.txt","r") as f:
        key = f.read().strip()

    infile = "../data/HistoricTrafficData1977to2011.csv"
    print "Reading Data ..."
    rows = readdata(infile)

    print "Reading Column Headers ..."
    columns = readcolumns(rows)

    #print columns

    rows = rows[1:]
    #print "{0}\n".format(rows[0])
    #print "{0}\n".format(rows[1])

    colindex = 10

    print "Processing Data ..."
    results = []
    for row in rows:
        result = {}
        for i in range(0,colindex):
            result[columns[i]] = row[i]
        volume = 0;
        for i in range(11,46):
            if not row[i].strip() == '':
                volume = int(row[i])
                break
        result['traffic_volume'] = volume
        results.append(result)

    print "Creating Data Sets for Monroe County ..."
    muncipalities = ['brighton','brockport','chili','churchville','clarkson',
                     'east rochester','fairport','gates','greece','hamlin',
                     'henrietta','hilton','honeoye falls','irondequoit','mendon',
                     'ogden','parma','penfield','perinton','pittsford','riga',
                     'rochester','rush','scottsville','spencerport','sweden',
                     'webster','wheatland']
    placetypes = ['town','village','city','hamlet']
    monroe = []
    for result in results:
        for muncipality in muncipalities:
            if muncipality.lower() in result['muncipality'].lower():
                # setup
                begin = result['begin_description']
                end = result['end_description']
                name = result['name']
                city = result['muncipality']
                state = "NY"

                # decode the start possition
                beginaddress = "{0} and {1}, {2}, {3}".format(begin,name,city,state)
                beginsuccess,beginlat,beginlng = geocodemq(beginaddress,key)

                # decode the end possition
                endaddress = "{0} and {1}, {2}, {3}".format(end,name,city,state)
                endsuccess,endlat,endlng = geocodemq(endaddress,key)

                success,shapepoints = getshapepoints(beginlat,beginlng,endlat,endlng)

                # update the result
                result['begin_latitude'] = beginlat
                result['begin_longitude'] = beginlng
                result['end_latitude'] = endlat
                result['end_longitude'] = endlng
                result['shape_points'] = shapepoints

		print json.dumps(result)

                monroe.append(result)

                print "'{0}' geocoded successfully ({1},{2} -> {3},{4})".format(result['name'],beginlat,beginlng,endlat,endlng)

                #raise Exception("debug")

    print "Found {0} Routes for Monroe County.".format(len(monroe))

    with open("../data/distilled_dot_data.json","w") as f:
        f.write(json.dumps(results))

    with open("../data/monroe_dot_data.json","w") as f:
        f.write(json.dumps(monroe))

    print "File Processed Successfully."

