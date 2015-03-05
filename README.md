# Spotify-Search
Searching through Spotify's library using Node js


INTALLATION

1) Download and install node.js and npm from http://nodejs.org/download/;\n
2) In root folder, install the request module using "npm install request";\n
3) Modify the contents of the search.txt file as required, following a CSV format:\n
	col 1) Track name;\n
	col 2) Artist;\n
4) Run the code throgh "node app.js [search.txt]" command, where [search.txt] is the input file containing the input.\n
5) All results will be output to an "output.txt" file, structured as follows:\n
	col 1) Track name;\n
	col 2) Artist(s);\n
	col 3) Big size album cover;\n
	col 4) Medium size album cover;\n
	col 5) Small size album cover;\n
	col 6) Track URI.\n