import { newfetchSpotifyTrack } from "./Tools/spotify_handler.cjs";
import fs from 'fs'

const playlist_url = 'https://open.spotify.com/playlist/2UpxGcCMsNmRPObM9mha44?si=cccbeac120764b19'
const input_dir= "C:/Users/aobar/Downloads/Test"

let songs = []
let renamed_paths = []
let old_paths = []

fs.readdirSync(input_dir).forEach(file=>{
    songs.push(file.replace('.mp3', ''))
    old_paths.push(`${input_dir}/${file}`)
}
)

const trackInfoList = await newfetchSpotifyTrack(playlist_url)

const isSong = (song, test) => {
    let matches = []
    test.split(' ').forEach(word => {
        if(!song.toLowerCase().includes(word.toLowerCase().replace('æ', '').replace('å', '').replace('ø', '').replace('.', '').replace("´",''))){
            matches.push(false)
            return
        }else{
            matches.push(true)
        }
    })
    return matches.filter(x=>x==false).length/matches.length <= 0.5 ? true : false;
}
songs.forEach(song => {
 const song_formatted = trackInfoList.filter(x=>{
    return isSong(song ,x.title)
 })[0]
 console.log(song_formatted)
 renamed_paths.push(`${input_dir}/${song_formatted.title} - ${song_formatted.subtitle}.mp3`)
})

console.log(old_paths)
console.log(renamed_paths)

for(let i = 0; i < old_paths.length; i++){
    fs.renameSync(old_paths[i], renamed_paths[i])
}