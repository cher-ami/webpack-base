(function() {
  var u = function() {};
  if (!("console" in window)) {
    window.console = {
      log: u,
      warn: u,
      error: u,
      table: u
    };
  }
  if (!("group" in console)) {
    console.group = console.log;
    console.groupEnd = u;
  }
})();
