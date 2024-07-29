import {DurableObject} from "cloudflare:workers";
import {Game2State} from "./game/types";
import {Game} from "./game/game";
import {z} from "zod";
import pino from "pino";

export const validFightActions = z.union([
    z.object({
        type: z.literal('play_card'),
        cardId: z.string().transform((v) => parseInt(v)),
    }),
    z.object({
        type: z.literal('end_turn'),
    })]
)

export const validRewardActions = z.union([
    z.object({
        type: z.literal('select_card'),
        card: z.string(),
    }),
    z.object({
        type: z.literal('skip'),
    })]
)


export const logger = pino({
    transport: {
        target: 'foo'
    },
});

export class GameState2 extends DurableObject {
    private game!: Game

    constructor(state: DurableObjectState, env: Env) {
        super(state, env);

        this.ctx.blockConcurrencyWhile(async () => {
            const existingState = await this.ctx.storage.get("state") as Game2State
            if (existingState) {
                this.game = new Game(existingState)
            } else {
                this.game = new Game()
            }
        });
    }

    async clearState() {
        await this.ctx.storage.deleteAll();
    }

    async handleFightAction(action: z.infer<typeof validFightActions>) {
        if (this.game.state.stage?.label !== 'fight') {
            throw new Error('Game is not in fight stage')
        }
        // Store action
        this.game.triggerFightEventLoop(action)

        await this.ctx.storage.put("state", this.game.state)

        // Trigger event loop
        return this.game.state
    }

    async handleRewardAction(action: z.infer<typeof validRewardActions>) {
        if (this.game.state.stage?.label !== 'reward') {
            throw new Error('Game is not in reward stage')
        }
        // Store action
        this.game.triggerRewardEventLoop(action)

        await this.ctx.storage.put("state", this.game.state)

        // Trigger event loop
        return this.game.state
    }

    async getState() {
        return this.game.state
    }
}