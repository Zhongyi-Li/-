module.exports = {
  plugins: [
    require("autoprefixer")({
      // 指定需要支持的浏览器版本
      browsers: ["last 2 versions", "iOS >= 8", "Android >= 4.1"],
      // 是否删除过时的前缀
      remove: false,
    }),
    require("postcss-pxtorem")({
      rootValue: 37.5, // 设计稿宽度的1/10，即375的1/10，这里是37.5
      propList: ["*"], // 转换所有 CSS 属性的像素单位
      selectorBlackList: [], // 忽略转换为 rem 的选择器，可以是正则表达式或字符串
      minPixelValue: 2, // 设置要替换的最小像素值，默认为 0
    }),
  ],
};
