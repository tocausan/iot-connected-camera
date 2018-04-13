'use strict';

import 'colors';
import * as shell from 'shelljs';
import {Benchmark} from "./Benchmark";

export class Host {
    private benchmark: Benchmark;
    public ip: string;
    public hostname: string;
    public host: string;

    constructor() {
        this.benchmark = new Benchmark('Host');
        this.check();
        this.getInfos();

        this.benchmark.pushLine('hostname', this.hostname, true);
        this.benchmark.pushLine('host', this.host, true);
        this.benchmark.pushLine('ip', this.ip, true);
        this.benchmark.display();
    }

    private check() {
        if (!shell.which('git')) {
            this.benchmark.pushLine('git', 'Sorry, this script requires git', false);
        }
    }

    private getInfos() {
        const regex: RegExp = new RegExp('\n', 'g'),
            ip: string = shell.exec('ifconfig | grep -o \'[0-9]\\{1,3\\}\\.[0-9]\\{1,3\\}\\.[0-9]\\{1,3\\}\\.[0-9]\\{1,3\\}\'')
                .toString()
                .replace(regex, ', '),
            hostname: string = shell.exec('hostname')
                .toString()
                .replace(regex, ', '),
            host: string = shell.exec('uname -a')
                .toString()
                .replace(regex, ', ');

        this.hostname = hostname.slice(0, hostname.length - 2);
        this.ip = ip.slice(0, ip.length - 2);
        this.host = host.slice(0, host.length - 2);
    }
}
