'use strict';

import 'colors';
import * as shell from 'shelljs';
import * as path from "path";
import * as fs from "fs";
import {Benchmark} from "./Benchmark";

const benchmark = new Benchmark('CheckList');

export class CheckList {

    constructor() {
        this.checkConfigFile();

        benchmark.display();
    }

    private checkConfigFile() {
        const configFilePath = path.join(__dirname, '../config.js'),
            defaultConfigFilePath = configFilePath + '.default.js';
        if (!fs.existsSync(configFilePath)) {
            if (!fs.existsSync(defaultConfigFilePath)) {
                fs.readFile(defaultConfigFilePath, (defaultConfig: any) => {
                    fs.writeFile(configFilePath, defaultConfig, (err: any) => {
                        console.log(err);
                        benchmark.pushLine('config file', err.toString(), false);
                    });
                });
            }
            benchmark.pushLine('config file', 'checked', true);
        }
    }

}
