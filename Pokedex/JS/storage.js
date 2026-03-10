import { FAVORITES_KEY, MAX_HISTORY, SEARCH_HISTORY_KEY } from './config.js';
function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}
function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
export function getSearchHistory() {
  return readJson(SEARCH_HISTORY_KEY, []);
}
export function addSearchToHistory(query) {
  const normalized = String(query).trim().toLowerCase();
  if (!normalized) return getSearchHistory();
  const history = getSearchHistory().filter((item) => item !== normalized);
  history.unshift(normalized);
  const trimmedHistory = history.slice(0, MAX_HISTORY);
  writeJson(SEARCH_HISTORY_KEY, trimmedHistory);
  return trimmedHistory;
}
export function clearSearchHistory() {
  writeJson(SEARCH_HISTORY_KEY, []);
  return [];
}
export function getFavorites() {
  return readJson(FAVORITES_KEY, []);
}
export function isFavoritePokemon(pokemon) {
  const favorites = getFavorites();
  return favorites.some((item) => item.id === pokemon.id);
}
export function toggleFavorite(pokemon) {
  const favorites = getFavorites();
  const exists = favorites.some((item) => item.id === pokemon.id);
  if (exists) {
    const updated = favorites.filter((item) => item.id !== pokemon.id);
    writeJson(FAVORITES_KEY, updated);
    return updated;
  }
  const favoritePokemon = {
    id: pokemon.id,
    name: pokemon.name
  };
  const updated = [...favorites, favoritePokemon].sort((a, b) => a.id - b.id);
  writeJson(FAVORITES_KEY, updated);
  return updated;
}