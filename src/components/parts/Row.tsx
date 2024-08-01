import {PropsWithChildren} from "hono/jsx";
import {css} from "hono/css";

export const Row = ({style, children}: PropsWithChildren<{ style?: Promise<string> }>) => {
    const s = css`
        display: flex;
        ${style};
    `

    return <div class={s}>
        {children}
    </div>

}