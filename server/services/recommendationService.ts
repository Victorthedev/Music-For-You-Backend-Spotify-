import spotifyApi from './spotifyService';

export const getSimilarTracks = async (seedTrackId: string) => {
  const seedTrackFeatures = await spotifyApi.getAudioFeaturesForTrack(seedTrackId);
  const seedTrackAnalysis = await spotifyApi.getAudioAnalysisForTrack(seedTrackId);

  const recommendations = await spotifyApi.getRecommendations({
    seed_tracks: [seedTrackId],
    limit: 50
  });

  const filteredTracks = recommendations.body.tracks.filter(track => {
    const trackFeatures = spotifyApi.getAudioFeaturesForTrack(track.id);
    const trackAnalysis = spotifyApi.getAudioAnalysisForTrack(track.id);

    const acousticnessDiff = Math.abs(trackFeatures.acousticness - seedTrackFeatures.acousticness);
    const energyDiff = Math.abs(trackFeatures.energy - seedTrackFeatures.energy);
    const instrumentalnessDiff = Math.abs(trackFeatures.instrumentalness - seedTrackFeatures.instrumentalness);

    const similarityScore = acousticnessDiff + energyDiff + instrumentalnessDiff;

    return similarityScore < 0.3;
  });

  filteredTracks.sort((a, b) => a.similarityScore - b.similarityScore);

  return filteredTracks.slice(0, 20);
};
