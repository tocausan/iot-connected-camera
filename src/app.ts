'use strict';

import 'colors';
import * as webSocket from 'ws';
import {Host, HttpServer, Socket} from "./models";
import {Config} from "./config";

const host = new Host(),
    socket = new Socket(),
    wsServer = socket.createServer(exec);

function exec(message: string, client: webSocket) {
    const commands = [
        {command: 'help', description: 'get command help'},
        {command: 'host', description: 'get host informations'},
        {command: 'config', description: 'get device configurations'},
        {command: 'ping', description: 'ping device'},
    ];

    switch (message) {
        case commands[0].command:
            client.send(JSON.stringify(commands));
            break;
        case commands[1].command:
            client.send(JSON.stringify(host));
            break;
        case commands[2].command:
            client.send(JSON.stringify(Config));
            break;
        case commands[3].command:
            client.send(JSON.stringify(new Date()));
            break;
        default:
            client.send('command not found (type "help")');
            break
    }
}





