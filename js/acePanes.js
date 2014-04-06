// Init ACE Editor and set options;
var aceTheme;
if (localStorage.getItem("theme")) {
  aceTheme = localStorage.getItem("theme");
} else {
  aceTheme = "ace/theme/chrome";
}

// HTML Editor
var htmlField = ace.edit("html");
htmlField.session.setUseWorker(false);
htmlField.setTheme(aceTheme);
htmlField.setDisplayIndentGuides(true);
htmlField.getSession().setMode("ace/mode/html");
htmlField.getSession().setTabSize(2);
htmlField.getSession().setUseSoftTabs(true);

// CSS Editor
var cssField = ace.edit("css");
cssField.setTheme(aceTheme);
cssField.setDisplayIndentGuides(true);
cssField.getSession().setMode("ace/mode/css");
cssField.getSession().setTabSize(2);
cssField.getSession().setUseSoftTabs(true);

// JS Editor
var jsField = ace.edit("js");
jsField.setTheme(aceTheme);
jsField.setDisplayIndentGuides(true);
jsField.getSession().setMode("ace/mode/javascript");
jsField.getSession().setTabSize(2);
jsField.getSession().setUseSoftTabs(true);

// Console
var consoleField = ace.edit("console");
consoleField.session.setUseWorker(false);
consoleField.setTheme(aceTheme);
consoleField.getSession().setMode("ace/mode/javascript");
consoleField.setReadOnly(true);
consoleField.setHighlightActiveLine(false);
consoleField.setHighlightGutterLine(false);
consoleField.renderer.$cursorLayer.element.style.opacity=0;
consoleField.container.style.pointerEvents="none";
consoleField.setShowPrintMargin(false);
consoleField.getSession().selection.on("changeSelection", function() {
  consoleField.clearSelection();
});

// Retrieve values from sessionStorage if set
(function sessionStorageGet() {
  if (sessionStorage.getItem("html")) {
    htmlField.setValue(sessionStorage.getItem("html"));
    htmlField.clearSelection();
  } else {
    htmlField.setValue("<!-- Do not place html/head/body tags here.\n" +
      "Insert the tags as would normally be used in your\n" +
      "body element. <script> tags ARE allowed, though\n" +
      "they're best placed at the end of your HTML -->\n");
    htmlField.clearSelection();
  }
  if (sessionStorage.getItem("css")) {
    cssField.setValue(sessionStorage.getItem("css"));
    cssField.clearSelection();
  }
  if (sessionStorage.getItem("js")) {
    jsField.setValue(sessionStorage.getItem("js"));
    jsField.clearSelection();
  }
}());

// Store data in sessionStorage to prevent data loss on window reload
(function sessionStorageSet() {
  htmlField.getSession().on("change", function(e) {
    sessionStorage.setItem("html", htmlField.getValue());
  });
  cssField.getSession().on("change", function(e) {
    sessionStorage.setItem("css", cssField.getValue());
  });
  jsField.getSession().on("change", function(e) {
    sessionStorage.setItem("js", jsField.getValue());
  });
}());
