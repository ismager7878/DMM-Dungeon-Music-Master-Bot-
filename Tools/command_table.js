const {pause, play, unpause, stop} = require('../commands/basic_controlls.js')
const {add, queue, skip, play_playlist, add_playlist, clear, shuffle} = require('../commands/playlist.js');

const command_table = [
    pause,
    play,
    unpause,
    stop,
    add,
    queue,
    skip,
    play_playlist,
    add_playlist,
    clear,
    shuffle,
]
module.exports = {command_table};