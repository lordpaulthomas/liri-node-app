require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api')
var fs = require("fs");
var axios = require("axios")
var moment = require("moment")

command = process.argv[2]

console.log(command) 

  if (command === 'spotify-this-song') {
    search = process.argv.slice(3).join(" ")
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

   
    search = process.argv.slice(3).join("")
    queryUrl = 'https://rest.bandsintown.com/artists/' + search + '/events?app_id=codingbootcamp'
    console.log(queryUrl)
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

  if (command === 'movie-this'){
    search = process.argv.slice(3).join(" ")
    total = 0
    for (let i = 0; i < search.length; i ++){
      if (search[i] === ' '){
        total++
      }
    }
    for (let i = 0; i < total; i++){
    search = search.replace(' ', "+")
  }
    console.log(search)

    
    axios.get("http://www.omdbapi.com/?t=" +search + "&y=&plot=short&apikey=trilogy").then(
  function(response) {
    // Then we print out the imdbRating
    console.log(response.data.Title)
    console.log("Released in " + response.data.Year)
    console.log("The IMDB rating is: " + response.data.imdbRating);
    console.log("The Rotten Tomatos rating is " + response.data.Ratings[1].Value)
    console.log("Produced in " + response.data.Country)
    console.log(response.data.Language)
    console.log(response.data.Plot)
    console.log("Starring " + response.data.Actors);
  }
    )
  }
;




if(command === 'do-what-it-says'){
  fs.readFile("random.txt", "utf8", function (err, data) {
    if (err) {
      return console.log(err)
    }
    var dataArray = data.split(',');
    for (let i = 0; i < dataArray.length; i++) {
      newCommand = dataArray[0]
      newSearch = dataArray[1]
    }
  
    if (newCommand === 'spotify-this-song') {
      var spotify = new Spotify(keys.spotify)
      spotify
        .search({ type: 'track', query: newSearch })
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
    if (newCommand === 'concert-this'){
      console.log(newSearch)
      queryUrl = 'https://rest.bandsintown.com/artists/' + newSearch + '/events?app_id=codingbootcamp'
      console.log(queryUrl)
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
  
    if (newCommand === 'movie-this'){
      total = 0
      for (let i = 0; i < newSearch.length; i ++){
        if (newSearch[i] === ' '){
          total++
        }
      }
      for (let i = 0; i < total; i++){
        newSearch = newSearch.replace(' ', "+")
    }
      console.log(newSearch)
  
      
      axios.get("http://www.omdbapi.com/?t=" +newSearch + "&y=&plot=short&apikey=trilogy").then(
    function(response) {
      // Then we print out the imdbRating
      console.log(response.data.Title.toUpperCase() )
      console.log("Released in " + response.data.Year)
      console.log("The IMDB rating is: " + response.data.imdbRating);
      console.log("The Rotten Tomatos rating is " + response.data.Ratings[1].Value)
      console.log("Produced in " + response.data.Country)
      console.log(response.data.Language)
      console.log(response.data.Plot)
      console.log("Starring " + response.data.Actors);
    }
  );
    }
  })
}
