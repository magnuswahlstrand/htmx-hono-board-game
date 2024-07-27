import {runFightLoop} from "./stages/fightStage";
import {CardType, Game2State} from "./types";
import {initialState, setupFight, setupReward} from "./setup";
import {Monsters} from "./monsters";
import {z} from "zod";
import {validFightActions, validRewardActions} from "../do2";
import _ from "lodash";
import {runRewardLoop} from "./stages/rewardStage";


export class Game {
    readonly state: Game2State

    constructor(existingState?: Game2State) {
        if (existingState) {
            this.state = existingState
        } else {
            this.state = structuredClone(initialState)
            this.state.stage = setupFight(initialState.player, Monsters["lizard_small"])
            runFightLoop(this.state.stage)
        }
    }

    private runEventLoop() {
        console.log('event loop', this.state.stage?.label)
        let newStage: Game2State["stage"]
        if (this.state.stage?.label === 'fight') {
            runFightLoop(this.state.stage)

            if (this.state.stage.state === 'phase_complete') {
                newStage = setupReward()
            }
        } else if (this.state.stage?.label === 'reward') {
            const addCardReward = (card: CardType) => {
                const maxId = _.maxBy(this.state.player.deck, 'id')?.id ?? 0
                this.state.player.deck.push({id: maxId + 1, type: card})
            }
            runRewardLoop(this.state.stage)

            if (this.state.stage.state === 'phase_complete') {
                if (this.state.stage.reward) {
                    addCardReward(this.state.stage.reward)
                }
                const newMonster = _.sample(['lizard', 'lizard_small'] as const)
                newStage = setupFight(this.state.player, Monsters[newMonster])

            }
        }

        if (newStage) {
            this.state.stage = newStage
            // TODO: Figure out how to handle game setup properly
            if (newStage.label === 'fight') {
                runFightLoop(newStage)
            }
        }
    }

    triggerFightEventLoop(action: z.infer<typeof validFightActions>) {
        if (this.state.stage?.label !== 'fight') {
            throw new Error('Game is not in fight stage')
        }
        this.state.stage.player.nextAction = action
        this.runEventLoop()
    }

    triggerRewardEventLoop(action: z.infer<typeof validRewardActions>) {
        if (this.state.stage?.label !== 'reward') {
            throw new Error('Game is not in reward stage')
        }
        this.state.stage.choice = action
        this.runEventLoop()
    }
}