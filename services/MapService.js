const fs = require('fs');
const C = require('../constants');
const map = require('../data/map.js');

class MapService {
    constructor(game) {
        this.game = game;
    }

    getTile(index) {
        if(index <= 0) return 1;
        return this.game.dataService.data.mapTiles.instances[map[index]].ascii;
    }

    blocksWalk(index) {
        return this.game.dataService.data.mapTiles.instances[index].blocksWalk;
    }

    tileAt(x, y) {
        return map[y * C.MAP_HEIGHT + x];
    }

    extractBackground(input) {
        if(input.indexOf('-bg') > -1) return input.substr(input, input.indexOf('-bg')).replace('{','');
        return false;
    }

    getFixture(x, y, bg) {
        for(let i in this.game.dataService.data.fixtures.instances) {
            if(this.game.dataService.data.fixtures.instances[i].x === x & this.game.dataService.data.fixtures.instances[i].y === y) {
                return this.game.dataService.data.fixtures.refs[this.game.dataService.data.fixtures.instances[i].ref].ascii;
            }
        }
        return false;
    }

    build(cameraX, cameraY) {
        let out = '';
        for (let y = 0; y < C.CAMERA_HEIGHT; y++) {
            for (let x = 0; x < C.CAMERA_WIDTH; x++) {
                let workingY = cameraY + y;
                let workingX = cameraX + x;

                let tile = this.getTile(workingY * C.MAP_HEIGHT + workingX);
                let bg = this.extractBackground(tile); 

                let fixture = this.getFixture(workingX, workingY, bg);
                
                let obj = tile;
                if(fixture) obj = fixture;
                if(x === ~~(C.CAMERA_WIDTH / 2) && y === (C.CAMERA_HEIGHT / 2)) { obj = `{${bg}-bg}` + this.game.dataService.data.players.refs[1].ascii + `{/${bg}-bg}`; }

                out += obj;
            }
            out+='\n';
        }
        return out;
    }

    tryMove(client, x=0, y=0) {
        // assume no movement
        let adjusted = {x: client.player.x, y: client.player.y }
        if(Date.now() - client.lastMove > C.MOVE_SPEED) {
            if(!this.blocksWalk(this.tileAt(client.player.x + x, client.player.y + y))) {
                client.lastMove = Date.now();
                adjusted.x = client.player.x + x;
                adjusted.y = client.player.y + y;
            }
        }
        return adjusted;
    }
}

module.exports = MapService;