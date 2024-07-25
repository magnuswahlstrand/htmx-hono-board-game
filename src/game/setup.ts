import {Game2State} from "./types";
import {FightState} from "./fightStage";
import _ from "lodash";

type CardType = 'stun' | 'punch_through'

const startingDeck: CardType[] = [
    'stun',
    'stun',
    'punch_through',
    'punch_through',
    'punch_through',
    'punch_through',
    'punch_through',
    'punch_through',
]

export const cardsWithId = (cards: CardType[]) => {
    return cards.map((type, i) => ({id: i, type}))
}

export const initialState: Game2State = {
    player: {
        deck: cardsWithId(startingDeck),
        health: {
            current: 100,
            max: 100
        },
    },
}

export function setupFight(player: Game2State["player"]): FightState {
    return {
        state: 'ongoing',
        label: 'fight',
        round: 1,
        player: {
            drawPile: _.shuffle(player.deck),
            discardPile: [],
            hand: [],
            health: player.health
        },
        currentActor: 'player',
        actors: ['player', 'monster'],
        monster: {
            type: 'lizard',
            health: {
                current: 35,
                max: 35
            }
        }
    };
}