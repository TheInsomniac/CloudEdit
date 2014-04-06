$(document).ready(function(){

  // Init ACE Editor and set options;
  var aceTheme;
  if (localStorage.getItem("theme")) {
    aceTheme = localStorage.getItem("theme");
  } else {
    aceTheme = "ace/theme/chrome";
  }

  var htmlField = ace.edit("html");
  htmlField.session.setUseWorker(false);
  htmlField.setTheme(aceTheme);
  htmlField.setDisplayIndentGuides(true);
  htmlField.getSession().setMode("ace/mode/html");
  htmlField.getSession().setTabSize(2);
  htmlField.getSession().setUseSoftTabs(true);

  var cssField = ace.edit("css");
  cssField.setTheme(aceTheme);
  cssField.setDisplayIndentGuides(true);
  cssField.getSession().setMode("ace/mode/css");
  cssField.getSession().setTabSize(2);
  cssField.getSession().setUseSoftTabs(true);

  var jsField = ace.edit("js");
  jsField.setTheme(aceTheme);
  jsField.setDisplayIndentGuides(true);
  jsField.getSession().setMode("ace/mode/javascript");
  jsField.getSession().setTabSize(2);
  jsField.getSession().setUseSoftTabs(true);

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

  // Toggle Text Areas from Displaying
  $("#htmlToggle").on("click", function(){
    var count = numberOfWindows();
    if (count > 1 || $(this).hasClass("btn-hidden")) {
      $(this).toggleClass("btn-hidden");
      $(".window.html").toggle();
      resizeWindow();
    } else {
      alert("You Must Have at least one Editor open");
    }
  });
  $("#cssToggle").on("click", function(){
    var count = numberOfWindows();
    if (count > 1 || $(this).hasClass("btn-hidden")) {
      $(this).toggleClass("btn-hidden");
      $(".window.css").toggle();
      resizeWindow();
    } else {
      alert("You Must Have at least one Editor open");
    }
  });
  $("#jsToggle").on("click", function(){
    var count = numberOfWindows();
    if (count > 1 || $(this).hasClass("btn-hidden")) {
      $(this).toggleClass("btn-hidden");
      $(".window.js").toggle();
      resizeWindow();
    } else {
      alert("You Must Have at least one Editor open");
    }
  });

  function resizeWindow() {
    var count = numberOfWindows();
    var win = $(".window");
    if (count === 3 || count === 0) {
      win.css("width", "33%");
    } else if (count === 2) {
      win.css("width", "49.5%");
    } else if (count === 1) {
      win.css("width", "100%");
    }
  }

  function numberOfWindows() {
    var count = 3;
    var items = $(".window");
    items.each(function(el) {
      if ($(items[el]).css("display") === "none") count -= 1;
    });
    return count;
  }

  // Publish output from HTML, CSS, and JS textareas in the iframe below
  // when "Run" button clicked.
  $("#run").on("click", function() {
    var contents = {
      html: htmlField.getValue(),
      css: cssField.getValue(),
      js: jsField.getValue()
    };

    (document.getElementById("preview").contentWindow.document).write(
      '<!DOCTYPE html>\n' +
      '<html lang="en">\n' +
      '<head>\n' +
      '<meta charset="UTF-8">\n' +
      '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>\n' +
      '<style>\n' + contents.css + '\n</style>\n' +
      '</head>\n' +
      '<body>\n' + contents.html + '\n' +
      '<script>\n' + contents.js + '\n</script>\n' +
      '</body>\n' +
      '</html>'
    );
    (document.getElementById("preview").contentWindow.document).close();
  });

  // Clear editors with "Clear" button
  $("#clear").on("click", function() {
    // htmlField.setValue("");
    htmlField.setValue("<!-- Do not place html/head/body tags here.\n" +
      "Insert the tags as would normally be used in your\n" +
      "body element. <script> tags ARE allowed, though\n" +
      "they're best placed at the end of your HTML -->\n");
    htmlField.clearSelection();
    cssField.setValue("");
    jsField.setValue("");
    sessionStorage.clear();
    (document.getElementById("preview").contentWindow.document).write("");
    (document.getElementById("preview").contentWindow.document).close();
  });

  // Download HTML/CSS/JS
  // Source: http://thiscouldbebetter.wordpress.com/2012/12/18/loading-editing-and-saving-a-text-file-in-html5-using-javascrip/
  $("#download").on("click", function() {
    var $download = $("#download")[0];
    var contents = {
      html: htmlField.getValue(),
      css: cssField.getValue(),
      js: jsField.getValue()
    };
    var textToWrite = '<!DOCTYPE html>\n' +
      '<html lang="en">\n' +
      '<head>\n' +
      '<meta charset="UTF-8">\n' +
      '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>\n' +
      '<style>\n' + contents.css + '\n</style>\n' +
      '</head>\n' +
      '<body>\n' + contents.html + '\n' +
      '<script>\n' + contents.js + '\n</script>\n' +
      '</body>\n' +
      '</html>';

    var textFileAsBlob = new Blob([textToWrite], {type:"text/plain"});
    var fileNameToSaveAs = "index.html";

    $download.download = fileNameToSaveAs;

    if (typeof window.webkitURL === "function") {
      // Chrome
      $download.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
      // Firefox
      $download.href = window.URL.createObjectURL(textFileAsBlob);
    }
  });

  // Theme contextMenu
  // Themes List
  var menu = [
    {
      name: "Light Themes",
      subMenu: [
        {
          name: "Chrome",
          fun: function () {
            updateTheme("chrome");
          }
        },
        {
          name: "Dreamweaver",
          fun: function () {
            updateTheme("dreamweaver");
          }
        },
        {
          name: "Dawn",
          fun: function () {
            updateTheme("dawn");
          }
        },
        {
          name: "Tomorow",
          fun: function () {
            updateTheme("tomorrow");
          }
        },
        {
          name: "XCode",
          fun: function () {
            updateTheme("xcode");
          }
        },
        {
          name: "Kuroir",
          fun: function () {
            updateTheme("kuroir");
          }
        },
        {
          name: "KatzenMilch",
          fun: function () {
            updateTheme("katzenmilch");
          }
        }
      ]
    },
    {
      name: "Dark Themes",
      subMenu: [
        {
          name: "Ambiance",
          fun: function () {
            updateTheme("ambiance");
          }
        },
        {
          name: "Clouds Midight",
          fun: function () {
            updateTheme("clouds_midnight");
          }
        },
        {
          name: "Idle Fingers",
          fun: function () {
            updateTheme("idle_fingers");
          }
        },
        {
          name: "Merbivore",
          fun: function () {
            updateTheme("merbivore");
          }
        },
        {
          name: "Merbivore Soft",
          fun: function () {
            updateTheme("merbivore_soft");
          }
        },
        {
          name: "Monokai",
          fun: function () {
            updateTheme("monokai");
          }
        },
        {
          name: "Tomorrow Night",
          fun: function () {
            updateTheme("tomorrow_night");
          }
        },
        {
          name: "Twilight",
          fun: function () {
            updateTheme("twilight");
          }
        }
      ]
    },
    {
      name:"Default",
      fun:function() {
        updateTheme("chrome");
      }
    }
  ];

  // Apply theme and save to localStorage
  function updateTheme(theme) {
    theme = "ace/theme/" + theme;
    htmlField.setTheme(theme);
    cssField.setTheme(theme);
    jsField.setTheme(theme);
    localStorage.setItem("theme", theme);
  }

  // On right-click in one of the editor panes
  $(".window").contextMenu(menu,{
    triggerOn:"contextmenu",
    displayAround:"cursor"
  });
});
