const C = require('../constants');

class Player {
    constructor() {
        this.x = 50;
        this.y = 50;
        this.name = 'Test Player'
    }

    tryMove(client, x=0, y=0) {
        // assume no movement
        let adjusted = {x: client.player.x, y: client.player.y };
        if(Date.now() - client.lastMove > C.MOVE_SPEED) {
            if(!client.game.mapService.blocksWalk(client.game.mapService.tileAt(client.player.x + x, client.player.y + y))) {
                client.lastMove = Date.now();

                client.player.x = client.player.x + x;
                client.player.y = client.player.y + y;
            }
        }
        return adjusted;
    }
}

module.exports = Player;