import {visit} from 'unist-util-visit'
import css from 'css'

export default function rehypeInjectStyles() {
    return (tree) => {
        visit(tree, 'element', (node) => {
            if (['style'].includes(node.tagName)) {
              const cast = css.parse(node.children[0].value); // Get an AST object of the CSS
              for(const rule of cast.stylesheet.rules) {
                  for(const selector of rule.selectors) {
                      visit(tree, 'element', (node) => {
                          if(selector.includes(node.tagName)) {
                              if (!node.properties.style) {
                                  node.properties.style = ""
                              }
                              node.properties.style+=`${selector}{`
                              for(let i=0;i<rule.declarations.length;i++) {
                                  const d = rule.declarations[i]
                                  node.properties.style+=`${d.property}:${d.value};`
                              }
                              node.properties.style+='}'
                          }
                      })
                  }
              }
            }
        })
    }
}