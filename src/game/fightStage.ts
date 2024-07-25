import {MonsterState} from "./monsters";
import _ from "lodash";
import {z} from "zod";
import {validActions} from "../do2";
import {Cards} from "./cards";
import pino from "pino";
import {Card, Health} from "./types";

// TODO: Refactor logger
export const logger = pino({});
let actor = ''

export const logger_info = (msg: string, ...args: any[]) => {
    logger.info(`${actor} ${msg}`, ...args)
}


type Actor = 'player' | 'monster'

export type PlayerFightState = {
    nextAction?: z.infer<typeof validActions>
    drawPile: Card[]
    discardPile: Card[]
    hand: Card[]
    health: Health
}

export type FightState = {
    label: 'fight'
    state: 'ongoing' | 'player_win' | 'monster_win'
    actors: [Actor, ...Actor[]]
    currentActor: Actor
    player: PlayerFightState
    monster: MonsterState
    round: number
}

function drawCards(state: FightState) {
    let cardsToDraw = 3
    while (cardsToDraw > 0) {
        if (state.player.drawPile.length === 0) {
            if (state.player.discardPile.length === 0) {
                break
            }
            // Shuffle discard pile into draw pile
            state.player.drawPile = _.shuffle(state.player.discardPile)
            state.player.discardPile = []
        }

        cardsToDraw--
        state.player.hand.push(state.player.drawPile.pop()!)
    }
}

function discardHand(state: FightState) {
    state.player.discardPile.push(...state.player.hand)
    state.player.hand = []
}


export const playCard = (state: FightState, cardId: number) => {
    const i = state.player.hand.findIndex(card => card.id === cardId)
    if (i == -1) {
        return
    }
    const card = state.player.hand[i]!
    Cards[card.type].effect(state)

    // Remove card from hand
    state.player.discardPile.push(card)
    state.player.hand.splice(i, 1)
}

function evalGameOver(state: FightState) {
    if (state.monster.health.current <= 0) {
        state.state = 'player_win'
        return true
    }

    if (state.player.health.current <= 0) {
        state.state = 'monster_win'
        return true
    }
    return false
}

function beforeTurn(state: FightState) {
    logger_info("Setup")
    // Run before turn
    if (state.currentActor === 'player') {
        drawCards(state);
    }
}

function endOfTurn(state: FightState) {
    logger_info("After turn")
    if (state.currentActor === 'player') {
        discardHand(state);
    }

    // Increase round number
    const nextIndex = state.actors.indexOf(state.currentActor) + 1
    if (nextIndex == state.actors.length) {
        state.round++
    }
    // Update current player
    state.currentActor = state.actors[nextIndex % state.actors.length]!
}

export function resumeFightLoopWithAction(state: FightState, action: z.infer<typeof validActions>) {
    state.player.nextAction = action
    runFightLoop(state, true)
}

export function runFightLoop(state: FightState, resume = false) {
    let skipSetup = resume

    const events = new Set<'end_of_turn'>()
    while (true) {
        actor = state.currentActor // For logging, remove later

        if (!skipSetup)
            beforeTurn(state);
        skipSetup = false

        // Run turn
        while (true) {
            events.clear()

            logger_info("Get action")
            const action = getAction(state)
            if (action === undefined) {
                logger_info('Wait for player input, exit loop')
                return
            }

            logger_info(`Perform action: ${action.type}`, )
            switch (action.type) {
                case 'end_turn':
                    events.add('end_of_turn')
                    break
                case 'play_card':
                    playCard(state, action.cardId)
                    break
                default:
                    return action satisfies never
            }

            // Check end conditions
            if (evalGameOver(state)) {
                logger_info("Game over!")
                return
            }

            // Check end of turn
            logger_info("Check EOT")
            if (events.has('end_of_turn')) {
                logger_info("EOT")
                events.delete('end_of_turn')
                break
            }
        }

        // Run after turn
        endOfTurn(state);


        logger_info("Next actor", state.currentActor)
    }
}

function foo(state: FightState) {
    const index = (state.actors.indexOf(state.currentActor) + 1) % state.actors.length
    if (index === 0) {
        // New round has begun
    }

    return state.actors[index]!
}

function getAction(state: FightState) {
    if (state.currentActor === 'player') {
        const action = state.player.nextAction
        state.player.nextAction = undefined
        return action
    } else {
        logger_info('Run monster AI')
        return {type: 'end_turn'} as const
    }
}

