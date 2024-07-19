import {Hono} from 'hono'
import {GameState} from "./do";
import {instrument, ResolveConfigFn} from '@microlabs/otel-cf-workers'

export {GameState}

type Bindings = {
    GAME_STATE: DurableObjectNamespace<GameState>
    BASELIME_API_KEY: string
    SERVICE_NAME: string
}

export interface Env {
    BASELIME_API_KEY: string
    SERVICE_NAME: string
}

// const handler = {
//     async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
//         // your cloudflare worker code
//     },
// }

const config: ResolveConfigFn = (env: Env, _trigger) => {
    console.log('config', env.BASELIME_API_KEY)
    return {
        exporter: {
            url: 'https://otel.baselime.io/v1',
            headers: {'x-api-key': env.BASELIME_API_KEY},
        },
        service: {name: env.SERVICE_NAME},
    }
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
    return c.text('Hello Hono!')
})

app.post('/x/:x/y/:y', async (c) => {
    let id = c.env.GAME_STATE.idFromName("A");
    let obj = c.env.GAME_STATE.get(id);
    // Forward the request to the remote Durable Object.

    // let resp = await obj.fetch(request);

    return c.text('Hello Hono!')
})

export default instrument(app, config)
