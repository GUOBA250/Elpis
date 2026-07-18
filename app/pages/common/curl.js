import axios from 'axios'

const $curl = async function (options) {
    const {
        method = 'get',
        url,
        data,
        params,
        headers,
        errorMessage = '请求失败',
        timeout = 30000
    } = options

    try {
        const response = await axios({
            method,
            url,
            data,
            params,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            timeout
        })

        return response.data
    } catch (error) {
        if (error.response) {
            console.error(`${errorMessage}: ${error.response.status} - ${error.response.statusText}`)
        } else if (error.request) {
            console.error(`${errorMessage}: 网络错误`)
        } else {
            console.error(`${errorMessage}: ${error.message}`)
        }
        return null
    }
}

export default $curl
