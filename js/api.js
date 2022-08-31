var API = (function () {
  const BASE_URL = "https://study.duyiedu.com";
  const TOKEN_KEY = "token";
  // 获取资源
  function get(path) {
    // 获取方法中，headers设为空
    const headers = {};
    const token = localStorage.getItem(TOKEN_KEY);
    //   如果有token，则把token传入请求头
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, { headers });
  }

  // 提交信息
  function post(path, bodyOBJ) {
    // post方法中，提交信息类型为指定类型
    const headers = { "Content-Type": "application/json" };
    const token = localStorage.getItem(TOKEN_KEY);
    //   如果有token，则把token传入请求头
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, {
      headers,
      method: "POST",
      body: JSON.stringify(bodyOBJ),
    });
  }

  async function reg(userInfo) {
    const resp = await post("/api/user/reg", userInfo);
    return await resp.json();
  }

  async function login(loginInfo) {
    const resp = await post("/api/user/login", loginInfo);
    const result = await resp.json();
    //   登陆的时候有响应的token，保存
    if (result.code === 0) {
      localStorage.setItem(TOKEN_KEY, resp.headers.get("authorization"));
    }
    return result;
  }

  async function exists(loginId) {
    const resp = await get("/api/user/exists?loginId=" + loginId);
    return resp.json();
  }
  async function sendMessage(text) {
    const resp = await post("/api/chat", { content: text });
    return resp.json();
  }

  //令牌被封装函数给带了过来
  async function getProfile() {
    const resp = await get("/api/user/profile");
    return await resp.json();
  }
  async function getHistory() {
    const resp = await get("/api/chat/history");
    return await resp.json();
  }

  // 退出登陆

  function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
  }

  return {
    reg,
    login,
    exists,
    getProfile,
    sendMessage,
    getHistory,
    loginOut,
  };
})();
