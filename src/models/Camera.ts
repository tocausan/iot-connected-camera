'use strict';

import 'colors';
import * as shell from 'shelljs';
import * as path from "path";

const PiCamera = require('pi-camera');

export class Camera {
    private camera: any;

    constructor() {

        this.camera = new PiCamera({
            mode: 'photo',
            output: path.join(__dirname, '../public/img', new Date() + '.jpg'),
            width: 640,
            height: 480,
            nopreview: true,
        });

    }

    public takeImage() {
        this.camera.snap()
            .then((result: any) => {
                console.log('result');
                console.log(result);
            })
            .catch((error: any) => {
                console.log('error');
                console.log(error);
            });

    }
}
