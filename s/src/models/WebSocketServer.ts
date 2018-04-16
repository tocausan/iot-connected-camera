'use strict';

import 'colors';
import * as webSocket from 'ws';
import {Config} from "../config";
import {Benchmark} from "./Benchmark";
import WebSocket = require("ws");
import {Host} from "./Host";
import {WebSocketMessage} from "./WebSocketMessage";

const benchmark: Benchmark = new Benchmark('WebSocketServer');

export class WebSocketServer {
    public port: number;
    public address: string;

    constructor() {
        this.port = Config.socket.port;
        this.address = 'ws://' + Config.host.ip + ':' + this.port;
        benchmark.pushLine('address', this.address, true);
        benchmark.display();
    }

    create(exec: any) {
        const server = new webSocket.Server({
            port: this.port
        });

        server.on('connection', (socket: WebSocket) => {
            socket.send(new WebSocketMessage().set('hello').stringify());

            socket.on('message', (data: any) => {
                const webSocketMessage = new WebSocketMessage().get(data).display();
                exec(webSocketMessage.message, socket);
            });
        });

        return server;
    }
}