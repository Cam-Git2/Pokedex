import { API_BASE, LIMIT } from './config.js';
export async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erreur lors du chargement du Pokémon');
  }
  return response.json();
}
export async function fetchPokemonBatch(offset) {
  const response = await fetch(`${API_BASE}/pokemon?limit=${LIMIT}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Impossible de récupérer la liste des Pokémon');
  }
  const data = await response.json();
  return Promise.all(data.results.map((pokemon) => fetchPokemonDetails(pokemon.url)));
}
export async function fetchPokemonByQuery(query) {
  const response = await fetch(`${API_BASE}/pokemon/${query}`);
  if (!response.ok) {
    throw new Error('Pokémon introuvable');
  }
  return response.json();
}