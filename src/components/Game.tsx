import Enemy from "./Enemy";
import Card from "./Card";

const Game = () => {
    return (
        <div class="game">
            <Enemy type="lizard"/>
            <div class="hand">
                <Card type="stun"/>
                <Card type="punch_through"/>
                <Card type="punch_through"/>
                <Card type="punch_through"/>
            </div>
        </div>
    )
}

export default Game
