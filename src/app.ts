'use strict';

import 'colors';
import {Host, HttpServer, WsServer} from "./models";

new class {
    host: Host;
    httpServer: HttpServer;
    wsServer: WsServer;

    constructor() {
        process.title = 'pi-security';

        this.host = new Host();
        this.httpServer = new HttpServer();
        this.wsServer = new WsServer();

        this.wsServer.server.on('connection', (ws: any) => {
            ws.on('message', (message: any) => {
                console.log(message.toString().blue.bold);
            })
        });

    }

};


