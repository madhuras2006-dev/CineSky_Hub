const API_KEY = 'aee57bdf';
const BASE_URL = 'https://www.omdbapi.com/';

const movieInput = document.getElementById('movie-input');
const typeSelect = document.getElementById('type-select');
const searchBtn = document.getElementById('search-btn');
const moviesGrid = document.getElementById('movies-grid');
const sectionTitle = document.getElementById('section-title');
const statusMessage = document.getElementById('status-message');

const movieModal = document.getElementById('movie-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalBody = document.getElementById('modal-body');

// Mix of famous web series and blockbuster movie titles to query on startup
const startupSeries = ['Stranger Things', 'The Last of Us', 'Wednesday', 'Loki'];
const startupMovies = ['Avengers', 'Interstellar', 'Batman'];

document.addEventListener('DOMContentLoaded', () => {
    loadMixedTrendingContent();
});

// Load a rich feed of both Movies and Web Series on startup
async function loadMixedTrendingContent() {
    statusMessage.textContent = 'Loading trending movies & web series...';
    moviesGrid.innerHTML = '';

    try {
        let combinedResults = [];

        // Fetch top web series
        for (let seriesTitle of startupSeries) {
            const res = await fetch(`${BASE_URL}?s=${encodeURIComponent(seriesTitle)}&type=series&apikey=${API_KEY}`);
            const data = await res.json();
            if (data.Response === 'True') {
                combinedResults.push(...data.Search);
            }
        }

        // Fetch top movies
        for (let movieTitle of startupMovies) {
            const res = await fetch(`${BASE_URL}?s=${encodeURIComponent(movieTitle)}&type=movie&apikey=${API_KEY}`);
            const data = await res.json();
            if (data.Response === 'True') {
                combinedResults.push(...data.Search);
            }
        }

        // Remove duplicates based on imdbID
        const uniqueResults = Array.from(new Map(combinedResults.map(item => [item.imdbID, item])).values());

        if (uniqueResults.length > 0) {
            statusMessage.textContent = '';
            // Shuffle/mix results so web series and movies alternate nicely
            uniqueResults.sort(() => Math.random() - 0.5);
            displayMovieList(uniqueResults.slice(0, 12));
        } else {
            statusMessage.textContent = 'Could not load trending content.';
        }
    } catch (error) {
        statusMessage.textContent = 'Error connecting to movie service.';
    }
}

// Perform search with support for type filter (All, Movies, Series)
async function fetchMovies(searchTerm, type = '') {
    if (!searchTerm.trim()) {
        statusMessage.textContent = 'Please enter a movie or web series title.';
        return;
    }

    statusMessage.textContent = 'Searching...';
    moviesGrid.innerHTML = '';

    let url = `${BASE_URL}?s=${encodeURIComponent(searchTerm)}&apikey=${API_KEY}`;
    if (type) {
        url += `&type=${type}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === 'True') {
            statusMessage.textContent = '';
            displayMovieList(data.Search);
        } else {
            moviesGrid.innerHTML = '';
            statusMessage.textContent = data.Error || 'No results found.';
        }
    } catch (error) {
        moviesGrid.innerHTML = '';
        statusMessage.textContent = 'Error connecting to movie service.';
    }
}

function displayMovieList(movies) {
    moviesGrid.innerHTML = '';

    movies.forEach(movie => {
        const posterSrc = (movie.Poster && movie.Poster !== 'N/A') 
            ? movie.Poster 
            : 'https://via.placeholder.com/300x450/11131f/ffffff?text=No+Poster';

        const isSeries = movie.Type === 'series';
        const badgeClass = isSeries ? 'type-badge series' : 'type-badge';
        const displayType = isSeries ? 'Web Series' : 'Movie';

        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <div class="poster-wrapper">
                <span class="${badgeClass}">${displayType}</span>
                <img src="${posterSrc}" alt="${movie.Title}">
            </div>
            <div class="movie-info">
                <h4 class="movie-title">${movie.Title}</h4>
                <div class="movie-meta">
                    <span><i class="fa-regular fa-calendar"></i> ${movie.Year}</span>
                </div>
                <button class="btn-details" onclick="openMovieDetails('${movie.imdbID}')">
                    <i class="fa-solid fa-circle-info"></i> View Details
                </button>
            </div>
        `;
        moviesGrid.appendChild(card);
    });
}

// Fetch single title full details (Plot, Cast, Director, Seasons, Ratings) for Modal
async function openMovieDetails(imdbID) {
    modalBody.innerHTML = '<p style="color: #9ca3af; text-align: center;">Loading detailed information...</p>';
    movieModal.classList.remove('hidden');

    try {
        const response = await fetch(`${BASE_URL}?i=${imdbID}&plot=full&apikey=${API_KEY}`);
        const movie = await response.json();

        if (movie.Response === 'True') {
            const posterSrc = (movie.Poster && movie.Poster !== 'N/A') 
                ? movie.Poster 
                : 'https://via.placeholder.com/300x450/11131f/ffffff?text=No+Poster';

            const extraInfo = movie.Type === 'series' 
                ? `<p><strong>Total Seasons:</strong> ${movie.totalSeasons || 'N/A'}</p>`
                : `<p><strong>Box Office:</strong> ${movie.BoxOffice || 'N/A'}</p>`;

            modalBody.innerHTML = `
                <div class="detail-container">
                    <img src="${posterSrc}" alt="${movie.Title}" class="detail-poster">
                    <div class="detail-info">
                        <h2 class="detail-title">${movie.Title}</h2>
                        <div class="detail-pills">
                            <span class="pill rating"><i class="fa-solid fa-star"></i> ${movie.imdbRating !== 'N/A' ? movie.imdbRating : 'N/A'} / 10</span>
                            <span class="pill">${movie.Rated}</span>
                            <span class="pill">${movie.Runtime}</span>
                            <span class="pill">${movie.Genre}</span>
                        </div>
                        <p class="detail-plot">${movie.Plot}</p>
                        <div class="detail-meta">
                            <p><strong>Director / Creator:</strong> ${movie.Director}</p>
                            <p><strong>Cast / Actors:</strong> ${movie.Actors}</p>
                            <p><strong>Writer:</strong> ${movie.Writer}</p>
                            <p><strong>Released:</strong> ${movie.Released}</p>
                            ${extraInfo}
                        </div>
                    </div>
                </div>
            `;
        } else {
            modalBody.innerHTML = '<p style="color: #f87171; text-align: center;">Could not load details.</p>';
        }
    } catch (error) {
        modalBody.innerHTML = '<p style="color: #f87171; text-align: center;">Error fetching details.</p>';
    }
}

// Close Modal Events
function closeModal() {
    movieModal.classList.add('hidden');
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Handle Search Click
searchBtn.addEventListener('click', () => {
    const term = movieInput.value.trim();
    const type = typeSelect.value;
    if (term) {
        const typeLabel = type ? ` (${type === 'series' ? 'Web Series' : 'Movies'})` : '';
        sectionTitle.textContent = `Search Results for "${term}"${typeLabel}`;
        fetchMovies(term, type);
    }
});

// Handle Enter Key in Search
movieInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const term = movieInput.value.trim();
        const type = typeSelect.value;
        if (term) {
            const typeLabel = type ? ` (${type === 'series' ? 'Web Series' : 'Movies'})` : '';
            sectionTitle.textContent = `Search Results for "${term}"${typeLabel}`;
            fetchMovies(term, type);
        }
    }
});