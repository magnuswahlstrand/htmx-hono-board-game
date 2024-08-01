import {CardTypes} from "./cards";
import {FightState} from "./stages/fightStage";
import {RewardState} from "./stages/rewardStage";
import {MapState} from "./stages/mapStage";

export type Card = {
    id: number
    type: CardTypes
}

export type Game2State = {
    stageNumber: number
    player: {
        deck: Card[]
        health: Health
        gold: number
    }
    stage?: FightState | RewardState | MapState
    map: WorldMap
}
export type Health = {
    current: number
    max: number
}

type WorldMapNode = {
    id: number,
    type: 'start' | 'monster' | 'camp' | 'boss'
    coordinates: {
        x: number,
        y: number
    }
    visited: boolean
    links: number[]
}

export type WorldMap = {
    currentNode: number
    nodes: WorldMapNode[]
}

export type Status = {
    poison?: number
    stun?: number
};
