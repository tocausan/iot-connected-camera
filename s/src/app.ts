'use strict';

import 'colors';
import {Host, HttpServer, WebSocketMessage, WebSocketServer} from "./models";
import moment = require("moment");
import {Config} from "./config";

process.title = Config.title;

const host = new Host().setConfig()
    .then(() => {
        const webServer = new HttpServer().create(),
            webSocketServer = new WebSocketServer().create(exec);

        function exec(message: string, socket: WebSocket) {
            const commands = [
                {command: 'help', description: 'get command help'},
                {command: 'ping', description: 'ping device'},
            ];

            switch (message) {
                case commands[0].command:
                    socket.send(new WebSocketMessage().set(commands).stringify());
                    break;
                case commands[1].command:
                    socket.send(new WebSocketMessage().set(moment.utc()).stringify());
                    break;
            }
        }

    })
    .catch((e: Error) => {
        console.log(e);
    });



