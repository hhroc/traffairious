import json

if __name__ == '__main__':

    print "updating routes ..."

    with open('../static/data/monroe_dot_data.json','r') as f:
        fullroutes = json.loads(f.read())

    with open('../static/data/monroe_point_list_25k.json','r') as f:
        routes25k = json.loads(f.read())

    with open('../static/data/monroe_point_list_50k.json','r') as f:
        routes50k = json.loads(f.read())

    count25k = 0
    count50k = 0
    for route in fullroutes:
        for i in range(0,len(routes25k)):
            if routes25k[i]['rc_id'] == route['rc_id'] and not 'volume' in routes25k:
                routes25k[i]['volume'] = route['traffic_volume']
                count25k += 1
        for i in range(0,len(routes50k)):
            if routes50k[i]['rc_id'] == route['rc_id'] and not 'volume' in routes50k:
                routes50k[i]['volume'] = route['traffic_volume']
                count50k += 1

    print "updated {0} 25K routes, {1} 50k routes".format(count25k,count50k)

    with open('../static/data/monroe_point_list_25k_final.json','w') as f:
        f.write(json.dumps(routes25k))

    with open('../static/data/monroe_point_list_50k_final.json','w') as f:
        f.write(json.dumps(routes50k))
