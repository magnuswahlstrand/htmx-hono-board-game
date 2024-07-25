import {CardTypes} from "./cards";
import {FightState} from "./fightStage";

export type Card = {
    id: number
    type: CardTypes
}
export type Game2State = {
    player: {
        deck: Card[]
        health: {
            current: number,
            max: number
        }
    }
    stage?: FightState
}
export type Health = {
    current: number
    max: number
}