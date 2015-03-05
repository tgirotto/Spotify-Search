# Spotify-Search
Searching through Spotify's library using Node js


INTALLATION

1) Download and install node.js and npm from http://nodejs.org/download/;

2) In root folder, install the request module using "npm install request";

3) Modify the contents of the search.txt file as required, following a CSV format:

	col 1) Track name;

	col 2) Artist;

4) Run the code throgh "node app.js [search.txt]" command, where [search.txt] is the input file containing the input.

5) All results will be output to an "output.txt" file, structured as follows:

	col 1) Track name;

	col 2) Artist(s);

	col 3) Big size album cover;

	col 4) Medium size album cover;

	col 5) Small size album cover;
	
	col 6) Track URI.