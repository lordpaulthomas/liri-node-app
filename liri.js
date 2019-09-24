require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api')
var fs = require("fs");
var axios = require("axios")
var moment = require("moment")

fs.readFile("random.txt", "utf8", function (err, data) {
  if (err) {
    return console.log(err)
  }
  var dataArray = data.split(',');
  for (let i = 0; i < dataArray.length; i++) {
    command = dataArray[0]
    search = dataArray[1]
  }

  if (command === 'spotify-this-song') {
    var spotify = new Spotify(keys.spotify)
    spotify
      .search({ type: 'track', query: search })
      .then(function (response) {
        console.log(response.tracks.items[0].artists[0].name);
        console.log(response.tracks.items[0].name);
        console.log(response.tracks.items[0].album.name);
        console.log(response.tracks.items[0].href);
      })
      .catch(function (err) {
        console.log(err);
      },
      );
  }
  if (command === 'concert-this'){
    queryUrl = `https://rest.bandsintown.com/artists/Madonna/events?app_id=codingbootcamp`
    axios.get(queryUrl).then(function(response){
      for( let i = 0; i < response.data.length;i++){
      console.log(response.data[i].venue.name)
      console.log(response.data[i].venue.city + ',' + response.data[i].venue.region)
      console.log(moment(response.data[i].datetime).format("MM/DD/YYYY"))
      }
    }).catch(function(error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    })
  }

  if (commmand === 'movie-this'){

  }

  // if (command === 'do-what-it-says'){

  // }
})


