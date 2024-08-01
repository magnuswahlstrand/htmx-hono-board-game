import Monster from "../Monster";
import {Player} from "../Player";
import {FightState} from "../../game/stages/fightStage";
import {css, Style} from "hono/css";
import {CenteredRow} from "../CenteredRow";
import {formatEvent} from "../../game/eventLog";
import {StatusBar} from "../StatusBar";

const style = css`
    .fight {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
`


const FightStage = ({state, gameId, swap = false}: { state: FightState, gameId: string, swap?: boolean }) => {
    const arenaStyle = css`
        background-color: white;
    `

    const innerStyle = css`
        justify-content: space-between;
        align-items: end;
    `

    const logOuterStyle = css`
        position: relative;
        width: 100%;
        overflow: hidden;
        height: 200px;
    `

    const logInnerStyle = css`
        position: absolute;
        bottom: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1em;

        &:before {
            content: '';
            width: 100%;
            height: 200px;
            position: absolute;
            left: 0;
            bottom: 0;
            background: linear-gradient(white 25px, transparent);
        }
    `

    return (
        <>
            <Style>{style}</Style>
            <div id="fight" class="fight" hx-swap-oob={swap}>
                <CenteredRow style={innerStyle} outerStyle={arenaStyle} maxWidth={"40em"}>
                    <div style={{position: "relative", flex: 1, display: "flex", flexDirection: "column", gap: "3em"}}>
                        <div class={logOuterStyle}>
                            <div class={logInnerStyle}>
                                {
                                    state.log.map((event) => (
                                        <div style={{width: "100%"}}>
                                            {formatEvent(event, state.monster.type)}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div>

                            <h3>Player</h3>
                            <StatusBar status={state.player.status} defense={state.player.defense}/>
                            <img
                                src='https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Blank&hairColor=Brown&facialHairType=BeardMedium&facialHairColor=BrownDark&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light'
                                height={100} width={100}/>
                        </div>
                    </div>
                    <Monster state={state.monster}/>
                </CenteredRow>
                <Player state={state.player} gameId={gameId}/>
            </div>
        </>
    )
}

export default FightStage
