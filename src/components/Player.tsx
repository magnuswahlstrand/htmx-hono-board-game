import {Hand} from "./Hand";
import {HtmxProps} from "../game/shared";
import {PlayerFightState} from "../game/stages/fightStage";
import {css, Style} from "hono/css";
import Button from "./Button";

type Props = {
    state: PlayerFightState
    gameId: string
} & HtmxProps

const style = css`

    .player {
        display: flex;
        gap: 0.5em;
        background-color: darkslategray;
        width: 100%;
    }

    .pile {
        border-radius: 0.5em;
        border: 1px solid black;
        background-color: red;
        padding: 0.5em;
        width: 6em;
    }

`

export function Player({state, gameId, hx_swap_oob}: Props) {
    return <div class="player" id="player" hx-swap-oob={hx_swap_oob}>
        <Style>{style}</Style>
        {/*<Pile state={state.drawPile} text={'Draw pile'}/>*/}
        <Hand state={state.hand} gameId={gameId}/>
        {/*<Pile state={state.discardPile} text={'Discard pile'}/>*/}
        <form hx-post={`/v2/game/${gameId}/action`} hx-target="this" hx-swap="outerHTML">
            <input type="hidden" name="type" value="end_turn"/>
            <Button>End Turn</Button>
        </form>
    </div>;
}