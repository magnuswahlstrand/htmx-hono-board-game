import {z} from "zod";
import {defenseIcon, poisonIcon, stunIcon, TypedObjectKeys} from "./shared";
import {FightState, Target} from "./stages/fightStage";
import {appliedDamage} from "./effects";

export function attack(state: FightState, damage: number, source: Target, target: Target) {
    const targetObj = target === 'monster' ? state.monster : state.player
    const actualDamage = appliedDamage(targetObj.health.current, damage)
    targetObj.health.current -= actualDamage
    return {type: 'attack', damage: actualDamage, defenseRemoved: 0}
}

export function stun(state: FightState, source: Target, target: Target, value: number) {
    const targetObj = target === 'monster' ? state.monster : state.player
    targetObj.status.stun = (targetObj.status.stun ?? 0) + value
    state.log.push({type: 'stun', source, target, value})
}

export function turn_skipped(state: FightState, source: Target, reason: 'stunned') {
    state.log.push({type: 'turn_skipped', source, reason})
}

export function applyPoison(state: FightState, source: Target, target: Target, value: number) {
    const targetObj = target === 'monster' ? state.monster : state.player
    targetObj.status.poison = (targetObj.status.poison ?? 0) + value
    state.log.push({type: 'poison_applied', source, target, value})
}

export function poisonDamage(state: FightState, source: Target, value: number) {
    const targetObj = source === 'monster' ? state.monster : state.player
    const damageTaken = appliedDamage(targetObj.health.current, value)
    targetObj.health.current -= damageTaken
    state.log.push({type: 'poison_damage', source, value})
}


export const Cards = {
    stun: {
        title: "Stun",
        description: "Stun enemy for 1 turn",
        url: stunIcon,
        effect: (state: FightState) => {
            stun(state, 'player', 'monster', 1)
        }
    },
    hit: {
        title: "Hit",
        description: "Deal 5 damage",
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/card_hit.png',
        effect: (state: FightState) => {
            const events = {
                effects: [attack(state, 5, 'player', 'monster')]
            }

            state.log.push({type: 'attack', source, target, damage: actualDamage, defenseRemoved: 0})
        }
    },
    big_punch: {
        title: "Big punch",
        description: "Deal 8 damage",
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/card_big_punch.png',
        effect: (state: FightState) => {
            attack(state, 8, 'player', 'monster')
        }
    },
    defend: {
        title: "Defend",
        description: "Gain 5 defense",
        url: defenseIcon,
        effect: (state: FightState) => {
            state.player.defense += 5
        }
    },
    poison: {
        title: "Poison",
        description: "Apply 3 poison",
        url: poisonIcon,
        effect: (state: FightState) => {
            applyPoison(state, 'player', 'monster', 3)
        }
    },
    poison_dagger: {
        title: "Poison dagger",
        description: "5 damage\n Apply 2 poison",
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/card_poison_dagger.png',
        effect: (state: FightState) => {
            attack(state, 5, 'player', 'monster')
            applyPoison(state, 'player', 'monster', 2)
        }
    },
    heal: {
        title: "Heal",
        description: "Heal 6 health",
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/card_heal.png',
        effect: (state: FightState) => {
            // state.player.health.current += 5
        }
    },
    life_steal: {
        title: "Life steal",
        description: "Deal 6 damage and heal 3 health",
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/card_life_steal.png',
        effect: (state: FightState) => {
            attack(state, 6, 'player', 'monster')

        }
    },
    cure_poison: {
        title: "Cure poison",
        description: "Remove all poison",
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/card_cure_poison.png',
        effect: (state: FightState) => {
            state.player.status.poison = 0
            // state.log.push({type: 'cure_poison', source: 'player'})
        }
    }
} as const


const [firstKey, ...otherKeys] = TypedObjectKeys(Cards)

export const CardTypes = z.enum([firstKey!, ...otherKeys])
export type CardTypes = z.infer<typeof CardTypes>
