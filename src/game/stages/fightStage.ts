import {MonsterAction, MonsterActions, MonsterState} from "../monsters";
import _ from "lodash";
import {z} from "zod";
import {validFightActions} from "../../do2";
import {attack, Cards, poisonDamage} from "../cards";
import pino from "pino";
import {Card, Health, Status} from "../types";
import {FightAction} from "../eventLog";

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
    status: Status
    defense: number
    actionCount: number
}

export type Target = 'player' | 'monster'

export type FightState = {
    label: 'fight'
    state: 'round_setup' | 'before_player' | 'waiting_for_player' | 'before_monster' | 'monster_turn' | 'round_teardown' | 'stage_complete'
    player: PlayerFightState
    monster: MonsterState
    round: number
    log: FightAction[][]
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

export const maxActionsPerTurn = 3

export const playCard = (state: FightState, cardId: number) => {
    if(state.player.actionCount >= maxActionsPerTurn) {
        return
    }

    const i = state.player.hand.findIndex(card => card.id === cardId)
    if (i == -1) {
        return
    }
    const card = state.player.hand[i]!
    Cards[card.type].effect(state)

    // Remove card from hand
    state.player.discardPile.push(card)
    state.player.hand.splice(i, 1)
    state.player.actionCount++
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
        state.log.push([{type: 'end_of_turn', actor: 'player'}])
        events.delete('end_of_turn')
        return ['before_monster', false]
    }

    return ['waiting_for_player', true]
}


type FightStageState = FightState["state"]

export function setMonsterAction(monster: MonsterState, round: number): MonsterAction {
    return MonsterActions[monster.type](round)
}

function checkGameOver(stage: FightState, passthrough: [FightStageState, boolean]) {
    if (evalGameOver(stage)) {
        return ['stage_complete', true] as [FightStageState, boolean]
    }
    return passthrough
}

const steps: Record<FightStageState, (stage: FightState) => [state: FightStageState, exit: boolean]> = {
    "round_setup": (stage: FightState) => {
        drawPlayerCards(stage);
        stage.monster.nextAction = setMonsterAction(stage.monster, stage.round)
        return ["before_player", false]
    },
    "before_player": (stage: FightState) => {
        // Reset defense
        stage.player.defense = 0
        stage.player.actionCount = 0

        // Apply poison damage
        stage.player.health.current -= stage.player.status.poison ?? 0

        // Log
        return checkGameOver(stage, ["waiting_for_player", false])
    },
    "waiting_for_player": (stage) => {
        return playerTurn(stage)
    },
    "before_monster": (stage) => {
        // Reset defense
        stage.monster.defense = 0

        // Apply poison damage
        if (stage.monster.status.poison) {
            poisonDamage(stage, 'monster', stage.monster.status.poison)
        }

        if (stage.monster.status.stun) {
            stage.monster.status.stun--
            stage.log.push([{type: 'turn_skipped', reason: 'stunned', actor: 'monster'}])
            return checkGameOver(stage, ["round_teardown", false])
        }

        return checkGameOver(stage, ["monster_turn", false])
    },
    "monster_turn": (state) => {
        const action = state.monster.nextAction
        if (action && action.attack) {
            const effect = attack(state, action.attack, 'monster', 'player')
            state.log.push([effect])
        }
        state.monster.nextAction = undefined

        state.log.push([{type: 'end_of_turn', actor: 'monster'}])
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
