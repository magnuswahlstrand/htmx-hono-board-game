import Monster from "../Monster";
import {Player} from "../Player";
import {FightState, maxActionsPerTurn, Target} from "../../game/stages/fightStage";
import {css, Style} from "hono/css";
import {CenteredRow} from "../CenteredRow";
import {FightAction} from "../../game/eventLog";
import {StatusBar} from "../StatusBar";
import _ from "lodash";
import {Row} from "../parts/Row";

const style = css`
    .fight {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
`


function formatItem(item: FightAction) {
    switch (item.type) {
        case "defend":
            return `added ${item.value} defense`
        case "cure_poison":
            return `cured poison`
        case "end_of_turn":
            return `end of turn`
        case "turn_skipped":
            return `stunned and cannot act`
        case 'attack':
            return `dealt ${item.value} damage`
        case 'poison_applied':
            return `applied ${item.value} poison`
        case 'poison_damage':
            return `took ${item.value} poison damage`
        case 'stun':
            return `stunned`
        case 'heal':
            return `healed for ${item.value} hit points`
        default:
            return item satisfies never
    }
}

export function groupAndFormatLog(log: FightAction[][]) {

    // TODO: Add type?
    const groups: {
        actor: Target,
        log: string[]
    }[] = []

    let previousActor: Target | undefined = undefined
    for (const items of log) {
        if (!items[0]) continue

        const {actor} = items[0]
        if (previousActor !== actor) {
            previousActor = actor
            // New group
            groups.push({actor, log: []})
        }

        if (!groups.length) continue
        const formatted = _.upperFirst(items.map(formatItem).join(' & '))

        groups[groups.length - 1]?.log.push(formatted)
    }

    return groups
}

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
                                    groupAndFormatLog(state.log).map((group) => (
                                        <div style={{width: "100%"}}>
                                            <b>{group.actor === 'player' ? 'Your' : 'Enemy\'s'} turn</b>
                                            {group.log.map(item =>
                                                <div>{item}</div>
                                            )}
                                            <hr/>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <Row>
                            <div>
                                <h3>Player</h3>
                                <StatusBar status={state.player.status} defense={state.player.defense}/>
                                <img
                                    src='https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Blank&hairColor=Brown&facialHairType=BeardMedium&facialHairColor=BrownDark&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light'
                                    height={100} width={100}/>
                            </div>
                            <div>
                                Actions left: {maxActionsPerTurn - state.player.actionCount}<br/>
                                Draw pile: {state.player.drawPile.length}<br/>
                                Discard pile: {state.player.discardPile.length}
                            </div>
                        </Row>
                    </div>
                    <Monster state={state.monster}/>
                </CenteredRow>
                <Player state={state.player} gameId={gameId}/>
            </div>
        </>
    )
}

export default FightStage
