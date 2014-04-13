/*global $:false, ace:false, htmlField:false, cssField:false, jsField:false, consoleField:false*/
(function cloudEdit() {
  "use strict";
  // Globals
  // ---
  // For buildOutput() creation. Toggle includes in html output.
  var use = {
    Autoprefixer: false,
    Less: false,
    Sass: false,
    Modernizr: false,
    Normalize: false,
    Bootstrap: false,
    Foundation: false,
    liveEdit: false
  };

  // ---
  // End Globals

  // Create Text Area panes
  // Init ACE Editor and set options;
  (function initAce() {
    var aceTheme;
    if (localStorage.getItem("theme")) {
      aceTheme = localStorage.getItem("theme");
    } else {
      aceTheme = "ace/theme/chrome";
    }

    // HTML Editor
    window.htmlField = ace.edit("html");
    htmlField.setOptions({
      useWorker: false,
      theme: aceTheme,
      displayIndentGuides: true,
      mode: "ace/mode/html",
      tabSize: 2,
      useSoftTabs: true,
      showPrintMargin: false
    });

    // CSS Editor
    window.cssField = ace.edit("css");
    cssField.setOptions({
      theme: aceTheme,
      displayIndentGuides: true,
      mode: "ace/mode/css",
      tabSize: 2,
      useSoftTabs: true,
      showPrintMargin: false
    });

    // JS Editor
    window.jsField = ace.edit("js");
    jsField.setOptions({
      theme: aceTheme,
      displayIndentGuides: true,
      mode: "ace/mode/javascript",
      tabSize: 2,
      useSoftTabs: true,
      showPrintMargin: false
    });

    // Console
    window.consoleField = ace.edit("console");
    // Hide input cursor
    consoleField.renderer.$cursorLayer.element.style.opacity=0;
    // Disable all pointer events
    consoleField.container.style.pointerEvents="none";
    // Clear highlight after appending output
    consoleField.getSession().selection.on("changeSelection", function() {
      consoleField.clearSelection();
    });
    consoleField.setOptions({
      useWorker: false,
      readOnly: true,
      theme: aceTheme,
      displayIndentGuides: true,
      mode: "ace/mode/javascript",
      highlightActiveLine: false,
      highlightGutterLine: false,
      showPrintMargin: false
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
        $(".html").one("click", function() {
          htmlField.setValue("");
        });
      }
      if (sessionStorage.getItem("css")) {
        cssField.setValue(sessionStorage.getItem("css"));
        cssField.clearSelection();
      }
      if (sessionStorage.getItem("js")) {
        jsField.setValue(sessionStorage.getItem("js"));
        jsField.clearSelection();
      }
    })();

  })();
  // END ACE Editor

  // Toggle Text Areas from Displaying
  $(".togglePane").on("click", function() {
    panes.close(this);
  });
  $("#consoleToggle").on("click", function() {
    $(this).toggleClass("btn-active");
    $(".console").toggle();
  });
  $("#previewToggle, #iframeClose").on("click", function() {
    $("#previewToggle").toggleClass("btn-active");
    $("html").toggleClass("modal-open");
  });

  var panes = {
    // Return the number of editor panes displayed
    count: function() {
      var count = 3;
      var items = $(".windowGroup .column-33");
      items.each(function(el) {
        if ($(items[el]).css("display") === "none") count -= 1;
      });
      return count;
    },
    // Resize panes based upon number currently toggled ON
    resize: function() {
      var count = this.count();
      var win = $(".windowGroup .column-33");
      if (count === 3 || count === 0) {
        win.css("width", "33%");
      } else if (count === 2) {
        win.css("width", "49.5%");
      } else if (count === 1) {
        win.css("width", "99%");
      }
    },
    // On toggling an editor pane resize remaining and toggle button class
    close: function(el) {
      var name = el.dataset.editor;
      var count = this.count();
      if (count > 1 || $(el).hasClass("btn-active")) {
        $(el).toggleClass("btn-active");
        $(".window." + name).parent().toggle();
        this.resize();
      } else {
        alert("You Must Have at least one Editor open");
      }
    }
  };

  // Used by preview and download to compile editor panes and "Imports" into valid html
  function buildOutput(consoleJS) {

    var content = {
      html: htmlField.getValue(),
      style: cssField.getValue(),
      js: jsField.getValue()
    };

    // If using Autoprefixer, load it first via XMLHTTPRequest but do so only once.
    if (use.Autoprefixer && typeof autoprefixer === "undefined") {
      (function loadAutoprefixer() {
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "http://rawgit.com/ai/autoprefixer-rails/master/vendor/autoprefixer.js", false);
        xmlHttp.send(null);
        var ap = document.createElement("script");
        ap.type ="text/javascript";
        ap.text = xmlHttp.responseText;
        document.getElementsByTagName("head")[0].appendChild(ap);
      })();
    }

    // If using Sass, load it first via XMLHTTPRequest but do so only once.
    // We don't want to include it from the get-go as it's 2 Megabytes!!
    //if (use.Sass && !($("#sass").length)) {
    if (use.Sass && typeof Sass === "undefined") {
      (function loadSass() {
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "http://rawgit.com/medialize/sass.js/master/dist/sass.min.js", false);
        xmlHttp.send(null);
        var sass = document.createElement("script");
        sass.id = "sass";
        sass.type = "text/javascript";
        sass.text = xmlHttp.responseText;
        document.getElementsByTagName("head")[0].appendChild(sass);
      })();
    }

    // String to hold elements to build HTML output
    var html = '';
    html += '<html lang="en">\n';
    html += '<head>\n';
    html += '<meta charset="UTF-8">\n';
    if (use.Normalize) {
      html += '<link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.1/normalize.min.css" rel="stylesheet">\n';
    }
    if (use.Bootstrap) {
      html += '<link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet">\n';
    }
    if (use.Foundation) {
      html += '<link href="https://cdnjs.cloudflare.com/ajax/libs/foundation/5.2.2/css/foundation.min.css" rel="stylesheet">\n';
    }
    if (use.Less) {
      html += '<style type="text/less">\n';
    } else {
      html += '<style type="text/css">\n';
    }
    if (use.Autoprefixer) {
      html += autoprefixer({ cascade: true }).process(content.style).css;
    } else if (use.Sass) {
      html += Sass.compile(content.style);
    } else {
      html += content.style;
    }
    html += '\n</style>\n';
    html += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>\n';
    if (use.Bootstrap) {
      html += '<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.1.1/js/bootstrap.min.js"></script>\n';
    }
    if (use.Foundation) {
      html += '<script src="https://cdnjs.cloudflare.com/ajax/libs/foundation/5.2.2/js/foundation/foundation.min.js"></script>\n';
    }
    if (use.Modernizr) {
      html += '<script src="https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.7.1/modernizr.min.js"></script>\n';
    }
    if (use.Less) {
      // Set LESS global variable to turn errorReporting off and mode to production
      html += '<script>\nless={env: "production", errorReporting: null}\n</script>\n';
      html += '<script src="https://cdnjs.cloudflare.com/ajax/libs/less.js/1.7.0/less.min.js"></script>\n';
    }
    html += '</head>\n';
    html += '<body>\n';
    html += content.html;
    // true if previewing in the preview pane; false if called by download function.
    if (consoleJS) {
      html += '<script src="js/console.min.js"></script>\n';
    }
    html += '\n<script>\n';
    html += content.js;
    html += '\n</script>\n';
    html += '</body>\n';
    html += '</html>';

    return html;
  }

  // Toggle live edit/preview mode. It's sometimes slow or doesn't react well.
  $("#liveEdit").on("click", function() {
    use.liveEdit ? use.liveEdit = false:use.liveEdit = true;
    $(this).toggleClass("btn-active");
  });

  // Publish output from HTML, CSS, and JS textareas in the iframe below
  // after given keyup delay if "use.liveEdit: true".
  htmlField.getSession().on("change", function(e) {
    if (use.liveEdit) preview(500);
  });
  cssField.getSession().on("change", function(e) {
    if (use.liveEdit) preview(2000);
  });

  // Update preview window AND js console on click of "Run" button
  $("#run").on("click", function() {
    preview();
  });

  function preview(delay) {
    delay = delay || 0;
    var timer = null;
    if (timer) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(function() {
      timer = null;
      // pass true as we want the pseudo console.js script
      var textToWrite = buildOutput(true);

      (document.getElementById("iframe").contentWindow.document).write(textToWrite);
      (document.getElementById("iframe").contentWindow.document).close();
    }, delay);
  }

  // Download HTML/CSS/JS
  // Source: http://thiscouldbebetter.wordpress.com/2012/12/18/loading-editing-and-saving-a-text-file-in-html5-using-javascrip/
  $("#download").on("click", function() {

    var $download = $("#download")[0];
    // pass false as we don't want the pseudo console.js script
    var textToWrite = buildOutput(false);
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
    htmlField.setValue("");
    cssField.setValue("");
    jsField.setValue("");
    consoleField.setValue("");
    sessionStorage.clear();
    (document.getElementById("iframe").contentWindow.document).write("");
    (document.getElementById("iframe").contentWindow.document).close();
  });

  // right click on console to clear;
  $(".console").on("contextmenu", function(el) {
    el.preventDefault();
    consoleField.setValue("");
  });

  // ContextMenu
  // This is going to get VERY unruly BUT.. it minifies well.
  (function contextMenu() {
    $.contextMenu({
      selector: ".windowGroup",
      "items": {
        "css": {
          "name": "CSS Options",
          "items": {
            "plaincss": {
              "name":"Plain CSS [Default]",
              "type": "radio",
              "radio": "css",
              "value": "plaincss",
              "selected": true
            },
            "autoprefixer": {
              "name": "Autoprefixer",
              "type": "radio",
              "radio": "css",
              "value": "autoprefixer",
              "selected": false
            },
            "less": {
              "name": "Less CSS",
              "type": "radio",
              "radio": "css",
              "value": "less",
              "selected": false
            },
            "sass": {
              "name": "Sass CSS [Experimental]",
              "type": "radio",
              "radio": "css",
              "value": "sass",
              "selected": false
            },
            "normalize": {
              "name": "Normalize CSS",
              "type": "checkbox",
              "selected": false
            },
            "modernizr": {
              "name": "Modernizr",
              "type": "checkbox",
              "selected": false
            }
          }
        },
        "framework": {
          "name": "Frameworks",
          "items": {
            "none": {
              "name": "None [Default]",
              "type": "radio",
              "radio": "framework",
              "value": "none",
              "selected": true
            },
            "bootstrap": {
              "name": "Bootstrap",
              "type": "radio",
              "radio": "framework",
              "value": "bootstrap",
              "selected": false
            },
            "foundation": {
              "name": "Foundation",
              "type": "radio",
              "radio": "framework",
              "value": "foundation",
              "selected": false
            }
          }
        },
        "themes": {
          "name": "Editor Themes",
          "items": {
            "light": {
              "name": "Light",
              "items": {
                "chrome": {
                  "name": "Chrome [Default]",
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
          // import states from data store IF set. If we don't check this
          // then default selected items get cleared on initial load
          if ($.contextMenu.getInputValues(opt, $this.data())) {
            $.contextMenu.setInputValues(opt, $this.data());
          }
        },
        hide: function(opt) {
          // this is the trigger element
          var $this = this;
          // export states to data store
          $.contextMenu.getInputValues(opt, $this.data());
        }
      }
    });
  })();

  // Get checkbox values from context-menu-input-*
  // and update "global" variable "use" in order to build
  // preview window
  // $("input[name*='context-menu-input']").on("click", function() {
  $(".context-menu-list").on("click", "input[name*='context-menu-input']", function() {
    var val = $(this).val();
    if (val) {
      switch (val) {
        // CSS Pre-Processor
        case "plaincss":
          $("#cssLabel").text("CSS");
          cssField.getSession().setMode("ace/mode/css");
          use.Autoprefixer = false;
          use.Less = false;
          use.Sass = false;
          break;
        case "autoprefixer":
          $("#cssLabel").text("CSS");
          cssField.getSession().setMode("ace/mode/css");
          use.Autoprefixer = true;
          use.Less = false;
          use.Sass = false;
          break;
        case "less":
          $("#cssLabel").text("LESS");
          cssField.getSession().setMode("ace/mode/less");
          use.Less = true;
          use.Sass = false;
          use.Autoprefixer = false;
          break;
        case "sass":
          $("#cssLabel").text("SASS");
          cssField.getSession().setMode("ace/mode/sass");
          use.Sass = true;
          use.Less = false;
          use.Autoprefixer = false;
          break;
        // CSS Frameworks
        case "none":
          use.Bootstrap = false;
          use.Foundation = false;
          break;
        case "bootstrap":
          use.Bootstrap = true;
          use.Foundation = false;
          break;
        case "foundation":
          use.Foundation = true;
          use.Bootstrap = false;
          break;
      }
    } else {
      var checked = $(this).is(":checked");
      var item = event.target.name; //$(this)[0].name;
      switch (item) {
        case "context-menu-input-modernizr":
          use.Modernizr = checked;
          break;
        case "context-menu-input-normalize":
          use.Normalize = checked;
          break;
      }
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

  // Detect a user leaving a page and display a message
  window.onbeforeunload = function (e) {
    // Save current buffers into sessionStorage
    sessionStorage.setItem("html", htmlField.getValue());
    sessionStorage.setItem("css", cssField.getValue());
    sessionStorage.setItem("js", jsField.getValue());
    // If we haven't been passed the event get the window.event
    e = e || window.event;
    var message = "Your current session will be lost..";
    // // For IE6-8 and Firefox prior to version 4
    if (e) e.returnValue = message;
    // // For Chrome, Safari, IE8+ and Opera 12+
    return message;
  };

})();
