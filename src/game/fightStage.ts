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
    state: 'round_setup' | 'waiting_for_player' | 'round_teardown' | 'monster_turn' | 'game_over'
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
        return true
    }

    if (state.player.health.current <= 0) {
        return true
    }
    return false
}


export function resumeFightLoopWithAction(state: FightState, action: z.infer<typeof validActions>) {
    state.player.nextAction = action
    console.log(action)
    runFightLoop(state)
}

function playerTurn(state: FightState): FightState["state"] {
    const events = new Set<'end_of_turn'>()
    const action = state.player.nextAction
    if (action === undefined) {
        return "waiting_for_player"
    }
    state.player.nextAction = undefined

    logger_info(`Perform action: ${action.type}`,)
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
        return 'game_over'
    }

    if (events.has('end_of_turn')) {
        events.delete('end_of_turn')
        return 'monster_turn'
    }

    return 'waiting_for_player'
}

export function runFightLoop(stage: FightState) {
    while (true) {
        logger_info(stage.state)
        switch (stage.state) {
            case "round_setup":
                drawCards(stage);
                // Select monster actions
                stage.state = "waiting_for_player"
                break
            case "waiting_for_player":
                stage.state = playerTurn(stage)
                logger_info(stage.state)
                if (stage.state === "waiting_for_player") {
                    // Exit and wait for player
                    return
                }
                break
            case "monster_turn":
                // Do nothing, for now
                // return "round_teardown"
                stage.state = "round_teardown"
                break
            case "round_teardown":
                discardHand(stage);
                stage.round++
                stage.state = "round_setup"
                break
            case "game_over":
                logger_info("Game over")
                // Something here
                return
            default:
                return stage.state satisfies never
        }
    }
}
