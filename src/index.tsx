import {Hono} from 'hono'
import {GameState2} from "./do2";
import {gameRouterV2} from "./gameRouter";
import Layout from "./components/Layout";
import Game from "./components/Game";
import {cardsWithId, initialState, setupFight, setupMap, setupReward} from "./game/setup";
import {runFightLoop} from "./game/stages/fightStage";
import MainMenu from "./components/screens/MainMenu";
import {Hand} from "./components/Hand";
import {Cards, CardTypes} from "./game/cards";

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
    return c.html(<Layout>
        <Game state={state} gameId={'hej'}/>
    </Layout>)
})


app.get('/dev/fight', async (c) => {
    const state = initialState
    // TODO: Use ennum
    state.stage = setupFight(state.player, 'goblin')
    state.stage.player.status.poison = 1
    state.stage.player.status.stun = 1
    state.stage.monster.status.poison = 1
    state.stage.monster.status.stun = 1
    state.stage.log.push(
        [{type: 'attack', value: 5, actor: 'player'}],
        [{type: 'attack', value: 5, actor: 'player'}, {type: 'poison_applied', value: 5, actor: 'player'}],
        [{type: 'stun', value: 1, actor: 'player'}],
        // [{type: 'attack', value: 3, actor: 'monster'}],
        // [{type: 'turn_skipped', actor: 'player', reason: 'stunned'}]
    )

    runFightLoop(state.stage)
    return c.html(<Layout>
        <Game state={state} gameId={'hej'}/>
    </Layout>)
})

app.get('/dev/cards', async (c) => {
    const hand = cardsWithId(Object.keys(Cards) as CardTypes[])
    return c.html(<Layout>
        <div style={{padding: "20em"}}>
            <Hand state={hand} gameId={"foo"}/>
        </div>
    </Layout>)
})

app.get('/dev/map', async (c) => {
    const state = initialState
    state.stage = setupMap(state.map)
    return c.html(<Layout>
        <Game state={state} gameId={'hej'}/>
    </Layout>)
})


export default app
