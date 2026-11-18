const global = {
  currentPage: window.location.pathname,
  search: {
    type: '',
    term: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  token: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNTgxYzY2YWVhNTlmNDlkNDcwNjkwZGU5OWMwNmUzZiIsIm5iZiI6MTc5MzYwODI4MC41OTYsInN1YiI6IjZhZTg0YTU4NzRiNTdiNTQwMWJiMDI5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.J6qBJjUsDIjdHMNT2ZYoLUIvqMRD8v3eutHV13jLPdA',
}

const moviesLink = document.querySelectorAll('.nav-link')[0]
const tvShowsLink = document.querySelectorAll('.nav-link')[1]



// display trending tv shows
async function diplayPopularShows() {
  const {results} = await fetchData('trending/tv/day')
  
  results.forEach(show => {
    const div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">

      ${
        show.poster_path ? 
        `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />` :
            `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${show.name}"
          />`
      }
      </a>
      <div class="card-body">
        <h5 class="card-title">${show.name}</h5>
        <p class="card-text">
            <small class="text-muted">Release: ${show.first_air_date}</small>
        </p>
      </div>
    `
    document.querySelector('#popular-shows').appendChild(div)
  })

}

// display popular movies
async function diplayPopularMovies() {
  const {results} = await fetchData('trending/movie/day')
  
  results.forEach(movie => {
    const div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">

      ${
        movie.poster_path ? 
        `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />` :
            `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
          />`
      }
      </a>
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
        </p>
      </div>
    `
    document.querySelector('#popular-movies').appendChild(div)
  })

}

// display current playing movies
async function displayMovieSwiper() {
  // display current playing movies

  const {results} = await fetchData('movie/now_playing')
  console.log(results);

  results.map(movie => {
    const div = document.createElement('div')
    div.classList.add('swiper-slide')

    div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed('1')} / 10
            </h4>
          
    `
    document.querySelector('.swiper-wrapper').appendChild(div)
    console.log(div);
    
  })

  initSwiper()

}

// display current TV show
async function displayShowSwiper() {
  // display current playing movies

  const {results} = await fetchData('tv/airing_today')
  console.log(results);

  results.map(show => {
    const div = document.createElement('div')
    div.classList.add('swiper-slide')

    div.innerHTML = `
            <a href="tv-details.html?id=${show.id}">
              <img src="https://image.tmdb.org/t/p/w500${show.poster_path}"alt="${show.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${show.vote_average.toFixed('1')} / 10
            </h4>
          
    `
    document.querySelector('.swiper-wrapper').appendChild(div)
    console.log(div);
    
  })

  initSwiper()

}

// display search movie results
async function displaySearchResults() {

      // clear search results
      document.querySelector('#search-results').innerHTML = ' '

      // clear search heading
      document.querySelector('#search-results-heading').innerHTML = ' '    

      // clear pagination
      document.querySelector('#pagination').innerHTML = ' '  
      // fetch data
      const {results, total_pages, page, total_results} = await fetchSearchData()
      if (results.length === 0) {
        showAlert("Not found", 'alert')
        return
      }

      global.search.page = page
      global.search.totalPages = total_pages
      global.search.totalResults = total_results
      console.log(global.search);

      // display numbers of search results

      const h2 = document.createElement('h2')
      h2.innerHTML = `
        ${results.length} of ${global.search.totalResults} results for ${global.search.term}
      `

      document.querySelector('#search-results-heading').appendChild(h2)

      results.map(result => {
        const div = document.createElement('div')
        div.classList.add('card')

        div.innerHTML = `
          <a href="${global.search.type}-details.html?id=${result.id}">
              ${
        result.poster_path ? 
        `<img
              src="https://image.tmdb.org/t/p/w500${result.poster_path}"
              class="card-img-top"
              alt="${global.search.type === 'movie' ? result.title : result.name}"
            />` :
            `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${global.search.type === 'movie' ? result.title : result.name}"
          />`
      }
          </a>
          <div class="card-body">
            <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${global.search.type === 'movie' ? result.release_date : result.first_air_date
                }</small>
            </p>
        `
        document.querySelector('#search-results').appendChild(div)
      }
    )

    // pagination
    const div = document.createElement('div')
    div.classList.add('pagination')
    div.innerHTML = `
        <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
    `

    // add to DOM
    document.querySelector('#pagination').appendChild(div)


    // checking to show prev and next btn
    if (global.search.page === 1) {
      document.querySelector('#prev').style.display = 'none'
    } else if (global.search.page === global.search.totalPages) {
      document.querySelector('#next').style.display = 'none'
    }

    // when click on next, go to next page
    document.querySelector('#next').addEventListener('click', nextPage)
    document.querySelector('#prev').addEventListener('click', prevPage)

}

// go to next page
async function nextPage() {
  global.search.page++;
  // global.search.length += results.length
  // global.search.length += results.length
  // console.log(global.search.page);

  // fetch data for next page
  displaySearchResults()

}

// go to prev page
async function prevPage() {
  global.search.page--;
  // global.search.length -= results.length
  // global.search.length += results.length
  // console.log(global.search.page);

  // fetch data for next page
  displaySearchResults()
  
}


async function movieDetails() {
  const movieID = window.location.search.split('=')[1]

  // console.log(movieID);

  const movie = await fetchData(`movie/${movieID}`)
  console.log(movie);

  displayBackgroundImage('movie', movie.backdrop_path)

  // create a div
  const div = document.createElement('div')
  div.innerHTML = `
      <div class="details-top">
          <div>
                 ${
        movie.poster_path ? 
        `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />` :
            `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
          />`
      }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed('1')} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
            ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map(genre => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget: </span> $${addCommaToNumber(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommaToNumber(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${movie.production_companies.map(company => company.name).join(', ')}
          </div>
        </div>
  `

  document.querySelector('#movie-details').appendChild(div)
}

async function showDetails() {

  const showID = document.location.search.split("=")[1]

  // fetching each show details by using ID
  const show = await fetchData(`tv/${showID}`)
  console.log(show);

  displayBackgroundImage('show', `${show.backdrop_path}`)
  const div = document.createElement('div')
  div.innerHTML = `  <div class="details-top">
          <div>
          ${
            show.poster_path ? 
            `<img
                  src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                  class="card-img-top"
                  alt="${show.name}"
                />` :
                `<img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="${show.name}"
              />`
          }
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${show.first_air_date}</p>
            <p>${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${
                show.genres.map(genre => `<li>${genre.name}</li>` ).join('')}
            </ul>
            <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${
              show.number_of_episodes}</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.name}
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${show.production_companies.map(company => `<span>${company.name}</span>`).join(', ')}
          </div>
        </div>`

    document.querySelector('#show-details').appendChild(div)
}

function search() {

  // getting url
  const url = document.location.search

  // passing url into URLSearchParams obj
  const urlParams = new URLSearchParams(url)

  // getting value using get method 
  global.search.type = urlParams.get('type')
  global.search.term = urlParams.get('search-term')
  

  console.log(global.search);
  // checking whether search-term is empty or null
  if (global.search.term !== '' && global.search.term !== null) {
    
    displaySearchResults()

  } else {
    showAlert('Please enter a search name!', 'alert-error')
  }
}

// fetch data
async function fetchData(endpoint) {

  const baseURL = 'https://api.themoviedb.org/3/'
  const options = {
    method: 'GET',
    headers: {accept: 'application/json', Authorization: `Bearer ${global.token}`}
  };

  showSpinner()

  const response = await fetch(`${baseURL}${endpoint}?language=en-US`, options)

  const data = response.json()
  hideSpinner()
  return data
}

// fetch search data
async function fetchSearchData() {

  const baseURL = 'https://api.themoviedb.org/3/'
  const options = {
    method: 'GET',
    headers: {accept: 'application/json', Authorization: `Bearer ${global.token}`}
  };

  showSpinner()

  const response = await fetch(`${baseURL}search/${global.search.type}?include_adult=false&language=en-US&query=${global.search.term}&page=${global.search.page}`, options)

  const data = response.json()
  hideSpinner()
  return data
}

// hilight active link 
function hilightActiveLink(link) {
  link.classList.add('active')
}

// spinner toggle
function showSpinner() {
  document.querySelector('.spinner').classList.add('show')
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show')
}

function showAlert(message, className) {
  const alertEl = document.createElement('div')
  alertEl.classList.add('alert', className)
  const alertMsg = document.createTextNode(message)

  console.log(alertMsg);

  // appending text node to alert div
  alertEl.appendChild(alertMsg)

  // appending alertEl to main alert container
  document.querySelector('#alert').appendChild(alertEl)
}

function addCommaToNumber(number) {
  return Intl.NumberFormat('en-US').format(number)
}

// display background image
function displayBackgroundImage(type, path) {
  const overlayDiv = document.createElement('div')
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${path})`
  overlayDiv.style.backgroundSize = 'cover'
  overlayDiv.style.backgroundPosition = 'center'
  overlayDiv.style.backgroundRepeat = 'no-repeat'
  overlayDiv.style.opacity = '0.1'
  overlayDiv.style.height = '100vh'
  overlayDiv.style.width = '100vw'
  overlayDiv.style.position = 'absolute'
  overlayDiv.style.top = '0'
  overlayDiv.style.left = '0'
  // overlayDiv.style.bottom = '0'
  overlayDiv.style.zIndex = '-1'
  // overlayDiv.style.border = '1px solid red'

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv)
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv)
  }
}

function initSwiper() {
  const swiper = new Swiper('.swiper',
    {
      slidesPerView: 1,
      spaceBetween: 30,
      freeMode: true,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      breakpoints: {
        500: {slidesPerView: 2},
        700: {slidesPerView: 3},
        1200: {slidesPerView: 4},
      }
    }
  )
}

function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      hilightActiveLink(moviesLink)
      displayMovieSwiper()
      diplayPopularMovies()
      break
    case '/shows.html':
      console.log('TV shows Page');
      hilightActiveLink(tvShowsLink)
      displayShowSwiper()
      diplayPopularShows()
      break;
    case '/movie-details.html':
      movieDetails()
      break;
    case '/tv-details.html':
      // console.log('TV show Details Page');
      showDetails()
      break;
    case '/search.html':
      search()
      break;
  }
}

document.addEventListener('DOMContentLoaded', init)

// document.addEventListener('DOMContentLoaded', () => {
//   moviesLink.style.color = '#fff'
// })