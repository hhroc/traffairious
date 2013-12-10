#!/bin/bash
#parse HistoricTrafficData to json

in=HistoricTrafficData1977to2011.csv
out=traffic_data.json
cp $in $out
perl -i -p -e 's/^(?:[^\t]*\t){4}([^\t]*)\t([^\t]*)\t[^\t]*\t([^\t]*)\t(?:[^\t]*\t){3}([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\s]*)/\{"begin":"$1","end":"$2","name":"$3","flow":\[{"year":"2011","rate":$4},{"year":"2010","rate":$5},{"year":"2009","rate":$6},{"year":"2008","rate":$7},{"year":"2007","rate":$8},{"year":"2006","rate":$9},{"year":"2005","rate":$10},{"year":"2004","rate":$11},{"year":"2003","rate":$12},{"year":"2002","rate":$13},{"year":"2001","rate":$14},{"year":"2000","rate":$15},{"year":"1999","rate":$16},{"year":"1998","rate":$17},{"year":"1997","rate":$18},{"year":"1996","rate":$19},{"year":"1995","rate":$20},{"year":"1994","rate":$21},{"year":"1993","rate":$22},{"year":"1992","rate":$23},{"year":"1991","rate":$24},{"year":"1990","rate":$25},{"year":"1989","rate":$26},{"year":"1988","rate":$27},{"year":"1987","rate":$28},{"year":"1986","rate":$29},{"year":"1985","rate":$30},{"year":"1984","rate":$31},{"year":"1983","rate":$32},{"year":"1982","rate":$33},{"year":"1981","rate":$34},{"year":"1980","rate":$35},{"year":"1979","rate":$36},{"year":"1978","rate":$37},{"year":"1977","rate":$38}\]\},/' $out
perl -i -p -e 's/,\{"[^"]*?":"[^"]*?","[^"]*?":\}//g' $out
perl -i -p -e 's/.*$/\[/ if 1..1' $out
perl -i -p -e 's/,\Z/\n\]/ if eof' $out
