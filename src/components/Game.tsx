import Monster from "./Monster";
import {Game2State} from "../games/game2/game2";
import {Player} from "./Player";

const Game = ({state, gameId, swap = false}: { state: Game2State, gameId: string, swap?: boolean }) => {
    return (
        <div id="game" class="game">
            <Monster state={state.monster}/>
            <Player state={state.player} gameId={gameId}/>
            <form hx-post={`/v2/game/${gameId}/action`} hx-target="this" hx-swap="outerHTML">
                <input type="hidden" name="actionType" value="end_turn"/>
                <button type="submit">
                    End turn
                </button>
            </form>
        </div>
    )
}

export default Game
