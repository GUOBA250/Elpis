<!DOCTYPE html><html><head><meta charset=utf-8><title>{{name}}</title><link href=/static/normalize.css rel=stylesheet><script defer=defer src=http://127.0.0.1:9002/public/dist/dev/js/runtime~entry.page2_f3b13ad6.bundle.js></script><script defer=defer src=http://127.0.0.1:9002/public/dist/dev/js/vendor_bf7f8c96.bundle.js></script><script defer=defer src=http://127.0.0.1:9002/public/dist/dev/js/entry.page2_cff221b6.bundle.js></script></head><body style="margin: 0;"><div id=root></div><input id=env value="{{ env }}" style="display: none"> <input id=options value="{{ options }}" style="display: none"></body><script type=text/javascript>try {
        window.env = document.getElementById("env").value
        const options = document.getElementById('options').value
        window.options = JSON.parse(options)
    } catch (e) {
        console.log(e)
    }</script></html>