import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';

const router = express.Router();
const spotifyApi = new SpotifyWebApi();

// Search for a track
router.get('/track', async (req, res) => {
  const trackName = req.query.track as string;

  try {
    const data = await spotifyApi.searchTracks(`track:${trackName}`);
    const tracks = data.body.tracks?.items || []; // Handle possible undefined tracks
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search tracks' });
  }
});

router.get('/artist', async (req, res) => {
  const artistName = req.query.artist as string;

  try {
    const data = await spotifyApi.searchArtists(`artist:${artistName}`);
    const artists = data.body.artists?.items || []; 
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search artists' });
  }
});

export default router;
