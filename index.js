'use strict';

//Format Query
function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}


//TEST for different movie API
function displayResults(responseJson) {
  console.log(responseJson);
  for (let i = 0; i < responseJson.results.length; i++){
    const movieDate = responseJson.results[i].release_date;
    $('#js-found-movies').append(
      `<option value="${responseJson.results[i].id}">${responseJson.results[i].title}, (${movieDate.slice(0, 4)})</option>`
  )};
  $('#results').removeClass('hidden');
  $(watchSecondForm);
};

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
    const searchTerm = $('#js-search-term').val();
    findMovie(searchTerm);
    $('#movie-poster').empty();
    $('#movie-title').empty();
    $('#movie-rating').empty();
    $('#movie-time').empty();
    $('#movie-director').empty();
    $('#movie-plot').empty();
    $('#movie-score').empty();
    $('#movie-cast').empty();
    $('#movie-trailer').empty();
    $('#movie-recs').empty();
  });
}

$(watchForm);




//Starts second half of movie search
function watchSecondForm() {
    $('#js-form-movies').submit(event => {
      event.preventDefault();
      const searchVal = $('#js-found-movies').val();
      getData(searchVal);
    });
}


//Displays movie info in the DOM
function displayMovieinfo(responseJson) {
  console.log(responseJson);
  const movieDate = responseJson.release_date;
      //Add movie poster
      $('.info-left').append(`
      <div id="movie-poster">
        <img src="https://image.tmdb.org/t/p/w300${responseJson.poster_path}" alt="${responseJson.title} movie poster">
      </div>`);
      //Add movie title
      $('.info-right').append(`
      <h3 id="movie-title">${responseJson.title} (${movieDate.slice(0, 4)})</h3>`);
      //Add movie rating
      for (let i = 0; i < responseJson.release_dates.results.length; i++) {
        if(responseJson.release_dates.results[i].iso_3166_1 === 'US') {
            $('.info-right').append(`<p id="movie-rating"><b>Rated:</b> ${responseJson.release_dates.results[i].release_dates[0].certification}</p>`);
        }
      };
      //Add movie runtime
      $('.info-right').append(`<p id="movie-time"><b>Runtime:</b> ${responseJson.runtime}min</p>`);
      //Add movie director
      for (let i = 0; i < responseJson.credits.crew.length; i++) {
          if(responseJson.credits.crew[i].job === 'Director') {
              $('.info-right').append(`<p id="movie-director"><b>Director:</b> ${responseJson.credits.crew[i].name} </p>`);
          }
      };
      //Add movie plot
      $('.info-right').append(`<p id="movie-plot"><b>Plot:</b> ${responseJson.overview}</p>`);
      //Add movie rating
      $('.info-right').append(`<p id="movie-score"><b>Rating:</b> ${responseJson.vote_average}/10</p>`);
      //Add movie cast
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
      //Add YouTube trailer
      $('#movie-trailer').append(`<h2>Trailer</h2>`);
      for (let i = 0; i < responseJson.videos.results.length; i++) {
          if(responseJson.videos.results[i].iso_3166_1 === 'US' && responseJson.videos.results[i].type === 'Trailer') {
              $('#movie-trailer').append(`
                <center><iframe width="560" height="315" src="https://www.youtube.com/embed/${responseJson.videos.results[i].key}" frameborder="0" allow="accelerometer; gyroscope; picture-in-picture" allowfullscreen></iframe></center>`);
          }
      };
      //Add recommendations
      $('#movie-recs').append(`<h2>Recommendations</h2>`);
      for (let i = 0; i < 4; i++) {
            $('#movie-recs').append(`
              <div class="rec-card" id="${responseJson.recommendations.results[i].title}">
                <div class="rec-image" id="${responseJson.recommendations.results[i].title}">
                  <img src="https://image.tmdb.org/t/p/w185${responseJson.recommendations.results[i].poster_path}" alt="${responseJson.recommendations.results[i].title}">
                </div>
              </div>`);
      };
  
      $('#results').addClass('hidden');
      $('#movie-results').removeClass('hidden');
      $('#js-found-movies').empty();
};



function getData(searchVal) {
  const firstUrl = 'https://api.themoviedb.org/3/movie/' + searchVal + '?api_key=99a68578a1d03d97a1d4c9f381484db9&language=en-US&append_to_response=credits,release_dates,videos,recommendations';
  
  console.log(firstUrl);
  
  fetch(firstUrl)
      .then(response => {
          if (response.ok) {
              return response.json();
          }
          throw new Error(response.statusText);
      })
      .then(responseJson => displayMovieinfo(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
  });
}