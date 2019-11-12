'use strict';

let searchEx = [ 'Pulp Fiction', 'Deadpool', 'The Godfather', 'Forrest Gump', 'The Shawshank Redemption', 'The Dark Knight' ];
  setInterval(function() {
    $('#js-search-term').attr("placeholder", searchEx[searchEx.push(searchEx.shift())-1]);
  }, 2000);

//Format Query
function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

//Wait for user input on search
function watchForm() {
  $('#js-form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    findMovie(searchTerm);
    $('.info-left').empty();
    $('.info-right').empty();
    $('#movie-cast').empty();
    $('#movie-trailer').empty();
    $('#movie-recs').empty();
    $('#js-error-message').empty();
    $('#js-search-term').val(null);
    $('#js-about').hide();
    $('#js-form').hide();
  });
}

//Fetch first set of info from API
function findMovie(searchTerm) {
  const findUrl = 'https://api.themoviedb.org/3/search/movie?';
  const params = {
    api_key: '99a68578a1d03d97a1d4c9f381484db9',
    language: 'en-US',
    query: searchTerm,
    page: '1',
    include_adult: 'false'
  };

  const queryString = formatQueryParams(params);
  const url = findUrl + queryString;
  fetch(url)
      .then(response => {
          if (response.ok) {
              return response.json();
          }
          throw new Error(response.statusText);
      })
      .then(responseJson => displayResults(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}. Please try a new search.`);
      });
}

//Display first search results
function displayResults(responseJson) {
  if (responseJson.results.length === 0) {
    $('#js-error-message').text(`Movie not found. Please search for something else`);
  } else {
    for (let i = 0; i < responseJson.results.length; i++){
      const movieDate = responseJson.results[i].release_date;
      if (typeof(movieDate) === "undefined") {
        $('#js-found-movies').append(
          `<option value="${responseJson.results[i].id}">${responseJson.results[i].title}</option>`);
      } else if (movieDate === "") {
        $('#js-found-movies').append(
          `<option value="${responseJson.results[i].id}">${responseJson.results[i].title}</option>`);
      } else {
        $('#js-found-movies').append(
          `<option value="${responseJson.results[i].id}">${responseJson.results[i].title} (${movieDate.slice(0, 4)})</option>`);
      }
    };
    $('#results').removeClass('hidden');
    
    $(watchSecondForm);
  }
  $('#js-new-search').removeClass('hidden');
};




//Starts second half of movie search
function watchSecondForm() {
    $('#js-form-movies').submit(event => {
      event.preventDefault();
      const searchVal = $('#js-found-movies').val();
      getData(searchVal);
    });
}

//Fetch second set of info from API
function getData(searchVal) {
  const movieFetch = 'https://api.themoviedb.org/3/movie/' + searchVal + '?api_key=99a68578a1d03d97a1d4c9f381484db9&language=en-US&append_to_response=credits,release_dates,videos,recommendations';
  fetch(movieFetch)
      .then(response => {
          if (response.ok) {
              return response.json();
          }
          throw new Error(response.statusText);
          
      })
      .then(responseJson => displayMovieinfo(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}. Please try a new search.`);
        $('#results').hide();
  });
}

