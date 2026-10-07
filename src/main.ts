import { css, l, lz, sync, type AsyncClassComponent, type ClassComponent, type FnComponent } from "./land.ts";

class CounterExample implements ClassComponent<HTMLDivElement> {
    render(): HTMLDivElement {
        let count = 0

        return lz('div', (_, z) => {
            l(_, 'span', _ => { _.innerText = 'Current count: ' + count })

            l(_, 'button', _ => {
                _.innerText = 'click to increment'
                _.onclick = () => sync([z], count++)
            })
        })
    }
}

class FetchExample implements AsyncClassComponent<HTMLDivElement> {
    render(): Promise<HTMLDivElement> {
        return l('div', async _ => {
            css`
        color:rgb(104, 31, 31);
      `.applyTo(_)

            _.innerText = 'The random number of your day is: ' +
                await (await fetch(
                    'https://www.random.org/integers/?num=1&min=1&max=100&col=5&base=10&format=plain&rnd=new'
                )).text()
        })
    }
}

class GameExample implements ClassComponent<HTMLDivElement> {
    render(): HTMLDivElement {
        let currentMove = 0
        const history: Array<Array<string>> = [
            ['', '', '', '', '', '', '', '', ''],
        ]

        function isWinnerContested() {
            const winPattern = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
                [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6],
            ]
            const board = history[currentMove]

            for (let [a, b, c] of winPattern)
                if (board[a] != '' && board[a] === board[b] && board[a] === board[c])
                    return true

            return false
        }

        function currentPlayer() { return currentMove % 2 == 1 ? 'O' : 'X' }


        return lz('div', (_, z) => {
            l(_, 'div', _ => {
                l(_, 'div', _ => {
                    _.innerText = (isWinnerContested() ? 'Winner: ' : 'Next player: ')
                        + currentPlayer();
                })
                l(_, 'div', _ => {
                    css`
                        display: grid;
                        grid-template-rows: repeat(3, 32px);
                        grid-template-columns: repeat(3, 32px);
                    `.applyTo(_)

                    for (let i = 0; i < 9; i++) {
                        const board = history[currentMove]
                        l(_, 'button', _ => {
                            _.innerText = board[i]
                            _.onclick = () => {
                                if (board[i] != '' || isWinnerContested()) return

                                const newBoard = [...board];
                                newBoard[i] = currentPlayer();
                                sync([z], [history.push(newBoard), currentMove++])
                            }
                        })
                    }
                })
            })
            l(_, 'ol', _ => {
                for (let i = 0; i < history.length; i++)
                    l(_, 'li', _ => {
                        l(_, 'button', _ => {
                            _.innerText = 'Go to ' + (i == 0 ? 'game start' : 'move #' + i)
                            _.onclick = () => { sync([z], currentMove = i) }
                        })
                    })
            })
        })
    }
}

const ui = l('div', _ => {
    css`
    font-size: 18px;
    color: #005143;
  `.applyTo(_)

    _.innerText = 'A simple examples in Land.ts'

    l(_, new FetchExample())
    l(_, new CounterExample())
    l(_, new GameExample())
})

if (ui instanceof Promise)
    ui.then(el => document.body.appendChild(el))
else
    document.body.appendChild(ui)