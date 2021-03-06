//example: node app.js test.txt

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
    processObjects(objects, function(line) {
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

function processObjects(objects, callback) {
  LENGTH = objects.length;
  console.log('Processing ' + objects.length + ' objects: it might take a while...');
  for(var i = 0; i < objects.length; i++) {
    iteration(i, objects[i], callback);

    if(i === objects.length - 1)
      console.log('Sent all requests to Spotify: printing results...');
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

function convertToString(input) {
  var temp = input.split('+');
  var string = '';
  for(var i = 0; i < temp.length; i++) {
    string += temp[i] + ' ';
  }

  return string.substr(0, string.length - 1);
};

function iteration(number, input, callback) {
  request(URL + input.name , function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var obj = JSON.parse(body);

      var popularity = '';

      if(obj.tracks.items.length > 0) {
        if(obj.tracks.items[0].popularity != undefined)
          popularity = obj.tracks.items[0].popularity;

        process.stdout.write(".");

        callback(
                convertToString(input.name) + ',' +
                convertToString(input.artist) + ',' +
                popularity + '\n');
      } else
        callback('#' + JSON.stringify(obj) + ':-------------------------------------->FAIL!!!\n');
    }
  });
};