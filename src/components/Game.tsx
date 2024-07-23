import Monster from "./Monster";
import Card from "./Card";
import {Game2State} from "../games/game2/game2";

const Game = ({state, gameId, swap = false}: { state: Game2State, gameId: string, swap?: boolean }) => {
    return (
        <div id="game" class="game">
            <Monster state={state.monster}/>
            <div class="hand">
                <Card type="stun" index={0} gameId={gameId}/>
                <Card type="punch_through" index={1} gameId={gameId}/>
                <Card type="punch_through" index={2} gameId={gameId}/>
                <Card type="punch_through" index={3} gameId={gameId}/>
            </div>
        </div>
    )
}

export default Game
