import json

if __name__ == '__main__':
    
    idlist = [3946,
              3982,
              4019,
              1812,
              3942,
              3967,
              3938,
              783,
              100,
              #1466,
              3978,
              1503,
              450,
              2689,
              3983,
    ]

    with open("../static/data/schools/monroe_county.json","r") as f:
        data = f.read()
        print "size: {0}".format(len(data))
        schools = json.loads(data)

    for i in range(0,len(schools)):
        schools[i].pop("close", None)
        if schools[i]['id'] in idlist:
            schools[i]['close'] = True

    with open("../static/data/schools/monroe_county.json","w") as f:
        f.write(json.dumps(schools))

