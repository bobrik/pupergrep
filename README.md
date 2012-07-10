# Pupergrep - have fun with log files, you nerds!

## Screenshots & Features

Everybody loves screenshots!

![screenshot](http://bobrik.name/uploads/pupergrep-new-screenshot.png)

* Grep only lines you like (skip non-fatal errors, stack traces, INFO lines).
* Highlight only lines you dislike (FATAL errors, long responses).
* Limit output buffer to keep the whole log area on the screen or make it large to see everthing.
* Pause log to take a look for fun facts in your error log.
* Fast switching between many logs with handsome list with search box.
* Font-size switching for eagles.
* Send your colleagues links to your favorite logs with your settings and bookmark them.
* Open-source. Can you imagine that?

## Demo

Yes, we have it, right here: [http://home.bobrik.name/](http://home.bobrik.name/).=

Select log you like and try to push some buttons.

## Installation

This is pretty simple, believe me!

```
mkdir ~/mypupergrep
cd ~/mypupergrep
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

        puper.listen(8080, "127.0.0.1");
    });
})();
```

Save it to `~/mypupergrep/server.js`. Run it right after that:

```
node server.js
```

Let's configure nginx (I don't want to make node.js serve static files). Example configuration:

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

Now cross your fingers and open `http://127.0.0.1/` in your favorite browser. This is it!

## Troubles

Let me guess, you tried to monitor access log of nginx server that proxy your PuperGrep? You bastard! Stop it right now!

Another trouble? Hm. Post an issue!

## Want to contribute?

You're welcome! Make a pull request and we'll see.

## Authors

* [Ian Babrou](https://github.com/bobrik)

Inspired by [supergrep](https://github.com/etsy/supergrep) from Etsy.
