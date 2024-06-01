import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';

const router = express.Router();
const spotifyApi = new SpotifyWebApi();

router.get('/features', async (req, res) => {
  const trackId = req.query.trackId as string;

  try {
    const data = await spotifyApi.getAudioFeaturesForTrack(trackId);
    const audioFeatures = data.body;
    res.json(audioFeatures);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get audio features' });
  }
});

router.get('/analysis', async (req, res) => {
  const trackId = req.query.trackId as string;

  try {
    const data = await spotifyApi.getAudioAnalysisForTrack(trackId);
    const audioAnalysis = data.body;
    res.json(audioAnalysis);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get audio analysis' });
  }
});

export default router;
