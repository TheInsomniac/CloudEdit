CloudEdit
===

####CloudEdit: A client side _jsFiddle_-like HTML Editor.

- Supports HTML5/CSS3/jQuery1.x development.
- Multiple themes and syntax highlighting thanks to __ACE__ editor.
- Download compiled file support for most browsers:
  - Concatenates html/css/js to their inline equivalents for single-file download.
- Toggle-able editor panes resize automatically based upon how many are displayed.
- Uses sessionStorage for the current state in case of the 'accidental' browser refresh.
- Uses localStorage to store the currently selected theme for your next use.

__Added:__

<del>- Rudimentary "view-only" JavaScript console for _console.log_ statements.
  - Unfortunately I have no way of catching "undefined" variables. They still go to the Browser.</del>
- jqConsole from [repl.it](https://github.com/replit/jq-console) for complete js console.
- Preview Modal in case you don't like scrolling or want more of the end-user experience.
- Context menu on "right-click" over any editor pane.
  - Theme Chooser for editor windows (changes all).
  - JS and CSS Imports for the preview window. Currently:
   - _autoprefixer.js_
   - _modernizr.js_
   - _normalize.css_
   - _LESS.css_
   - _SASS.css_ : __Experimental. The minified js is 2 Megabytes!__
  - Frameworks:
    - _Bootstrap 3 CSS & JS_
    - _Foundation CSS & JS_
- Downloaded HTML file now includes CDN versions of selected JS/CSS Imports as
  well as autoprefixing all embedded CSS if _autoprefixer_ chosen as an import.
- Appcache manifest for offline caching of resources and quicker future loading.
- Save current session to localStorage for persistence.
- Load previous session from localStorage into current panes.

![Image1](https://raw.githubusercontent.com/TheInsomniac/CloudEdit/master/img/CloudEdit1.png)

![Image2](https://raw.githubusercontent.com/TheInsomniac/CloudEdit/master/img/CloudEdit2.png)
