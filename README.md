# slim-lang-loader

This is a webpack loader to transform [slim](http://slimlang.org) files
into HTML, and then load that HTML into Javascript. This is "true blue"
slim, using the ruby program's CLI executable.

The resulting HTML does not have any boiler added - it can be full
HTML documents or just partials / fragments.

The code here is a modified version of
[coffee-loader](https://github.com/webpack-contrib/coffee-loader).

## howto

1. Make sure the `slim` gem is installed and there is a `slimrb`
executable available.

2. Install this into your project: `npm install --save slim-lang-loader`

3. Add hook to `webpack.config.js` (_make sure to put this above any loader
that expects javascript or coffeescript input_):

    ```js
    {test: /\.slim$/, loader: ['slim-lang-loader']},
    ```    

    Also, add `.slim` to the list of extensions:
  
    ```jsP
    resolve: {
      extensions: ['.js", <etc>, ".slim"]
    },
    ```

4. load templates from javascript:

    ```js
     var file = require("html-loader!./test.slim");
     alert(file); // this will be a html string that auto-reloads 
    ```
