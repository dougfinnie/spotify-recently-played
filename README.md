# Spotify Recently Played

A secure Node.js application that allows you to log in to your Spotify account and view your recently played tracks. Your credentials are never saved on the server.

## Features

- 🔐 Secure OAuth 2.0 authentication with Spotify
- 🎵 View your recently played tracks
- 📱 Responsive Bootstrap v5 design
- 🛡️ No data storage - your privacy is protected
- 🎨 Modern, clean interface

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd spotify-recently-played
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Spotify API Credentials

Create a `.env` file in the root directory with the following variables:

```bash
# Spotify API Credentials
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
SPOTIFY_REDIRECT_URI=http://localhost:3000/callback

# Server Configuration
PORT=3000
```

### 4. Get Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in the app details:
   - **App name**: Spotify Recently Played (or any name you prefer)
   - **App description**: A web app to view recently played tracks
   - **Website**: `http://localhost:3000`
   - **Redirect URI**: `http://localhost:3000/callback`
5. Click "Save"
6. Copy your **Client ID** and **Client Secret**
7. Paste them into your `.env` file

### 5. Build Assets

Copy Bootstrap CSS, JS, and fonts from npm packages to public directory:

```bash
npm run build
```

**Note:** The build process copies files from `node_modules` to `public/` directory. These generated files are excluded from git and can be recreated by running `npm run build`.

### 6. Start the Application

```bash
npm start
```

Visit `http://localhost:3000` in your browser.

## Development

### Available Scripts

- `npm start` - Start the server
- `npm run build` - Download Bootstrap CSS
- `npm run lint` - Check code for linting errors
- `npm run lint:fix` - Auto-fix linting errors
- `npm run format` - Format code with Prettier
- `npm run check` - Run both linting and formatting checks

### Code Quality

This project uses:
- **ESLint** for JavaScript linting
- **Prettier** for code formatting
- **Gulp** for build automation

## Security

- 🔒 No user data is stored on the server
- 🔐 OAuth 2.0 secure authentication
- 🛡️ Environment variables for sensitive data
- 🔍 View source code to verify privacy

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, Bootstrap v5, JavaScript
- **Authentication**: Spotify Web API
- **Build Tools**: Gulp, ESLint, Prettier

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Ensure your redirect URI in Spotify Dashboard matches exactly: `http://localhost:3000/callback`

2. **"Invalid client" error**
   - Double-check your `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in the `.env` file

3. **Bootstrap CSS not loading**
   - Run `npm run build` to download Bootstrap CSS locally

## License

MIT License - feel free to use and modify as needed.

---

Originally based on the Spotify Authorization Code Flow project from Glitch.com
