import { defineConfig } from 'vite'
import path from 'node:path';
import fs from 'node:fs';

const fileRegex = /\.(ts)$/
const cssExprRegex = /css`([^`]*)`/gs
const cssPropertiesEntryRegex = /^\s*[A-Za-z-_0-9]+\s*:/
const cssPropertiesEntryRegex2 = /^\s*&/

function landTsPlugin() {

    let counter = 0

    return {
        name: 'transform-file',

        transform(src, id) {
            if (fileRegex.test(id)) {
                // FIXME: починить this-class


                const xxx = process.cwd() + '/.css/' + path.relative(
                    process.cwd() + '/src/', path.dirname(id) + '/' +
                    path.basename(id, '.ts') + '.css'
                )
                const yyy = path.relative(path.dirname(id), path.dirname(xxx)) + '/' + path.basename(id, '.ts') + '.css'

                console.log(xxx)
                console.log(id)
                console.log(yyy)

                const dirName = path.dirname(id);

                const imports = []
                const cssBlocks = []

                const newCode = (src).replace(cssExprRegex, (_, cssCode) => {
                    const classId = counter++;
                    const className = '.g' + classId;

                    const processed =
                        (
                            cssPropertiesEntryRegex.test(cssCode) ||
                            cssPropertiesEntryRegex2.test(cssCode)
                        )
                            ? `${className} {\n${cssCode}\n}`
                            : cssCode.replace('.this-class', className);


                    cssBlocks.push(processed)
                    return `new Css(${classId})`
                })

                if (cssBlocks.length != 0)
                    imports.push(yyy)

                fs.mkdirSync(path.dirname(xxx), { recursive: true })
                fs.writeFileSync(
                    xxx, cssBlocks.join('\n')
                )

                let libImport = path.relative(dirName, process.cwd() + '/src/land.ts')
                if (!libImport.startsWith('..')) libImport = './' + libImport

                const withImports =
                    (cssBlocks.length == 0 ? '' : `import { Css } from "${libImport}";\n`) +
                    imports.map(i => `import "./${i}";`).join('\n') + '\n'
                    + newCode

                return {
                    code: withImports, map: null
                }
            }
        },
    }
}

export default defineConfig({
    build: { sourcemap: true },
    plugins: [landTsPlugin()]
})