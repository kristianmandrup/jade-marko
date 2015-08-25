Jade compilation for Markoa templates
=====================================

Getting Started
---------------

Install the module with: `npm install jade-markoa`

Use the `jadeMarko` transformation to compile jade files to marko files. Jade doesn't care about the tag name, so we can use it with marko tags and custom tags without any problem :)

```javascript
gulp.task('jade:marko', function() {
  // custom jade compilation with Pencil using jade API
  gulp.src(['apps/**/*.jade'])
      .pipe(jadeMarko())
      .pipe(gulp.dest('./apps'))
});
```

### Gotchas!

In order for Jade to work correctly with Marko, there are a few little gotchas. Both Jade and Marko use the same special keywords for constructs, such as:

-	if
-	else
-	var

In order for Jade to not treat these as Jade language constructs, use `x-` equivalents like this:

```jade
xvar(a='17')
xif(test='a = b')
  $data.a
xelse-if(test='a = c')
  $data.c
xelse
  $data.d
```

Otherwise you are "good to go" with the usual Jade syntax. You can even mix in with Jade conditional logic if you like ;)

### Example

`layout.jade`

```jade
doctype html
html
  head
    block title
      title Default title
  body
    block content
```

`index.jade`

```jade
extends layout.jade
block title
  title Article Title

block content
  h1 My Article

  async-fragment(data="data")

  xvar(a='17')
  xif(test='a = b')
    $data.a
  xelse-if(test='a = c')
    $data.c
  xelse
    $data.d
```

Testing
-------

Delete the `.marko` files in `apps/index`. Run `gulp jade:marko` and check that `apps/index` now contains `.marko` files for the jade templates.

`index.marko`

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Article Title</title>
  </head>
  <body>
    <h1>My Article</h1>
    <async-fragment data="data"></async-fragment>
    <var a="17"></var>
    <if test="a = b">$data.a</if>
    <else-if test="a = c">$data.c</else-if>
    <else>$data.d</else>
  </body>
</html>
```

Contributing
------------

Please submit all issues and pull requests to the [kristianmandrup/jade-markoa](https://github.com/kristianmandrup/jade-markoa) repository!

Support
-------

If you have any problem or suggestion please open an issue [here](https://github.com/kristianmandrup/jade-markoa/issues).

License
-------

The MIT License

Copyright (c) 2015, Kristian Mandrup

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
