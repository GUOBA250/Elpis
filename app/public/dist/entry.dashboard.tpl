<!DOCTYPE html>
<html class="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{ name }}</title>
    <link rel="stylesheet" href="/static/normalize.css" />
    <link rel="icon" href="/static/logo.png" type="image/x-icon" />
  <script defer src="http://127.0.0.1:9002/public/dist/dev/js/runtime~entry.dashboard_4f52f290.bundle.js"></script><script defer src="http://127.0.0.1:9002/public/dist/dev/js/vendor_ac202591.bundle.js"></script><script defer src="http://127.0.0.1:9002/public/dist/dev/js/entry.dashboard_eacc528c.bundle.js"></script></head>

  <body>
    <div id="root"></div>
    <input id="projKey" value="{{ projKey }}" style="display: none" />
    <input id="env" value="{{ env }}" style="display: none" />
    <input id="options" value="{{ options }}" style="display: none" />
  </body>
  <!-- axios / md5 均由 webpack ProvidePlugin 从 npm 依赖注入 bundle，无需外部 CDN（已移除无 SRI 的 CDN 脚本） -->
  <script type="text/javascript">
    try {
      window.env = document.getElementById("env").value;
      window.projKey = document.getElementById("projKey").value;
      const options = document.getElementById("options").value;
      window.options = JSON.parse(options);
    } catch (e) {
      console.log(e);
    }
  </script>
</html>
