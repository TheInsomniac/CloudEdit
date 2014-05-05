(function () {
  if (!console) {
    console = {};
  }

  var logger = window.parent.jqconsole;

  console.log = function(message) {
    var data;
    if (typeof message == "object") {
      data = JSON && JSON.stringify ? JSON.stringify(message) : String(message);
    } else {
      data = message;
    }
    logger.Write("==> " + data + "\n");
  };
})();
