var json = require('./routes2011shapepoints.json'),
    fs = require('fs');

function parse () {
    json.forEach(function (route) {
        var points = decompress(route.shapepoints, 6);
        route.shapepoints = points;
    });

    fs.writeFile('routes2011shapepoints.json', JSON.stringify(json), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('File written')
        }
    });
}

function decompress (encoded, precision) {
    precision = Math.pow(10, -precision);
    var len = encoded.length, index=0, lat=0, lng = 0, array = [];
    while (index < len) {
        var b, shift = 0, result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;
        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;
        array.push(lat * precision);
        array.push(lng * precision);
    }
    return array;
}

parse();