//example: node app.js test.txt

var MAX_CONNECTIONS = 1000;
var open_connections = 0;
var current = 0;

var URL = 'https://api.spotify.com/v1/search?limit=50&type=track,album,artist,playlist&q=';

if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

var fs = require('fs');
var request = require('request');
var filename = process.argv[2];
var OUTPUT = '';
var LENGTH = 0;

fs.readFile(filename, 'utf8', function(err, data) {
  if (err) 
    throw err;

  OUTPUT = filename.split('.')[0] + '.out';

  var lines = extractLines(data);
  var objects = extractObjects(lines);

  createFile(OUTPUT, function() {
    processObjects(objects, 0, function(line) {
      appendToFile(OUTPUT, line, function(message) {
        //console.log(message);
      });
    });
  });
});


/************************************************************************************************************/

function extractLines(data) {
  console.log('Extracting lines...');
  return data.split('\n');
};

function extractObjects(lines) {
  console.log('Extracting objects...');
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
  if(string != undefined) {
    var punctuationless = removePunctuation(string);
    var temp = punctuationless.split(' ');
    var name = '';

    for(var j = 0; j < temp.length; j++)
      name += temp[j] + '+';

    return name.substr(0, name.length - 1);
  } else
    return '';
};

function removePunctuation(string) {
  var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#\$%&\(\)\*\+,\-\.\/:;<=>\?@\[\]\^_`\{\|\}~]/g;
  var spaceRE = /\s+/g;
  var result = string.replace(punctRE, '').replace(spaceRE, ' ');
  return result;
};

function createFile(filename, callback) {
  fs.writeFile('./' + filename, '', function(err) {
    if(err)
        console.log(err);
    else
      callback();
  }); 
}; 

function processObjects(objects, offset, callback) {
  console.log('open connections: ', open_connections);
  LENGTH = objects.length;

  for(var i = offset; i < objects.length; i++) {
    if(open_connections < MAX_CONNECTIONS) {
      open_connections++;
      iteration(i, objects[i], callback);
    } else {
      setTimeout(function() {
        sleep(objects, i, callback);
      }, 500);
      break;
    }

    if(i === objects.length - 1)
    console.log('Sent all requests to Spotify: printing results...');
  }
};

function sleep(objects, i, callback) {
  processObjects(objects, i, callback);
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

function iteration(number, input, callback) {
  request(URL + input.name , function (error, response, body) {
    open_connections--;

    if (!error && response.statusCode == 200) {
      var obj = JSON.parse(body);

      var name = '';
      var artists = '';
      var album  = '';
      var cover_big = '';
      var cover_medium = '';
      var cover_small = '';
      var uri = '';

      if(obj.tracks.items.length > 0) {
        if(obj.tracks.items[0].name != undefined)
          name = obj.tracks.items[0].name;

        if(obj.tracks.items[0].artists != undefined)
          artists = extractArtists(obj.tracks.items[0].artists);

        if(obj.tracks.items[0].album.name != undefined)
          album = obj.tracks.items[0].album.name;

        if(obj.tracks.items[0].album.images[0] != undefined)
          cover_big = obj.tracks.items[0].album.images[0].url;

        if(obj.tracks.items[0].album.images[1] != undefined)
          cover_medium = obj.tracks.items[0].album.images[1].url;

        if(obj.tracks.items[0].album.images[2] != undefined)
          cover_small = obj.tracks.items[0].album.images[2].url;

        if(obj.tracks.items[0].uri != undefined)
          uri = obj.tracks.items[0].uri;

        callback(
                number + ',' +
                input.name + ',' +
                input.artist + ',' +
                name + ',' + 
                artists + ',' +
                album + ',' +
                cover_big + ',' +
                cover_medium + ',' +
                cover_small + ',' +
                uri + '\n');
      } else
        callback(number + ', #' + JSON.stringify(obj) + ':-------------------------------------->FAIL!!!\n');
    }
  });
};