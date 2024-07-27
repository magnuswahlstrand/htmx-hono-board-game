import {Hono} from 'hono'
import {GameState2} from "./do2";
import {gameRouterV2} from "./game_2_router";
import Layout from "./components/Layout";
import Game from "./components/Game";
import {initialState, setupFight, setupReward} from "./game/setup";

export {GameState2}

type Bindings = {}


const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
    return c.text('Hello Hono!')
})


app.route('/v2/game/:id', gameRouterV2)


app.get('/dev/reward', async (c) => {
    const state = initialState
    state.stage = setupReward()
    console.log(state)
    return c.html(<Layout>
        <Game state={state} gameId={'hej'}/>
    </Layout>)
})


app.get('/dev/fight', async (c) => {
    const state = initialState
    state.stage = setupFight(state.player)
    console.log(state)
    return c.html(<Layout>
        <Game state={state} gameId={'hej'}/>
    </Layout>)
})



export default app
