const blessed = require('blessed');
const playerService = require('../services/PlayerService');

class Screen {
    constructor(mudClient) {
        this.screen = blessed.screen({
            smartCSR: true,
            input: mudClient.client,
            output: mudClient.client,
            terminal: 'xterm-256color',
            fullUnicode: true
        });

        this.screen.on('destroy', () => {
            if (mudClient.client.writable) {
                playerService.logout(mudClient);
                mudClient.client.destroy();
            }
        });

        this.screen.key('q', () => {
            playerService.logout(mudClient);
            mudClient.client.destroy();
        });
               
        mudClient.client.on('debug', (msg) => {
            console.error(msg);
        });
    
        mudClient.client.on('term', (terminal) => {
            this.screen.terminal = terminal;
            this.screen.render();
        });

        mudClient.client.on('size', (width, height) => {
            mudClient.client.columns = width;
            mudClient.client.rows = height;
            mudClient.client.emit('resize');
        });

        mudClient.client.on('close', () => {
            if (!this.screen.destroyed) {
                playerService.logout(mudClient);
                mudClient.client.destroy();
            }
        });
    }
}

module.exports = Screen;