(async function () {
  const user = await API.getProfile(),
    data = user.data;
  //   若未登录，返回
  if (!user.data) {
    alert("登录已过期，请重新登录");
    location.href = "./login.html";
    return;
  }
  //   若成功登录，执行以下代码
  //   获取dom
  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    form: $(".msg-container"),
    txtMsg: $("#txtMsg"),
  };

  //   设置聊天窗口账户名和昵称
  setUserData();

  //   注销登录
  doms.close.onclick = () => {
    // 获取token
    API.loginOut();
    alert("已退出登录，返回登录界面，点击确定");
    location.href = "./login.html";
  };

  //   获取聊天记录
  const resp = await API.getHistory();

  //   添加聊天内容
  resp.data.map((item) => addContent(item));

  //   发送聊天内容
  doms.form.onsubmit = function (e) {
    e.preventDefault();
    sendNewMessage();
  };

  //   发送新聊天内容
  async function sendNewMessage() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }
    // 创建聊天内容对象
    const txtObjFromUser = {
      content: content,
      createdAt: Date.now(),
      from: data.loginId,
      to: null,
    };
    // 发送
    addContent(txtObjFromUser);
    // 清空打字框
    doms.txtMsg.value = "";
    const resp = await API.sendMessage(content);

    // 机器人回复
    // console.log(resp);
    const txtObjFromRobot = {
      content: resp.data.content,
      createdAt: Date.now(),
      from: null,
      to: data.loginId,
    };
    addContent(txtObjFromRobot);
  }

  function scrollToNewMessage() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }

  // 创建聊天内容
  function addContent(contentObj) {
    // 头像
    const img = $$$("img");
    img.className = "chat-avatar";
    img.src = contentObj.from
      ? "./asset/avatar.png"
      : "./asset/robot-avatar.jpg";

    // 内容
    const text = $$$("div");
    text.classList.add("chat-content");
    text.innerText = contentObj.content;

    // 时间
    const date = $$$("div");
    date.classList.add("chat-date");
    date.innerText = formatDate(contentObj.createdAt);

    // 创建项
    const div = $$$("div");
    div.classList.add("chat-item");
    if (contentObj.from) {
      div.classList.add("me");
    }

    div.appendChild(img);
    div.appendChild(text);
    div.appendChild(date);
    doms.chatContainer.appendChild(div);

    //   发送消息后滚动到底部
    scrollToNewMessage();
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${second} `;
  }

  function setUserData() {
    doms.aside.nickname.innerText = data.nickname;
    doms.aside.loginId.innerText = data.loginId;
  }
})();
