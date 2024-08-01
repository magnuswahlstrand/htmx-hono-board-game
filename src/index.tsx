import {Hono} from 'hono'
import {GameState2} from "./do2";
import {gameRouterV2} from "./gameRouter";
import Layout from "./components/Layout";
import Game from "./components/Game";
import {cardsWithId, initialState, setupFight, setupMap, setupReward} from "./game/setup";
import {runFightLoop, singleAction} from "./game/stages/fightStage";
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
        singleAction({type: 'attack', value: 5}, 'monster', 'player'),
        singleAction({type: 'attack', value: 5}, 'player', 'monster'),
        singleAction({type: 'stun', value: 1}, 'player', 'monster'),
        {
            source: 'monster', target: 'player', effects: [
                {type: 'attack', value: 5},
                {type: 'stun', value: 1},
                {type: 'attack', value: 5}
            ]
        },
        {
            source: 'player', target: undefined,
            effects: [{type: 'turn_skipped', reason: 'stunned'}]
        }
    )

    console.log(state.stage.log)

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
