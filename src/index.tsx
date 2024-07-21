import {Hono} from 'hono'
import {GameState} from "./do";
import Board from "./components/Board";
import GamePage from "./components/GamePage";

export {GameState}

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

app.get('/game/:id', async (c) => {
    let id = c.env.GAME_STATE.idFromName(c.req.param('id'));
    const state = await c.env.GAME_STATE.get(id).getState()
    return c.html(<GamePage state={state}/>)
})


app.post('/game/:id', async (c) => {
    let id = c.env.GAME_STATE.idFromName(c.req.param('id'));
    const state = await c.env.GAME_STATE.get(id).pickCell(0);


    return c.html(<Board state={state}/>)
})

export default app
