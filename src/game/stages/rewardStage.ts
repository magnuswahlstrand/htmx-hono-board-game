import pino from "pino";
import {CardType} from "../types";
import {logger_info} from "./fightStage";
import {z} from "zod";
import {validRewardActions} from "../../do2";

// TODO: Refactor logger
export const logger = pino({});


export type RewardState = {
    label: 'reward'
    state: 'reward_selection' | 'stage_complete'
    cards: CardType[]
    choice?: z.infer<typeof validRewardActions>;
    reward?: CardType
}


export function runRewardLoop(stage: RewardState) {
    if (stage.state === 'stage_complete') {
        return
    }

    // Reward selection
    if (stage.choice === undefined)
        return

    if (stage.choice.type === 'select_card') {
        const cardType = stage.choice.card
        logger_info('select_card', stage.choice.card)
        const card = stage.cards.find(c => c === cardType)
        if (card === undefined) {
            throw new Error('Invalid card selection')
        }
        stage.reward = card
        stage.state = 'stage_complete'
    } else if (stage.choice.type === 'skip') {
        stage.reward = undefined
        stage.state = 'stage_complete'
    }
}