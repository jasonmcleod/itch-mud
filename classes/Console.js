const C = require('../constants');
class Console {
    constructor() {
        this.history = [];
        for(let b = 0; b < C.CONSOLE_HISTORY-1; b++) this.history.push('');
    }

    add(markup) {
        this.history.push(markup);
        if(this.history.length === C.CONSOLE_HISTORY) {
            this.history.shift()
        }
    }

}

module.exports = Console;