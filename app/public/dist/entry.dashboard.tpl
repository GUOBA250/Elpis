<!DOCTYPE html><html class=dark><head><meta charset=utf-8><title>{{name}}</title><link href=/static/normalize.css rel=stylesheet><script defer=defer src=http://127.0.0.1:9002/public/dist/dev/js/runtime~entry.dashboard_7b70bb3a.bundle.js></script><script defer=defer src=http://127.0.0.1:9002/public/dist/dev/js/vendor_2bf407f6.bundle.js></script><script defer=defer src=http://127.0.0.1:9002/public/dist/dev/js/common_92c27aa3.bundle.js></script><script defer=defer src=http://127.0.0.1:9002/public/dist/dev/js/entry.dashboard_5f16b072.bundle.js></script></head><body style="margin: 0;"><div id=root></div><input id=env value="{{ env }}" style="display: none"> <input id=options value="{{ options }}" style="display: none"></body><script type=text/javascript>try {
        window.env = document.getElementById("env").value
        const options = document.getElementById('options').value
        window.options = JSON.parse(options)
    } catch (e) {
        console.log(e)
    }</script></html>