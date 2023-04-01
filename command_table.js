import {pause, play, unpause, stop} from "./Commands/basic_controlls.js";
import {add, queue} from "./Commands/playlist.js";

export const command_table = {
    "play": play,
    "pause": pause,
    "unpause": unpause,
    "stop": stop,
    "add": add,
    "queue": queue,
};