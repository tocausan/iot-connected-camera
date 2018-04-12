'use strict';

import * as http from 'http';
import * as express from 'express';
import * as path from 'path';
import * as bodyParser from "body-parser";
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as ejs from 'ejs';
import {Config} from "./config";
import {Routes} from "./routes";

new class {
    port: string;
    app: any;

    constructor() {


        this.port = Config.server.port.toString();
        this.createServer();
        console.log('Listening on port ' + this.port);
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


