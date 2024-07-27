import Monster from "../Monster";
import {Player} from "../Player";
import {FightState} from "../../game/stages/fightStage";
import {css, Style} from "hono/css";

const style = css`
    .fight {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
    }

    .fight > .arena {
        display: flex;
        gap: 2em;
        width: 100%;
        max-width: 40em;
        
        justify-content: space-between;
        align-items: end;
    }
`
const FightStage = ({state, gameId, swap = false}: { state: FightState, gameId: string, swap?: boolean }) => {
    return (
        <>
            <Style>{style}</Style>
            <div id="fight" class="fight" hx-swap-oob={swap}>
                <div class="arena">
                    <div>
                        <h3>Player</h3>
                        <img src='https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Blank&hairColor=Brown&facialHairType=BeardMedium&facialHairColor=BrownDark&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light' height={100} width={100}/>
                    </div>
                    <Monster state={state.monster}/>
                </div>
                <Player state={state.player} gameId={gameId}/>
            </div>
        </>
    )
}

export default FightStage
