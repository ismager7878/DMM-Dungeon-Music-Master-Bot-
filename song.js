import ytdl from "ytdl-core";
import { createAudioResource } from "@discordjs/voice";

export class Song {
    constructor(url) {
      this.url = url;
      this.resource = createAudioResource(ytdl(this.url, {
        filter: "audioonly",
        fmt: "mp3",
        highWaterMark: 1 << 62,
        liveBuffer: 1 << 62,
        dlChunkSize: 0,
        bitrate: 128,
        quality: "lowestaudio",
    }));
      this.metadata = this.getMetadata();
    }
    getMetadata = () => {
        const metadata = ytdl.getInfo(this.url);
        return metadata;}}

