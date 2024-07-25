import {runFightLoop} from "./fightStage";
import {Game2State} from "./types";
import {initialState, setupFight} from "./setup";


export class Game {
    readonly state: Game2State

    constructor(existingState?: Game2State) {
        if (existingState) {
            this.state = existingState
        } else {
            this.state = initialState
            this.state.stage = setupFight(initialState.player)
        }

        this.startEventLoop()
    }

    private startEventLoop() {
        if (this.state.stage?.label === 'fight') {
            runFightLoop(this.state.stage)
        }
    }
}
