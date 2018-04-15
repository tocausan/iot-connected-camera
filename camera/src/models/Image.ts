'use strict';

import 'colors';
import * as shell from 'shelljs';
import * as path from "path";
import {Config} from "../config";
import {ExecCallback} from "shelljs";

const image = {
    format: [[4, 3], [8, 5], [16, 9], [21, 10]],
    resolution: [3280, 2000, 1000, 500],
    quality: [0, 100],
    sharpness: [0, 100],
    contrast: [0, 100],
    brightness: [0, 100],
    saturation: [0, 100],
    rotation: [0, 359],
    exposure: ['off', 'auto', 'night', 'nightpreview', 'backlight', 'spotlight', 'sports', 'snow', 'beach', 'verylong', 'fixedfps', 'antishake', 'fireworks'],
    awb: ['off', 'auto', 'sun', 'cloud', 'shade', 'tungsten', 'fluorescent', 'incandescent', 'flash', 'horizon'],
    effect: ['none', 'negative', 'solarise', 'sketch', 'denoise', 'emboss', 'oilpaint', 'hatch', 'gpen', 'pastel', 'watercolour', 'film', 'blur', 'saturation', 'colourswap', 'washedout', 'posterise', 'colourpoint', 'colourbalance', 'cartoon'],
    metering: ['average', 'spot', 'backlit', 'matrix'],
    drc: ['off', 'low', 'med', 'high'],
};

export class Image {
    _output: string;
    _width: number;
    _height: number;
    _format: number[];
    _resolution: number[];
    _quality: number;        // 0 - 100
    _sharpness: number;      // 0 - 100
    _contrast: number;       // 0 - 100
    _brightness: number;     // 0 - 100
    _saturation: number;     // 0 - 100
    _rotation: number;       // 0 - 359
    _exposure: string;
    _awb: string;
    _effect: string;
    _metering: string;
    _drc: string;

    constructor(setup?: any) {
        this._output = path.join(Config.path.public, new Date().getTime() + '.jpg');
        this._format = image.format[0];
        this._exposure = image.exposure[1];
        this._awb = image.awb[1];
    }

    public output(def: string) {
        this._output = path.join(Config.path.public, def + '.jpg')
    }

    public format(width: number, height: number) {
        this._format = [width, height];
    }

    public resolution(def: number) {
        const height = def / this._format[0] * this._format[1];
        if (height < 100) throw new Error('image resolution too small');

        this._resolution = [def, height];
        this._width = def;
        this._height = height;
        return this;

    }

    public quality(def: number) {
        if (Math.abs(def) > 100) throw new Error('image quality out of range');

        this._quality = Math.abs(def);
        return this;
    }

    public sharpness(def: number) {
        if (Math.abs(def) > 100) throw new Error('image sharpness out of range');

        this._sharpness = Math.abs(def);
        return this;
    }

    public contrast(def: number) {
        if (Math.abs(def) > 100) throw new Error('image contrast out of range');

        this._contrast = Math.abs(def);
        return this;
    }

    public brightness(def: number) {
        if (Math.abs(def) > 100) throw new Error('image brightness out of range');

        this._brightness = Math.abs(def);
        return this;
    }

    public saturation(def: number) {
        if (Math.abs(def) > 100) throw new Error('image saturation out of range');

        this._saturation = Math.abs(def);
        return this;
    }

    public rotation(def: number) {
        if (Math.abs(def) > 359) throw new Error('image rotation out of range');

        this._rotation = Math.abs(def);
        return this;
    }

    public exposure(def: string) {
        if (image.exposure.indexOf(def) === -1) throw new Error('image exposure incorrect');

        this._exposure = def;
        return this;
    }

    public awb(def: string) {
        if (image.awb.indexOf(def) === -1) throw new Error('image awb incorrect');

        this._awb = def;
        return this;
    }

    public effect(def: string) {
        if (image.effect.indexOf(def) === -1) throw new Error('image effect incorrect');

        this._effect = def;
        return this;
    }

    public metering(def: string) {
        if (image.metering.indexOf(def) === -1) throw new Error('image metering incorrect');

        this._metering = def;
        return this;
    }

    public drc(def: string) {
        if (image.drc.indexOf(def) === -1) throw new Error('image drc incorrect');

        this._drc = def;
        return this;
    }

    public async take() {
        const command: string[] = ['raspistill'];

        Object.keys(this).map((key: string) => {
            switch (key.replace('_', '')) {
                case 'output':
                    command.push('-o ' + this._output);
                    break;
                case 'width':
                    command.push('-w ' + this._width);
                    break;
                case 'heigth':
                    command.push('-h ' + this._height);
                    break;
                case 'quality':
                    command.push('-q ' + this._quality);
                    break;
                case 'sharpness':
                    command.push('-sh ' + this._sharpness);
                    break;
                case 'contrast':
                    command.push('-co ' + this._contrast);
                    break;
                case 'brightness':
                    command.push('-br ' + this._brightness);
                    break;
                case 'saturation':
                    command.push('-sa ' + this._saturation);
                    break;
                case 'rotation':
                    command.push('-rot ' + this._rotation);
                    break;
                case 'exposure':
                    command.push('-ex ' + this._exposure);
                    break;
                case 'awb':
                    command.push('-awb ' + this._awb);
                    break;
                case 'effect':
                    command.push('-ifx ' + this._effect);
                    break;
                case 'metering':
                    command.push('-mm ' + this._metering);
                    break;
                case 'drc':
                    command.push('-drc ' + this._drc);
                    break;
            }
        });

        console.log(command.join(' '));
        shell.exec(command.join(' '), (result: any) => {
            return (result);
        });
    }
}

