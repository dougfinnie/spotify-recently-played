// client-side js
// run by the browser each time your view template is loaded

document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem("spotify-recent") != null) {
    document.getElementById("login").style.display = "none";
    displayRecent(JSON.parse(localStorage.getItem("spotify-recent")));
  }

  document.getElementById("login").addEventListener('click', function() {
    // Call the authorize endpoint, which will return an authorize URL, then redirect to that URL
    fetch("/authorize")
      .then(response => response.text())
      .then(data => {
        console.log(data);
        window.location = data;
      })
      .catch(error => console.error('Error:', error));
  });

  const hash = window.location.hash
    .substring(1)
    .split("&")
    .reduce(function(initial, item) {
      if (item) {
        var parts = item.split("=");
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});
  window.location.hash = "";

  if (hash.access_token) {
    fetch("/recent", {
      headers: { Authorization: `Bearer ${hash.access_token}` }
    })
      .then(response => response.json())
      .then(data => {
        // "Data" is the array of track objects we get from the API. See server.js for the function that returns it.
        localStorage.setItem("spotify-recent", JSON.stringify(data));
        displayRecent(data);
      })
      .catch(error => console.error('Error:', error));
  }

  function refresh(access_token) {
    localStorage.removeItem("spotify-recent");
  }

  function displayRecent(data) {
    const container = document.getElementById("data-container-recent");
    
    // Clear existing content
    container.innerHTML = "";
    
    // Create title
    const title = document.createElement("h3");
    title.textContent = "Your recent tracks on Spotify:";
    container.appendChild(title);

    // Create ordered list
    const trackList = document.createElement("ol");
    trackList.className = "list-group list-group-flush";

    // For each of the tracks, create an element
    data.items.forEach(function(obj) {
      const track = obj.track;
      const trackDiv = document.createElement("li");
      trackDiv.className = "list-group-item d-flex align-items-center";
      
      const img = track.album.images[2];
      const trackImg = document.createElement("img");
      trackImg.src = img.url;
      trackImg.title = track.album.name;
      trackImg.width = img.width;
      trackImg.height = img.height;
      trackImg.className = "img-thumbnail me-3";
      
      const trackInfo = document.createElement("div");
      trackInfo.className = "flex-grow-1";
      
      const trackName = document.createElement("div");
      trackName.className = "fw-bold";
      trackName.textContent = track.name;
      
      const trackArtist = document.createElement("div");
      trackArtist.className = "text-muted small";
      const artists = track.artists.map(item => item.name);
      trackArtist.textContent = artists.join(", ");
      
      trackInfo.appendChild(trackName);
      trackInfo.appendChild(trackArtist);
      
      trackDiv.appendChild(trackImg);
      trackDiv.appendChild(trackInfo);
      trackList.appendChild(trackDiv);
    });
    
    container.appendChild(trackList);
  }
});
