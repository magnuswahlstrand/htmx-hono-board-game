import {DurableObject} from "cloudflare:workers";
import {TicTacToe, TicTacToeState} from "./games/tictactoe";

export class GameState extends DurableObject {
    private game!: TicTacToe

    constructor(state: DurableObjectState, env: Env) {
        super(state, env);

        this.ctx.blockConcurrencyWhile(async () => {
            const existingState = await this.ctx.storage.get("state") as TicTacToeState
            if (existingState) {
                this.game = new TicTacToe(existingState)
                console.log("Loaded existing state")
                console.log(this)
            } else {
                this.game = new TicTacToe()
                console.log("Created new game")
                console.log(this)
            }
        });
    }

    async clearState() {
        await this.ctx.storage.deleteAll();
    }

    async pickCell(cell: number) {
        this.game.moves.pickCell(this.game.ctx.currentPlayer, cell)
        return this.game.state
    }

    async getState() {
        return this.game.state
    }
}