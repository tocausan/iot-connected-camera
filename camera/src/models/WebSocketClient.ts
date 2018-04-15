'use strict';

import 'colors';
import * as moment from 'moment';
import * as webSocket from 'ws';
import {Config} from "../config";
import {Benchmark} from "./Benchmark";
import {Host} from "./Host";
import {WebSocketMessage} from "./WebSocketMessage";

const benchmark: Benchmark = new Benchmark('WebSocketClient');

export class WebSocketClient {
    public address: string;
    public serverAddress: string;
    private client: webSocket;
    private exec: any;
    public down: moment.Moment[][];

    constructor() {
        this.address = 'ws://' + Config.host.ip + ':' + Config.socket.port;
        this.serverAddress = Config.server.socket;
        this.down = [];

        benchmark.pushLine('address', this.address, true);
        benchmark.pushLine('server', this.serverAddress, true);
        benchmark.display();
    }

    public create(exec: any): webSocket {
        this.exec = exec;
        this.client = new webSocket(this.serverAddress);

        this.client.onopen = () => {
            console.log(new WebSocketMessage().set('connected').stringify())
            this.client.send(new WebSocketMessage().set('connected').stringify());
            new Benchmark('WebSocketClient', this.serverAddress, 'connected', true).display();
        };

        this.client.onclose = () => {
            new Benchmark('WebSocketClient', this.serverAddress, 'closed', false).display();
            this.ping();
        };

        this.client.onerror = () => {
            new Benchmark('WebSocketClient', this.serverAddress, 'unreachable', false).display();
        };
        this.client.onmessage = (data: any) => {
            const webSocketMessage = new WebSocketMessage().get(data).display();
            exec(webSocketMessage.message, this.client);
        };

        return this.client;
    }

    private ping() {
        const startTime = moment.utc(),
            pingInterval = setInterval(() => {
                this.client = new webSocket(this.serverAddress);

                this.client.onopen = () => {
                    clearInterval(pingInterval);
                    this.down.push([startTime, moment.utc()]);
                    this.client.close();
                    this.client = this.create(this.exec);
                };

                this.client.onerror = () => {
                    new Benchmark('WebSocketClient', this.serverAddress, 'unreachable', false).display();
                };
            }, 1000);
    }
}