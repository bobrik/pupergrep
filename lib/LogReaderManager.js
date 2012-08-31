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

        this.logs[name] = {
            path: path
        };

        callback();
    };

    LogReaderManager.prototype.setLogType = function(name, type) {
        if (this.logs[name]) {
            this.logs[name].type = type;
        }
    };

    LogReaderManager.prototype.getLogReader = function(name, callback) {
        if (!this.readers[name]) {
            if (!this.logs[name]) {
                return callback(new Error("No log defined with name " + name));
            }

            this.readers[name] = new LogReader(this.logs[name].path);
        }

        callback(undefined, this.readers[name]);
    };

    LogReaderManager.prototype.getLogs = function() {
        var self = this;

        return Object.keys(self.logs).map(function(name) {
            return {
                name: name,
                type: self.logs[name].type
            };
        });
    };

    module.exports = LogReaderManager;
})(module);
