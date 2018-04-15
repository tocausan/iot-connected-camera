'use strict';

import 'colors';
import {Image} from "./Image";

export class Camera {

    constructor() {

    }

    public takeImage(imageSetup?: any): Promise<string> {
        return new Promise((resolve, reject) => {

            const image = new Image(imageSetup)
                .resolution(2000)
                .take()
                .then((result: any) => {
                    resolve(result.toString());
                });
        });
    }

}
