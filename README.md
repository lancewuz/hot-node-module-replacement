# hot-node-module-replacement

Hot Node Module Replacement for node.js in server side

This module is designed to complete Hot Module Replacement of unpacked code in server side when using Server Side Render. This module is expected to be used only in development environment, along with [babel-register](https://github.com/babel/babel/tree/master/packages/babel-register) to transform the code. So that, the code in server side don't need to be packed by Webpack.

when a parent file import a child file, the module.exports Objects of the child file are used by the parent file. This module saves the module.exports Objects of the child file. when files change, the content of the corresponding module.exports Objects will be replaced, so that the parent file is hot replaced.

## Installation

```js
  npm install --save-dev hot-node-module-replacement
```

## Usage

Put this code in your server side code before the 'require('[hot module]') statements.

```js
  require('hot-node-module-replacement')({
    extenstions: ['.js', '.jsx']
  });
```

when using Server Side Rendering, babel-register will be used, and this module should be put after the babel-register code.

```js
  require("babel-register")({
    extensions: [".jsx", ".js"]
  });
  require('hot-node-module-replacement')({
    extenstions: ['.js', '.jsx']
  });
```

## Options

#### extenstions

Specify extenstions of files which should be hot replaced

#### ignoreNodeModules

ignore node modules

#### matchFn

a match function to judge which files should be hot replaced

## Example

an example is put in the folder './example'.