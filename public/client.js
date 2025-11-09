// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  if (localStorage.getItem("spotify-recent") != null) {
    $("#login").hide();
    displayRecent(JSON.parse(localStorage.getItem("spotify-recent")));
  }

  $("#login").click(function() {
    // Call the authorize endpoint, which will return an authorize URL, then redirect to that URL
    $.get("/authorize", function(data) {
      console.log(data);
      window.location = data;
    });
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
    $.get(
      {
        url: "/recent",
        headers: { Authorization: `Bearer ${hash.access_token}` }
      },
      function(data) {
        // "Data" is the array of track objects we get from the API. See server.js for the function that returns it.
        localStorage.setItem("spotify-recent", JSON.stringify(data));
        displayRecent(data);
      }
    );
  }
  function refresh(access_token) {
    localStorage.removeItem("spotify-recent");
  }
  function displayRecent(data) {
    var title = $("<h3>Your recent tracks on Spotify:</h3>");
    title.prependTo("#data-container-recent");

    // For each of the tracks, create an element
    data.items.forEach(function(obj) {
      var track = obj.track
      var trackDiv = $('<li class="track"></li>');
      var img = track.album.images[2];
      var trackImg = $('<img class="art" >');
      trackImg.attr({
        src: img.url,
        title: track.album.name,
        width: img.width,
        height: img.height,
        class: "img-thumbnail"
      });
      var trackArtist = $('<span class="artist"></span>');
      trackDiv.append(trackImg);
      trackDiv.append(track.name);
      let artists = track.artists.map(item => item.name);
      trackArtist.text(artists.join(", "));
      trackDiv.append(" (");
      trackDiv.append(trackArtist);
      trackDiv.append(")");
      trackDiv.appendTo("#data-container-recent ol");
    });
  }
});
