import {Card} from "../games/game2/game2";

export function Pile(props: { state: Card[] }) {
    return <div>
        {props.state.length} cards
    </div>;
}