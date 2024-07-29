import {z} from "zod";
import {TypedObjectKeys} from "./shared";
import {FightState} from "./stages/fightStage";
import {dealDamage} from "./effects";

export const Cards = {
    stun: {
        title: "Small punch",
        description: "Deal 5 damage",
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/skill_icons5.png',
        effect: (state: FightState) => {
            dealDamage(state,5)
        }
    },
    punch_through: {
        title: "Punch!",
        description: "Deal 10 damage",
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/skill_icons41.png',
        effect: (state: FightState) => {
            dealDamage(state,10)
        }
    }
} as const

const [firstKey, ...otherKeys] = TypedObjectKeys(Cards)

export const CardTypes = z.enum([firstKey!, ...otherKeys])
export type CardTypes = z.infer<typeof CardTypes>
