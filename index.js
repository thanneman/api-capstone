'use strict';

//Format Query
function formatQueryParams (params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//Creates the HTML for each repo and appends to element in the DOM
function displayResults(responseJson) {
    console.log(responseJson);
    //Clear error message and previous results
    $('#js-error-message').empty();
    $('#js-found-movies').empty();
    for (let i = 0; i < responseJson.Search.length; i++){
        $('#js-found-movies').append(
            `<option value="${responseJson.Search[i].imdbID}">${responseJson.Search[i].Title}, (${responseJson.Search[i].Year})</option>`
    )};
    $('#results').removeClass('hidden');
    $(watchSecondForm);
};

//Applies user's input into the api URL and checks for a 200 status
function findMovie(baseUrl, searchTerm) {
    const params = {
        s: searchTerm
    };

    const queryString = formatQueryParams(params);
    const url = baseUrl + queryString;
    console.log(url);
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
          $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

//Wait for user input
function watchForm() {
  $('#js-form').submit(event => {
    event.preventDefault();
    const baseUrl = 'http://www.omdbapi.com/?apikey=409a9a19&'
    const searchTerm = $('#js-search-term').val();
    findMovie(baseUrl, searchTerm);
  });
}

$(watchForm);

function watchSecondForm() {
    $('#js-form-movies').submit(event => {
      event.preventDefault();
      const baseUrl = 'http://www.omdbapi.com/?apikey=409a9a19&'
      const searchVal = $('#js-found-movies').val();
      getMovie(baseUrl, searchVal);
    });
  }

//Creates the HTML for each repo and appends to element in the DOM
function displayMovie(responseJson) {
    console.log(responseJson);
    //Clear error message and previous results
    $('#js-error-message').empty();
    $('#js-found-movies').empty();
    $('#movie-poster').append(
        `<img src="${responseJson.Poster}" alt="${responseJson.Title} movie poster">`);
    $('#movie-list').append(
        `<h3>${responseJson.Title} (${responseJson.Year})</h3>
            <p>Rated: ${responseJson.Rated}</p>
            <p>Runtime: ${responseJson.Runtime}</p>
            <p>Director: ${responseJson.Director}</p>
            <p>Actors: ${responseJson.Actors}</p>
            <p>Plot: ${responseJson.Plot}</p>
            <p>Awards: ${responseJson.Awards}</p>
            <p>IMDb Rating: ${responseJson.imdbRating} / 10</p>`);
    $('#results').addClass('hidden');
    $('#movie-results').removeClass('hidden');
};

//Applies user's input into the api URL and checks for a 200 status
function getMovie(baseUrl, searchVal) {
    const params = {
        i: searchVal
    };

    const queryString = formatQueryParams(params);
    const url = baseUrl + queryString;
    console.log(url);
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayMovie(responseJson))
        .catch(err => {
          $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}