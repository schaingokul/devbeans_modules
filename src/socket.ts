import { Server } from "socket.io";
import appConfig from "./config/app.config";

export const inistalizeSocket = (server:any)=>{
    const io= new Server(server, {cors:{origin:'*'}});
    io.on('connection', (socket) => {
        appConfig.logger.log(`Socket conected ${socket.id}`);

    })
}

export default inistalizeSocket;