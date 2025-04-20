// Load favorites from localStorage
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Toggle favorite (add/remove)
function toggleFavorite(name, img, price, btn) {
  let found = false;

  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i].name === name) {
      found = true;
      favorites.splice(i, 1);
      btn.classList.remove('favorited');
      btn.innerText = '❤ Favorite';
      break;
    }
  }

  if (!found) {
    favorites.push({ name: name, img: img, price: price });
    btn.classList.add('favorited');
    btn.innerText = '❤ Favorited';
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavoritesCount();
}

// Update favorite count display
function updateFavoritesCount() {
  const favCount = document.getElementById('favorites-count');
  if (favCount) {
    favCount.innerText = favorites.length;
  }
}

// Remove a favorite by name
function removeFromFavorites(name) {
  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i].name === name) {
      favorites.splice(i, 1);
      break;
    }
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavoritesCount();
  renderFavoriteItems();
}

// Show all favorite items in the favorites page
function renderFavoriteItems() {
  const favContainer = document.getElementById('favorites-container');
  if (!favContainer) return;

  favContainer.innerHTML = '';

  if (favorites.length === 0) {
    favContainer.innerHTML = '<p>No favorite items yet.</p>';
    return;
  }

  for (let i = 0; i < favorites.length; i++) {
    const item = favorites[i];
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p class="price">${item.price.toLocaleString()} LKR</p>
      <div class="status in-stock">In Stock</div>
      <button class="remove-favorite" onclick="removeFromFavorites('${item.name}')">Remove</button>
    `;
    favContainer.appendChild(card);
  }
}

// When page loads
document.addEventListener('DOMContentLoaded', function () {
  updateFavoritesCount();
  renderFavoriteItems();

  const favBtns = document.querySelectorAll('.favorite-btn');
  for (let i = 0; i < favBtns.length; i++) {
    const btn = favBtns[i];
    const onclickAttr = btn.getAttribute('onclick');

    if (onclickAttr && onclickAttr.includes("toggleFavorite(")) {
      const match = onclickAttr.match(/toggleFavorite\(['"](.+?)['"]/);
      if (match) {
        const name = match[1];
        for (let j = 0; j < favorites.length; j++) {
          if (favorites[j].name === name) {
            btn.classList.add('favorited');
            btn.innerText = '❤ Favorited';
            break;
          }
        }
      }
    }
  }
});
