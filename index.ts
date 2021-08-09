import * as LIBRARY_JSON from './library.json';
import Queue from "./classes/Queue";
import { Server, Socket } from "socket.io";

const io = new Server(3001,{
    cors:{
        origin:"*"
    }
});
const queue=new Queue(LIBRARY_JSON.library);
queue.next();

io.on("connection",(socket:Socket)=>{
    console.log(socket.id);
    socket.on("askSong",()=> {
        socket.emit("receiveSong",queue.currentSong,queue.currentState,queue.nextSong);
    });
})