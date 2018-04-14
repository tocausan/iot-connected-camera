'use strict';

import 'colors';
import * as webSocket from 'ws';
import {Config} from "../config";
import {Benchmark} from "./Benchmark";

const benchmark: Benchmark = new Benchmark('Socket');

export class Socket {
    public host: string;
    public port: number;
    public clientAddress: string;
    public serverAddress: string;

    constructor() {
        this.host = Config.socket.host;
        this.port = Config.socket.port;
        this.clientAddress = 'ws://' + this.host + ':' + this.port;
        this.serverAddress = Config.server.socket;
        benchmark.pushLine('client address', this.clientAddress, true);
        benchmark.pushLine('server address', this.serverAddress, true);
        benchmark.display();
    }

    createServer(exec: any) {
        const server = new webSocket.Server({
            port: this.port
        });

        server.on('connection', (socket: any) => {
            socket.send('hello');

            socket.on('message', (message: any) => {
                console.log('server received: '.blue, message);
                exec(message, socket);
            });
        });

        return server;
    }

    createClient(exec: any) {
        const client = new webSocket(this.clientAddress);

        client.onopen = () => {
            client.send('hello');
            benchmark.pushLine('client open', 'passing', true);
        };

        client.onerror = (error: any) => {
            benchmark.pushLine('client error', error.message, false);
        };

        client.onmessage = (message: any) => {
            console.log('client received: '.blue, message.data);
            exec(message.data, client);
        };

        return client;
    }
}