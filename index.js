'use strict';

//Format Query
function formatQueryParams (params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}


//TEST for different movie API
function displayResults(responseJson) {
  console.log(responseJson);
  //Clear error message and previous results
  $('#js-error-message').empty();
  $('#js-found-movies').empty();
  $('#movie-poster').empty();
  $('#movie-list').empty();
  for (let i = 0; i < responseJson.results.length; i++){
    $('#js-found-movies').append(
      `<option value="${responseJson.results[i].id}">${responseJson.results[i].title}, (${responseJson.results[i].release_date})</option>`
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
    //getYouTubeVideos(searchTerm);
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
      //Add movie poster
      $('#movie-poster').append(`<img src="https://image.tmdb.org/t/p/w300${responseJson.poster_path}" alt="${responseJson.title} movie poster">`);
      //Add movie title
      $('#movie-title').append(`${responseJson.title} (${responseJson.release_date})`);
      //Add movie runtime
      $('#movie-time').append(`<b>Runtime:</b> ${responseJson.runtime}min`);
      //Add movie rating
      for (let i = 0; i < responseJson.release_dates.results.length; i++) {
          if(responseJson.release_dates.results[i].iso_3166_1 === 'US') {
              $('#movie-rating').append(`<b>Rated:</b> ${responseJson.release_dates.results[i].release_dates[0].certification}`);
          }
      };
      //Add movie director
      for (let i = 0; i < responseJson.credits.crew.length; i++) {
          if(responseJson.credits.crew[i].job === 'Director') {
              $('#movie-director').append(`<b>Director:</b> ${responseJson.credits.crew[i].name} `);
          }
      };
      //Add movie plot
      $('#movie-plot').append(`<b>Plot:</b> ${responseJson.overview}`);
      //Add movie rating
      $('#movie-score').append(`<b>Rating:</b> ${responseJson.vote_average}/10`);
      //Add movie cast
      for (let i = 0; i < 3; i++) {
          $('#movie-cast').append(`
              <h2>Cast</h2>
              <div class="cast-card" id="${responseJson.credits.cast[i].name} card">
                  <div class="cast-image" id="${responseJson.credits.cast[i].name} profile">
                      <img src="https://image.tmdb.org/t/p/w185${responseJson.credits.cast[i].profile_path}" alt="${responseJson.credits.cast[i].name}">
                  </div>
                  <div class="cast-name" id="${responseJson.credits.cast[i].name} title">
                      <p><b>${responseJson.credits.cast[i].name}</b> - ${responseJson.credits.cast[i].character}</p>
                  </div>
              </div>`);
      };
      //Add YouTube trailer
      for (let i = 0; i < responseJson.videos.results.length; i++) {
          if(responseJson.videos.results[i].iso_3166_1 === 'US' && responseJson.videos.results[i].type === 'Trailer') {
              $('#movie-trailer').append(`
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/${responseJson.videos.results[i].key}" frameborder="0" allow="accelerometer; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
          }
      };
  
      $('#results').addClass('hidden');
      $('#movie-results').removeClass('hidden');
};



function getData(searchVal) {
  const firstUrl = 'https://api.themoviedb.org/3/movie/' + searchVal + '?api_key=99a68578a1d03d97a1d4c9f381484db9&language=en-US&append_to_response=credits,release_dates,videos';
  
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