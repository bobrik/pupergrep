# Pupergrep - have fun with log files, you nerds!

## Screenshots & Features

Everybody loves screenshots!

![screenshot](http://i.imgur.com/Xl3yf.png)

* Grep only lines you like (skip non-fatal errors, stack traces, INFO lines).
* Highlight only lines you dislike (FATAL errors, long responses).
* Group highlight and grep conditions with AND/OR;
* Limit output buffer to keep the whole log area on the screen or make it large to see everthing.
* Pause log with button, hotkey (space) or hold mouse button on logs to take a look for fun facts in your error log.
* Fast switching between many logs with handsome list with search box.
* Font-size switching for eagles.
* Send your colleagues links to your favorite logs with your settings and bookmark them.
* Link activation in logs - just click on it to open.
* Whole system and current log activity state indication.
* Support for plain text, html and color ansi (yep, like in your terminal) logs.
* Custom filters for log lines before outputting. Colorize if you want to.
* Open-source. Can you imagine that?

## Demo

Yes, we have it, right here: [http://home.bobrik.name/](http://home.bobrik.name/). Feel free to touch it before using!

Select log you like and try to push some buttons.

## Installation

This is pretty simple, believe me!

```
mkdir ~/mypupergrep
cd ~/mypupergrep
mkdir node_modules
npm install pupergrep
```

Now you have `pupergrep` module installed.

PuperGrep needs to know what to monitor. Simple server to make you understand what I mean:

```javascript
(function() {
    var PuperGrep = require("pupergrep"),
        puper     = new PuperGrep(),
        manager   = puper.getLogReaderManager();

    manager.addLog("my_cool_log", "/var/log/my_cool_log", function(error) {
        if (error) {
            console.log("Error adding test log", error);
            return;
        }

        // if your log may be interpreted as html:
        // manager.setLogType("my_cool_log", "html");
        // or has ANSI escape sequences
        // manager.setLogType("my_cool_log", "ansi");

        // if you want to colorize your log before outputting as html:
        // manager.getLogReader("my_cool_log", function(error, reader) {
        //     if (error) {
        //         console.log(error);
        //         return;
        //     }
        //
        //     reader.setProcessor(function(line, callback) {
        //         callback(undefined, "<span style="color: red;>" + line + "</span>");
        //     });
        // });

        puper.listen(8080, "127.0.0.1");
    });
})();
```

Save it to `~/mypupergrep/server.js`. Run it right after that:

```
node server.js
```

Now cross your fingers and open `http://127.0.0.1:8080/` in your favorite browser. This is it!

## Nginx configuration (optional)

If you want nginx in front of your logs for security or whatever, this is example config:

```
server {
    listen 80;
    server_name localhost;

    location / {
        index index.html;
        root /home/user/mypupergrep/node_modules/pupergrep/public;
    }

    location /socket.io/ {
        proxy_http_version 1.1;
        proxy_pass http://127.0.0.1:8080/socket.io/;
    }
}
```

This way you may open `http://127.0.0.1/` and enjoy your logs. Note that nginx does not support
websockets yet and you'll need to wait for 2 seconds to switch from ws to xhr-polling.

## Troubles

Let me guess, you tried to monitor access log of nginx server that proxy your PuperGrep? You bastard! Stop it right now!

Another trouble? Hm. Post an issue!

## Want to contribute?

You're welcome! Make a pull request and we'll see.

## Authors

* [Ian Babrou](https://github.com/bobrik)

## Contributors

* [Artyom Kohver](https://github.com/kohver)
* [Max Riveiro](https://github.com/kavu)

Inspired by [supergrep](https://github.com/etsy/supergrep) from Etsy.
