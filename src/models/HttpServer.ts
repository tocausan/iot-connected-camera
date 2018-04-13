'use strict';

import 'colors';
import * as http from 'http';
import * as express from 'express';
import * as path from 'path';
import * as bodyParser from "body-parser";
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as ejs from 'ejs';
import {Config} from "../config";
import {Routes} from "../routes";
import {Benchmark} from "./Benchmark";

export class HttpServer {
    private benchmark: Benchmark;
    public host: string;
    public port: number;
    public address: string;

    constructor() {
        this.benchmark = new Benchmark('HttpServer');
        this.host = Config.rtc.host;
        this.port = parseInt(process.env.PORT) || Config.web.port;
        this.address = 'http://' + this.host + ':' + this.port;
        this.benchmark.pushLine('host', this.address, true);

        this.createServer();
        this.testServer()
            .then(() => this.benchmark.display())
            .catch(() => this.benchmark.display());
    }

    createApp() {
        return express()
            .set('port', this.port)
            .set('views', path.join(__dirname, 'views'))
            .set('view engine', 'ejs')
            .use(logger(Config.environment))
            .use(express.json())
            .use(express.urlencoded({extended: false}))
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({extended: false}))
            .use(cookieParser())
            .use(express.static(path.join(__dirname, 'public')))
            .use(Routes)
    }

    createServer() {
        return http.createServer(this.createApp())
            .listen(this.port)
            .on('error', this.onError);
    }

    testServer() {
        return new Promise((resolve, reject) => {
            try {
                http.get(this.address, (result) => {
                    this.benchmark.pushLine('test connection', result.statusCode.toString(), true);
                    resolve();
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    onError(error: any) {
        if (error.syscall !== 'listen') throw error;
        const bind = typeof this.port === 'string' ? 'Pipe ' + this.port : 'Port ' + this.port;
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
};


