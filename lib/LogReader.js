(function(module) {
    var events = require("events"),
        util   = require("util"),
        child  = require("child_process");

    function LogReader(path, length) {
        var self = this;

        if (!length) {
            length = 500;
        }

        self.path     = path;
        self.attached = false;
        self.tail     = undefined;
        self.length   = length;
        self.buffer   = [];
    }

    util.inherits(LogReader, events.EventEmitter);

    LogReader.prototype.getBuffer = function() {
        return this.buffer;
    };

    LogReader.prototype.process = function(line, callback) {
        callback(undefined, line);
    };

    LogReader.prototype.setProcessor = function(processor) {
        this.process = processor;
    };

    LogReader.prototype.attach = function() {
        if (this.attached) {
            return;
        }

        var self = this,
            args = ["-n", self.length, "-F", self.path];

        self.tail = child.spawn("tail", args);
        self.tail.stdout.on("data", function(data) {
            data.toString().split("\n").forEach(function(line) {
                if (line.length != 0) {
                    self.process(line, function(error, line) {
                        if (error) {
                            return;
                        }

                        self.buffer.push(line);
                        while (self.buffer.length > self.length) {
                            self.buffer.shift();
                        }

                        self.emit("line", line);
                    });
                }
            });
        });

        self.attached = true;
    };

    LogReader.prototype.detach = function() {
        if (!this.attached) {
            return;
        }

        this.tail.kill();

        this.tail     = undefined;
        this.attached = false;
    };

    module.exports = LogReader;
})(module);
