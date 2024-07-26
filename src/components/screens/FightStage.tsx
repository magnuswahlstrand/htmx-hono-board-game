import Monster from "../Monster";
import {Player} from "../Player";
import {FightState} from "../../game/stages/fightStage";

const FightStage = ({state, gameId, swap = false}: { state: FightState, gameId: string, swap?: boolean }) => {
    return (
        <div id="fight" class="fight" hx-swap-oob={swap}>
            <Monster state={state.monster}/>
            <Player state={state.player} gameId={gameId}/>
            <form hx-post={`/v2/game/${gameId}/action`} hx-target="this" hx-swap="outerHTML">
                <input type="hidden" name="type" value="end_turn"/>
                <button type="submit">
                    End turn
                </button>
            </form>
        </div>
    )
}

export default FightStage
