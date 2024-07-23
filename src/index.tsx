import {Hono} from 'hono'
import {GameState} from "./do";
import {GameState2} from "./do2";
import Board from "./components/Board";
import GamePage from "./components/GamePage";
import {createMiddleware} from "hono/factory";
import {gameRouterV2} from "./game_2_router";

export {GameState}
export {GameState2}

type Bindings = {
    GAME_STATE: DurableObjectNamespace<GameState>
}


const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
    let id = c.env.GAME_STATE.idFromName("A");
    let obj = c.env.GAME_STATE.get(id);
    await obj.clearState();
    return c.text('Hello Hono!')
})

type Variables = {
    gameId: string
    durableObject: DurableObjectStub<GameState>
}

const gameMiddleware = createMiddleware<{ Bindings: Bindings, Variables: Variables }>(async (c, next) => {
    const gameId = c.req.param('id')
    if (!gameId) {
        return c.text('Game not found', 404)
    }

    // Retrieve the Shop Durable Object
    const durableObjectId = c.env.GAME_STATE.idFromName(gameId);
    const durableObject = c.env.GAME_STATE.get(durableObjectId)
    c.set('gameId', gameId)
    c.set('durableObject', durableObject)

    await next()
})

const gameRouter = new Hono<{ Variables: Variables }>()

gameRouter.use('*', gameMiddleware)
gameRouter.get('/', async (c) => {
    const state = await c.get('durableObject').getState()
    return c.html(<GamePage id={c.get('gameId')} state={state}/>)
})


gameRouter.post('/cell/:cellId', async (c) => {
    const cellId = parseInt(c.req.param('cellId'))
    const state = await c.get('durableObject').pickCell(cellId);

    return c.html(<Board gameId={c.get('gameId')} state={state}/>)
})

app.route('/game/:id', gameRouter)
app.route('/v2/game/:id', gameRouterV2)


export default app
