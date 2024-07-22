import './GamePage.css'
import {css, Style} from "hono/css";
import {PropsWithChildren} from 'hono/jsx'


const Layout = (props: PropsWithChildren) => {
    return <div>
        <html lang="en">
        <meta http-equiv="refresh" content="1"/>
        <head>
            <meta charSet="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <script src="https://unpkg.com/htmx.org@1.9.12/dist/htmx.js"
                    integrity="sha384-qbtR4rS9RrUMECUWDWM2+YGgN3U4V4ZncZ0BvUcg9FGct0jqXz3PUdVpU1p0yrXS"
                    crossOrigin="anonymous"></script>
            {/*<script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/ws.js"></script>*/}
            <title>Shop</title>
            <Style>{css`
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
                
                .hand {
                    display: flex;
                    gap: 0.5em;
                }

                .card {
                    border-radius: 0.5em;
                    border: 1px solid black;
                    background-color: rgb(220, 224, 230);
                    background-color: darkolivegreen;
                    color: gainsboro;
                    /*font-family: Inter, sans-serif;*/
                    padding: 0.5em;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5em;
                    height: 12em;
                    width: 9em;
                    justify-content: start;
                    align-items: center;
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