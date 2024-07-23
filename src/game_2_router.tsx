import {createMiddleware} from "hono/factory";
import {Hono} from "hono";
import Layout from "./components/Layout";
import Game from "./components/Game";
import {GameState2} from "./do2";
import {zValidator} from '@hono/zod-validator'
import {z} from 'zod'
import Monster from "./components/Monster";
import {CardTypes} from "./games/game2/cards";


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
    const durableObjectId = c.env.GAME_STATE_2.idFromName(gameId);
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
    </Layout>)
})


gameRouterV2.post('/action', zValidator(
        'form',
        z.union([
            z.object({
                actionType: z.literal('play_card'),
                cardIndex: z.string(),
                cardType: CardTypes,
            }),
            z.object({
                actionType: z.literal('end_turn'),
            })]
        )
    ),
    async (c) => {
        const validated = c.req.valid('form')
        if (validated.actionType === 'end_turn') {
            const state = await c.get('durableObject').endTurn()
            return c.html(
                <>
                    <Monster state={state.monster} hx_swap_oob={true}/>
                </>
            )
        } else {
            const state = await c.get('durableObject').playCard(validated.cardType)
            return c.html(
                <>
                    <Monster state={state.monster} hx_swap_oob={true}/>
                </>
            )
        }
    })