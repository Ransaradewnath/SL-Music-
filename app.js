let allSongs = [];

// Load and parse item.txt on page load
async function loadSongs() {
  try {
    const res = await fetch('item.txt');
    const text = await res.text();
    allSongs = parseSongs(text);
    showTrendingSongs();
} catch (error) {
    console.error('Error loading item.txt:', error);
}
}

// Convert item.txt content into song objects
function parseSongs(text) {
  const blocks = text.trim().split('\n\n');
  return blocks.map(block => {
    const lines = block.split('\n');
    const song = {};
    lines.forEach(line => {
      const [key, value] = line.split(':');
      if (key && value) {
        song[key.trim()] = value.trim();
}
});
    return song;
});
}

// Display search results
function showSearchResults(songs) {
  const list = document.getElementById('searchResults');
  list.innerHTML = '';
  songs.forEach(song => {
    const li = document.createElement('li');
    li.textContent = song['Song Name'];
    li.className = 'search-item';
    li.onclick = () => showSongDetails(song);
    list.appendChild(li);
});
}

// Show full song card
function showSongDetails(song) {
  const container = document.getElementById('songDetails');
  container.innerHTML = `
    <div class="song-card">
      <img src="${song['Cover']}" class="cover" alt="${song['Song Name']} Cover" />
      <h3>${song['Song Name']}</h3>
      <p>${song['Artist']}</p>
      <audio controls src="${song['Audio']}"></audio>
      <a href="${song['Audio']}" download class="download-btn">Download</a>
    </div>
  `;
  showRecommendations(song);
}

// Smart recommendations based on artist
function showRecommendations(currentSong) {
  const recs = allSongs.filter(song =>
    song['Artist'] === currentSong['Artist'] &&
    song['Song Name']!== currentSong['Song Name']
).slice(0, 2);

  if (recs.length> 0) {
    const container = document.createElement('div');
    container.className = 'recommendations';
    container.innerHTML = `<h4>You Might Also Like</h4>`;
    recs.forEach(song => {
      const div = document.createElement('div');
      div.className = 'rec-card';
      div.innerHTML = `<p>${song['Song Name']} – ${song['Artist']}</p>`;
      div.onclick = () => showSongDetails(song);
      container.appendChild(div);
});
    document.getElementById('songDetails').appendChild(container);
}
}

// Trending songs (first 3 from item.txt)
function showTrendingSongs() {
  const trendingList = document.getElementById('trendingList');
  if (!trendingList) return;
  trendingList.innerHTML = '';
  const topSongs = allSongs.slice(0, 3);
  topSongs.forEach(song => {
    const card = document.createElement('div');
    card.className = 'trending-card';
    card.innerHTML = `
      <img src="${song['Cover']}" alt="${song['Song Name']} Cover" />
      <h4>${song['Song Name']}</h4>
      <p>${song['Artist']}</p>
    `;
    card.onclick = () => showSongDetails(song);
    trendingList.appendChild(card);
});
}

// Search input listener
document.getElementById('searchInput')?.addEventListener('input', e => {
  const query = e.target.value.toLowerCase();
  const matches = allSongs.filter(song =>
    song['Song Name'].toLowerCase().includes(query) ||
    song['Artist'].toLowerCase().includes(query)
);
  showSearchResults(matches);
});

// Initialize
loadSongs();
