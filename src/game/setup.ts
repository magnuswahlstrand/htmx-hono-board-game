import {CardType, Game2State, WorldMap} from "./types";
import {FightState} from "./stages/fightStage";
import _ from "lodash";
import {Monsters} from "./monsters";
import {RewardState} from "./stages/rewardStage";
import {MapState} from "./stages/mapStage";

const startingDeck: CardType[] = [
    'stun',
    'stun',
    'punch_through',
    'punch_through',
    'punch_through',
    'punch_through',
    'punch_through',
    'punch_through',
]

export const cardsWithId = (cards: CardType[]) => {
    return cards.map((type, i) => ({id: i, type}))
}

export const initialState: Game2State = {
    stageNumber: 1,
    player: {
        deck: cardsWithId(startingDeck),
        health: {
            current: 100,
            max: 100
        },
        gold: 15,
    },
    map: {
        currentNode: 0,
        nodes: [
            {id: 0, type: 'start', coordinates: {x: 5, y: 0}, visited: true, links: [1, 2]},
            {id: 1, type: 'monster', coordinates: {x: 3, y: 2}, visited: false, links: [3]},
            {id: 2, type: 'monster', coordinates: {x: 7, y: 2}, visited: false, links: [4, 5]},
            {id: 3, type: 'monster', coordinates: {x: 4, y: 4}, visited: false, links: [6]},
            {id: 4, type: 'monster', coordinates: {x: 6, y: 4}, visited: false, links: [7]},
            {id: 5, type: 'camp', coordinates: {x: 8, y: 4}, visited: false, links: [7]},
            {id: 6, type: 'monster', coordinates: {x: 4.5, y: 6.5}, visited: false, links: [8]},
            {id: 7, type: 'monster', coordinates: {x: 7, y: 6.5}, visited: false, links: [8]},
            {id: 8, type: 'boss', coordinates: {x: 6, y: 8.5}, visited: false, links: []},
        ]
    }
}

export function setupFight(player: Game2State["player"], monster = Monsters['lizard_small']): FightState {
    return {
        state: 'round_setup',
        label: 'fight',
        round: 1,
        player: {
            drawPile: _.shuffle(player.deck),
            discardPile: [],
            hand: [],
            health: player.health
        },
        monster: structuredClone(monster),
        log: []
    };
}

export function setupMap(map: WorldMap): MapState {
    return {
        label: 'map',
        state: 'selection',
        map: structuredClone(map)
    };
}


export function setupReward(): RewardState {
    return {
        label: 'reward',
        state: 'reward_selection',
        cards: ['stun', 'stun', 'stun']
    };
}