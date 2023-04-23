
const fetch = require('isomorphic-unfetch')
const { getData } = require('spotify-url-info')(fetch)

const fetchSpotifyTrack = async (url, message) => {
  const allData = await getData(url);
  const trackList = allData.trackList;
  await message.editReply(`Loading ${trackList.length} songs from spotify`);
  const searchList = trackList.map((track) => `${track.title} ${track.subtitle}`);
  return searchList;
}
module.exports = { fetchSpotifyTrack };