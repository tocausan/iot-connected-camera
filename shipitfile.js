'use strict';

module.exports = shipit => {
    require('shipit-deploy')(shipit);

    shipit.initConfig({
        default: {
            deployTo: '~/www',
            repositoryUrl: 'https://github.com/tocausan/pi-security.git',
        },
        staging: {
            servers: 'tocausan@192.168.1.28',
        },
    })
};