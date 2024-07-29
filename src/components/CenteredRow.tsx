import {PropsWithChildren} from "hono/jsx";
import {css} from "hono/css";

export function CenteredRow({children, style, outerStyle, maxWidth}: PropsWithChildren<{
    style?: Promise<string>,
    outerStyle?: Promise<string>,
    maxWidth: string
}>) {
    const wrapperStyle = css`
        width: 100%;
        display: flex;
        justify-content: center;
        ${outerStyle};
    `
    const innerStyle = css`
        display: flex;
        gap: 2em;
        max-width: ${maxWidth};
        width: 100%;
        ${style};
    `

    return <div class={wrapperStyle}>
        <div class={innerStyle}>
            {children}
        </div>
    </div>;
}