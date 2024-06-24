const api_key = "0cef49dce8d89376c3e98a86a6b88018";
const api_url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${api_key}&page=1`;
const img_path = "https://image.tmdb.org/t/p/w1280";
const search_api = `https://api.themoviedb.org/3/search/movie?&api_key=${api_key}&query=`;
const cast_api = (movie_id) => `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${api_key}`;

const movieBox = document.querySelector("#movie-box");
const modal = document.getElementById("movie-modal");
const closeModalBtn = document.getElementsByClassName("close")[0];
const searchInput = document.getElementById("search-input");

const getMovies = async (url) => {
    try {

         let data = null;

       
        const cachedData = localStorage.getItem(url);
        if (cachedData) {
            data = JSON.parse(cachedData);
        } else {
            
            const response = await fetch(url);
            data = await response.json();

            
            localStorage.setItem(url, JSON.stringify(data));
        }
      if (data.results.length === 0) {
            showErrorMessage("No movies found.");
        } else {
            showMovies(data);
        }
    }
    catch {
         console.error('Error fetching movies:', error);
        showErrorMessage("Error fetching movies. Please try again later.");
    }
  
};

const getMovieCast = async (movie_id) => {
    const response = await fetch(cast_api(movie_id));
    const data = await response.json();
    return data.cast.slice(0, 5); 
};

const showMovies = (data) => {
    movieBox.innerHTML = "";
    data.results.forEach(result => {
        console.log(result)
        const imagePath = result.poster_path === null ? "img/image-missing.png" : img_path + result.poster_path;

        const box = document.createElement("div");
        box.classList.add("box");
        box.innerHTML = `<div class="movie-cards" data-id="${result.id}">
            <img src="${imagePath}" alt="" />
            <div class="rating-releaseDate">
                <span>${result.vote_average}</span>
                <span>${result.release_date}</span>
            </div>
            <div class="title"> 
                <h2>${result.original_title}</h2>
            </div>
            
        </div>`;
        movieBox.appendChild(box);

       
        box.addEventListener("click", async () => {
            document.getElementById("movie-detail-img").src = imagePath;
            document.getElementById("movie-detail-title").innerText = result.original_title;
            document.getElementById("movie-detail-rating").innerText = `Rating: ${result.vote_average}`;
            document.getElementById("movie-detail-releasedate").innerText = `Release: ${result.release_date}`;
            document.getElementById("movie-detail-overview").innerText = result.overview;

            const cast = await getMovieCast(result.id);
            const castNames = cast.map(member => member.name).join(', ');
            document.getElementById("movie-detail-cast").innerText = castNames;

            modal.style.display = "flex";
        });
    });
};

//show error message
const showErrorMessage = (message) => {
    movieBox.innerHTML = `<div class="error-message">${message}</div>`;
};

// Event listener for closing the modal
closeModalBtn.onclick = function () {
    modal.style.display = "none";
};

// Event listener for clicking outside the modal to close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// document.querySelector("#search-input").addEventListener("keyup", function (event) {
//     if (event.target.value !== "") {
//         getMovies(search_api + event.target.value);
//     } else {
//         getMovies(api_url);
//     }
// });


document.querySelector("#search-button").addEventListener("click", function () {
    const query = document.querySelector("#search-input").value.trim();
    if (query !== "") {
        getMovies(search_api + query);
    } else {
        getMovies(api_url);
    }
});

searchInput.addEventListener("input", function () {
    if (searchInput.value === "") {
        getMovies(api_url); 
    }
});
getMovies(api_url);

