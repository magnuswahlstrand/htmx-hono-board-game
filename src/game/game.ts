import {runFightLoop} from "./fightStage";
import {Game2State} from "./types";
import {initialState, setupFight} from "./setup";
import {Monsters} from "./monsters";
import {z} from "zod";
import {validActions} from "../do2";
import _ from "lodash";


export class Game {
    readonly state: Game2State

    constructor(existingState?: Game2State) {
        if (existingState) {
            this.state = existingState
        } else {
            this.state = structuredClone(initialState)
            this.state.stage = setupFight(initialState.player, Monsters["lizard_small"])
        }

        this.runEventLoop()
    }

    private runEventLoop() {
        let newStage
        if (this.state.stage?.label === 'fight') {
            runFightLoop(this.state.stage)
            console.log(this.state.stage)
            if (this.state.stage.state === 'game_over') {
                const newMonster = _.sample(['lizard', 'lizard_small'] as const)
                newStage = setupFight(this.state.player, Monsters[newMonster])
            }
        }

        if (newStage) {
            this.state.stage = newStage
            this.runEventLoop()
        }
    }

    triggerFightEventLoop(action: z.infer<typeof validActions>) {
        if (this.state.stage?.label !== 'fight') {
            throw new Error('Game is not in fight stage')
        }
        this.state.stage.player.nextAction = action
        this.runEventLoop()
    }
}
