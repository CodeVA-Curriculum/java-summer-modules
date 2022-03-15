import {visit} from 'unist-util-visit'

const wrapperStyle = "max-width:800px;margin: 0 auto;"

export default function rehypeCanvasWrapper() {
    return (tree) => {
        visit(tree, 'element', function(node) {
            if (['body'].includes(node.tagName)) {
                node.tagName='div'
                node.properties.style=wrapperStyle
            }
        })
    }
}