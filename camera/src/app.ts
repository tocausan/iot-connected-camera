'use strict';

import 'colors';
import * as webSocket from 'ws';
import {Camera, Host, HttpServer, WebSocketClient, WebSocketMessage} from "./models";
import {Config} from "./config";
import moment = require("moment");

process.title = Config.title;

const host = new Host().setConfig()
    .then(() => {
        const webServer = new HttpServer().create(),
            webSocketClient = new WebSocketClient().create(exec),
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
                    client.send(new WebSocketMessage().set(commands).stringify());
                    break;
                case commands[1].command:
                    client.send(new WebSocketMessage().set(host).stringify());
                    break;
                case commands[2].command:
                    client.send(new WebSocketMessage().set(Config).stringify());
                    break;
                case commands[3].command:
                    client.send(new WebSocketMessage().set(moment.utc()).stringify());
                    break;
                case commands[4].command:
                    camera.takeImage()
                        .then((result: any) => {
                            client.send(new WebSocketMessage().set(result).stringify());
                        })
                        .catch((e: any) => {
                            client.send(new WebSocketMessage().set(e).stringify());
                        });
                    break;
                default:
                    client.send(new WebSocketMessage().set('command not found (type "help")').stringify());
                    break;
            }
        }

    })
    .catch((e: Error) => {
        console.log(e);
    });





