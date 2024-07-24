import {Card} from "./game2";
import {Health} from "./shared";
import {MonsterState} from "./monsters";
import _ from "lodash";
import {z} from "zod";
import {validActions} from "../../do2";
import {Cards} from "./cards";
import pino from "pino";

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
    actors: Actor[]
    currentActor: Actor
    player: PlayerFightState
    monster: MonsterState
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
    logger_info('Play card', cardId)
    logger_info('Play card', state.player.hand)
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

function afterTurn(state: FightState) {
    logger_info("After turn")
    if (state.currentActor === 'player') {
        discardHand(state);
    }
}

export function runFightLoop(state: FightState, resume = false) {
    let skipSetup = resume

    const events = new Set<'end_of_turn'>()
    while (true) {
        events.clear()

        actor = state.currentActor // For logging, remove later

        if (!skipSetup)
            beforeTurn(state);
        skipSetup = false

        // Run turn
        while (true) {

            logger_info("Get action")
            const action = getAction(state)
            if (action === undefined) {
                logger_info('Wait for player input, exit loop')
                return
            }

            logger_info("Perform action", action)
            logger_info("Perform action", action.type)
            if (action.type === 'end_turn') {
                events.add('end_of_turn')
                console.log(events)
            } else if (action.type === 'play_card') {
                playCard(state, action.cardId)
            } else {
                throw new Error('Invalid action')
            }

            // Check end conditions
            if (evalGameOver(state)) {
                return
            }

            // Check end of turn
            logger_info("Check EOT")
            if (events.has('end_of_turn')) {
                console.log(events)
                logger_info("EOT")
                events.delete('end_of_turn')
                break
            }
        }

        // Run after turn
        afterTurn(state);

        state.currentActor = state.actors[(state.actors.indexOf(state.currentActor) + 1) % state.actors.length]!
        logger_info("Next actor", state.currentActor)
    }
}

// function getTriggerAction(triggerAction: z.infer<typeof validActions>) {
//     if (triggerAction.actionType === 'end_turn') {
//         return {type: 'end_of_turn'} as const
//     } else if (triggerAction.actionType === 'play_card') {
//         return {type: 'play_card', cardId: triggerAction.cardId}
//     }
//     throw new Error('Invalid action')
// }


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

