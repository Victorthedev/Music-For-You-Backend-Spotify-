import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';

const router = express.Router();
const spotifyApi = new SpotifyWebApi();

router.post('/create', async (req, res) => {
  const { seedTrackId } = req.body;
  const userId = req.query.userId as string;

  try {
    const createPlaylistResponse = await spotifyApi.createPlaylist('Made for You', {
      description: 'Enjoy better shuffle',
      public: false,
    });

    const playlistId = createPlaylistResponse.body.id;

    const recommendationsResponse = await spotifyApi.getRecommendations({
      seed_tracks: [seedTrackId],
      limit: 30,
    });

    const trackUris = recommendationsResponse.body.tracks.map(track => track.uri);

    await spotifyApi.addTracksToPlaylist(playlistId, trackUris);

    res.json({
      message: 'Playlist created successfully',
      playlistId: playlistId,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

export default router;
