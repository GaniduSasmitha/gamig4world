// Initialize favorites
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Toggle Favorite
function toggleFavorite(name, img, price, btn) {
    const exists = favorites.find(item => item.name === name);

    if (exists) {
        favorites = favorites.filter(item => item.name !== name);
        btn.classList.remove('favorited');
        btn.innerText = '❤ Favorite';
    } else {
        favorites.push({ name, img, price });
        btn.classList.add('favorited');
        btn.innerText = '❤ Favorited';
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesCount();
}

// Update Favorite Count
function updateFavoritesCount() {
    const favCount = document.getElementById('favorites-count');
    if (favCount) {
        favCount.innerText = favorites.length;
    }
}

// Remove from Favorites
function removeFromFavorites(name) {
    favorites = favorites.filter(item => item.name !== name);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesCount();
    renderFavoriteItems();
}

// Render Favorite Items
function renderFavoriteItems() {
    const favContainer = document.getElementById('favorites-container');
    if (!favContainer) return;

    favContainer.innerHTML = '';

    if (favorites.length === 0) {
        favContainer.innerHTML = '<p>No favorite items yet.</p>';
        return;
    }

    favorites.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p class="price">${item.price.toLocaleString()} LKR</p>
            <div class="status in-stock">In Stock</div>
            <button class="remove-favorite" onclick="removeFromFavorites('${item.name}')">🗑 Remove</button>
        `;
        favContainer.appendChild(card);
    });
}

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    updateFavoritesCount();

    // Sync favorite buttons on product or consoles page
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const text = btn.getAttribute('onclick') || '';
        const match = text.match(/toggleFavorite\(['"](.+?)['"]/);
        if (match) {
            const name = match[1];
            if (favorites.some(item => item.name === name)) {
                btn.classList.add('favorited');
                btn.innerText = '❤ Favorited';
            }
        }
    });

    // If on favorite page
    renderFavoriteItems();
});
