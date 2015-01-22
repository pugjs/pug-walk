'use strict';

module.exports = walkAST;
function walkAST(ast, before, after) {
  function replace(replacement) {
    ast = replacement;
  }
  var result = before && before(ast, replace);
  if (before && result === false) {
    return ast;
  }
  switch (ast.type) {
    case 'NamedBlock':
    case 'Block':
      ast.nodes = ast.nodes.map(function (node) {
        return walkAST(node, before, after);
      });
      break;
    case 'Case':
    case 'Each':
    case 'Mixin':
    case 'Tag':
    case 'When':
    case 'Code':
      if (ast.block) {
        ast.block = walkAST(ast.block, before, after);
      }
      break;
    case 'Extends':
    case 'Include':
      // arguably we should walk into the asts, but that's not what the linker wants
      if (ast.ast) {
        //ast.ast = walkAST(ast.ast, before, after);
      }
      break;
    case 'Attrs':
    case 'BlockComment':
    case 'Comment':
    case 'Doctype':
    case 'Filter':
    case 'Literal':
    case 'MixinBlock':
    case 'Text':
      break;
    default:
      throw new Error('Unexpected node type ' + ast.type);
      break;
  }
  after && after(ast, replace);
  return ast;
};
