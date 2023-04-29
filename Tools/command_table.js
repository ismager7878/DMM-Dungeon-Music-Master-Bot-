import {pause, play, unpause, stop, ping} from '../Commands/basic_controlls.js'
import {add, queue, skip, clear, shuffle} from '../Commands/playlist.js'
import {check, help} from '../Commands/data.js';
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
    help,
]