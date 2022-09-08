import {visit, SKIP} from 'unist-util-visit'
import {h} from 'hastscript'

let count = 0 // Keep track of how many code-example elements we've rendered to avoid id collision in tabs

const CodeExample = (properties, children) => {
    // Clean input
    if(typeof(properties.tabs) == typeof('str')) {
        properties.tabs = true;
    } else {
        properties.tabs = false;
    }

    // Construct template hast
    const hast = h('article.code-example', [
        h('.enhanceable_content.tabs.tab-content', [...children])
    ])

    let tabElements = []
    visit(hast, 'element', function (node, index, parent) {
        // Find name, transform it into an <li> and add it to the `tabElements` list, remove from tree
        if(node.tagName == 'name' && properties.tabs) {
            // Transform into link, save node for later in `tabElements` list
            node.tagName = 'a'
            node.properties.href = `#fragment-${count}${tabElements.length+1}`
            tabElements.push(h('li', [node]))

            // Remove all the children preceding the `name` element, and add them back wrapped in the appropriate div
            const children = parent.children.splice(tabElements.length, index+1)
            const div = h(`#fragment-${count}${tabElements.length}`, [
                ...children
            ])
            parent.children.splice(tabElements.length, 0, div)

            // Remove `name` node from tree
            parent.children.splice(index, 1)
            return [SKIP, index]
        }
        

        // take `hast` tree out of "body" wrapper
        if (['body', 'head', 'html'].includes(node.tagName)) {
            parent.children.splice(index, 1, ...node.children)
            // Do not traverse `node`, continue at the node *now* at `index`.
            return [SKIP, index]
        } else {
            return
        }
    })

    // If we need to add tabs...
    if(properties.tabs) {
        // Construct `ul` element for tabs
        const ul = h('ul.tabs-list', [
            ...tabElements
        ])
        // Add `ul` to hast
        hast.children[0].children.splice(0, 0, ul)
    }
    // Add image, if appropriate
    let addImage = false
    if(typeof(properties.src) == typeof('str')) {
        addImage = true
    }
    if(addImage) {
        const src = properties.src.includes('http') ? properties.src : `https://canvas.instructure.com/courses/13038/files/${properties.src}/preview`
        const img = h('.code-example-image-wrapper',[
            h('img.code-example-image', {src:src, alt: properties.alt})
        ])
        hast.children.splice(hast.children.length, 0, img)
    }
    

    // add styles to 'pre' tag
    // visit(hast, 'element', function (node, index, parent) {
    //     if (['pre'].includes(node.tagName)) {
    //         const existingStyles = node.properties.style ? node.properties.style : ""
    //         node.properties.className = ['code-example-code']
    //         node.properties.style = existingStyles+"min-width: 60%; max-height: 400px; overflow: scroll; overflow-x: hidden; -webkit-column-break-inside: avoid; page-break-inside: avoid; break-inside: avoid;"
    //     }
    // })
    count++
    return hast
}
    

export { CodeExample }