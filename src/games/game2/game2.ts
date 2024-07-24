import {GameContext} from "../../engine";
import {CardTypes} from "./cards";
import _ from "lodash";
import {FightState, runFightLoop} from "./fightStage";
import {z} from "zod";
import {validActions} from "../../do2";


export type Card = {
    id: number
    type: CardTypes
}


export const endTurn = ({events}: Main) => {
    events.endTurn()
    return 'SUCCESS'
}


type Moves = {
    playCard: (cardId: number) => void
    endTurn: () => void
}


export type GameEvents = {
    queue: Set<'end_turn'>
    endTurn: () => void
}

type Main = {
    G: Game2State,
    ctx: GameContext
    events: GameEvents
}

const startingDeck = ([
    'stun',
    'stun',
    'punch_through',
    'punch_through',
    'punch_through',
    'punch_through',
    'punch_through',
    'punch_through',
] as const).map((type, i) => ({id: i, type}))

export type Game2State = {
    player: {
        deck: Card[]
        health: {
            current: number,
            max: number
        }
    }
    stage?: FightState
}

const initialState: Game2State = {
    player: {
        deck: startingDeck,
        health: {
            current: 100,
            max: 100
        },
    },
}

function setupFight(player: Game2State["player"]): FightState {
    return {
        state: 'ongoing',
        label: 'fight',
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
                current: 30,
                max: 30
            }
        }
    };
}

export class Game2 {
    readonly state: Game2State

    constructor(existingState?: Game2State) {
        if (existingState) {
            this.state = existingState
        } else {
            this.state = initialState
            this.state.stage = setupFight(initialState.player)
        }

        this.startEventLoop()
    }

    private startEventLoop() {
        if (this.state.stage?.label === 'fight') {
            runFightLoop(this.state.stage)
        }
    }
}
