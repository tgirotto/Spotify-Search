var URL = 'https://api.spotify.com/v1/search?limit=1&type=track&q=';
var OUTPUT = 'output.txt';

if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

var fs = require('fs');
var request = require('request');
var filename = process.argv[2];

fs.readFile(filename, 'utf8', function(err, data) {
  if (err) 
    throw err;

  var lines = extractLines(data);
  var objects = extractObjects(lines);

  createFile(OUTPUT, function() {
    processObjects(objects, function(line) {
      appendToFile(OUTPUT, line, function(message) {
        console.log(message);
      });
    });
  });
});


/************************************************************************************************************/

function extractLines(data) {
  return data.split('\n');
};

function extractObjects(lines) {
  var objects = [];

  for(var i = 0; i < lines.length; i++) {
    var temp = lines[i].split(',');
    
    objects.push({
      name: convertToQuery(temp[0]),
      artist: convertToQuery(temp[1])
    });
  }

  return objects;
};

function convertToQuery(string) {
  var temp = string.split(' ');
  var name = '';

  for(var j = 0; j < temp.length; j++)
    name += temp[j] + '+';

  return name.substr(0, name.length - 1);
};

function createFile(filename, callback) {
  fs.writeFile('./' + filename, '', function(err) {
    if(err)
        console.log(err);
    else
      callback();
  }); 
}; 

function processObjects(objects, callback) {
  for(var i = 0; i < objects.length; i++) {
    request(URL + objects[i].name + '&artist:' + objects[i].artist, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var obj = JSON.parse(body);

        console.log(obj.tracks.items[0].name);
        console.log(obj.tracks.items[0].artists[0].name);
        console.log(obj.tracks.items[0].album.images[0].url);
        console.log(obj.tracks.items[0].album.images[1].url);
        console.log(obj.tracks.items[0].album.images[2].url);
        console.log(obj.tracks.items[0].uri);

        callback(obj.tracks.items[0].name + ',' + 
                extractArtists(obj.tracks.items[0].artists) + ',' + 
                obj.tracks.items[0].album.images[0].url + ',' +
                obj.tracks.items[0].album.images[1].url + ',' +
                obj.tracks.items[0].album.images[1].url + ',' +
                obj.tracks.items[0].uri + '\n');
      }
    });
  }
};

function extractArtists(array) {
  var string = '';
  for(var i = 0; i < array.length; i++) {
    string += array[i].name + '+';
  }

  return string.substr(0, string.length - 1);
};

function appendToFile(filename, line, callback) {
  fs.appendFile(filename, line, function (err) {
    if(err != null)
      console.log('An error occurred.');
    else
      callback(line);
  });
};