import {TicTacToeState} from "../games/tictactoe";
import Board from "./Board";
import './GamePage.css'
import {css} from "hono/css";

const GamePage = (props: { state: TicTacToeState, id: string }) => {
    return <div>

        <html lang="en">
        <head>
            <meta charSet="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <script src="https://unpkg.com/htmx.org@1.9.12/dist/htmx.js"
                    integrity="sha384-qbtR4rS9RrUMECUWDWM2+YGgN3U4V4ZncZ0BvUcg9FGct0jqXz3PUdVpU1p0yrXS"
                    crossOrigin="anonymous"></script>
            {/*<script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/ws.js"></script>*/}
            <title>Shop</title>
            <style>
                {css`
                    #board {
                        display: grid;
                        grid-template-columns: repeat(3, 100px);
                        grid-gap: 10px;
                        margin-top: 20px;
                    }
                `}
            </style>
        </head>
        <body>
        <div>TicTacToe!</div>
        <Board gameId={props.id} state={props.state}/>
        </body>
        </html>
    </div>
}

export default GamePage