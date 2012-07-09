(function(module) {
    var LogReader = require("./LogReader");

    function LogReaderManager() {
        this.readers = {};
        this.logs    = {};
    }

    LogReaderManager.prototype.addLog = function(name, path, callback) {
        if (this.logs[name]) {
            return callback(new Error("Log " + name + " already registered with path " + path));
        }

        this.logs[name] = path;

        callback();
    };

    LogReaderManager.prototype.getLogReader = function(name, callback) {
        if (!this.readers[name]) {
            if (!this.logs[name]) {
                return callback(new Error("No log defined with name " + name));
            }

            this.readers[name] = new LogReader(this.logs[name]);
        }

        callback(undefined, this.readers[name]);
    };

    LogReaderManager.prototype.getLogsNames = function() {
        return Object.keys(this.logs);
    };

    module.exports = LogReaderManager;
})(module);
