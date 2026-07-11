<!DOCTYPE html>
<html>
<head>
    <title>{{name}}</title>
</head>
<body style = "color: blue">
    <h1>Page1</h1>
    <input id="env" value="{{ env }}" style = "display: none">
    <input id="options" value="{{ options }}" style = "display: none">
</body>
<script type = "text/javascript>
    try {
        window.env = doucument.getElementById("env").value
        const options = document.getElementById('enc').value
        window.options = JSON.pares(options)
    } catch (e) {
        console.log(e)
    }
</script>
</html>