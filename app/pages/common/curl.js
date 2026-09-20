import md5 from "md5";
import { ElMessage } from "element-plus";

/**
 * 请求函数统一封装
 * @param {Object} options - The configuration options for the request.
 * @param {string} options.url - 请求地址
 * @param {string} [options.method="get"] - 请求方法，默认get请求
 * @param {Object} [options.headers={}] - 请求头信息
 * @param {Object} [options.query={}] - 请求参数
 * @param {Object} [options.data={}] - 请求数据
 * @param {string} [options.responseType="json"] - 返回数据类型
 * @param {number} [options.timeout=60000] - 请求超时时间，默认60秒
 * @param {string} [options.errorMessage="请求失败"] - 请求失败时的错误提示信息
 * @returns {Promise<Object>}
 * @throws {Error} Throws an error if the request fails.
 */
const curl = async ({
  url,
  method = "get",
  headers = {},
  query = {},
  data = {},
  responseType = "json",
  timeout = 60000,
  errorMessage = "请求失败",
}) => {
  try {
    // 请求签名
    const signKey = "fe7f165ec0314deea95fd9d391800c0c";
    const st = Date.now();
    const sSign = md5(`${signKey}_${st}`);

    // 组装请求头信息
    const dtoHeaders = {
      ...headers,
      s_t: st,
      s_sign: sSign,
    };
    if (url.indexOf("/api/proj/") > -1 && window.projKey) {
      // 项目key
      dtoHeaders.proj_key = window.projKey;
    }

    // 请求配置
    const axiosParams = {
      url,
      method,
      params: query,
      data,
      responseType,
      timeout,
      headers: dtoHeaders,
    };

    // 发送请求，返回数据
    const response = await axios.request(axiosParams);
    const resData = response?.data || {};
    const { success, code, message, metadata } = resData;

    if (!success) {
      if (code === 445) {
        ElMessage.error("请求不合法");
      } else if (code === 446) {
        ElMessage.error("缺少项目必要参数");
      } else if (code === 442) {
        ElMessage.error("请求参数错误");
      } else if (code === 50000) {
        ElMessage.error(message);
      } else {
        ElMessage.error(errorMessage);
      }
      // 返回失败的结果
      return {
        success,
        code,
        message,
      };
    } else {
      // 返回成功的结果
      return {
        success,
        data: resData?.data,
        metadata,
      };
    }
  } catch (error) {
    // 处理请求错误（统一返回与成功分支一致的结构）
    console.error(error);
    return {
      success: false,
      code: 0,
      message: error?.message || errorMessage,
    };
  }
};

export default curl;
