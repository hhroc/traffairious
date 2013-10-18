import sqlite3
import json

def dosearch(filename,town):
    #town = "town of owego"
    con = sqlite3.connect(filename) #"infile.sqlite")
    with con:
        cur = con.cursor()
        cur.execute("""SELECT RoadwayType,Begin_Mile_Point,End_Mile_Point,Begin_Description,
                          End_Description,Muncipality,Name,GISCode,Functional_Class,
                          Factor_Group,Year_2011,Year_2010 FROM data WHERE 
                          LOWER(Muncipality) = '{0}'""".format(town.lower()))
        #cur = con.cursor()
        #cur.execute(query,(town.lower()))
        rows = cur.fetchall()
        jsondata = json.dumps(rows)
    return jsondata
        
   
#0|RC_ID|TEXT|0||0
#1|RoadwayType|TEXT|0||0
#2|Begin_Mile_Point|TEXT|0||0
#3|End_Mile_Point|TEXT|0||0
#4|Begin_Description|TEXT|0||0
#5|End_Description|TEXT|0||0
#6|Muncipality|TEXT|0||0
#7|Name|INTEGER|0||0
#8|GISCode|TEXT|0||0
#9|Functional_Class|TEXT|0||0
#10|Factor_Group|TEXT|0||0

stuff = dosearch("./tools/data.sqlite","town of owego")
print stuff