/*
Runs camera for specific time, and take JPG capture at end if requested

usage: raspistill [options]

Image parameter commands

-?, --help	: This help information
-w, --width	: Set image width <size>
-h, --height	: Set image height <size>
-q, --quality	: Set jpeg quality <0 to 100>
-r, --raw	: Add raw bayer data to jpeg metadata
-o, --output	: Output filename <filename> (to write to stdout, use '-o -'). If not specified, no file is saved
-l, --latest	: Link latest complete image to filename <filename>
-v, --verbose	: Output verbose information during run
-t, --timeout	: Time (in ms) before takes picture and shuts down (if not specified, set to 5s)
-th, --thumb	: Set thumbnail parameters (x:y:quality) or none
-d, --demo	: Run a demo mode (cycle through range of camera options, no capture)
-e, --encoding	: Encoding to use for output file (jpg, bmp, gif, png)
-x, --exif	: EXIF tag to apply to captures (format as 'key=value') or none
-tl, --timelapse	: Timelapse mode. Takes a picture every <t>ms. %d == frame number (Try: -o img_%04d.jpg)
-fp, --fullpreview	: Run the preview using the still capture resolution (may reduce preview fps)
-k, --keypress	: Wait between captures for a ENTER, X then ENTER to exit
-s, --signal	: Wait between captures for a SIGUSR1 or SIGUSR2 from another process
-g, --gl	: Draw preview to texture instead of using video render component
-gc, --glcapture	: Capture the GL frame-buffer instead of the camera image
-set, --settings	: Retrieve camera settings and write to stdout
-cs, --camselect	: Select camera <number>. Default 0
-bm, --burst	: Enable 'burst capture mode'
-md, --mode	: Force sensor mode. 0=auto. See docs for other modes available
-dt, --datetime	: Replace output pattern (%d) with DateTime (MonthDayHourMinSec)
-ts, --timestamp	: Replace output pattern (%d) with unix timestamp (seconds since 1970)
-fs, --framestart	: Starting frame number in output pattern(%d)
-rs, --restart	: JPEG Restart interval (default of 0 for none)

Preview parameter commands

-p, --preview	: Preview window settings <'x,y,w,h'>
-f, --fullscreen	: Fullscreen preview mode
-op, --opacity	: Preview window opacity (0-255)
-n, --nopreview	: Do not display a preview window

Image parameter commands

-sh, --sharpness	: Set image sharpness (-100 to 100)
-co, --contrast	: Set image contrast (-100 to 100)
-br, --brightness	: Set image brightness (0 to 100)
-sa, --saturation	: Set image saturation (-100 to 100)
-ISO, --ISO	: Set capture ISO
-vs, --vstab	: Turn on video stabilisation
-ev, --ev	: Set EV compensation - steps of 1/6 stop
-ex, --exposure	: Set exposure mode (see Notes)
-awb, --awb	: Set AWB mode (see Notes)
-ifx, --imxfx	: Set image effect (see Notes)
-cfx, --colfx	: Set colour effect (U:V)
-mm, --metering	: Set metering mode (see Notes)
-rot, --rotation	: Set image rotation (0-359)
-hf, --hflip	: Set horizontal flip
-vf, --vflip	: Set vertical flip
-roi, --roi	: Set region of interest (x,y,w,d as normalised coordinates [0.0-1.0])
-ss, --shutter	: Set shutter speed in microseconds
-awbg, --awbgains	: Set AWB gains - AWB mode must be off
-drc, --drc	: Set DRC Level (see Notes)
-st, --stats	: Force recomputation of statistics on stills capture pass
-a, --annotate	: Enable/Set annotate flags or text
-3d, --stereo	: Select stereoscopic mode
-dec, --decimate	: Half width/height of stereo image
-3dswap, --3dswap	: Swap camera order for stereoscopic
-ae, --annotateex	: Set extra annotation parameters (text size, text colour(hex YUV), bg colour(hex YUV))


Notes

Exposure mode options :
off,auto,night,nightpreview,backlight,spotlight,sports,snow,beach,verylong,fixedfps,antishake,fireworks

AWB mode options :
off,auto,sun,cloud,shade,tungsten,fluorescent,incandescent,flash,horizon

Image Effect mode options :
none,negative,solarise,sketch,denoise,emboss,oilpaint,hatch,gpen,pastel,watercolour,film,blur,saturation,colourswap,washedout,posterise,colourpoint,colourbalance,cartoon

Metering Mode options :
average,spot,backlit,matrix

Dynamic Range Compression (DRC) options :
off,low,med,high

Preview parameter commands

-gs, --glscene	: GL scene square,teapot,mirror,yuv,sobel,vcsm_square
-gw, --glwin	: GL window settings <'x,y,w,h'>
 */