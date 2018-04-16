'use strict';

import 'colors';
import * as shell from 'shelljs';
import {Benchmark} from "./Benchmark";
import {Config} from "../config";
import * as path from "path";
import * as fs from "fs";

const benchmark = new Benchmark('Host');

export class Host {
    public hostname: string;
    public ip: string;
    public os: string;

    constructor() {
        this.check();
        this.getInfos();
        benchmark.pushLine('hostname', this.hostname, true);
        benchmark.pushLine('host', this.os, true);
        benchmark.pushLine('ip', this.ip, true);
        benchmark.display();
    }

    private check() {
        if (!shell.which('git')) benchmark.pushLine('git', 'Sorry, this script requires git', false);
    }

    private getInfos() {
        const lineBreakRegex: RegExp = new RegExp('\n', 'g'),
            hostname: string = shell.exec('hostname')
                .toString()
                .replace(lineBreakRegex, ', '),
            ip: string = shell.exec('ifconfig | grep -o \'[0-9]\\{1,3\\}\\.[0-9]\\{1,3\\}\\.[0-9]\\{1,3\\}\\.[0-9]\\{1,3\\}\'')
                .toString()
                .replace(lineBreakRegex, ', '),

            os: string = shell.exec('uname -a')
                .toString()
                .replace(lineBreakRegex, ', ');

        this.hostname = hostname.slice(0, hostname.length - 2);
        this.ip = ip.slice(0, ip.length - 2);
        this.os = os.slice(0, os.length - 2);
    }

    public async setConfig() {
        Config.host.hostname = this.hostname.trim();
        Config.host.ip = this.ip.split(',')[1].trim();
        Config.host.os = this.os.trim();
    }

}
