// Node Modules being used in this app
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api')
var fs = require("fs");
var axios = require("axios")
var moment = require("moment")
var inquirer = require("inquirer")


inquirer
  // ask user for command and search info
  .prompt([
    {
      type: "list",
      message: "Which Type of Search Would You Like?",
      choices: ["spotify-this-song", "concert-this", "movie-this", "do-what-it-says"],
      name: "command"
    }
  ])
  .then(function (response) {
    // grab and set user's parameters 
    var command = response.command;


    // if spotify command 

    if (command === 'spotify-this-song') {
      inquirer
        .prompt([
          {
            type: "input",
            message: "What song would you like to search for?",
            name: 'search'
          }
        ])
        .then(function (response) {
          search = response.search;
          // if user leaves input empty, this will show 
          if (!search) {
            search = "Make It Better"
          }
          // append search results to log.txt
          fs.appendFile("log.txt", "\n\n" + command + '----' + search, function (err) {
            if (err) {
              return console.log(err)
            }
          })
          console.log(command + '----' + search)
          // create new search object using keys not pushed to github
          var spotify = new Spotify(keys.spotify)
          spotify
            // call to spotify with user search info
            .search({ type: 'track', query: search })
            .then(function (response) {
              console.log(response.tracks.items[0].artists[0].name);
              fs.appendFile("log.txt", '\n' + response.tracks.items[0].artists[0].name, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log(response.tracks.items[0].name);
              fs.appendFile("log.txt", '\n' + response.tracks.items[0].name, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log(response.tracks.items[0].album.name);
              fs.appendFile("log.txt", '\n' + response.tracks.items[0].album.name, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log(response.tracks.items[0].href);
              fs.appendFile("log.txt", '\n' + response.tracks.items[0].href, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
            })
            .catch(function (err) {
              console.log(err);
            },
            );
        })
    }

    

    if (command === 'concert-this') {
      inquirer
        .prompt([
          {
            type: "input",
            message: "Who's upcoming concerts would you like to search?",
            name: 'search'
          }

        ])
        .then(function (response) {
          search = response.search;
          // if user doesn't give input the app shows this 
          if (!search) {
            search = "Post Malone"
          }
          // append results to log.txt
          fs.appendFile("log.txt", "\n\n" + command + '----' + search, function (err) {
            if (err) {
              return console.log(err)
            }
          })
          console.log(command + '----' + search)
          // query for bands in town in proper format
          queryUrl = 'https://rest.bandsintown.com/artists/' + search + '/events?app_id=codingbootcamp'

          axios.get(queryUrl).then(function (response) {
            for (let i = 0; i < response.data.length; i++) {
              console.log(response.data[i].venue.name)
              fs.appendFile("log.txt", '\n' + response.data[i].venue.name, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log(response.data[i].venue.city + ',' + response.data[i].venue.region)
              fs.appendFile("log.txt", '\n' + response.data[i].venue.city, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log(moment(response.data[i].datetime).format("MM/DD/YYYY"))
              fs.appendFile("log.txt", "\n" + moment(response.data[i].datetime).format("MM/DD/YYYY"), function (err) {
                if (err) {
                  return console.log(err)
                }
              })
            }
          }).catch(function (error) {
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
        })
    }

    if (command === 'movie-this') {
      inquirer
        .prompt([
          {
            message: "What movie would you like to search for?",
            type: "input",
            name: "search"
          }
        ])
        .then(function (response) {
          search = response.search;
          // user input is blank they will get this movie 
          if (!search) {
            search = "Mr+Nobody"
          }

          // files get appended to log.txt file
          fs.appendFile("log.txt", "\n\n" + command + '----' + search, function (err) {
            if (err) {
              return console.log(err)
            }
          })
          console.log(command + '----' + search)
          // change user input into proper search format 
          total = 0
          for (let i = 0; i < search.length; i++) {
            if (search[i] === ' ') {
              total++
            }
          }
          for (let i = 0; i < total; i++) {
            search = search.replace(' ', "+")
          }

          // search to OMDB with proper url query
          axios.get("http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy")
            .then(function (response) {
              // print results to console and log.txt file
              console.log(response.data.Title)
              fs.appendFile("log.txt", '\n' + response.data.Title, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log("Released in " + response.data.Year)
              fs.appendFile("log.txt", "\nReleased in " + response.data.Year, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log("The IMDB rating is: " + response.data.imdbRating);
              fs.appendFile("log.txt", "\nThe IMDB rating is: " + response.data.imdbRating, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log("The Rotten Tomatos rating is " + response.data.Ratings[1].Value)
              fs.appendFile("log.txt", "\nThe Rotten Tomatos rating is " + response.data.Ratings[1].Value, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log("Produced in " + response.data.Country)
              fs.appendFile("log.txt", "\nProduced in " + response.data.Country, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log(response.data.Language)
              fs.appendFile("log.txt", '\n' + response.data.Language, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log(response.data.Plot)
              fs.appendFile("log.txt", '\n' + response.data.Plot, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log("Starring " + response.data.Actors);
              fs.appendFile("log.txt", "\nStarring " + response.data.Actors, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
            })
            .catch(function (error) {
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
        })
    };

    if (command === 'do-what-it-says') {

      fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
          return console.log(err)
        }
        var dataArray = data.split(',');
        command = dataArray[0]
        search = dataArray[1]

        if (command === 'spotify-this-song') {
          // if user leaves input empty, this will show 
          if (!search) {
            search = "Make It Better"
          }
          // append search results to log.txt
          fs.appendFile("log.txt", "\n\n" + command + '----' + search, function (err) {
            if (err) {
              return console.log(err)
            }
          })
          console.log(command + '----' + search)
          // create new search object using keys not pushed to github
          var spotify = new Spotify(keys.spotify)
          spotify
            // call to spotify with user search info
            .search({ type: 'track', query: search })
            .then(function (response) {
              console.log(response.tracks.items[0].artists[0].name);
              fs.appendFile("log.txt", '\n' + response.tracks.items[0].artists[0].name, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log(response.tracks.items[0].name);
              fs.appendFile("log.txt", '\n' + response.tracks.items[0].name, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log(response.tracks.items[0].album.name);
              fs.appendFile("log.txt", '\n' + response.tracks.items[0].album.name, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log(response.tracks.items[0].href);
              fs.appendFile("log.txt", '\n' + response.tracks.items[0].href, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
            })
            .catch(function (err) {
              console.log(err);
            },
            );
        }

        if (command === 'concert-this') {
          if (!search) {
            search = "Post Malone"
          }

          fs.appendFile("log.txt", "\n\n" + command + '----' + search, function (err) {
            if (err) {
              return console.log(err)
            }
          })
          console.log(command + '----' + search)
          queryUrl = 'https://rest.bandsintown.com/artists/' + search + '/events?app_id=codingbootcamp'

          axios.get(queryUrl).then(function (response) {
            for (let i = 0; i < response.data.length; i++) {
              console.log(response.data[i].venue.name)
              fs.appendFile("log.txt", '\n' + response.data[i].venue.name, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log(response.data[i].venue.city + ',' + response.data[i].venue.region)
              fs.appendFile("log.txt", '\n' + response.data[i].venue.city, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log(moment(response.data[i].datetime).format("MM/DD/YYYY"))
              fs.appendFile("log.txt", "\n" + moment(response.data[i].datetime).format("MM/DD/YYYY"), function (err) {
                if (err) {
                  return console.log(err)
                }
              })
            }
          }).catch(function (error) {
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

        if (command === 'movie-this') {
          if (!search) {
            search = "Mr+Nobody"
          }
          fs.appendFile("log.txt", "\n\n" + command + '----' + search, function (err) {
            if (err) {
              return console.log(err)
            }
          })
          console.log(command + '----' + search)
          total = 0
          for (let i = 0; i < search.length; i++) {
            if (search[i] === ' ') {
              total++
            }
          }
          for (let i = 0; i < total; i++) {
            search = search.replace(' ', "+")
          }

          axios.get("http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy")
            .then(function (response) {
              console.log(response.data.Title)
              fs.appendFile("log.txt", '\n' + response.data.Title, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log("Released in " + response.data.Year)
              fs.appendFile("log.txt", "\nReleased in " + response.data.Year, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log("The IMDB rating is: " + response.data.imdbRating);
              fs.appendFile("log.txt", "\nThe IMDB rating is: " + response.data.imdbRating, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log("The Rotten Tomatos rating is " + response.data.Ratings[1].Value)
              fs.appendFile("log.txt", "\nThe Rotten Tomatos rating is " + response.data.Ratings[1].Value, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log("Produced in " + response.data.Country)
              fs.appendFile("log.txt", "\nProduced in " + response.data.Country, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log(response.data.Language)
              fs.appendFile("log.txt", '\n' + response.data.Language, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log(response.data.Plot)
              fs.appendFile("log.txt", '\n' + response.data.Plot, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
              console.log("Starring " + response.data.Actors);
              fs.appendFile("log.txt", "\nStarring " + response.data.Actors, function (err) {
                if (err) {
                  return console.log(err)
                }
              })
            })
            .catch(function (error) {
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
        };
      
      }) 
    }
  })
