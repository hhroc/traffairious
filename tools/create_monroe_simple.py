import json
import re

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

if __name__ == '__main__':

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
                year = columns[i]
                break
        result['traffic_volume'] = volume
        result['traffic_year'] = year
        results.append(result)

    print "Creating Data Sets for Monroe County ..."
    muncipalities = ['brighton','brockport','chili','churchville','clarkson',
                     'east rochester','fairport','gates','greece','hamlin',
                     'henrietta','hilton','honeoye falls','irondequoit','mendon',
                     'ogden','parma','penfield','perinton','pittsford','riga',
                     'rochester','rush','scottsville','spencerport','sweden',
                     'webster','wheatland']

    monroe = []
    count = 0
    ids = []
    for result in results:
        for muncipality in muncipalities:
            if muncipality.lower() in result['muncipality'].lower():
                if result['traffic_volume'] > 50000:

                    # to cover the SAME ID IN THE DATA SET MORE THAN ONCE OMG
                    if result['rc_id'] in ids:
                        continue
                    else:
                        ids.append(result['rc_id'])

                    # clean up our data so it is easy to read
                    for key,val in result.iteritems():
                        if type(val) != type(int(0)):
                            result[key] = re.sub(' +',' ',val.lower().strip())

                    # add the route to the list
                    monroe.append(result)

    with open("../data/monroe_raw.json","w") as f:
        f.write(json.dumps(monroe))

    print "File Processed Successfully."



