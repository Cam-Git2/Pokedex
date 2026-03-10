import { LIMIT } from './config.js';
import { fetchPokemonBatch, fetchPokemonByQuery } from './api.js';
import {
  addSearchToHistory,
  clearSearchHistory,
  getFavorites,
  getSearchHistory,
  isFavoritePokemon,
  toggleFavorite
} from './storage.js';
import {
  createPokemonCard,
  renderFavorites,
  renderHistory
} from './ui.js';
import { formatName } from './utils.js';

const pokemonGrid = document.getElementById('pokemonGrid');
const statusEl = document.getElementById('status');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resetBtn = document.getElementById('resetBtn');
const historyList = document.getElementById('historyList');
const favoritesList = document.getElementById('favoritesList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

let offset = 0;
function refreshHistoryUi() {
  renderHistory(historyList, getSearchHistory(), async (query) => {
    searchInput.value = query;
    await searchPokemon(query);
  });
}
function refreshFavoritesUi() {
  renderFavorites(favoritesList, getFavorites(), async (query) => {
    searchInput.value = query;
    await searchPokemon(query);
  });
}
function appendPokemonCard(pokemon) {
  const card = createPokemonCard(
    pokemon,
    isFavoritePokemon(pokemon),
    (selectedPokemon) => {
      toggleFavorite(selectedPokemon);
      refreshFavoritesUi();
      redrawCurrentCards();
    }
  );
  pokemonGrid.appendChild(card);
}
async function redrawCurrentCards() {
  const currentNames = [...pokemonGrid.querySelectorAll('.pokemon-name')]
    .map((element) => element.textContent.trim().toLowerCase().replace(/ /g, '-'));
  if (!currentNames.length) return;
  pokemonGrid.innerHTML = '';
  for (const name of currentNames) {
    try {
      const pokemon = await fetchPokemonByQuery(name);
      appendPokemonCard(pokemon);
    } catch {
      // rien
    }
  }
}
async function loadPokemonBatch() {
  try {
    statusEl.textContent = 'Chargement...';
    loadMoreBtn.disabled = true;
    const details = await fetchPokemonBatch(offset);
    details.forEach((pokemon) => {
      appendPokemonCard(pokemon);
    });
    offset += LIMIT;
    statusEl.textContent = `${pokemonGrid.children.length} Pokémon affichés`;
  } catch (error) {
    statusEl.textContent = error.message;
  } finally {
    loadMoreBtn.disabled = false;
  }
}
async function searchPokemon(forcedQuery = null) {
  const query = (forcedQuery ?? searchInput.value).trim().toLowerCase();
  if (!query) {
    statusEl.textContent = 'Entre un nom ou un numéro de Pokémon.';
    return;
  }
  try {
    pokemonGrid.innerHTML = '';
    statusEl.textContent = 'Recherche en cours...';
    loadMoreBtn.classList.add('hidden');
    const pokemon = await fetchPokemonByQuery(query);
    appendPokemonCard(pokemon);
    statusEl.textContent = `Résultat pour : ${formatName(pokemon.name)}`;
    addSearchToHistory(query);
    refreshHistoryUi();
  } catch (error) {
    statusEl.textContent = error.message;
  }
}
function resetPokedex() {
  pokemonGrid.innerHTML = '';
  offset = 0;
  searchInput.value = '';
  loadMoreBtn.classList.remove('hidden');
  loadPokemonBatch();
}
loadMoreBtn.addEventListener('click', loadPokemonBatch);
searchBtn.addEventListener('click', () => searchPokemon());
resetBtn.addEventListener('click', resetPokedex);
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchPokemon();
  }
});
clearHistoryBtn.addEventListener('click', () => {
  clearSearchHistory();
  refreshHistoryUi();
});
refreshHistoryUi();
refreshFavoritesUi();
loadPokemonBatch();