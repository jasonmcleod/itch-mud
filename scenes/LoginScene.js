const blessed = require('blessed');

class LoginScene {
    constructor(client) {

        this.client = client;

        this.username = false;
        this.password = false;
        this.scene = {};

        this.build();

        return this.scene;
    }

    build() {
        this.scene.bg = blessed.box({
            parent: this.client.screen,
            mouse: true,
            keys: true,
            left: 0,
            top: 0,
            width: '100%',
            style: {
                bg: 'grey',
                scrollbar: {
                    inverse: true
                }
            },
            scrollable: true,
            scrollbar: {
                ch: ' '
            }
        });

        this.scene.loginField = blessed.textbox({
            inputOnFocus: true,
            parent: this.client.screen,
            border: 'line',
            height: 'shrink',
            width: 'half',
            top: 20,
            left: 'center',
            label: ' {white-fg}Account name or e-mail address{/white-fg} ',
            border:'bg',
            tags: true,
            keys: true
        });

        this.scene.passwordField = blessed.textbox({
            censor: true,
            inputOnFocus: true,            
            parent: this.client.screen,
            border: 'line',
            height: 'shrink',
            width: 'half',
            top: 25,
            left: 'center',
            label: ' {white-fg}Password{/white-fg} ',
            border:'bg',
            tags: true,
            hidden:true,
            keys: true
        });

        this.scene.error = blessed.box({
            parent: this.client.screen,
            left: 'center',
            top: 30,
            width: 'half',
            height: 5,
            border:'ch',
            style: {
                bg: 'red'
            },
            tags:true,
            hidden:true,
            label: 'Login failed'
        });

        this.scene.loginField.on('submit', (value) => {
            this.username = value;
            this.scene.passwordField.show();
            this.scene.passwordField.focus();            
            this.client.screen.render();
        });

        this.scene.passwordField.on('submit', (value) => {
            this.password = value;
            this.client.game.login(this.client, this.username, this.password, (state) => {
                if(!state.success) {
                    this.showError(state.message);
                }
            });
        });

        this.scene.loginField.on('keypress', () => { this.clearError(); });
        this.scene.passwordField.on('keypress', () => { this.clearError(); });

        this.scene.loginField.focus();
        this.client.screen.render();
    }

    clearError() {
        this.scene.error.hide();
    }

    showError(error) {
        this.scene.error.setContent(`\n{center}${error}{/center}`);
        this.scene.error.show();

        this.scene.passwordField.hide();
        this.scene.passwordField.clearValue();        

        this.scene.loginField.focus();

        this.client.screen.render();
    }
}

module.exports = LoginScene;