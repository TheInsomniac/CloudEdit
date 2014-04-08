$(document).ready(function() {
  "use strict";
  // Globals
  // ---
  // For iframe creation:
  var use_Autoprefixer = false;
  var use_Modernizr = false;
  var use_Normalize = false;

  // Toggle Text Areas from Displaying
  $("#htmlToggle").on("click", function(el) {
    el.preventDefault();
    closeWindow(this, "html");
  });
  $("#cssToggle").on("click", function(el) {
    el.preventDefault();
    closeWindow(this, "css");
  });
  $("#jsToggle").on("click", function(el) {
    el.preventDefault();
    closeWindow(this, "js");
  });
  $("#consoleToggle").on("click", function(el) {
    el.preventDefault();
    $(this).toggleClass("btn-hidden");
    $(".console").toggle();
  });
  $("#previewToggle, #iframeClose").on("click", function(el) {
    el.preventDefault();
    $("#previewToggle").toggleClass("btn-hidden");
    $(".preview, html, body, section, #iframeLabel, #iframeClose").toggleClass("modal-open");
  });

  function closeWindow(el, name) {
    var count = numberOfWindows();
    if (count > 1 || $(el).hasClass("btn-hidden")) {
      $(el).toggleClass("btn-hidden");
      $(".window." + name).toggle();
      resizeWindow();
    } else {
      alert("You Must Have at least one Editor open");
    }
  }

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

  function buildOutput(preview) {
    var contents = {
      html: htmlField.getValue(),
      css: "",
      preview: "",
      js: jsField.getValue(),
      scripts: ""
    };

    if (preview && preview === 'preview') {
      contents["preview"] += '<script src="js/console.min.js"></script>\n'
    }

    if (use_Autoprefixer) {
      var rawCSS = cssField.getValue();
      contents["css"] = autoprefixer({ cascade: true }).process(rawCSS).css;
    } else {
      contents["css"] = cssField.getValue();
    }

    if (use_Modernizr) contents["scripts"] += '<script src="http://cdnjs.cloudflare.com/ajax/libs/modernizr/2.7.1/modernizr.min.js"></script>\n';
    if (use_Normalize) contents["scripts"] += '<link href="http://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.1/normalize.min.css" rel="stylesheet">\n';

    var textToWrite = '<!DOCTYPE html>\n' +
      '<html lang="en">\n' +
      '<head>\n' +
      '<meta charset="UTF-8">\n' +
      '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>\n' +
      contents.scripts +
      '<style>\n' + contents.css + '\n</style>\n' +
      '</head>\n' +
      '<body>\n' + contents.html + '\n' +
      contents.preview +
      '<script>\n' + contents.js + '\n</script>\n' +
      '</body>\n' +
      '</html>';

    return textToWrite;
  }

  // Publish output from HTML, CSS, and JS textareas in the iframe below
  // when "Run" button clicked.
  $("#run").on("click", function(el) {
    el.preventDefault();

    var textToWrite = buildOutput("preview");

    (document.getElementById("iframe").contentWindow.document).write(textToWrite);
    (document.getElementById("iframe").contentWindow.document).close();
  });

  // Download HTML/CSS/JS
  // Source: http://thiscouldbebetter.wordpress.com/2012/12/18/loading-editing-and-saving-a-text-file-in-html5-using-javascrip/
  $("#download").on("click", function() {

    var $download = $("#download")[0];
    var textToWrite = buildOutput();
    var textFileAsBlob = new Blob([textToWrite], {type: "text/plain"});
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
    $("#console").empty();
    sessionStorage.clear();
    (document.getElementById("iframe").contentWindow.document).write("");
    (document.getElementById("iframe").contentWindow.document).close();
  });

  // ContextMenu
  // This is going to get VERY unruly!
  (function() {
    $.contextMenu({
      selector: ".windowGroup",
      "items": {
        "imports": {
          "name": "Imports",
          "items": {
            "autoprefixer": {
              "name": "Autoprefixer",
              "type": "checkbox",
              "selected": false
            },
            "modernizr": {
              "name": "Modernizr",
              "type": "checkbox",
              "selected": false
            },
            "normalize": {
              "name": "CSS Normalize",
              "type": "checkbox",
              "selected": false
            }
          }
        },
        "themes": {
          "name": "Themes",
          "items": {
            "light": {
              "name": "Light",
              "items": {
                "chrome": {
                  "name": "Chrome",
                  "callback": function() {
                    updateTheme("chrome");
                  }
                },
                "dreamweaver": {
                  "name": "Dreamweaver",
                  "callback": function() {
                    updateTheme("dreamweaver");
                  }
                },
                "dawn": {
                  "name": "Dawn",
                  "callback": function() {
                    updateTheme("dawn");
                  }
                },
                "tomorrow": {
                  "name": "Tomorow",
                  "callback": function() {
                    updateTheme("tomorrow");
                  }
                },
                "xcode": {
                  "name": "XCode",
                  "callback": function() {
                    updateTheme("xcode");
                  }
                },
                "kuroir": {
                  "name": "Kuroir",
                  "callback": function() {
                    updateTheme("kuroir");
                  }
                },
                "katzenmilch": {
                  "name": "KatzenMilch",
                  "callback": function() {
                    updateTheme("katzenmilch");
                  }
                }
              }
            },
            "dark": {
              "name": "Dark",
              "items": {
                "ambiance": {
                  "name": "Ambiance",
                  "callback": function() {
                    updateTheme("ambiance");
                  }
                },
                "cloudsmidnight": {
                  "name": "Clouds Midight",
                  "callback": function() {
                    updateTheme("clouds_midnight");
                  }
                },
                "idlefingers": {
                  "name": "Idle Fingers",
                  "callback": function() {
                    updateTheme("idle_fingers");
                  }
                },
                "merbivore": {
                  "name": "Merbivore",
                  "callback": function() {
                    updateTheme("merbivore");
                  }
                },
                "merbivoresoft": {
                  "name": "Merbivore Soft",
                  "callback": function() {
                    updateTheme("merbivore_soft");
                  }
                },
                "monokai": {
                  "name": "Monokai",
                  "callback": function() {
                    updateTheme("monokai");
                  }
                },
                "tomorrownight": {
                  "name": "Tomorrow Night",
                  "callback": function() {
                    updateTheme("tomorrow_night");
                  }
                },
                "twilight": {
                  "name": "Twilight",
                  "callback": function() {
                    updateTheme("twilight");
                  }
                }
              }
            },
            "default": {
              "name": "Default",
              "callback": function() {
                updateTheme("chrome");
              }
            }
          }
        }
      },
      events: {
        show: function(opt) {
          // this is the trigger element
          var $this = this;
          // import states from data store
          $.contextMenu.setInputValues(opt, $this.data());
          // this basically fills the input commands from an object
          // like {name: "foo", yesno: true, radio: "3", …}
        },
        hide: function(opt) {
          // this is the trigger element
          var $this = this;
          // export states to data store
          $.contextMenu.getInputValues(opt, $this.data());
          // this basically dumps the input commands' values to an object
          // like {name: "foo", yesno: true, radio: "3", …}
        }
      }
    });
  })();

  // Get checkbox values from context-menu-input-*
  // and update "global" variables in order to build
  // preview window
  $("input[name*='context-menu-input']").click(function() {
    var checked = $(this).is(":checked");
    var item = $(this)[0].name;
    switch (item) {
      case "context-menu-input-autoprefixer":
        use_Autoprefixer = checked;
        break;
      case "context-menu-input-modernizr":
        use_Modernizr = checked;
        break;
      case "context-menu-input-normalize":
        use_Normalize = checked;
        break;
    }
  });

  // Apply theme and save to localStorage
  function updateTheme(theme) {
    theme = "ace/theme/" + theme;
    htmlField.setTheme(theme);
    cssField.setTheme(theme);
    jsField.setTheme(theme);
    consoleField.setTheme(theme);
    localStorage.setItem("theme", theme);
  }

  // right click on console to clear;
  $(".console").on("contextmenu", function(el) {
    el.preventDefault();
    consoleField.setValue("");
  });

  // Detect a user leaving a page and display a message
  window.onbeforeunload = function (e) {
    // If we haven't been passed the event get the window.event
    e = e || window.event;
    var message = "Your current session will be lost..";
    // For IE6-8 and Firefox prior to version 4
    if (e) e.returnValue = message;
    // For Chrome, Safari, IE8+ and Opera 12+
    return message;
  };

});
