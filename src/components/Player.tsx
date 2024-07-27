import {Pile} from "./Pile";
import {Hand} from "./Hand";
import {HtmxProps} from "../game/shared";
import {PlayerFightState} from "../game/stages/fightStage";
import {css} from "hono/css";

type Props = {
    state: PlayerFightState
    gameId: string
} & HtmxProps

const style = css`

    .hand {
        display: flex;
        gap: 0.5em;
        width: 100%;
    }

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
        {/*<Pile state={state.drawPile} text={'Draw pile'}/>*/}
        <Hand state={state.hand} gameId={gameId}/>
        {/*<Pile state={state.discardPile} text={'Discard pile'}/>*/}
    </div>;
}