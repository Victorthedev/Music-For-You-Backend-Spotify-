import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import querystring from 'querystring';
import dotenv from 'dotenv';
import crypto from 'crypto';  

dotenv.config();

const router = express.Router();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

router.get('/login', (req, res) => {
  const scopes = ['user-read-private', 'user-read-email'];
  const state = crypto.randomBytes(16).toString('hex'); 
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  res.redirect(authorizeURL);
});

router.get('/callback', async (req, res) => {
  const code = req.query.code as string;

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];

    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    res.redirect(`/#/access_token=${accessToken}&refresh_token=${refreshToken}`);
  } catch (err) {
    res.redirect('/#/error/invalid_token');
  }
});

router.get('/refresh_token', async (req, res) => {
  const refreshToken = req.query.refresh_token as string;

  try {
    spotifyApi.setRefreshToken(refreshToken);
    const data = await spotifyApi.refreshAccessToken();
    const accessToken = data.body['access_token'];
    res.send({
      'access_token': accessToken,
    });
  } catch (err) {
    res.status(500).send('Failed to refresh access token');
  }
});

export default router;
