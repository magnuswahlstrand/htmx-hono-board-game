import {createMiddleware} from "hono/factory";
import {Hono} from "hono";
import Layout from "./components/Layout";
import Game from "./components/Game";
import {GameState2, validFightActions, validRewardActions} from "./do2";
import {zValidator} from '@hono/zod-validator'
import {Game2State} from "./game/types";


type Bindings = {
    GAME_STATE_2: DurableObjectNamespace<GameState2>
}

type Variables = {
    gameId: string
    durableObject: DurableObjectStub<GameState2>
}

export const gameMiddlewareV2 = createMiddleware<{ Bindings: Bindings, Variables: Variables }>(async (c, next) => {
    const gameId = c.req.param('id')
    if (!gameId) {
        return c.text('Game not found', 404)
    }

    // Retrieve the Shop Durable Object
    const durableObjectId = c.env.GAME_STATE_2.idFromString(gameId)
    const durableObject = c.env.GAME_STATE_2.get(durableObjectId)
    c.set('gameId', gameId)
    c.set('durableObject', durableObject)

    await next()
})

export const gameRouterV2 = new Hono<{ Variables: Variables }>()

gameRouterV2.use('*', gameMiddlewareV2)
gameRouterV2.get('/', async (c) => {
    const state = await c.get('durableObject').getState()
    return c.html(<Layout>
        <Game state={state} gameId={c.get('gameId')}/>
        {/*<Debug state={state}/>*/}
    </Layout>)
})


function Debug(props: { state: Game2State }) {
    return <pre id="debug" hx-swap-oob={true}>
        {JSON.stringify(props.state, null, 2)}
    </pre>
}

gameRouterV2.post('/action', zValidator(
        'form',
        validFightActions,
    ),
    async (c) => {
        const validated = c.req.valid('form')

        const state = await c.get('durableObject').handleFightAction(validated)
        return c.html(
            <>
                <Game state={state} gameId={c.get('gameId')} swap={true}/>
            </>
        )
    }
)

gameRouterV2.post('/reward', zValidator(
        'form',
        validRewardActions,
    ),
    async (c) => {
        const validated = c.req.valid('form')

        const state = await c.get('durableObject').handleRewardAction(validated)
        return c.html(
            <>
                <Game state={state} gameId={c.get('gameId')} swap={true}/>
                {/*<Debug state={state}/>*/}
            </>
        )
    }
)