import './GamePage.css'
import {css, Style} from "hono/css";
import {PropsWithChildren} from 'hono/jsx'


const Layout = (props: PropsWithChildren) => {
    return <div>
        <html lang="en">
        {/*<meta http-equiv="refresh" content="1"/>*/}
        <head>
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
            <title>Shop</title>
            <Style>{css`

                * {
                    outline: 1px solid red;
                }
                
                .game {
                    display: flex;
                    flex-direction: column;
                    gap: 1em;
                    justify-items: center;
                    align-items: center;
                }

                body {
                    font-family: "Pixelify Sans", system-ui;
                }

                .card {
                    border: 3px solid black;
                    background-color: darkolivegreen;
                    color: gainsboro;
                    /*font-family: Inter, sans-serif;*/
                    padding: 1em;
                    display: flex;
                    flex-direction: column;
                    gap: 0.7em;
                    height: 15em;
                    width: 10em;
                    justify-content: start;
                    align-items: center;
                    cursor: pointer;
                }

                .card > .header {
                    color: whitesmoke;
                    font-weight: bold;
                }

                .card > .description {
                    font-size: 1em;
                }


            `}</Style>
        </head>
        <body>
        {props.children}
        </body>
        </html>
    </div>
}

export default Layout