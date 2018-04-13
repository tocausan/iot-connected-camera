import * as webSocket from 'ws';
import {Config} from "../../hidden/config";
import {Benchmark} from "./Benchmark";

export class WsClient {
    private benchmark: Benchmark;
    private test: string;
    public host: string;
    public port: number;
    public address: string;
    public server: webSocket.Server;

    constructor() {
        this.benchmark = new Benchmark('WsClient');
        this.host = Config.rtc.host;
        this.port = Config.rtc.port;
        this.address = 'ws://' + this.host + ':' + this.port;

        this.createServer();
        this.testServer()
            .then(() => this.benchmark.display())
            .catch(() => this.benchmark.display());
    }

    createServer() {
        this.server = new webSocket.Server({
            port: this.port
        });
        this.server.on('connection', (ws: any) => {
            ws.on('message', (message: any) => {
                console.log('received: %s', message);
            })
                .on('error', (error: any) => {
                    console.log(error.message.red.bold);
                });
            this.test = 'hello';
            ws.send(this.test);
        });

        this.benchmark.pushLine('address', this.address, true);
    }

    testServer() {
        return new Promise((resolve, reject) => {
            const connection = new webSocket(this.address);

            connection.onopen = () => {
                this.benchmark.pushLine('test connection', 'passing', true);
            };

            connection.onerror = (error: any) => {
                this.benchmark.pushLine('test connection', error.message, false);
                reject();
            };

            connection.onmessage = (message: any) => {
                if (message.data === this.test) {
                    this.benchmark.pushLine('test message', 'passing', true);
                } else {
                    this.benchmark.pushLine('test message', 'not passing', false);
                }
                resolve();
            };
        });
    }
}