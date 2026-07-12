<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{name}}</title>
    <link href="/static/normalize.css" rel="stylesheet">
</head>
<body style = "margin: 0;">
    <div id="root"></div>
    <input id="env" value="{{ env }}" style = "display: none">
    <input id="options" value="{{ options }}" style = "display: none">
</body>
<script type = "text/javascript">
    try {
        window.env = document.getElementById("env").value
        const options = document.getElementById('options').value
        window.options = JSON.parse(options)
    } catch (e) {
        console.log(e)
    }
</script>
</html>