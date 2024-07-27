import FightStage from "./screens/FightStage";
import {Game2State} from "../game/types";
import RewardScreen from "./screens/RewardScreen";
import {css} from "hono/css";
import {PropsWithChildren} from "hono/jsx";

type Props = { state: Game2State, gameId: string, swap?: boolean }

const Game = ({state, gameId, swap = false}: Props) => {
    switch (state.stage?.label) {
        case 'fight':
            return <FightStage state={state.stage} gameId={gameId} swap={swap}/>
        case 'reward':
            return <RewardScreen state={state.stage} gameId={gameId} swap={swap}/>
        case undefined:
            return <div>Oh no, something went wrong</div>
        default:
            return state.stage satisfies never
    }
}

const IconItem = ({src, children}: PropsWithChildren<{ src: string }>) => {
    return <div style={{display:'flex', gap: '0.3em', alignItems: 'center'}}>
        <image src={src}/>
        {children}
    </div>
}

export default (props: Props) => {
    const style = css`
        background-color: darkslategray;
        padding: 0.3em;
        color: white;
        width: 100%;
    `
    return <div id="game" className="game" hx-swap-oob={props.swap}>
        <div class={style}>
            <div style={{display:'flex', gap: '2em'}}>
                <IconItem src="https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/heart.png">
                    {props.state.player.health.current} / {props.state.player.health.max}
                </IconItem>

                <IconItem src="https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/gold_coins.png">
                    145
                </IconItem>

                <IconItem src="https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/start.png">
                    {props.state.stageNumber}
                </IconItem>
            </div>
        </div>
        <Game {...props}/>
    </div>
}
