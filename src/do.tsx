import {DurableObject} from "cloudflare:workers";

export class GameState extends DurableObject {

    constructor(state: DurableObjectState, env: Env) {
        super(state, env);
        console.log('Counter created', this.ctx.storage.get("count"))
    }

    async increment() {
        const prevCount: number = (await this.ctx.storage.get("count")) || 0 + 1;
        const newCount = prevCount + 1;
        console.log('Incrementing previous', newCount)
        await this.ctx.storage.put('count', newCount);

        const countComponent = <div id="count" hx-swap-oob="true">
            <Count count={newCount}/>
        </div>

        this.ctx.getWebSockets().forEach(ws => ws.send(
            countComponent.toString()
        ));

        return newCount
    }
}