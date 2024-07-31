import {z} from "zod";
import {TypedObjectKeys} from "./shared";
import {FightState, Target} from "./stages/fightStage";
import {appliedDamage} from "./effects";

export function attack(state: FightState, damage: number, source: Target, target: Target) {
    const targetObj = target === 'monster' ? state.monster : state.player
    const actualDamage = appliedDamage(targetObj.health.current, damage)
    targetObj.health.current -= actualDamage
    state.log.push({type: 'attack', source, target, damage: actualDamage, defenseRemoved: 0})
}

export const Cards = {
    stun: {
        title: "Small punch",
        description: "Deal 5 damage",
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/skill_icons5.png',
        effect: (state: FightState) => {
            attack(state, 5, 'player','monster')
        }
    },
    punch_through: {
        title: "Punch through",
        description: "Deal 10 damage",
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/skill_icons41.png',
        effect: (state: FightState) => {
            attack(state, 10, 'player','monster')
        }
    }
} as const

const [firstKey, ...otherKeys] = TypedObjectKeys(Cards)

export const CardTypes = z.enum([firstKey!, ...otherKeys])
export type CardTypes = z.infer<typeof CardTypes>
