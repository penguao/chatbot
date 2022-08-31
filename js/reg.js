// 参数中的函数，当input存在值，检查是否有重复，有则返回错误消息，无则不返回；当不存在值，返回错误消息
const loginIdValidator = new FiledValidator("txtLoginId", async function (
  value
) {
  if (!value) {
    return "账号不能为空";
  }
  //   是否已经存在当前输入的账号
  const resp = await API.exists(value);
  if (resp.data) {
    return "已存在该账号，请重新输入";
  }
});
const nicknameValidator = new FiledValidator("txtNickname", function (value) {
  if (!value) {
    return "昵称不能为空";
  }
});
const loginPwdValidator = new FiledValidator("txtLoginPwd", function (value) {
  if (!value) {
    return "密码不能为空";
  }
});
const loginPwdConfirmValidator = new FiledValidator(
  "txtLoginPwdConfirm",
  function (value) {
    if (!value) {
      return "确认密码不能为空";
    } else if (value !== loginPwdValidator.input.value) {
      return "确认密码错误，请再次确认";
    }
  }
);

// 提交表格事件
const form = $(".user-form");

form.onsubmit = async (e) => {
  //阻止浏览器默认行为
  e.preventDefault();
  // 调用类中的静态方法，对表单验证得出汇总结果
  const result = await FiledValidator.validate(
    loginIdValidator,
    nicknameValidator,
    loginPwdValidator,
    loginPwdConfirmValidator
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
  const resp = await API.reg(data);
  // 跳转登录界面
  if (resp.code === 0) {
    alert("注册成功，自动跳转登录界面");
    location.href = "./login.html";
  }
};
