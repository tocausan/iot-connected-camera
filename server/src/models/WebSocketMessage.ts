'use strict';

import 'colors';
import {Config} from "../config";

export class WebSocketMessage {
    source: string;
    message: any;
    status: boolean;

    set(message: any, status?: boolean) {
        this.source = Config.host.ip + ':' + Config.socket.port;
        this.message = message;
        this.status = status;
        return this;
    }

    get(data: any) {
        let checkedData: any = data.data !== null && data.data !== undefined ? data.data : data;
        // receive websocket data
        if (typeof checkedData === 'string') checkedData = JSON.parse(checkedData);

        this.source = checkedData !== null && checkedData !== undefined && checkedData.source !== null && checkedData.source !== undefined ?
            checkedData.source : '';
        this.message = checkedData !== null && checkedData !== undefined && checkedData.message !== null && checkedData.message !== undefined ?
            checkedData.message.data !== null && checkedData.message.data !== undefined ? checkedData.message.data : checkedData.message : '';
        this.status = checkedData !== null && checkedData !== undefined && checkedData.status !== null && checkedData.status !== undefined ? checkedData.status : true;
        return this;
    }

    display() {
        const message = [];
        if (this.source.length > 0) message.push(this.source.blue);
        else message.push('unknown source '.blue);
        if (this.message.length > 0) message.push(this.status ? this.message.green : this.message.red);
        else message.push('no message'.blue);
        console.log(message.join('  '));
        return this;
    }

    stringify() {
        return JSON.stringify(this).toString();
    }
}