//Displays movie info in the DOM
function displayMovieinfo(responseJson) {
  const movieDate = responseJson.release_date;
  
      //Add movie poster
      if (responseJson.poster_path !== null && responseJson.title !== null) {
        $('.info-left').append(`
        <div id="movie-poster">
          <img src="https://image.tmdb.org/t/p/w300${responseJson.poster_path}" alt="${responseJson.title} movie poster">
        </div>`);
      } else {
        $('.info-left').append(`
        <div id="movie-poster" class="not-found">
          <p>No Image Found</p>
        </div>`);
      }

      //Add movie title
      if (responseJson.title !== null) {
        $('.info-right').append(`<h3 id="movie-title">${responseJson.title} (${movieDate.slice(0, 4)})</h3>`);
      } else {
        $('.info-right').append(`<h3 id="movie-title">No data to display</h3>`);
      }

      //Add movie rating
      if (responseJson.release_dates.results.length !== 0) {
        for (let i = 0; i < responseJson.release_dates.results.length; i++) {
          if(responseJson.release_dates.results[i].iso_3166_1 === 'US' && responseJson.release_dates.results[i].certification !== "") {
            $('.info-right').append(`<p id="movie-rating"><b>Rated:</b> ${responseJson.release_dates.results[i].release_dates[0].certification}</p>`);
          }
        };
      } else {
        $('.info-right').append(`<p id="movie-rating"><b>Rated:</b> No data to display</p>`);
      }

      //Add movie runtime
      if (responseJson.runtime > 0) {
        $('.info-right').append(`<p id="movie-time"><b>Runtime:</b> ${responseJson.runtime}min</p>`);
      } else {
        $('.info-right').append(`<p id="movie-time"><b>Runtime:</b> No data to display</p>`);
      }

      //Add genres
      if (responseJson.genres.length !== 0) {
        $('.info-right').append(`<p id="movie-time"><b>Genre:</b> ${responseJson.genres[0].name}</p>`);
      } else {
        $('.info-right').append(`<p id="movie-time"><b>Genre:</b> No data to display</p>`);
      }

      //Add movie director
      if (responseJson.credits.crew.length !== 0) {
        for (let i = 0; i < responseJson.credits.crew.length; i++) {
          if(responseJson.credits.crew[i].job === 'Director') {
            $('.info-right').append(`<p id="movie-director"><b>Director:</b> ${responseJson.credits.crew[i].name} </p>`);
          }
        };
      } else {
        $('.info-right').append(`<p id="movie-director"><b>Director:</b> No data to display</p>`);
      }

      //Add movie plot
      if (responseJson.overview !== null) {
        $('.info-right').append(`<p id="movie-plot"><b>Plot:</b> ${responseJson.overview}</p>`);
      } else {
        $('.info-right').append(`<p id="movie-plot"><b>Plot:</b> No data to display</p>`);
      }

      //Add movie score
      if (responseJson.vote_count > 1) {
        $('.info-right').append(`<p id="movie-score"><b>Rating:</b> ${responseJson.vote_average}/10</p>`);
      } else {
        $('.info-right').append(`<p id="movie-score"><b>Rating:</b> No data to display</p>`);
      }

      //Add movie cast
      if (responseJson.credits.cast.length !== 0) {
        $('#movie-cast').append(`<h2>Cast</h2>`);
          for (let i = 0; i < 3; i++) {
            $('#movie-cast').append(`
              <div class="cast-card" id="${responseJson.credits.cast[i].name} card">
                <div class="cast-image" id="${responseJson.credits.cast[i].name} profile">
                  <img src="https://image.tmdb.org/t/p/original${responseJson.credits.cast[i].profile_path}" alt="${responseJson.credits.cast[i].name}">
                </div>
                <div class="cast-name" id="${responseJson.credits.cast[i].name} title">
                  <p><b>${responseJson.credits.cast[i].name}</b> - ${responseJson.credits.cast[i].character}</p>
                </div>
              </div>`);
          };
      }

      //Add YouTube trailer
      if (responseJson.videos.results.length !== 0) {
        $('#movie-trailer').append(`<h2>Trailer(s)</h2>`);
          for (let i = 0; i < responseJson.videos.results.length; i++) {
            if(responseJson.videos.results[i].iso_3166_1 === 'US' && responseJson.videos.results[i].type === 'Trailer') {
              $('#movie-trailer').append(`
                <div class="trailer"><iframe width="560" height="315" src="https://www.youtube.com/embed/${responseJson.videos.results[i].key}" frameborder="0" allow="accelerometer; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`);
            }
        };
      } 

      //Add recommendations
      if (responseJson.recommendations.results.length !== 0) {
        $('#movie-recs').append(`<h2>Recommendations</h2>`);
          for (let i = 0; i < 4; i++) {
            $('#movie-recs').append(`
              <div class="rec-card" id="${responseJson.recommendations.results[i].id}">
                <div class="rec-image" id="${responseJson.recommendations.results[i].id}">
                  <img src="https://image.tmdb.org/t/p/w185${responseJson.recommendations.results[i].poster_path}" alt="${responseJson.recommendations.results[i].id} image">
                </div>
              </div>`);
          };
      }

      $('#results').addClass('hidden');
      $('#movie-results').removeClass('hidden');
      $('#js-found-movies').empty();
      $('#js-form').hide();
};



$(watchForm);