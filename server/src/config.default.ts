'use strict';

import * as path from "path";

export const Config = {
    title: 'iot-server',
    environment: 'dev',
    host:{
        hostname: '',
        ip: '127.0.0.1',
        os: '',
    },
    http: {
        port: 3000
    },
    socket: {
        port: 3100
    },
    path: {
        public: path.join(__dirname, '/public')
    }
};