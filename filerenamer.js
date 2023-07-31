import { newfetchSpotifyTrack } from "./Tools/spotify_handler.cjs";
import fs from 'fs'

const playlist_url = 'https://open.spotify.com/playlist/2IXsqUDxPtwMBnAeA5azy6?si=9edac75eede846d7'
const input_dir= "D:/Barbre og Haun på tur"

let songs = []
let renamed_paths = []
let old_paths = []

fs.readdirSync(input_dir).forEach(file=>{
    songs.push(file.replace('.mp3', ''))
    old_paths.push(`${input_dir}/${file}`)
}
)

const trackInfoList = await newfetchSpotifyTrack(playlist_url)

console.log(songs)

const isSong = (song, test) => {
    let matches = []
    test.split(' ').forEach(word => {
if(song.toLowerCase().includes(` ${word.toLowerCase().replace('æ', '').replace('å', '').replace('ø', '').replace('.', '').replace("´",'')}`) || song.toLowerCase().includes(`${word.toLowerCase().replace('æ', '').replace('å', '').replace('ø', '').replace('.', '').replace("´",'')} `)){
            matches.push(true)
        }else{
            matches.push(false)
            return
        }
    })
    return matches.filter(x=>x==false).length/matches.length <= 0.3 ? true : false;
}
songs.forEach(song => {
 const song_formatted = trackInfoList.filter(x=>{
    return isSong(song ,x.title)
 })[0]
 console.log(song)
 console.log(song_formatted)
 renamed_paths.push(`${input_dir}/${song_formatted.title} - ${song_formatted.subtitle}.mp3`)
})

console.log(old_paths)
console.log(renamed_paths)

for(let i = 0; i < old_paths.length; i++){
    try{
        fs.renameSync(old_paths[i], renamed_paths[i])
    } catch (e){
        console.log(old_paths[i] + e)
    }
}