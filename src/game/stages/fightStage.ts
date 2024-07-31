import {MonsterAction, MonsterActions, MonsterState} from "../monsters";
import _ from "lodash";
import {z} from "zod";
import {validFightActions} from "../../do2";
import {attack, Cards} from "../cards";
import pino from "pino";
import {Card, Health} from "../types";
import {appliedDamage} from "../effects";

// TODO: Refactor logger
export const logger = pino({});
let actor = ''

export const logger_info = (msg: string, ...args: any[]) => {
    logger.info(`${actor} ${msg}`, ...args)
}


export type PlayerFightState = {
    nextAction?: z.infer<typeof validFightActions>
    drawPile: Card[]
    discardPile: Card[]
    hand: Card[]
    health: Health
}

export type Target = 'player' | 'monster'

export type FightEvent = attackEvent | eotEvent

type attackEvent = {
    type: 'attack'
    source: Target
    target: Target
    damage: number
    defenseRemoved: number
}
type eotEvent = {
    type: 'end_of_turn'
    source: 'player'
}

export type FightState = {
    label: 'fight'
    state: 'round_setup' | 'waiting_for_player' | 'round_teardown' | 'monster_turn' | 'stage_complete'
    player: PlayerFightState
    monster: MonsterState
    round: number
    log: FightEvent[]
}

function drawPlayerCards(state: FightState) {
    let cardsToDraw = 5
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

function discardPlayerHand(state: FightState) {
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


export function resumeFightLoopWithAction(state: FightState, action: z.infer<typeof validFightActions>) {
    state.player.nextAction = action
    runFightLoop(state)
}

function playerTurn(state: FightState): [FightStageState, boolean] {
    const events = new Set<'end_of_turn'>()
    const action = state.player.nextAction
    if (action === undefined) {
        return ["waiting_for_player", true]
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
        return ['stage_complete', true]
    }

    if (events.has('end_of_turn')) {
        state.log.push({type: 'end_of_turn', source: 'player'})
        events.delete('end_of_turn')
        return ['monster_turn', false]
    }

    return ['waiting_for_player', true]
}


type FightStageState = FightState["state"]

export function setMonsterAction(monster: MonsterState, round: number): MonsterAction {
    return MonsterActions[monster.type](round)
}

const steps: Record<FightStageState, (stage: FightState) => [state: FightStageState, exit: boolean]> = {
    "round_setup": (stage: FightState) => {
        drawPlayerCards(stage);
        stage.monster.nextAction = setMonsterAction(stage.monster, stage.round)
        return ["waiting_for_player", false]
    },
    "waiting_for_player": (stage) => {
        return playerTurn(stage)
    },
    "monster_turn": (state) => {
        const action = state.monster.nextAction
        if (action && action.attack) {
            attack(state, action.attack, 'monster', 'player')
            state.player.health.current = appliedDamage(state.player.health.current, action.attack)
        }
        state.monster.nextAction = undefined

        return ["round_teardown", false]
    },
    "round_teardown": (stage) => {
        discardPlayerHand(stage);
        stage.round++
        return ["round_setup", false]
    },
    "stage_complete": (_) => {
        logger_info("Game over")
        return ["stage_complete", true]
    },
}

export function runFightLoop(stage: FightState) {
    while (true) {
        logger_info('before ' + stage.state)
        const [newState, exit] = steps[stage.state](stage)
        stage.state = newState
        if (exit) {
            logger_info('exit')
            return
        }
    }
}
