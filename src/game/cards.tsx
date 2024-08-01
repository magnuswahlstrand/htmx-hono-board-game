import {z} from "zod";
import {defenseIcon, poisonIcon, stunIcon, TypedObjectKeys} from "./shared";
import {FightState, Target} from "./stages/fightStage";
import {appliedDamage} from "./effects";
import {FightAction} from "./eventLog";

export function attack(state: FightState, damage: number, actor: Target, target: Target): FightAction {
    const targetObj = target === 'monster' ? state.monster : state.player
    const actualDamage = appliedDamage(targetObj.health.current, damage)
    targetObj.health.current -= actualDamage
    return {type: 'attack', value: actualDamage, actor}
}

export function stun(state: FightState, actor: Target, target: Target, value: number): FightAction {
    const targetObj = target === 'monster' ? state.monster : state.player
    targetObj.status.stun = (targetObj.status.stun ?? 0) + value
    return {type: 'stun', value: 1, actor}
}

export function turnSkipped(state: FightState, actor: Target, reason: 'stunned'): FightAction {
    return {type: 'turn_skipped', reason, actor}
}

export function applyPoison(state: FightState, source: Target, target: Target, value: number): FightAction {
    const targetObj = target === 'monster' ? state.monster : state.player
    targetObj.status.poison = (targetObj.status.poison ?? 0) + value
    return {type: 'poison_applied', actor: source, value}
}

export function poisonDamage(state: FightState, actor: Target, value: number): FightAction {
    const targetObj = actor === 'monster' ? state.monster : state.player
    const damageTaken = appliedDamage(targetObj.health.current, value)
    targetObj.health.current -= damageTaken
    return {type: 'poison_damage', actor: actor, value}
}

export function defend(state: FightState, actor: Target, value: number): FightAction {
    state.player.defense += value
    return {type: 'defend', actor, value}
}

export function heal(state: FightState, actor: Target, value: number): FightAction {
    const targetObj = actor === 'monster' ? state.monster : state.player
    const actualHeal = Math.min(targetObj.health.max - targetObj.health.current, value)
    targetObj.health.current += actualHeal
    return {type: 'heal', actor, value: actualHeal}
}


export const Cards = {
    stun: {
        title: "Stun",
        description: "Stun enemy for 1 turn",
        url: stunIcon,
        effect: (state: FightState) => {
            const effect = stun(state, 'player', 'monster', 1)
            state.log.push([effect])
        }
    },
    hit: {
        title: "Hit",
        description: "Deal 5 damage",
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/card_hit.png',
        effect: (state: FightState) => {
            const effect = attack(state, 5, 'player', 'monster')
            state.log.push([effect])
        }
    },
    big_punch: {
        title: "Big punch",
        description: "Deal 8 damage",
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/card_big_punch.png',
        effect: (state: FightState) => {
            const effect = attack(state, 8, 'player', 'monster')
            state.log.push([effect])
        }
    },
    defend: {
        title: "Defend",
        description: "Gain 3 defense",
        url: defenseIcon,
        effect: (state: FightState) => {
            const effect = defend(state, 'player', 3)
            state.log.push([effect])
        }
    },
    poison: {
        title: "Poison",
        description: "Apply 3 poison",
        url: poisonIcon,
        effect: (state: FightState) => {
            const effect = applyPoison(state, 'player', 'monster', 3)
            state.log.push([effect])
        }
    },
    poison_dagger: {
        title: "Poison dagger",
        description: "5 damage\n Apply 2 poison",
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/card_poison_dagger.png',
        effect: (state: FightState) => {
            const e1 = attack(state, 5, 'player', 'monster')
            const e2 = applyPoison(state, 'player', 'monster', 2)
            state.log.push([e1, e2])
        }
    },
    heal: {
        title: "Heal",
        description: "Heal 6 health",
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/card_heal.png',
        effect: (state: FightState) => {
            const effect = heal(state, 'player', 6)
            state.log.push([effect])
        }
    },
    life_steal: {
        title: "Life steal",
        description: "Deal 6 damage and heal 3 health",
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/card_life_steal.png',
        effect: (state: FightState) => {
            const e1 = attack(state, 6, 'player', 'monster')
            const e2 = heal(state, 'player', 3)
            state.log.push([e1, e2])
        }
    },
    cure_poison: {
        title: "Cure poison",
        description: "Remove all poison",
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/card_cure_poison.png',
        effect: (state: FightState) => {
            state.player.status.poison = 0
            state.log.push([{type: 'cure_poison', actor: 'player'}])
        }
    }
} as const


const [firstKey, ...otherKeys] = TypedObjectKeys(Cards)

export const CardTypes = z.enum([firstKey!, ...otherKeys])
export type CardTypes = z.infer<typeof CardTypes>
