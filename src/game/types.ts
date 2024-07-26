import {CardTypes} from "./cards";
import {FightState} from "./stages/fightStage";
import {RewardState} from "./stages/rewardStage";

export type Card = {
    id: number
    type: CardTypes
}
export type Game2State = {
    stageNumber: number
    player: {
        deck: Card[]
        health: {
            current: number,
            max: number
        }
    }
    stage?: FightState | RewardState
}
export type Health = {
    current: number
    max: number
}
export type CardType = 'stun' | 'punch_through'