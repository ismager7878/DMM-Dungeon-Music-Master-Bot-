
// import SpotifyWebApi from 'spotify-web-api-node';
// import pkg from 'spotify-url-info';
// import dotenv from 'dotenv';
// import { createAudioPlayer, createAudioResource } from '@discordjs/voice';
const fetch = require('isomorphic-unfetch')
const { getData, getPreview, getTracks, getDetails } = require('spotify-url-info')(fetch)

const fetchSpotifyTrack = async (url, message) => {
  const allData = await getData(url);
  const trackList = allData.trackList;
  await message.editReply(`Loading ${trackList.length} songs from spotify`);
  const searchList = trackList.map((track) => `${track.title} ${track.subtitle}`);
  return searchList;
}
module.exports = { fetchSpotifyTrack };
// const spotifyApi = new SpotifyWebApi({
//     clientId: process.env.ClientID,
//     clientSecret: process.env.ClientSecret,
//     redirectUri: 'http://localhost:3000/callback'
//   });

// async function playSpotifyTrack(voiceConnection, spotifyTrackUrl) {
//     try {
//       const player = createAudioPlayer();
//       // Get the info about the Spotify track
//       const { title, artist, streams } = await getData(spotifyTrackUrl);
  
//       // Create a readable stream from the track's URL
//       console.log(streams);
      
//       // Create an audio resource from the stream
//       const resource = createAudioResource(stream, {
//         inputType: 'stream',
//       });
  
//       // Play the audio resource
//       player.play(resource);
  
//       // Subscribe the player to the voice connection
//       voiceConnection.subscribe(player);
  
//       // Log a message when the track starts playing
//       console.log(`Now playing: ${title} by ${artist}`);
//     } catch (error) {
//       console.error(error);
//     }
// }
// //     if (message.content == '!login') {
// //         // Step 1: Redirect the user to Spotify Accounts Service for authentication and authorization
// //         const authorizeUrl = spotifyApi.createAuthorizeURL(['user-read-private', 'user-read-email'], 'state');
// //         await message.author.send(`Please authenticate and authorize your Spotify account by visiting this URL: ${authorizeUrl}`);
// //         const filter = (m) => {
// //             console.log(m.author.id);
// //             console.log(message.author.id);
// //             return m.author.id === message.author.id;
// //         };
// //         console.log(filter);
// //         console.log(message.author.dmChannel); 
// //         message.author.dmChannel.awaitMessages({filter, max: 1, time: 100000, errors: ['time']})
// //             .then(async collected => {
// //                 const data = await spotifyApi.authorizationCodeGrant(collected.first().content);
// //                 const accessToken = data.body.access_token;
// //                 const refreshToken = data.body.refresh_token;
// //                 const expiresIn = data.body.expires_in;
    
// //                 // Set the access token on the Spotify API client
// //                 spotifyApi.setAccessToken(accessToken);
    
// //                 await message.author.send(`Successfully authenticated and authorized your Spotify account! Your access token is: ${accessToken}`);
// //             })
// //             .catch(() => {
// //                 console.log('Timed out while waiting for message.');
// //             }
// //         );
        
// //     }
// // }