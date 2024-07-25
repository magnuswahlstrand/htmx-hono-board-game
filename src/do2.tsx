import {DurableObject} from "cloudflare:workers";
import {Game2, Game2State} from "./game/game2/game2";
import {z} from "zod";
import {resumeFightLoopWithAction} from "./game/game2/fightStage";
import pino from "pino";

export const validActions = z.union([
    z.object({
        type: z.literal('play_card'),
        cardId: z.string().transform((v) => parseInt(v)),
    }),
    z.object({
        type: z.literal('end_turn'),
    })]
)


export const logger = pino({
    transport: {
        target: 'foo'
    },
});

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

    async handleFightAction(action: z.infer<typeof validActions>) {
        console.log(action)
        if (this.game.state.stage?.label !== 'fight') {
            throw new Error('Game is not in fight stage')
        }
        // Store action
        resumeFightLoopWithAction(this.game.state.stage, action)
        // Trigger event loop
        return this.game.state
    }
}