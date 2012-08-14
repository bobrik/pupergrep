(function(module) {
    var LogReaderManager = require("./LogReaderManager"),
        socketIO         = require("socket.io");

    function PuperGrep() {
        this.logReaderManager = new LogReaderManager();
    };

    PuperGrep.prototype.getLogReaderManager = function() {
        return this.logReaderManager;
    };

    PuperGrep.prototype.listen = function(port, host) {
        var self    = this,
            manager = self.getLogReaderManager();

        self.io = socketIO.listen(port, host);

        self.io.sockets.on("connection", function(socket) {
            var lastLog = {
                name     : undefined,
                listener : undefined
            };

            function unsubscribeFromPreviousLog(callback) {
                if (!lastLog.name) {
                    return callback();
                }

                manager.getLogReader(lastLog.name, function(error, reader) {
                    if (error) {
                        return callback(error);
                    }

                    reader.removeListener("line", lastLog.listener);

                    lastLog.name     = undefined;
                    lastLog.listener = undefined;

                    if (reader.listeners("line").length == 0) {
                        reader.detach();
                        return callback(undefined, true);
                    }

                    return callback(undefined, false);
                });
            }

            socket.emit("logs", {
                logs: manager.getLogsNames().sort()
            });

            socket.on("subscribe", function(data) {
                unsubscribeFromPreviousLog(function(error) {
                    if (error) {
                        console.log(error);
                        return;
                    }

                    manager.getLogReader(data.name, function(error, reader) {
                        if (error) {
                            return;
                        }

                        function listener(line) {
                            socket.emit("line", {
                                line: line
                            });
                        }

                        reader.getBuffer().forEach(listener);
                        reader.on("line", listener);
                        reader.attach();

                        lastLog.name     = data.name;
                        lastLog.listener = listener;
                    });
                });
            });

            socket.on("disconnect", function() {
                unsubscribeFromPreviousLog(function(error) {
                    if (error) {
                        console.log(error);
                    }
                });
            });
        });
    };

    PuperGrep.prototype.close = function() {
        if (!this.io) {
            this.io.server.close();
        }
    };

    module.exports = PuperGrep;
})(module);

