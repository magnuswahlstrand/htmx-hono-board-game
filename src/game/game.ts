import {runFightLoop} from "./stages/fightStage";
import {Game2State} from "./types";
import {initialState, setupFight, setupMap, setupReward} from "./setup";
import {z} from "zod";
import {validFightActions, validMapActions, validRewardActions} from "../do2";
import _ from "lodash";
import {runRewardLoop} from "./stages/rewardStage";
import {runMapLoop} from "./stages/mapStage";
import {CardTypes} from "./cards";


export class Game {
    readonly state: Game2State

    constructor(existingState?: Game2State) {
        if (existingState) {
            this.state = existingState
        } else {
            this.state = structuredClone(initialState)
            this.state.stage = setupMap(this.state.map)
            // this.state.stage = setupFight(initialState.player, Monsters["lizard_small"])
            // runFightLoop(this.state.stage)
        }
    }

    private runEventLoop() {
        console.log('event loop', this.state.stage?.label)
        let newStage: Game2State["stage"]
        if (this.state.stage?.label === 'fight') {
            runFightLoop(this.state.stage)

            if (this.state.stage.state === 'stage_complete') {
                newStage = setupReward()
            }
        } else if (this.state.stage?.label === 'reward') {
            const addCardReward = (card: CardTypes) => {
                const maxId = _.maxBy(this.state.player.deck, 'id')?.id ?? 0
                this.state.player.deck.push({id: maxId + 1, type: card})
            }
            runRewardLoop(this.state.stage)

            if (this.state.stage.state === 'stage_complete') {
                if (this.state.stage.reward) {
                    addCardReward(this.state.stage.reward)
                }
                newStage = setupMap(this.state.map)
            }
        } else if (this.state.stage?.label === 'map') {
            runMapLoop(this.state.stage)

            if (this.state.stage.state === 'stage_complete') {
                // Update map
                const chosenNodeId = this.state.stage.choice
                if (chosenNodeId === undefined) {
                    throw new Error('Invalid state')
                }
                this.state.map.currentNode = chosenNodeId
                this.state.map.nodes[chosenNodeId]!.visited = true

                // TODO: Handle other type of nodes
                const newMonster = _.sample(['goblin'] as const)
                newStage = setupFight(this.state.player, newMonster)
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

    triggerMapEventLoop(action: z.infer<typeof validMapActions>) {
        if (this.state.stage?.label !== 'map') {
            throw new Error('Game is not in map stage')
        }
        this.state.stage.action = action
        this.runEventLoop()
    }
}
