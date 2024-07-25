import {Hono} from 'hono'
import {GameState2} from "./do2";
import {gameRouterV2} from "./game_2_router";

export {GameState2}

type Bindings = {}


const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
    return c.text('Hello Hono!')
})


app.route('/v2/game/:id', gameRouterV2)


export default app
