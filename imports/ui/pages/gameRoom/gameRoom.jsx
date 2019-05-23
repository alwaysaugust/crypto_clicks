import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';


import {Games} from '../../../api/game.js';

import Room from '../../component/room/room';

// App component - represents the whole app
class GameRoom extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    playerReadyHandler(id) {
        Meteor.call("game.playerReady", id, (err, res) => {
            this.setState({id});
        });
    }

    resetGame(){
        Meteor.call("game.resetGame", (err, res) => {
            window.location.reload();
        });
    }

    render() {
        const game = this.props.game;
        const AShadow = (this.state.id == "B" || (!this.state.id && game && game.playerAReady));
        const BShadow = (this.state.id == "A");

        console.log(game);

        if (!game) {
            return null;
        }

        return (
            <div className={"game-room"}>
                <div className={"room-header"}>
                    <h1>
                        Crypto Clicks
                    </h1>
                    <button
                        onClick={this.resetGame}
                        className={"new-game"}>
                        reset game
                    </button>
                </div>

                <div className={"rooms"}>
                    <Room
                        id={"A"}
                        ready={game.playerAReady}
                        playerReadyHandler={() => {
                            this.playerReadyHandler("A");
                        }}
                        gameStartsAt={game.gameStartsAt}
                        gameEndsAt={game.gameEndsAt}
                        playersButtonLoc={game.playersButtonLoc}
                        shadow={AShadow}
                        winner={game.winner}
                    />
                    <Room
                        id={"B"}
                        ready={game.playerBReady}
                        playerReadyHandler={() => {
                            this.playerReadyHandler("B");
                        }}
                        gameStartsAt={game.gameStartsAt}
                        gameEndsAt={game.gameEndsAt}
                        playersButtonLoc={game.playersButtonLoc}
                        shadow={BShadow}
                        winner={game.winner}
                    />
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('games');

    const game = Games.findOne();
    const gameStartsAt = (game ? game.gameStartsAt : null);

    return {
        game,
        gameStartsAt: gameStartsAt
    };
})(GameRoom);
