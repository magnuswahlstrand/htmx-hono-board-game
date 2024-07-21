import {TicTacToeState} from "../games/tictactoe";
import Board from "./Board";
import './GamePage.css'

const GamePage = (props: { state: TicTacToeState }) => {
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
                {`
                #board {
                    display: grid;
                    grid-template-columns: repeat(3, 100px);
                    grid-gap: 10px;
                    margin-top: 20px;
                }
                
                .cell {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100px;
                    height: 100px;
                    border: 1px solid black;
                }
                `}
            </style>
        </head>
        <body>
        <div>TicTacToe!</div>
        <Board state={props.state}/>
        </body>
        </html>
    </div>
}

export default GamePage