import './GamePage.css'
import {css, Style} from "hono/css";
import {PropsWithChildren} from 'hono/jsx'


const Layout = (props: PropsWithChildren) => {
    return <html lang="en">
    {/*<meta http-equiv="refresh" content="1"/>*/}
    <head>
        <script src="https://d3js.org/d3.v6.min.js"></script>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <Style>{css`
            /*
1. Use a more-intuitive box-sizing model.
*/

            *, *::before, *::after {
                box-sizing: border-box;
            }

            /*
              2. Remove default margin
            */

            * {
                margin: 0;
            }

            /*
              Typographic tweaks!
              3. Add accessible line-height
              4. Improve text rendering
            */

            body {
                line-height: 1.5;
                -webkit-font-smoothing: antialiased;
            }

            /*
              5. Improve media defaults
            */

            img, picture, video, canvas, svg {
                display: block;
                max-width: 100%;
            }

            /*
              6. Remove built-in form typography styles
            */

            input, button, textarea, select {
                font: inherit;
            }

            /*
              7. Avoid text overflows
            */

            p, h1, h2, h3, h4, h5, h6 {
                overflow-wrap: break-word;
            }

            /*
              8. Create a root stacking context
            */

            #root, #__next {
                isolation: isolate;
            }

            button {
                border: none;
            }
        `}
        </Style>
        <script src="https://unpkg.com/htmx.org@1.9.12/dist/htmx.js"
                integrity="sha384-qbtR4rS9RrUMECUWDWM2+YGgN3U4V4ZncZ0BvUcg9FGct0jqXz3PUdVpU1p0yrXS"
                crossOrigin="anonymous"></script>
        {/*<script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/ws.js"></script>*/}
        <title>Deckbuilder Game</title>
        <Style>{css`

            //* {
            //    outline: 1px solid red;
            //}


            .game {
                display: flex;
                flex-direction: column;
                justify-items: center;
                align-items: center;
            }

            body {
                font-family: "Pixelify Sans", system-ui;
                background-color: darkslategray;
            }

            .card {
                border: 3px solid black;
                background-color: darkolivegreen;
                color: gainsboro;
                /*font-family: Inter, sans-serif;*/
                padding: 0.5em;
                display: flex;
                flex-direction: column;
                gap: 0.7em;
                height: 14em;
                width: 7em;
                justify-content: start;
                align-items: center;
                cursor: pointer;
                font-size: 0.8em;
                transform-origin: bottom center;
                position: relative;
                transition: transform 0.3s, background-color 0.1s;
                user-select: none;
            }

            .card:hover {
                background-color: olive;
                transform: scale(1.05);
            }

            .card > .header {
                color: whitesmoke;
                font-weight: bold;

            }

            .card > .description {
            }


        `}</Style>
    </head>
    <body>
    {props.children}
    </body>
    </html>
}

export default Layout