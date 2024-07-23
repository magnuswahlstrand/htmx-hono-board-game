import {Game, GameOverFunc, Main} from "../../engine";
import {MonsterState} from "./monsters";
import {Cards, CardTypes} from "./cards";

export type Game2State = {
    deck: CardTypes[],
    drawPile: CardTypes[]
    hand: CardTypes[],
    monster: MonsterState
}

const defaultState: Game2State = {
    deck: ['stun', 'stun', 'punch_through', 'punch_through'],
    drawPile: [],
    hand: [],
    monster: {
        type: 'lizard',
        health: {
            current: 100,
            max: 100
        }
    }
}
export const playCard = ({G}: Main<Game2State>, cardType: CardTypes) => {
    Cards[cardType].effect(G)
    return 'SUCCESS'
}
export const endIf: GameOverFunc<Game2State> = ({G}: Main<Game2State>) => {
    if (G.monster.health.current <= 0) {
        return {winner: 'player'} as const
    }
    return;
}


const moves = {
    playCard,
}

export class Game2 extends Game<Game2State, typeof moves> {
    constructor(initialState?: Game2State) {
        super({
            state: initialState || defaultState,
            moves,
            endIf
        })
    }
}