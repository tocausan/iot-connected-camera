import * as webSocket from 'ws';
import {Config} from "../config";
import {Benchmark} from "./Benchmark";

export class WsServer {
    private benchmark: Benchmark;
    public host: string;
    public port: number;
    public address: string;
    public server: webSocket.Server;

    constructor() {
        this.benchmark = new Benchmark('WsServer');
        this.host = Config.rtc.host;
        this.port = Config.rtc.port;
        this.address = 'ws://' + this.host + ':' + this.port;
        this.benchmark.pushLine('address', this.address, true);

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
            ws.send('hello');
        });
    }

    testServer() {
        return new Promise((resolve, reject) => {
            const connection = new webSocket(this.address);

            connection.onopen = () => {
                this.benchmark.pushLine('client open', 'passing', true);
            };

            connection.onerror = (error: any) => {
                this.benchmark.pushLine('client error', error.message, false);
                reject();
            };

            connection.onmessage = (message: any) => {
                if (message.data === 'hello') {
                    this.benchmark.pushLine('client message', 'passing', true);
                } else {
                    this.benchmark.pushLine('client message', 'not passing', false);
                }
                resolve();
            };
        });
    }
}