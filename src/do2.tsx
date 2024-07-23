import {DurableObject} from "cloudflare:workers";
import {Game2, Game2State} from "./games/game2/game2";

import {CardTypes} from "./games/game2/cards";
import {z} from "zod";

export const validActions = z.union([
    z.object({
        actionType: z.literal('play_card'),
        cardId: z.string().transform((v) => parseInt(v)),
    }),
    z.object({
        actionType: z.literal('end_turn'),
    })]
)

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

    async handleAction(action: z.infer<typeof validActions>) {
        if (action.actionType === 'play_card') {
            // TODO: Validate card index
            this.game.moves.playCard(action.cardId)
        } else if (action.actionType === 'end_turn') {
            this.game.moves.endTurn()
        } else {
            // TODO: What to do here?
        }

        return this.game.state
    }

    async getState() {
        return this.game.state
    }
}