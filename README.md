# Land.ts
## Get started
You can download this repo as starter project for Land.ts & Vite.
```typescript
import { css, l } from "./land.ts";

document.body.appendChild(
  l('div', _ => {
    css`
        color: #005143;
    `.applyTo(_)
    _.innerText = 'Hello from Land.ts!'
  })
)
```
## DOM tree building
The overloaded `l` (land) function is used. Thats why Land.ts is Land.ts
### . . Create local tree-root
```typescript
import { l } from "./land.ts";

const aDiv: HTMLDivElement = 
  l('div', newDiv => { 
    // this lambda is __init__ for newDiv
    newDiv.innerText = 'Hello, from Land.ts!'
  })

// Trivially sugared to:
const aDiv: HTMLDivElement =
  l('div', _ => { 
    _.innerText = 'Hello, from Land.ts!'
  })
```
Async init function is not a problem:
```typescript
const aDiv: Promise<HTMLDivElement> =
  l('div', _ => {
    await someAsyncInvokation()
    _.innerText = 'Hello, from Land.ts!'
  })
```

### . . Append to tree-root

### . . Conditional element tree
Nothing special here
```typescript
const root = l('div', _ => {
  const tasks = [
    { isImportant: false, description: 'Go for a walk' },
    { isImportant: true,  description: 'Repair the TV' }
  ]

  for (task of tasks)
    l(_, 'div', _ => {
      if (task.isImportant)
        css`color: red;`.applyTo(_)
      _.innterText = task.description
    })
})
```
## Components
## Rerendering
### . . Simple zone-based rerender
### . . Advanced zone-based rerender
### . . Direct DOM manipulations
Land.ts is just a little wizard for DOM operations in typical SPA cases. There is no constraints to direct DOM manipulation. 
## CSS embedding
Land.ts does not restricts usage of pure CSS but allows to embed styles into components. No magic hanneps - just Vite plugin job.
### . . Embed as new CSS class
```typescript
// project_root/src/Button.ts
import { css, l } from "./land.ts";

class Button implements Component<HTMLDivElement> {
  render(): HTMLDivElement {
    return l('div', _ => {
        css`
            font-size: 16px;
        `.applyTo(_)
    })
  }
}
```

On build time (via Vite plugin) for each __.ts__ file paired __.css__ file will be created in __project_root/.css/__. For each `css` function invocation (via ``) a new css __class__ will be created.

```css
/* project_root/.css/src/Button.ts.css */
.g1 {
    font-size: 16px;
}
```
Original invocation will be transformed:
```typescript
// project_root/src/Button.ts after transform
    return l('div', _ => {
        new Css('g1')
        
          .applyTo(_)
    })
```
`NB: embedded CSS style object is not a fiction! It's a normal JS runtime value with special API.`

```typescript
  const dst: HTMLElement = ...
  const aStyle = css`
    color: black;
  `
  dst.applyTo(aStyle)     // apply  style  to  html element
  dst.unapplyFrom(aStyle) // remove style from html element
  dst.toggleOn(aStyle)    // toggle style  on  html element

```
### . . Embed any CSS code
```typescript
class SectionHeader implements ClassComponent<HTMLDivElement> {
  render(): HTMLDivElement {
    return l('h2', _ => {
      css`
        @media (max-width: 550px) {
          .this-class {
            text-align: center;
          }
        }
      `.apply(_)
    })
  }
}
```
Usage of `.this-class` selector toggles Land.ts into __embed any CSS__ mode. Also __.this-class__ will be replaced with new generated class name, CSS style object will reference this name.
```css
@media (max-width: 550px) {
  .g2 {
    text-align: center;
  }
}
```