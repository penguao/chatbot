// 参数中的函数，当input存在值，检查是否有重复，有则返回错误消息，无则不返回；当不存在值，返回错误消息
const loginIdValidator = new FiledValidator("txtLoginId", function (value) {
  if (!value) {
    return "请输入账号登录";
  }
});

const loginPwdValidator = new FiledValidator("txtLoginPwd", function (value) {
  if (!value) {
    return "密码不能为空";
  }
});

// 提交表格事件
const form = $(".user-form");

form.onsubmit = async (e) => {
  //阻止浏览器默认行为
  e.preventDefault();
  // 调用类中的静态方法，对表单验证得出汇总结果
  const result = await FiledValidator.validate(
    loginIdValidator,
    loginPwdValidator
  );
  if (!result) {
    return;
  }
  // 若有结果，则提取表单数据
  const form = $(".user-form");
  let data = new FormData(form);
  // 迭代器
  data = Object.fromEntries(data.entries());
  // 得到响应体
  const resp = await API.login(data);
  // 跳转登录界面
  if (resp.code === 0) {
    alert("登录成功，点击确定，跳转到首页");
    location.href = "./index.html";
  } else {
    alert("登录失败，请检查账号和密码");
    loginIdValidator.p.innerText = "账号或密码错误";
    loginPwdValidator.input.value = "";
  }
};
