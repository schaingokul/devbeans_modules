import { Server } from "socket.io";
import { printLog } from "./server";

export const inistalizeSocket = (server:any)=>{
    const io= new Server(server, {cors:{origin:'*'}});
    io.on('connection', (socket) => {
        if(printLog) console.log(`Socket conected ${socket.id}`);

    })
}

export default inistalizeSocket;