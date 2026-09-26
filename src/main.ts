import { css, l } from "./land.ts";

document.body.appendChild(l('div', _ => {
  _.innerText = 'hello'
  css`
    color: red;
  `.applyTo(_)
}))