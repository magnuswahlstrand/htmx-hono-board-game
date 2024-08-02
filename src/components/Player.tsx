import {Hand} from "./Hand";
import {HtmxProps} from "../game/shared";
import {maxActionsPerTurn, PlayerFightState} from "../game/stages/fightStage";
import {css} from "hono/css";
import Button from "./Button";
import {CenteredRow} from "./CenteredRow";

type Props = {
    state: PlayerFightState
    gameId: string
} & HtmxProps

const style = css`

    .player {
        display: flex;
        gap: 0.5em;
        width: 100%;
        max-width: 50em;
        justify-content: space-around;
    }

    .pile {
        border-radius: 0.5em;
        border: 1px solid black;
        background-color: red;
        padding: 0.5em;
        width: 6em;
        justify-content: space-around;
    }

`

export function Player({state, gameId, hx_swap_oob}: Props) {
    return <div class="player" id="player" hx-swap-oob={hx_swap_oob}>
        <CenteredRow maxWidth={"50em"} style={css`
            justify-content: space-around;
        `}>

            {/*<Pile state={state.drawPile} text={'Draw pile'}/>*/}
            <Hand state={state.hand} gameId={gameId} outOfActions={state.actionCount >= maxActionsPerTurn}/>
            {/*<Pile state={state.discardPile} text={'Discard pile'}/>*/}
            <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                <form hx-post={`/game/${gameId}/action`} hx-target="this" hx-swap="outerHTML">
                    <input type="hidden" name="type" value="end_turn"/>
                    <Button>End Turn</Button>
                </form>
            </div>
        </CenteredRow>
    </div>;
}