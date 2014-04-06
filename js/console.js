(function () {
  if (!console) {
    console = {};
  }
  var logger = window.parent.consoleField;
  
  console.log = function(message) {
    var currentMsgs, newMsg;
    currentMsgs = logger.getValue() ? currentMsgs = logger.getValue() + '\n' : currentMsgs = '';
    if (typeof message == 'object') {
      newMsg = currentMsgs + (JSON && JSON.stringify ? JSON.stringify(message) : String(message));
    } else if (typeof message == 'undefined') {
      newMsg = currentMsgs + 'Uncaught ReferenceError: variable is not defined';
    } else {
      newMsg = currentMsgs + message;
    }
    logger.setValue(newMsg);
  };
})();
