# Spotify-Search
Searching through Spotify's library using Node js


INTALLATION

1. Clone using "git clone https://github.com/tgirotto/Spotify-Search.git";
2. Download and install node.js and npm from http://nodejs.org/download/;
3. In the root folder, install the request module using "npm install request";
4. Modify the contents of the search.txt file as required, following a CSV 	format:
  - Track name;
  - Artist;
5. Run the code throgh "node app.js [search.txt]" command, where [search.txt] is the input file containing the input;
6. All results will be output to a [search].out file, structured as follows:
  - Track name;
  - Artist(s);
  - Album name;
  - Big size album cover;
  - Medium size album cover;
  - Small size album cover;
  - Track URI;
  - Popularity;
