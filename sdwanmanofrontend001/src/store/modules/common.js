/* eslint-disable no-irregular-whitespace */
import {
  SET_USER_INFO,
  SET_TOKEN,
  CLEAR,
  TO_LOGIN,
  UPGRADE_USER_INFO
} from '@/store/mutation-types';
import { getUserInfo } from 'apis/common';
const state = {
  token: localStorage.getItem('user-token') || '',
  userInfo: JSON.parse(localStorage.getItem('user-info')) || {},
  accountId: localStorage.getItem('account-id') || '',
  treeData: ''
};

const getters = {
  permission(state) {
    return key => state.userInfo[key];
  }
};

const mutations = {
  [SET_USER_INFO](state, payload) {
    console.log(payload);
    const userInfo = {};
    const userInfoData = payload.userInfoRes.result;
    userInfo.id = userInfoData.id;
    userInfo.username = userInfoData.username;
    userInfo.parentId = userInfoData.parentId;
    userInfo.systemId = userInfoData.systemId;
    userInfo.orgId = userInfoData.orgId;
    userInfo.orgUsername = userInfoData.orgUsername;
    userInfo.orgPassword = userInfoData.orgPassword;
    userInfo.orgAuth = userInfoData.orgAuth;
    userInfo.level = userInfoData.level;
    state.userInfo = userInfo;
    state.accountId = payload.accountId;
    localStorage.setItem('account-id', payload.accountId);
    localStorage.setItem('user-info', JSON.stringify(userInfo));
  },
  [SET_TOKEN](state, payload) {
    state.token = payload;
    localStorage.setItem('user-token', payload);
  },
  [CLEAR](state) {
    state.token = '';
    state.userInfo = '';
    localStorage.clear();
    sessionStorage.clear();
  },
  [TO_LOGIN](state, params) {
    const status = params ? 'next' : 'window';
    const { from, next } = params ?? {};
    const env = process.env.VUE_APP_BUILD_MODE;
    if (env === 'development' || env === 'production') {
      if (status === 'next') {
        next({
          path: '/login',
          query: {
            redirect: from.fullPath
          }
        });
      } else {
        window.$vm.$router.push({
          path: '/login',
          query: {
            redirect: window.$vm.$route.fullPath
          }
        });
      }
    } else if (env === 'poc') {
      // 浪潮
      // 跳转前记录当前地址
      localStorage.setItem('redirect-url', window.location.href);
      window.location.href =
        'https://www.caiicloud.com/auth?clientId=67054d37-ff29-4173-874c-8611eba73023&redirectUrl=https://riiot.caiicloud.com/auth/index.html&islangchao=0';
    } else if (env === 'devops') {
      // 移动
      // window.location.href = `${process.env.VUE_APP_BASE_URL}login`;
      if (status === 'next') {
        next({
          path: '/login',
          query: {
            redirect: from.fullPath
          }
        });
      } else {
        window.$vm.$router.push({
          path: '/login',
          query: {
            redirect: window.$vm.$route.fullPath
          }
        });
      }
    }
  },
  [UPGRADE_USER_INFO]() {
    console.log(state.userInfo);
    state.userInfo = JSON.parse(localStorage.getItem('user-info'));
    console.log(state.userInfo);
  }
};

const actions = {
  async updateUserInfo({ commit, state }) {
    if (!state.token) return;
    const userInfoRes = await getUserInfo(state.accountId);
    if (userInfoRes.status !== '0000')
      return this.$message.error(userInfoRes.message);
    commit(SET_USER_INFO, userInfoRes);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
