var blessed = require('blessed');
const PlayScene = require('./scenes/PlayScene');

var screen = blessed.screen({
    smartCSR: true,
});

screen.key('q', () => {
    screen.destroy();
});

const scene = new PlayScene({screen});
// screen.render();