'use strict';

import 'colors';
import * as webSocket from 'ws';
import {Camera, Host, HttpServer, Socket} from "./models";
import {Config} from "./config";

const host = new Host(),
    webServer = new HttpServer().createServer(),
    socket = new Socket(),
    wsServer = socket.createServer(exec),
    camera = new Camera();

function exec(message: string, client: webSocket) {
    const commands = [
        {command: 'help', description: 'get command help'},
        {command: 'host', description: 'get host informations'},
        {command: 'config', description: 'get device configurations'},
        {command: 'ping', description: 'ping device'},
        {command: 'image', description: 'take image'},
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
        case commands[4].command:
            camera.takeImage()
                .then((result: any) => {
                    client.send(JSON.stringify(result));
                })
                .catch((e: any) => {
                    client.send(JSON.stringify(e));
                });
            break;
        default:
            client.send('command not found (type "help")');
            break
    }
}





