<!DOCTYPE html><html class=dark><head><meta charset=utf-8><title>{{name}}</title><link href=/static/normalize.css rel=stylesheet><script defer=defer src=/dist/prod/js/runtime~entry.project-list_2ae24901.bundle.js></script><script defer=defer src=/dist/prod/js/vendor_c635511a.bundle.js></script><script defer=defer src=/dist/prod/js/entry.project-list_0313fa65.bundle.js></script><link href=/dist/prod/vendor.css rel=stylesheet><link href=/dist/prod/entry.project-list.css rel=stylesheet></head><body style="margin: 0;"><div id=root></div><input id=env value="{{ env }}" style="display: none"> <input id=options value="{{ options }}" style="display: none"></body><script type=text/javascript>try {
        window.env = document.getElementById("env").value
        const options = document.getElementById('options').value
        window.options = JSON.parse(options)
    } catch (e) {
        console.log(e)
    }</script></html>