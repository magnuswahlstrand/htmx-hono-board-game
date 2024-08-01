import {css, Style} from "hono/css";
import {HtmxProps} from "../game/shared";
import {MonsterState, UIMonsters} from "../game/monsters";
import {StatusBar} from "./StatusBar";

type Props = {
    state: MonsterState
} & HtmxProps

const imgClass = css`
    width: 150px; /* Width of a single frame */
    height: 150px; /* Height of a single frame */
    //background: url('path/to/your/sprite.png') left top;
    background-size: 1800px 150px; /* Total width and height of the sprite sheet */
    animation: play 1s steps(2) infinite;
    transform: scaleX(-1); /* Flip the image horizontally */
`
//
// const imgClass = css`
//     width: 20em;
//     height: 20em;
//     image-rendering: pixelated;
// `

const containerClass = css`
    display: flex;
    flex-direction: column;
    gap: 0.3em;
    align-items: center;
`

const meterClass = css`
    width: 100%;
    height: 3em;
`

const meterContainerClass = css`
    display: flex;
    width: 100%;
    align-items: center;
    gap: 0.5em;
`

const meterText = css`
    white-space: nowrap;
    width: 70px;
    text-align: left;
`

const Monster = ({state, hx_swap_oob}: Props) => {
    const {url, name} = UIMonsters[state.type]

    // TODO: Add a common htmx wrapper
    return (<div class={containerClass} id="monster" hx-swap-oob={hx_swap_oob}>
            <h1>{name}</h1>
            <StatusBar status={state.status} defense={state.defense}/>
            <Style>{css`
                @keyframes play {
                    from {
                        background-position: 0 0;
                    }
                    to {
                        background-position: -300px 0; /* Move to the left by the total width of the sprite sheet */
                    }
                }
            `}
            </Style>
            <div class={imgClass} src={url} alt="enemy" style={{background: `url(${url})`}}/>
            <div class={meterContainerClass}>
                <div class={meterText}>{state.health.current} / {state.health.max}</div>
                <meter value={state.health.current} min="0" max={state.health.max} class={meterClass}/>
            </div>
        </div>
    )
}

export default Monster
