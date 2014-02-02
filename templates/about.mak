<%inherit file="master.mak"/>

<div class="row" style="font-size: 21px;">
  <div class="col-md-4">
    <div style="padding-left: 10px;">

      <h2>Methodologies</h2>
      <p>
      HHRoc was able to obtain a data set from the New York State Department of Transportation (NYS DOT) that contained traffic volume information for thousands of roads all across the state.  That data can be found <a href="https://www.dot.ny.gov/divisions/engineering/technical-services/hds-respository/Tab/Historic%20Traffic%20Data%201977%20to%202011.csv">here</a>.
      New York State Department of Education generates Violent and Disruptive Incident Reporting (VADIR) data sets each year that contain a listing of all schools within NYS.  Data from the 2011-2012 school year was used to obtain a list of schools within NYS outside of New York City.  That data can be found <a href="http://www.p12.nysed.gov/irs/school_safety/2013/VADIR_INCIDENTS_RESTOFSTATE_2011-12.xls">here</a>
      </p>

      <p>
      Two data sets were generated from the list of traffic volumes to include only Monroe County.  One data set was roadways that were 50,000+ cars per day, and the other roadways that were 25,000 - 49,999 cars per day.  These are represented on the Traffairious map as Red lines and Purple lines, respectively.
      </p>

      <p>
      A final data set was generated using the VADIR data to contain only schools within Monroe County.  These schools'' addresses were used to find their location on the map, and are represented by the small blue and red icons.
      </p>

      <p>
      Schools that were within 1000 feet of a roadway were marked as red, and schools outside of that distance were marked as blue.  Distances were measured from the address location of the school, and not the school property boundary.
      </p>

      <h2>Who?</h2>
      <p>
      The Traffairious website was built by members of <a href="http://www.meetup.com/HackshackersROC/">Hacks/Hackers Rochester</a> in collaboration  with <a href="http://www.wxxi.org/">WXXI</a> and <a href="http://innovationtrail.org/">Innovation Trail</a>.  Traffairious was begun by <a href="https://github.com/decause">Remy DeCausemaker</a> and <a href="https://github.com/Nolski">Michael Nolan</a> at a <a href="http://hackupstate.com/">Hack Upstate</a> hackathon in Syracuse, NY. 
      </p>

      <h2>How?</h2>
      <p>
      The site is built using <a href="http://leafletjs.com/">leafletjs</a>, <a href="http://getbootstrap.com/">twitter bootstrap</a>, <a href="http://flask.pocoo.org/">flask</a>, and <a href="http://www.makotemplates.org/">Mako</a>.  The Traffairious website sits on the Redhat <a href="https://www.openshift.com/">Open Shift</a> cloud.
      </p>


    </div>
  </div>

  <div class="col-md-4">
 
    <h2>Studdies and Research</h2>
    
    <p>
    There have been a number of studies done on the effects of health and the output of motor vehicles.
    </p>

    <h3>Not in My Schoolyard:</h3>
    <p style="padding-left: 10px;">
    2006 report prepared for the US EPA by Rhode Island Legal Services. Includes state-by-state look at regulations regarding schools sitting near transportation lines (including roads and railroads), starting p. 58.  The paper can be found <a href="http://www.nylpi.org/images/FE/chain234siteType8/site203/client/EJ%20-%20Not%20in%20My%20Schoolyard%20-%20Improving%20Site%20Selection%20Process.pdf"><b>Here</b></a>.
    </p>

    <h3>National survey of school proximity to roadways (Appatova et al., 2008)</h3>
    <p style="padding-left: 10px;">
    A national look by the University of Cincinnati on the number of schools within 100m and 400m of highways. Includes citations to numerous studies about health effects of traffic pollution.  The paper can be found <a href="http://ccaaps.uc.edu/webpage/Publications/Appatova%20-%20Proximal%20exposure%20of%20public%20schools%20and%20students.pdf"><b>Here</b></a>.
    </p>

    <h3>Traffic pollution effects on school children</h3>
    1993 German study establishing correlation between traffic exhaust and respiratory issues in children can be found <a href="http://www.ncbi.nlm.nih.gov/pmc/articles/PMC1678953/"><b>Here</b></a>.

    <h3>San Francisco schoolchildren study</h3>
    <p style="padding-left: 10px;">
2001 study by the California EPA on health effects of traffic pollution on children in San Francisco schools. This study helped support the passage of the California law requiring 500-foot setback from busy highways.  The study can be found <a href="http://www.arb.ca.gov/research/eb-kids/eb-kids.htm"><b>Here</b></a>.
    </p>

    <h3>Air pollution and early deaths in the United States (Caiazzo et al., 2013)</h3>
    <p style="padding-left: 10px;">
    New study using 2005 data finding total combustion emissions in the U.S. account for about 200,000 premature deaths per year in the U.S. The largest contributors are road transportation. Disaggregates data by state and major metros.  The study can be found <a href="https://www.documentcloud.org/documents/782206-barrett-2013.html"><b>Here</b></a>.

  </div>
  <div class="col-md-4">

    <h2>Hacks/Hackers Rochester and Getting Involved</h2>

    <p>
    If you would like to learn more about how was traffairous was created, or would like to contribute to the project, head over to the <a href="https://github.com/HHROC/traffairious">code repository</a>.  You can see a complete list of contributors <a href="https://github.com/hhroc/traffairious/graphs/contributors">here</a>.
    </p>

    <p>
    If you would like to be a part of future Hacks/Hackers Rochester projects, learn more about current projects, or be a part of future work, feel free to stop by our next meetup.  Our meetup schedule can be found <a href="http://www.meetup.com/HackshackersROC/">here</a>.
    </p>

    <h2>Disclaimer and License</h2>

    <p>
    
    </p>

    <p>
    Copyright 2013 Hacks/HackersROC
    </p>

    <p>
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License.  You may obtain a copy of the
License <a href="http://www.apache.org/licenses/LICENSE-2.0">here</a>.
    </p>

    <p>
    Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied.  See the License for the
specific language governing permissions and limitations under the License.
    </p>


  </div>

</div>

<%def name="scripts()">
    <script src="/static/js/active-nav.js"></script>
</%def>
