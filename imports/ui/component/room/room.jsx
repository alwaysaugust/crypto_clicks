import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Countdown from 'react-countdown-now';

// App component - represents the whole app
export default class Room extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.getGameStatus = this.getGameStatus.bind(this);
        this.setButtonLocations = this.setButtonLocations.bind(this);
        this.setButtonLocations = this.setButtonLocations.bind(this);
        this.setWinner = this.setWinner.bind(this);
    }


    componentDidMount() {
        setInterval(this.getGameStatus, 300);
        setInterval(this.setButtonLocations, 10);
    }

    getGameStatus() {
        let gameInProgress = (
            this.props.gameStartsAt &&
            (this.props.gameStartsAt.getTime() < Date.now()) &&
            this.props.gameEndsAt &&
            (this.props.gameEndsAt.getTime() > Date.now())
        );

        this.setState({gameInProgress});
    }

    setButtonLocations() {
        if (this.props.playersButtonLoc) {
            this.props.playersButtonLoc.forEach((point) => {
                if (Date.now() > point.fromTime && Date.now() < point.toTime) {
                    this.setState({point});
                }
            })
        }
    }

    countDownRender(cd) {
        let seconds = cd.seconds;

        if (seconds > 0) {
            return (<h1> The game starts in {cd.seconds} seconds </h1>)
        }

        return null;
    }

    setWinner() {
        const side = this.props.id;
        const time = Date.now();

        console.log("setWinner");

        Meteor.call("game.setWinner", side, time, (err, res) => {
        });
    }

    render() {

        if (this.props.winner) {

            return (
                <div className={"room"}>
                    {this.props.shadow && <div className={"shadow"}/>}
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <h1>
                        You {this.props.id == this.props.winner.side ? "won" : "lost"} 1 Aion
                    </h1>
                    <h2>
                        {this.props.id == this.props.winner.side ? "Congratulations!!!" : "Sorry!"}
                    </h2>
                    <h3>
                        {this.props.id == this.props.winner.side && "We will send your reward to the same address you paid your deposit from"}
                    </h3>
                </div>
            )
        }

        if (this.state.gameInProgress) {

            let x;
            let y;

            if (this.props.id == "A") {
                x = (this.state.point && this.state.point.Ax) || 50;
                y = (this.state.point && this.state.point.Ay) || 50;
            } else {
                x = (this.state.point && this.state.point.Bx) || 50;
                y = (this.state.point && this.state.point.By) || 50;
            }

            return (
                <div className={"room"}>
                    {this.props.shadow && <div className={"shadow"}/>}

                    <button
                        onClick={this.setWinner}
                        className={"dot " + this.props.id}
                        style={{top: (y + "%"), left: (x + "%")}}
                    >
                    </button>
                </div>
            )
        }

        return (
            <div className={"room"}>
                {this.props.shadow && <div className={"shadow"}/>}
                {
                    this.props.ready ?
                        <div className={"ready"}>
                            {this.props.gameStartsAt ?
                                <span>
                                    <br/>
                                    <br/>
                                    <br/>
                                    <br/>
                                    <br/>
                                    <br/>
                                <Countdown
                                    date={this.props.gameStartsAt.getTime()}
                                    renderer={this.countDownRender}
                                />
                                </span>
                                :
                                <span>
                                    <h1>Ready</h1>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <h2 className={"animated fadeIn infinite"}> Waiting for the other player to join </h2>
                                </span>

                            }


                        </div>
                        :
                        <div className={"payment"}>
                            <h2>
                                Waiting for player
                            </h2>

                            <h3>
                                Please pay 1 Aion to play
                            </h3>

                            <img src={"QR.png"}/>

                            <button
                                className={"kokun"}
                                onClick={this.props.playerReadyHandler}
                            >
                                Pay via Kokun
                            </button>
                        </div>

                }

                <br/>


            </div>
        );
    }
}

Room.propTypes = {
    id: PropTypes.string,
    ready: PropTypes.bool,
    shadow: PropTypes.bool,
    playerReadyHandler: PropTypes.func,
    gameStartsAt: PropTypes.object,
    gameEndsAt: PropTypes.object
};