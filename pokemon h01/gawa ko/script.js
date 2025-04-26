const pokedex = document.getElementById("pokedex");
const searchInput = document.getElementById("search");
const typeFilter = document.getElementById("typeFilter");
const generationFilter = document.getElementById("generationFilter");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

let allPokemon = [];
let filteredPokemon = [];
let currentPage = 1;
const itemsPerPage = 8;

// Fetch Pokémon data with real types
async function fetchPokemon() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await response.json();

    const pokemonDetails = await Promise.all(
        data.results.map(async (p, index) => {
            const res = await fetch(p.url);
            const details = await res.json();
            
            return {
                name: p.name,
                id: details.id,
                img: details.sprites.front_default,
                type: details.types.map(t => t.type.name).join(", "), // Get real type(s)
                generation: details.id <= 151 ? "Gen I" : "Gen II" // Adjust for more gens if needed
            };
        })
    );

    allPokemon = pokemonDetails;
    filteredPokemon = [...allPokemon]; // Ensure all Pokémon are searchable
    displayPokemon();
}

// Display paginated Pokémon
function displayPokemon() {
    pokedex.innerHTML = "";
    let start = (currentPage - 1) * itemsPerPage;
    let end = start + itemsPerPage;
    let paginatedPokemon = filteredPokemon.slice(start, end);

    paginatedPokemon.forEach(pokemon => {
        const card = document.createElement("div");
        card.classList.add("pokemon-card");
        card.innerHTML = `
            <img src="${pokemon.img}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <p>Type: ${pokemon.type}</p>
        `;
        card.addEventListener("click", () => showDetails(pokemon));
        pokedex.appendChild(card);
    });

    updatePagination();
}

// Show details when clicking a Pokémon
function showDetails(pokemon) {
    document.body.innerHTML = `
        <a href="index.html">Back to Pokédex</a>
        <h2>${pokemon.name}</h2>
        <img src="${pokemon.img}" alt="${pokemon.name}">
        <p><strong>Type:</strong> ${pokemon.type}</p>
        <p><strong>Generation:</strong> ${pokemon.generation}</p>
    `;
}

// Pagination functions
function updatePagination() {
    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(filteredPokemon.length / itemsPerPage)}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === Math.ceil(filteredPokemon.length / itemsPerPage);
}

// Search function
searchInput.addEventListener("input", (e) => {
    let searchTerm = e.target.value.toLowerCase();
    filteredPokemon = allPokemon.filter(pokemon => pokemon.name.includes(searchTerm));
    currentPage = 1;
    displayPokemon();
});

// Pagination buttons
prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        displayPokemon();
    }
});

nextPageBtn.addEventListener("click", () => {
    if (currentPage < Math.ceil(filteredPokemon.length / itemsPerPage)) {
        currentPage++;
        displayPokemon();
    }
});

// Initialize Pokédex
fetchPokemon();
