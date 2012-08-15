(function(module) {
    var LogReaderManager = require("./LogReaderManager"),
        http             = require("http"),
        send             = require("send"),
        url              = require("url"),
        path             = require("path")
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

        self.http = http.createServer(function(req, res) {
            var file = url.parse(req.url).pathname,
                root = path.join(__dirname, "..", "public");

            send(req, file).root(root).pipe(res);
        });

        self.io = socketIO.listen(self.http, {
            "log level": 2 // info
        });

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
                logs: manager.getLogs().sort(function(left, right) {
                    return left.name.localeCompare(right.name);
                })
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

        self.http.listen(port, host);
    };

    PuperGrep.prototype.close = function() {
        if (this.http) {
            this.http.close();
        }
    };

    module.exports = PuperGrep;
})(module);

