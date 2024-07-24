import {Card} from "../games/game2/game2";

export function Pile(props: { state: Card[], text: string }) {
    return <div class="pile" style={{backgroundColor: 'red'}}><h3>{props.text}</h3><br/>{props.state.length} cards
    </div>;
}