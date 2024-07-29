import {Hono} from 'hono'
import {GameState2} from "./do2";
import {gameRouterV2} from "./gameRouter";
import Layout from "./components/Layout";
import Game from "./components/Game";
import {initialState, setupFight, setupReward} from "./game/setup";
import {runFightLoop} from "./game/stages/fightStage";
import MainMenu from "./components/screens/MainMenu";

export {GameState2}

type Bindings = {
    GAME_STATE_2: DurableObjectNamespace<GameState2>
}


const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
    return c.html(
        <Layout>
            <MainMenu/>
        </Layout>)
})

app.post('/game', async (c) => {
    let id = c.env.GAME_STATE_2.newUniqueId().toString();
    c.header('HX-Redirect', `/game/${id}`)
    return c.text('ok!')
})
app.route('/game/:id', gameRouterV2)


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
    runFightLoop(state.stage)
    return c.html(<Layout>
        <Game state={state} gameId={'hej'}/>
    </Layout>)
})


export default app
