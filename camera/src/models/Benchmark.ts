'use strict';

import 'colors';

export class Benchmark {
    private content: string[];

    constructor(title: string, name?: string, value?: string, status?: boolean) {
        const header = '—————————— ' + title;
        this.content = [header.blue.bold.toString()];
        if (name && value) {
            this.pushLine(name, value, status);
        }
    }

    pushLine(name: string, value: string, status?: boolean) {
        const coloredValue = status ? value.green : value.red;
        this.content.push(name.yellow + ' ' + coloredValue);
    }

    display() {
        this.content.push('——————————'.blue.bold.toString());
        console.log(this.content.join('\n'));
    }
}