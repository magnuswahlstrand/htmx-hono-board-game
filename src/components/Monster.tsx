import {css} from "hono/css";
import {HtmxProps} from "../game/shared";
import {Monsters, MonsterState} from "../game/monsters";

type Props = {
    state: MonsterState
} & HtmxProps

const imgClass = css`
    width: 20em;
    height: 20em;
    image-rendering: pixelated;
`

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
    const {url, name} = Monsters[state.type]

    // TODO: Add a common htmx wrapper
    return (<div class={containerClass} id="monster" hx-swap-oob={hx_swap_oob}>
            <h1>{name}</h1>
            <img class={imgClass} src={url} alt="enemy"/>
            <div class={meterContainerClass}>
                <div class={meterText}>{state.health.current} / {state.health.max}</div>
                <meter value={state.health.current} min="0" max={state.health.max} class={meterClass}/>
            </div>
        </div>
    )
}

export default Monster
