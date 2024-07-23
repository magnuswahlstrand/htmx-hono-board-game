import {GameContext} from "../../engine";
import {MonsterState} from "./monsters";
import {Cards, CardTypes} from "./cards";
import _ from "lodash";


export type Card = {
    id: number
    type: CardTypes
}


export type PlayerState = {
    deck: Card[],
    drawPile: Card[]
    discardPile: Card[]
    hand: Card[],
    health: {
        current: number,
        max: number
    }
};
export type Game2State = {
    player: PlayerState
    monster: MonsterState
}


export const playCard = ({G}: Main, cardId: number) => {
    const i = G.player.hand.findIndex(card => card.id === cardId)
    if (i == -1) {
        return 'ERROR'
    }
    const card = G.player.hand[i]!
    Cards[card.type].effect(G)

    // Remove card from hand
    G.player.discardPile.push(card)
    G.player.hand.splice(i, 1)
    return 'SUCCESS'
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


const defaultState: Game2State = {
    player: {
        deck: ([
            'stun',
            'stun',
            'punch_through',
            'punch_through',
            'punch_through',
            'punch_through',
            'punch_through',
            'punch_through',
        ] as const).map((type, i) => ({id: i, type})),
        drawPile: [],
        discardPile: [],
        hand: [],
        health: {
            current: 100,
            max: 100
        }
    },
    monster: {
        type: 'lizard',
        health: {
            current: 100,
            max: 100
        }
    }
}


export class Game2 {
    readonly state: Game2State
    readonly ctx: GameContext
    readonly moves: Moves
    readonly events: GameEvents
    // moves: PublicMoves<InitialMoves>
    // private readonly turns: Turns<GameState>
    // private readonly endIf: GameOverFunc<GameState>

    constructor(initialState?: Game2State) {
        this.state = initialState ? initialState : defaultState
        this.ctx = {
            currentPlayer: '0',
            playOrder: [
                "0",
            ]
        }

        this.moves = {
            playCard: (cardId) => {
                playCard({G: this.state, ctx: this.ctx, events: this.events}, cardId)
                this.evaluateGameLoop()
                return
            },
            endTurn: () => {
                endTurn({G: this.state, ctx: this.ctx, events: this.events})
                this.evaluateGameLoop()
                return
            }
        }

        const eventQueue = new Set<'end_turn'>()
        this.events = {
            queue: eventQueue,
            endTurn: () => {
                eventQueue.add('end_turn')
            }
        }

        // TODO: Refactor
        this.state.player.drawPile = _.shuffle(this.state.player.deck);
        this.onStartTurn()
    }

    onStartTurn() {
        console.log("Start turn")
        let cardsToDraw = 3
        while (cardsToDraw > 0 && this.state.player.drawPile.length) {
            cardsToDraw--
            this.state.player.hand.push(this.state.player.drawPile.pop()!)
        }
        console.log(this.state.player.drawPile)
        console.log(this.state.player.hand)
    }

    onEndTurn() {
        console.log("End turn")
    }

    evaluateGameLoop() {
        // TODO: Merge events with functions below
        if (this.events.queue.has('end_turn')) {
            this.onEndTurn()
            this.onStartTurn()
        }
        this.events.queue.delete('end_turn')
        console.log(this.state.player)

        // const gameOver = this.endIf({G: this.state, ctx: this.ctx, events: this.events})
        // if (gameOver) {
        //     this.ctx.gameOver = gameOver
        // }
    }
}