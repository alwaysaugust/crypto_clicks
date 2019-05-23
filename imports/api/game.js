import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

const Games = new Mongo.Collection('games');

Games.deny({
        insert() {
            return true;
        }
        ,
        update() {
            return true
        }
        ,
        remove() {
            return true
        }
    }
);

if (Meteor.isServer) {
    Meteor.publish('games', () => {
        return Games.find({});
    });
}

const resetGame = () => {
    if (Meteor.isServer) {
        Games.remove({});

        Games.insert({
            playerAReady: false,
            playerBReady: false
        });
    }
};

resetGame();

Meteor.methods({
    'game.playerReady'(side) {
        check(side, String);

        if (side == "A") {
            Games.update({}, {$set: {playerAReady: true}});
        } else if (side == "B") {
            Games.update({}, {$set: {playerBReady: true}});
        }

        //If both players are ready, set the game start time and random button locations for each player
        let game = Games.findOne({});
        if (game.playerAReady && game.playerBReady) {
            let gameStartsAt = new Date();
            let gameEndsAt = new Date();

            gameStartsAt.setSeconds(gameStartsAt.getSeconds() + 3);
            gameEndsAt.setSeconds(gameEndsAt.getSeconds() + 25);


            const getRandomInt = (min, max) => {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
            };

            let playersButtonLoc = [];

            let timeCounter = gameStartsAt.getTime();
            while (true) {
                if (gameEndsAt.getTime() - timeCounter < 1000) {
                    let time = gameEndsAt.getTime() - timeCounter;

                    playersButtonLoc.push({
                        Ax: getRandomInt(5, 85),
                        Ay: getRandomInt(5, 85),
                        Bx: getRandomInt(5, 85),
                        By: getRandomInt(5, 85),
                        fromTime: timeCounter,
                        toTime: timeCounter + time
                    });

                    timeCounter += time;
                    break;
                } else {
                    let time = getRandomInt(700, 800);

                    playersButtonLoc.push({
                        Ax: getRandomInt(5, 85),
                        Ay: getRandomInt(5, 85),
                        Bx: getRandomInt(5, 85),
                        By: getRandomInt(5, 85),
                        fromTime: timeCounter,
                        toTime: timeCounter + time
                    });

                    timeCounter += time;

                }
            }


            Games.update({}, {$set: {gameStartsAt, gameEndsAt, playersButtonLoc}});

            setTimeout(Meteor.bindEnvironment(resetGame), 30000);
        }
    },
    'game.resetGame'() {
        resetGame();
    },
    'game.setWinner'(side, time) {
        check(side, String);
        check(time, Number);

        Games.update({}, {$set: {winner: {side, time}}});
    }
});


export {Games}