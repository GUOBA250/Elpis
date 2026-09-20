const log = require("npmlog");

log.level = process.env._ENV === "local" ? "verbose" : "info"; // 判断debug模式

log.heading = "Elpis"; // 修改前缀
log.headingStyle = { fg: "cyan", bg: "black" };

log.addLevel("success", 2000, { fg: "green", bold: true }); // 添加自定义命令

module.exports = log;
