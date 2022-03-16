import {visit} from 'unist-util-visit'

// Makes the output only be a body
export default function rehypeImageStyle() {
    return (tree) => {
        visit(tree, 'element', function (node, index, parent) {
            if (['img'].includes(node.tagName)) {
                node.properties.width="100%"
                parent.properties.className = ["image-wrapper"]
            }
        })
    }
}