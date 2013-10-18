import sqlite3

def readcolumns(data):
    columns = []
    #print data[1]
    for i in range(0,len(data[0])):
        name = data[0][i].strip()
        if len(name.strip()) == 4: #data[1][i].replace('-','').strip():
            isnum = True
        else:
            isnum = False
        #print "'{0}' is '{1}'".format(name,isnum) 
        columns.append((name,isnum))
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

def writedb(columns,data,outfile):
    con = sqlite3.connect(outfile)

    with con:

        cur = con.cursor()

        print "Creating table ..."

        # create the table
        query = "CREATE TABLE data(" #id INTEGER PRIMARY KEY AUTOINCREMENT,\n"
        for column in columns:
            name,isnum = column
            name = name.replace(' ','_').replace('-','')
            if name.isdigit():
                name = "Year_{0}".format(name)
            t = "TEXT"
            if isnum:
                t = "INTEGER"
            query += "{0} {1},\n".format(name,t)
        query = query[:-2]
        query += ")"
        #print query
        cur.execute(query)

        print "Loading {0} rows of data ...".format(len(data))

        # load the data
        i = 0
        perct = 0
        for row in data:
            query = "INSERT INTO data VALUES("
            if not i == 0:
                for col in row:
                    if not col.isdigit():
                        col = '"{0}"'.format(col)
                    query += "{0},".format(col)
                query = query[:-1]
                query += ")"
                #print query
                cur.execute(query)
                #print "\b."
            i += 1
            if i % (len(data) / 100) == 0:
                print "{0}% complete.".format(perct)
                perct += 1
 
        #query = query[:-1] # last coma
        #query += ")"
        #print query
        #cur.execute(query)
        #print "Done with {0}".format(i)

        cur.close()
    
    con.close()

    return

def main():

    # input file
    infile = "infile.csv"
    outfile = "outfile.sqlite"
    
    print "Reading data ..."
    data = readdata(infile)
   
    print "Reading column headers ..." 
    columns = readcolumns(data)

    print "Pushing to database ..."
    writedb(columns,data,outfile)
    
    print "Done."


main()
