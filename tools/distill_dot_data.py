import json

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
        columns.append(name.lower()) #,isnum))
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
                break
        result['traffic_volume'] = volume
        results.append(result)

    print "Creating Data Sets for Specific Counties ..."
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
                monroe.append(result)

    with open("../data/distilled_dot_data.json","w") as f:
        f.write(json.dumps(results))

    with open("../data/monroe_dot_data.json","w") as f:
        f.write(json.dumps(monroe))

    print "File Processed Successfully."

