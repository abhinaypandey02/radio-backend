import * as LIBRARY_JSON from './library.json';
import Queue from "./classes/Queue";
import { Server, Socket } from "socket.io";
import {Chat} from "./interfaces/Chat";

const io = new Server(3001,{
    cors:{
        origin:"*"
    }
});
const queue=new Queue(LIBRARY_JSON.library);
queue.next();

let chats:Chat[]=[];

io.on("connection",(socket:Socket)=>{
    socket.on("askSong",()=> {
        socket.emit("receiveSong",queue.currentSong,queue.currentState,queue.nextSong);
    });
    socket.on("sendChat",(chat:Chat)=>{
        chats.push(chat);
        socket.emit("newChat",chats);
    })
    socket.on("getChats",()=>{
        socket.emit("newChat",chats);
    })
})