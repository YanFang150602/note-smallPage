import Vue from 'Vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

const messages = {
  zh: {
    L: {
      "table.id": "学号",
      "table.name": "姓名",
      "table.age": "年龄",
      "table.grade": "班级",
      "table.address": "家庭地址",
      "table.telphone": "联系电话"
    }
  },
  en: {
    L: {
      "table.id": "ID",
      "table.name": "Name",
      "table.age": "Age",
      "table.grade": "Grade",
      "table.address": "Family Address",
      "table.telphone": "Telphone"
    }
  }
};

export default new VueI18n({
  locale: "zh",
  messages
});

