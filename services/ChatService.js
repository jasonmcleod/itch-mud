class ChatService {
    constructor(game) {
        this.history = [];
        this.cache = '';
    }

    send(client, message) {
        this.history.push({
            name: client.player.name,
            message
        });
        if(this.history.length === 7) {
            this.history.shift()
        }

        this.cache = this.build();
    }

    getMarkup() {
        return this.cache;
    }

    build() {
        let out = '';
        this.history.forEach((r) => {
            out+= `${r.name}: ${r.message}\n`;
        });
         
        return out;
    }
}

module.exports = ChatService;