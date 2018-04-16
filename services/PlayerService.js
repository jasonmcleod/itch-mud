const C = require('../constants');
const dataService = require('../services/DataService');
const mapService = require('../services/MapService');

class PlayerService {
    constructor() {
    }

    login(client, name, password, callback) {
        // todo: move into service
        dataService.models.account.find({where:{name, password}}).then((result) => {
            if(!result) return callback({success: false, message: 'Invalid credentials'});
            
            dataService.models.player.find({where: {account: result.dataValues.id}}).then((result) => {
                Object.assign(client.player, result.dataValues);
                client.authenticated = true;
                dataService.data.players.instances[result.id] = client.player;

                client.setScene('play');
                callback({success: true, character: result.dataValues.id});
            });

        });
    }

    logout(client) {
        delete dataService.data.players.instances[client.player.id];
    }

    tryMove(client, x=0, y=0) {
        // assume no movement
        let adjusted = {x: client.player.x, y: client.player.y };
        if(Date.now() - client.lastMove > C.MOVE_SPEED) {
            if(!mapService.blocksWalk(mapService.tileAt(client.player.x + x, client.player.y + y))) {
                client.lastMove = Date.now();

                client.player.x = client.player.x + x;
                client.player.y = client.player.y + y;
            }
        }
        return adjusted;
    }
}

module.exports =new PlayerService();