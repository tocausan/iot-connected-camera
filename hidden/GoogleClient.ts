'use strict';

import 'colors';
//import * as google from 'googleapis';
import {OAuth2Client} from 'google-auth-library';
import * as fs from "fs";
import * as path from "path";

const {google} = require('googleapis');

/*
const http = require('http');
const url = require('url');
const querystring = require('querystring');
const opn = require('opn');
const destroyer = require('server-destroy');

const keyPath = path.join(__dirname, 'oauth2.keys.json');
let keys = {redirect_uris: ['']};
if (fs.existsSync(keyPath)) {
    keys = require(keyPath).web;
}

class SampleClient {
    _options: any;
    oAuth2Client: any;
    authorizeUrl: any;

    constructor(options: any) {
        this._options = options || {scopes: []};

        // create an oAuth client to authorize the API call
        this.oAuth2Client = new google.auth.OAuth2(
            keys.client_id,
            keys.client_secret,
            keys.redirect_uris[0]
        );
    }

    // Open an http server to accept the oauth callback. In this
    // simple example, the only request to our webserver is to
    // /callback?code=<code>
    async authenticate(scopes: any) {
        return new Promise((resolve, reject) => {
            // grab the url that will be used for authorization
            this.authorizeUrl = this.oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes.join(' ')
            });
            const server = http.createServer(async (req: any, res: any) => {
                try {
                    if (req.url.indexOf('/oauth2callback') > -1) {
                        const qs = querystring.parse(url.parse(req.url).query);
                        res.end('Authentication successful! Please return to the console.');
                        server.destroy();
                        const {tokens} = await this.oAuth2Client.getToken(qs.code);
                        this.oAuth2Client.credentials = tokens;
                        resolve(this.oAuth2Client);
                    }
                } catch (e) {
                    reject(e);
                }
            }).listen(3000, () => {
                // open the browser to the authorize url to start the workflow
                opn(this.authorizeUrl, {wait: false}).then(cp => cp.unref());
            });
            destroyer(server);
        });
    }
}
*/

export class GoogleClient {

    private auth: any;

    constructor() {
        this.authenticate()
            .then((auth: any) => {
                console.log(auth);
            })
            .catch((e: Error) => console.log(e.toString().red.bold));

    }

    private getCredentials() {
        // get google credentials from downloaded file at google
        return new Promise(async (resolve, reject) => {
            const fileName = 'google-credentials.json',
                filePath = path.join(__dirname, '../../' + fileName)
            fs.readFile(filePath, (err: any, credentials: any) => {
                if (err) reject(new Error('"google-credentials.json" not found'));
                resolve(JSON.parse(credentials.toString()).web);
            });
        });
    }

    private authenticate() {
        return new Promise(async (resolve, reject) => {
            // get credentials
            return this.getCredentials()
                .then((credentials: any) => {


                    // get auth and token
                    const oauth2Client = new google.auth.OAuth2(credentials.client_id, credentials.client_secret);


                    // set auth as a global default
                    google.options({
                        auth: oauth2Client
                    });

                    const url = oauth2Client.generateAuthUrl({
                            // 'online' (default) or 'offline' (gets refresh_token)
                            access_type: 'offline',
                            scope: ['https://www.googleapis.com/auth/plus.me']
                        }),
                        token = oauth2Client.getToken(credentials.auth_uri, (err: any, token: any) => {
                            if (err) reject(err.toString());
                            oauth2Client.credentials = token;
                            resolve(oauth2Client);

                            console.log(token);
                        });


                })
        });

    }


    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     *
     * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback to call with the authorized
     *     client.
     */

    /*
    function getNewToken(oauth2Client, callback) {
        var authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        });
        console.log('Authorize this app by visiting this url: ', authUrl);
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Enter the code from that page here: ', function (code) {
            rl.close();
            oauth2Client.getToken(code, function (err, token) {
                if (err) {
                    console.log('Error while trying to retrieve access token', err);
                    return;
                }
                oauth2Client.credentials = token;
                storeToken(token);
                callback(oauth2Client);
            });
        });
    }


    /**
     * Store token to disk be used in later program executions.
     *
     * @param {Object} token The token to store to disk.
     */

    /*
    function storeToken(token) {
        try {
            fs.mkdirSync(TOKEN_DIR);
        } catch (err) {
            if (err.code != 'EEXIST') {
                throw err;
            }
        }
        fs.writeFile(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to ' + TOKEN_PATH);
    }

    /**
     * Lists the labels in the user's account.
     *
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */

    /*
    function listLabels(auth) {
        var gmail = google.gmail('v1');
        gmail.users.labels.list({
            auth: auth,
            userId: 'me',
        }, function (err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            var labels = response.labels;
            if (labels.length == 0) {
                console.log('No labels found.');
            } else {
                console.log('Labels:');
                for (var i = 0; i < labels.length; i++) {
                    var label = labels[i];
                    console.log('- %s', label.name);
                }
            }
        });
    }
*/


}