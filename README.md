CloudEdit  
===  

####CloudEdit: A client side _jsFiddle_-like HTML Editor.  

- Supports HTML5/CSS3/jQuery1.x development.  
- Multiple themes and syntax highlighting thanks to __ACE__ editor.  
- Download compiled file support for most browsers:
  - Concatenates html/css/js to their inline equivalents for single-file download.  
- Toggle-able editor panes resize automatically based upon how many are displayed.  
- Uses sessionStorage for the current state in case of the 'accidental' browser refresh.  
- Uses localStorage to store the currently selected them for your next use.

__Added:__  
- Rudimentary "view-only" JavaScript console for _console.log_ statements.
  - Unfortunately I have no way of catching "undefined" variables. They still go to the Browser.  
- Preview Modal in case you don't like scrolling or want more of the end-user experience.  
- Context menu on "right-click" over any editor pane.  
  - Theme Chooser for editor windows (changes all).  
  - JS and CSS Imports for the preview window. Currently:  
   - _-prefix-free.js_  
   - _modernizr.js_  
   - _normalize.css_  

![Image1](https://raw.githubusercontent.com/TheInsomniac/CloudEdit/master/img/CloudEdit1.png)  

![Image2](https://raw.githubusercontent.com/TheInsomniac/CloudEdit/master/img/CloudEdit2.png)
