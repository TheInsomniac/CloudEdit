$(document).ready(function() {

  // Toggle Text Areas from Displaying
  $("#htmlToggle").on("click", function(el) {
    el.preventDefault();
    var count = numberOfWindows();
    if (count > 1 || $(this).hasClass("btn-hidden")) {
      $(this).toggleClass("btn-hidden");
      $(".window.html").toggle();
      resizeWindow();
    } else {
      alert("You Must Have at least one Editor open");
    }
  });
  $("#cssToggle").on("click", function(el) {
    el.preventDefault();
    var count = numberOfWindows();
    if (count > 1 || $(this).hasClass("btn-hidden")) {
      $(this).toggleClass("btn-hidden");
      $(".window.css").toggle();
      resizeWindow();
    } else {
      alert("You Must Have at least one Editor open");
    }
  });
  $("#jsToggle").on("click", function(el) {
    el.preventDefault();
    var count = numberOfWindows();
    if (count > 1 || $(this).hasClass("btn-hidden")) {
      $(this).toggleClass("btn-hidden");
      $(".window.js").toggle();
      resizeWindow();
    } else {
      alert("You Must Have at least one Editor open");
    }
  });
  $("#consoleToggle").on("click", function(el) {
    el.preventDefault();
    $(this).toggleClass("btn-hidden");
    $(".console").toggle();
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
  $("#run").on("click", function(el) {
    el.preventDefault();
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
      '<script src="js/console.min.js"></script>\n' +
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
    $("#console").empty();
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

  // Theme contextMenu
  (function() {
    $.contextMenu({
      selector: ".windowGroup",
      items: {
        "light": {
          "name": "Light Themes",
          items: {
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
          "name": "Dark Themes",
          items: {
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
    });
  })();

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

});
