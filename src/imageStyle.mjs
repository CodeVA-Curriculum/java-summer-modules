import {visit} from 'unist-util-visit'

// Makes the output only be a body
export default function rehypeImageStyle() {
    return (tree) => {
        visit(tree, 'element', function (node, index, parent) {
            if (['img'].includes(node.tagName) && (!node.properties.className || node.properties.className.length == 0)) {
                node.properties.width="100%"
                parent.properties.className = ["image-wrapper"]
                if(node.properties.src) {
                    node.properties.src=`https://canvas.instructure.com/courses/4198981/files/${node.properties.src}/preview`
                }
            }
        })
    }
}