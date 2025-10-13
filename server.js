// server.js
// where your node app starts

// Load environment variables from .env file
require('dotenv').config();

// Security dependencies
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { body, validationResult } = require('express-validator');

// init project
var express = require('express');
var app = express();

// Security middleware configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://accounts.spotify.com", "https://api.spotify.com"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGINS?.split(',') : true,
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
});
app.use('/authorize', authLimiter);
app.use('/callback', authLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.woff2')) {
      res.setHeader('Content-Type', 'font/woff2');
    } else if (path.endsWith('.woff')) {
      res.setHeader('Content-Type', 'font/woff');
    } else if (path.endsWith('.ttf')) {
      res.setHeader('Content-Type', 'font/ttf');
    }
  }
}));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


//-------------------------------------------------------------//


// init Spotify API wrapper
var SpotifyWebApi = require('spotify-web-api-node');

// Replace with your redirect URI, required scopes, and show_dialog preference
var redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/callback';
var scopes = ['user-read-recently-played'];
var showDialog = true;

// The API object we'll use to interact with the API
var spotifyApi = new SpotifyWebApi({
  clientId : process.env.SPOTIFY_CLIENT_ID,
  clientSecret : process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri : redirectUri
});

app.get("/authorize", function (request, response) {
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes, null, showDialog);
  console.log(authorizeURL)
  response.send(authorizeURL);
});

// Exchange Authorization Code for an Access Token
app.get("/callback", function (request, response) {
  var authorizationCode = request.query.code;
  
  // Validate authorization code
  if (!authorizationCode || typeof authorizationCode !== 'string' || authorizationCode.length > 1000) {
    return response.status(400).json({ error: 'Invalid authorization code' });
  }
  
  spotifyApi.authorizationCodeGrant(authorizationCode)
  .then(function(data) {
    // Store tokens securely in session instead of URL
    request.session.accessToken = data.body['access_token'];
    request.session.refreshToken = data.body['refresh_token'];
    request.session.tokenExpiry = Date.now() + (data.body['expires_in'] * 1000);
    
    // Redirect to success page without exposing tokens
    response.redirect('/?auth=success');
  }, function(err) {
    console.error('Authorization error:', err.message);
    response.status(400).json({ error: 'Authentication failed' });
  });
});

app.get("/logout", function (request, response) {
  // Clear session data
  request.session.destroy(function(err) {
    if (err) {
      console.error('Session destruction error:', err);
    }
    response.redirect('/?logout=success');
  });
});

app.get('/recent', function(request, response) {
  // Check if user is authenticated via session
  if (!request.session.accessToken) {
    return response.status(401).json({ error: 'Authentication required' });
  }
  
  // Check if token is expired
  if (request.session.tokenExpiry && Date.now() > request.session.tokenExpiry) {
    return response.status(401).json({ error: 'Session expired' });
  }
  
  var loggedInSpotifyApi = new SpotifyWebApi();
  loggedInSpotifyApi.setAccessToken(request.session.accessToken);
  
  loggedInSpotifyApi.getMyRecentlyPlayedTracks()
    .then(function(data) {
      response.json(data.body);
    }, function(err) {
      console.error('Spotify API error:', err.message);
      response.status(500).json({ error: 'Failed to fetch recent tracks' });
    });
});

// Check authentication status
app.get('/auth-status', function(request, response) {
  if (request.session.accessToken) {
    response.json({ authenticated: true });
  } else {
    response.json({ authenticated: false });
  }
});

// Error handling middleware
app.use(function(err, req, res, next) {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use(function(req, res) {
  res.status(404).json({ error: 'Not found' });
});

//-------------------------------------------------------------//


// listen for requests :)
var port = process.env.PORT || 3000;
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
