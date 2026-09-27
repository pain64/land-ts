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

const ui = l('div', _ => {
  css`
    font-size: 18px;
    color: #005143;
  `.applyTo(_)

  _.innerText = 'A simple examples in Land.ts'

  new (class implements ClassComponent<HTMLDivElement> {
    render(): HTMLDivElement {
      return l('div', _ => {})
    }
  })

  // FunctionComponent<H>
  const fx2: FnComponent<HTMLDivElement> = () => l('div', _ => {})

  const fx = () => l('div', _ => {})

  l(_, new FetchExample())
  l(_, new CounterExample())
})

if (ui instanceof Promise)
  ui.then(el => document.body.appendChild(el))
else
  document.body.appendChild(ui)