<!DOCTYPE html>
<html>
<head>
    <title>{{name}}</title>
    <link href="/static/normalize.css" rel="stylesheet">
</head>
<body style = "color: blue">
    <h1>Page1</h1>
    <input id="env" value="{{ env }}" style = "display: none">
    <input id="options" value="{{ options }}" style = "display: none">
    <button onclick="handleClick()">发送请求</button>
</body>
<script src="https://cdn.jsdelivr.net/npm/axios@0.18.0/dist/axios.min.js"></script>
<script src="https://cdn.jsdeliver.net/npm/js-md5@0.8.3/src/md5.min.js"></script>
<script type = "text/javascript">
    try {
        window.env = document.getElementById("env").value
        const options = document.getElementById('options').value
        window.options = JSON.parse(options)
    } catch (e) {
        console.log(e)
    }
    const handleClick = () => {
        const signKey = 'klklfadfkj1341adjoiwejhwqhghj123'
        const st = Date.now()
        axios.request({
            method: 'get'
            url: '/api/project/list'
            data: { page: 1, size: 2},
            headers: { 
                s_t: st, 
                s_sign: md5(`${signKey}_${st}`) 
            }
        })
    }
</script>
</html>