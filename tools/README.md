###What to do###

First you need to create the raw dataset of just Monroe County from 
the massive list of all roads in NYS;

    python create_monroe_simple.py

Next you need to modify the output file to include "begin_loc" and 
"end_loc" keys within each dictionary entry within the json array.  
This was done by hand for monroe county.

After you have added the required files, you can run this script to generate shape files for the routes:

    python create_shape_from_simple.py

The resulting file will be data/monroe_final.json.  If you copy this file to static/data/monroe_final.json 
and run the flask app you can see monroe county displayed.  You can see a demo of this [here](http://traffairious.mycodespace.net/)
