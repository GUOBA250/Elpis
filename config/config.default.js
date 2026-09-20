module.exports = {
  name: "qsb3008-默认",
  age: 33,
  apiSignVerify: {
    // API 签名密钥（需与前端 curl.js 中的 signKey 保持一致；生产环境应通过 config.prod.js 覆盖并轮换）
    signKey: "fe7f165ec0314deea95fd9d391800c0c",
    // 签名校验白名单（无需签名校验的路径）
    whiteList: [],
  },
};
