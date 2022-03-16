import {read} from 'to-vfile'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkRehype from 'remark-rehype'
import remarkDirective from 'remark-directive'
import remarkDirectiveRehype from 'remark-directive-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeDocument from 'rehype-document'
import remarkExtract from 'remark-extract-frontmatter'
import rehypeInline from 'rehype-inline'
import rehypeInjectStyles from './injectStyles.mjs'
import rehypeDecapitate from './decapitate.mjs'
import rehypeCanvasWrapper from './canvasWrapper.mjs'
import rehypeFormat from 'rehype-format'
import rehypeComponents from 'rehype-components'
import yaml from 'yaml'
import {h} from 'hastscript'
import {YouTube} from './components/youtube/index.mjs'
import {Collapse} from './components/collapse/index.mjs'
import {Callout} from './components/callout/index.mjs'
import remarkGfm from 'remark-gfm'
import behead from 'remark-behead'
// const YouTube = (properties, children) =>
  

async function renderFile(path) {
    const html = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(behead, { depth: 1})
    .use(remarkExtract, {yaml:yaml.parse, name:'frontmatter'})
    .use(remarkFrontmatter, ['yaml'])
    // .use(() => (tree) => {
    //   console.dir(tree)
    // })
    .use(remarkDirective)
    .use(remarkDirectiveRehype)
    .use(remarkRehype)
    .use(rehypeComponents, {
      components: {
            'youtube': YouTube,
            'collapse': Collapse,
            'callout': Callout
        },
    })
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
    .use(rehypeCanvasWrapper)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(await read(path))
    return html;
}

export {renderFile}