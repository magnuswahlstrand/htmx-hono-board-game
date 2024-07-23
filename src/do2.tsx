import {DurableObject} from "cloudflare:workers";
import {Game2, Game2State} from "./games/game2/game2";

import {CardTypes} from "./games/game2/cards";

export class GameState2 extends DurableObject {
    private game!: Game2

    constructor(state: DurableObjectState, env: Env) {
        super(state, env);

        this.ctx.blockConcurrencyWhile(async () => {
            const existingState = await this.ctx.storage.get("state") as Game2State
            if (existingState) {
                this.game = new Game2(existingState)
            } else {
                this.game = new Game2()
            }
        });
    }

    async clearState() {
        await this.ctx.storage.deleteAll();
    }

    async playCard(cardType: CardTypes) {
        this.game.moves.playCard(cardType)
        return this.game.state
    }

    async endTurn() {
        this.game.events.endTurn()
        // TODO: Merge this into endTurn
        this.game.evaluateGameLoop()
        return this.game.state
    }

    async getState() {
        return this.game.state
    }
}