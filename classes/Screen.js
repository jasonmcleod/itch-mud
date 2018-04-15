const blessed = require('blessed');
class Screen {
    constructor(connection) {
        this.screen = blessed.screen({
            smartCSR: true,
            input: connection.client,
            output: connection.client,
            terminal: 'xterm-256color',
            fullUnicode: true
        });

        this.screen.on('destroy', () => {
            if (connection.client.writable) {
                connection.client.destroy();
            }
        });

        this.screen.key('q', () => {
            connection.client.destroy();
        });
               
        connection.client.on('debug', (msg) => {
            console.error(msg);
        });
    
        connection.client.on('term', (terminal) => {
            this.screen.terminal = terminal;
            this.screen.render();
        });

        connection.client.on('size', (width, height) => {
            connection.client.columns = width;
            connection.client.rows = height;
            connection.client.emit('resize');
        });

        connection.client.on('close', () => {
            if (!this.screen.destroyed) {
                connection.client.destroy();
            }
        });
    }
}

module.exports = Screen;