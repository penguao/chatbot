// 用户注册验证的表单验证通用代码

/**
 * 对某一个表单项进行验证的构造函数
 */

class FiledValidator {
  /**
   * 构造器
   * @param {string} inputId 1.input元素的ID
   * @param {function} validatorFunc 2.进行输入内容的正误判定，判断规则：此处向构造器中传入一个规则（此处规则用函数）
   */
  constructor(inputId, validatorFunc) {
    // 获取dom
    this.input = $("#" + inputId);
    this.p = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;
    // 单个表格失去聚焦时，触发验证
    this.input.onblur = () => {
      this.validate();
    };
  }

  /**
   * 验证函数
   */
  async validate() {
    // 接收错误消息
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }

  //   汇总每个表格判断结果，并输出最终结果
  static async validate(...validators) {
    const proms = validators.map((v) => v.validate());
    console.log(proms);
    let result = await Promise.all(proms);
    return result.every((p) => p);
  }
}
