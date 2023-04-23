import {pause, play, unpause, stop, ping} from '../commands/basic_controlls.js'
import {add, queue, skip, clear, shuffle} from '../commands/playlist.js';
import {check} from '../commands/data.js';
export const command_table = [
    check,
    pause,
    play,
    unpause,
    stop,
    add,
    queue,
    skip,
    clear,
    shuffle,
    ping,
]