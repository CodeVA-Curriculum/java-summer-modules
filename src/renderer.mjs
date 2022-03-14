import {read} from 'to-vfile'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkRehype from 'remark-rehype'
import remarkDirective from 'remark-directive'
import remarkDirectiveRehype from 'remark-directive-rehype'
import rehypeStringify from 'rehype-stringify'
import addClasses from 'rehype-add-classes'
import rehypeDocument from 'rehype-document'
import remarkExtract from 'remark-extract-frontmatter'
import rehypeInline from 'rehype-inline'
import rehypeInjectStyles from './injectStyles.mjs'
import rehypeDecapitate from './decapitate.mjs'
import rehypeCanvasWrapper from './canvasWrapper.mjs'
import rehypeFormat from 'rehype-format'
import yaml from 'yaml'


async function renderFile(path) {
    const html = await unified()
    .use(remarkParse)
    .use(remarkExtract, {yaml:yaml.parse, name:'frontmatter'})
    .use(remarkFrontmatter, ['yaml'])
    // .use(() => (tree) => {
    //   console.dir(tree)
    // })
    .use(remarkDirective)
    .use(remarkDirectiveRehype)
    .use(remarkRehype)
    // .use(rehypeComponents, {
    // //   components: {
    // //     'ingredients': Ingredients
    // //     // 'inline-code': InfoBox,
    // //     // 'copyright-notice': CopyrightNotice,
    // //     },
    // })
    // .use(rehypeInline)
    // .use(addClasses, {
    //   h1: 'title',
    //   body: 'section'
    //   // TODO: add classes
    // }
    .use(rehypeDocument, {
        css: './src/main.css'
    })
    .use(rehypeInline, {
        js: false,
        css: true,
        images: false,
        imports: false,
        svgElements: false,
    })
    .use(rehypeInjectStyles)
    .use(rehypeDecapitate)
    // .use(rehypeCanvasWrapper)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(await read(path))
    return html;
}

async function writeToFile(path) {
    
}

export {renderFile}