// client-side js
// run by the browser each time your view template is loaded

document.addEventListener('DOMContentLoaded', function() {
  // Check authentication status via server session
  checkAuthStatus();
  
  // Handle URL parameters for auth success/logout
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('auth') === 'success') {
    showMessage('Authentication successful!', 'success');
    loadRecentTracks();
  } else if (urlParams.get('logout') === 'success') {
    showMessage('Logged out successfully!', 'info');
    clearDisplay();
  }

  document.getElementById("login").addEventListener('click', function() {
    // Call the authorize endpoint, which will return an authorize URL, then redirect to that URL
    fetch("/authorize")
      .then(response => response.text())
      .then(data => {
        window.location = data;
      })
      .catch(error => {
        console.error('Error:', error);
        showMessage('Authentication failed. Please try again.', 'danger');
      });
  });

  // Handle logout - redirect to server logout endpoint
  const logoutLink = document.querySelector('a[href="/logout"]');
  if (logoutLink) {
    logoutLink.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default navigation
      window.location.href = "/logout"; // Server will handle session cleanup
    });
  }

  // Check authentication status via server
  function checkAuthStatus() {
    fetch('/auth-status')
      .then(response => response.json())
      .then(data => {
        if (data.authenticated) {
          document.getElementById("login").style.display = "none";
          document.querySelector('a[href="/logout"]').style.display = "inline-block";
          loadRecentTracks();
        } else {
          document.getElementById("login").style.display = "inline-block";
          document.querySelector('a[href="/logout"]').style.display = "none";
          clearDisplay();
        }
      })
      .catch(error => {
        console.error('Auth check failed:', error);
        showMessage('Unable to verify authentication status.', 'warning');
      });
  }

  // Load recent tracks from server
  function loadRecentTracks() {
    fetch('/recent')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch recent tracks');
        }
        return response.json();
      })
      .then(data => {
        displayRecent(data);
      })
      .catch(error => {
        console.error('Error loading tracks:', error);
        showMessage('Failed to load recent tracks. Please try logging in again.', 'danger');
        // Reset to login state
        document.getElementById("login").style.display = "inline-block";
        document.querySelector('a[href="/logout"]').style.display = "none";
      });
  }

  // Clear display and show default message
  function clearDisplay() {
    document.getElementById("data-container-recent").innerHTML = `
      <div class="text-center text-muted py-4">
        <i class="bi bi-music-note-beamed display-4 d-block mb-3" aria-hidden="true"></i>
        <p class="mb-0">No tracks to display yet. Click "Log in" to get started!</p>
      </div>
    `;
  }

  // Show user messages
  function showMessage(message, type) {
    const container = document.getElementById("data-container-recent");
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 5000);
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
