import { formatName } from './utils.js';
export function createPokemonCard(pokemon, isFavorite, onToggleFavorite) {
  const statsHtml = pokemon.stats.map((stat) => {
    const value = stat.base_stat;
    const width = Math.min((value / 180) * 100, 100);
    return `
      <div class="stat-row">
        <span>${formatName(stat.stat.name)}</span>
        <div class="bar"><span style="width:${width}%"></span></div>
        <strong>${value}</strong>
      </div>
    `;
  }).join('');
  const typesHtml = pokemon.types.map((type) => `
    <span class="type">${type.type.name}</span>
  `).join('');
  const card = document.createElement('article');
  card.className = 'pokemon-card';
  card.innerHTML = `
    <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" alt="${pokemon.name}" />
    <div class="pokemon-id">#${String(pokemon.id).padStart(4, '0')}</div>
    <div class="pokemon-name">${formatName(pokemon.name)}</div>
    <div class="types">${typesHtml}</div>
    <div class="stats">${statsHtml}</div>
    <button class="favorite-btn ${isFavorite ? 'is-favorite' : ''}">
      ${isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    </button>
  `;
  const favoriteBtn = card.querySelector('.favorite-btn');
  favoriteBtn.addEventListener('click', () => {
    onToggleFavorite(pokemon);
  });
  return card;
}
export function renderHistory(container, history, onSearchClick) {
  container.innerHTML = '';
  if (!history.length) {
    container.innerHTML = '<p class="empty-text">Aucune recherche enregistrée.</p>';
    return;
  }
  history.forEach((query) => {
    const button = document.createElement('button');
    button.className = 'tag-button';
    button.textContent = formatName(query);
    button.addEventListener('click', () => onSearchClick(query));
    container.appendChild(button);
  });
}
export function renderFavorites(container, favorites, onFavoriteClick) {
  container.innerHTML = '';

  if (!favorites.length) {
    container.innerHTML = '<p class="empty-text">Aucun favori pour le moment.</p>';
    return;
  }
  favorites.forEach((pokemon) => {
    const button = document.createElement('button');
    button.className = 'favorite-card-button';
    button.textContent = `#${String(pokemon.id).padStart(4, '0')} ${formatName(pokemon.name)}`;
    button.addEventListener('click', () => onFavoriteClick(pokemon.name));
    container.appendChild(button);
  });
}