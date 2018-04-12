'use strict';

import 'colors';
import * as shell from 'shelljs';

const text = {
    error: {
        requireGit: 'Sorry, this script requires git'.red.bold
    }
};

export class Host {
    public ip: string;
    public hostname: string;
    public host: string;

    constructor() {
        this.check();
        this.getInfos();

        setTimeout(() => this.displayInfos(), 1000);
    }

    private check() {
        if (!shell.which('git')) {
            shell.echo(text.error.requireGit);
            shell.exit(1);
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

    public displayInfos() {
        const text = [
            this.hostname.green.bold,
            this.ip.green.bold,
            this.host.green.bold,
        ].join('\n');
        console.log(text);
        return text;
    }
}
