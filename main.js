const API_URL = 'http://localhost:3000/api/games';
const contentArea = document.getElementById('content-area');

// 1. Make loadGamesList globally accessible
window.loadGamesList = async function(searchQuery = '') {
    const url = searchQuery ? `${API_URL}?search=${searchQuery}` : API_URL;
    
    try {
        const res = await fetch(url);
        const games = await res.json();
        
        let html = `
            <div style="margin-bottom: 2rem;">
                <input type="search" id="search-input" placeholder="Search by title or genre..." value="${searchQuery}">
                <button onclick="handleSearch()">Search</button>
            </div>
            <div class="grid">
        `;
        
        games.forEach(game => {
            html += `
                <article>
                    <img src="${game.image_url}" alt="${game.title}" style="width:100%; height:180px; object-fit:cover;">
                    <h3>${game.title}</h3>
                    <p><strong>Genre:</strong> ${game.genre}</p>
                    <button onclick="loadGameDetail('${game.id}')">View Full Specifications</button>
                </article>
            `;
        });
        
        html += `</div>`;
        contentArea.innerHTML = html;
        
    } catch (err) {
        contentArea.innerHTML = `<p class="error">Failed to fetch list records from backend database.</p>`;
    }
}

// 2. Make loadGameDetail globally accessible
window.loadGameDetail = async function(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const game = await res.json();
        
        contentArea.innerHTML = `
            <article>
                <header>
                    <button class="secondary" onclick="loadGamesList()">← Back to Archive</button>
                    <h2>${game.title}</h2>
                </header>
                <div class="grid">
                    <img src="${game.image_url}" alt="${game.title}">
                    <div>
                        <h3>Database Entry Details</h3>
                        <ul>
                            <li><strong>Manufacturer:</strong> ${game.manufacturer}</li>
                            <li><strong>Release Year:</strong> ${game.year}</li>
                            <li><strong>Genre:</strong> ${game.genre}</li>
                            <li><strong>Global High Score:</strong> ${game.high_score}</li>
                        </ul>
                        <p>${game.description}</p>
                    </div>
                </div>
            </article>
        `;
    } catch (err) {
        console.error(err);
    }
}

// 3. Keep handleSearch globally accessible
window.handleSearch = () => {
    const query = document.getElementById('search-input').value;
    window.loadGamesList(query);
};

// Fire up initial view load immediately
window.loadGamesList();