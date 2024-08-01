import {Status} from "../game/types";
import {Row} from "./parts/Row";
import {defenseIcon, poisonIcon, stunIcon} from "../game/shared";
import {css} from "hono/css";

type Props = {
    defense: number
    status: Status
}

const Icon = (props: { src: string }) =>
    <img src={props.src} className={css`height: 24px`}/>

function IconWithNumber(props: { src: string, value: number }) {
    return <>
        <Icon src={props.src}/>
        <div class={css`
            height: 24px;
            width: 20px;
            text-align: center;
            font-size: 14px;
            color: white;
            background-color: black;
            border: 1px solid white;
            margin-left: -1px;
            border-left-width: 0;
        `}>{props.value}</div>
    </>;
}

export function StatusBar(props: Props) {
    return <Row>
        {props.status.stun ? <Icon src={stunIcon}/> : null}
        {props.status.poison ? <IconWithNumber src={poisonIcon} value={props.status.poison}/> : null}
        {props.defense ? <IconWithNumber src={defenseIcon} value={props.defense}/> : null}
    </Row>;
}