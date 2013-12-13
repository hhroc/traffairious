import json

stringTypes = ['RC_ID',
               'RoadwayType',
               'Begin_Mile_Point',
               'End_Mile_Point',
               'Begin_Description',
               'End_Description',
               'Muncipality',
               'Name',
               'GISCode',
              ]

def readcsv(filename,delimiter):
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
                item = items[j].strip()
                if columns[j] not in stringTypes:
                    if item == '':
                        item = 0
                    item = int(item)
                route[columns[j]] = item
            #route['begin_latitude'] = 0
            #route['begin_longitude'] = 0
            #route['end_latitude'] = 0
            #route['end_longitude'] = 0
            routes.append(route)
    return routes

def main():

    print "Loading app ..."

    filename = "../data/HistoricTrafficData1977to2011.csv"
    delimiter = '\t'

    print "Reading routes from '%s' ..." % filename

    routes = readcsv(filename,delimiter)

    print "Processing %i routes (2011 data, 5000+ cars/hour) ..." % len(routes)

    finalroutes = []
    for route in routes:
        if route['2011'] != 0:
            if route['2011'] > 5000:
                finalroutes.append(route)
    
    print "writing out %i routes ..." % len(finalroutes)

    with open("routes2011.json","w") as f:
        f.write(json.dumps(finalroutes))

    print "Done."

main()
