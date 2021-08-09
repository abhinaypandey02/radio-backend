import Song from "../interfaces/Song";
import CurrentlyPlaying from "../interfaces/CurrentlyPlaying";

const SYNC_RATE=1000;
const WAIT_TIME=5000;

export default class Queue {
    get nextSong(): CurrentlyPlaying | null {
        return this._nextSong;
    }
    get currentState(): "W" | "P" | "X" {
        return this._currentState;
    }
    get currentSong(): CurrentlyPlaying | null {
        return this._currentSong;
    }
    private readonly _library: Song[] = [];
    private _queue: Song[] = [];
    private _currentSong: CurrentlyPlaying | null = null;
    private _nextSong: CurrentlyPlaying | null = null;
    private _currentState: "W"|"P"|"X" = "X";

    constructor(library: Song[]) {
        this._library = library;
        setInterval(() => {
            if (!this.verifyCurrentlyPlaying()) {
                this.breakPhase();
                setTimeout(this.next.bind(this), WAIT_TIME)
            }
        }, SYNC_RATE)
    }

    generateQueue() {
        this._queue = [...this._library];
    }

    deleteFromQueue(song: Song) {
        this._queue = this._queue.filter(arraySong => arraySong.id !== song.id)
    }

    getSongFromQueue = (): Song => {
        if (this._queue.length === 0) this.generateQueue();
        return this._queue[Math.floor(Math.random() * this._queue.length)]
    }

    play(song: Song,start:number) {
        this._currentSong = { song, start };
        this._currentState = "P";
        this._nextSong=null;
    }

    verifyCurrentlyPlaying() {
        if (this._currentState === "W") return true;
        if (!this._currentSong) return false;
        return ((new Date().getTime() - this._currentSong.start) / 1000 <= this._currentSong.song.duration)
    }

    breakPhase() {
        const time = new Date();
        time.setSeconds(time.getSeconds() + WAIT_TIME/1000);
        this._nextSong = {start: time.getTime(), song: this.getSongFromQueue()};
        this._currentState="W";
    }

    next() {
        let nextSong,start;

        if (this._currentState === "W"&&this._nextSong) {
            nextSong = this._nextSong.song;
            start=this._nextSong.start;
        }
        else {
            nextSong = this.getSongFromQueue();
            start=new Date().getTime();
        }
        this.deleteFromQueue(nextSong);
        this.play(nextSong,start)
    }

}