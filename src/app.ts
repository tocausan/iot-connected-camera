'use strict';

import {Host, HttpClient, WsClient} from "./models";

new class {
    host: Host;
    httpClient: HttpClient;
    wsClient: WsClient;

    constructor() {
        process.title = 'pi-security';

        this.host = new Host();
        this.httpClient = new HttpClient();
        this.wsClient = new WsClient();
    }

};


