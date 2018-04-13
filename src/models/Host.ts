'use strict';

import 'colors';
import * as shell from 'shelljs';
import {Benchmark} from "./Benchmark";

const benchmark: Benchmark = new Benchmark('Host')

export class Host {
    public hostname: string;
    public ip: string;
    public os: string;

    constructor() {
        this.check();
        this.setData();

        benchmark.pushLine('hostname', this.hostname, true);
        benchmark.pushLine('ip', this.ip, true);
        benchmark.pushLine('os', this.os, true);
        benchmark.display();
    }

    private check() {
        if (!shell.which('git')) {
            benchmark.pushLine('git', 'Sorry, this script requires git', false);
        }
    }

    private setData() {
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
        this.os = host.slice(0, host.length - 2);
    }
}
