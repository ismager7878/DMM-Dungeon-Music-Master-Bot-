import ytdl from "ytdl-core";
import { createAudioResource } from "@discordjs/voice";

export class Song {
    constructor(url) {
      this.url = url;
    }
    
    initSong = async () => {
        this.resource = createAudioResource(ytdl(this.url, {
            filter: "audioonly",
            fmt: "mp3",
            highWaterMark: 1 << 62,
            liveBuffer: 1 << 62,
            
            dlChunkSize: 0,
            bitrate: 128,
            quality: "highestaudio",
        }));
        this.metadata = await this.getMetadata();
    }

    getMetadata = async () => {
      const metadata = await (await ytdl.getBasicInfo(this.url)).videoDetails;
      this.title = metadata.title;
      return metadata;}
}

