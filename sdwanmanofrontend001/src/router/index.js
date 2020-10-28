import Vue from 'vue';
import vuex from '@/store';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
// 解决重复路由报错
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push;
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

let otherRouter = [];
const files = require.context('./', true, /\.js$/);
// 路由自动化导入
files.keys().forEach(key => {
  if (key !== './index.js' && files(key).default) {
    otherRouter = [...otherRouter, ...[...files(key).default]];
  }
});

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: '首页'
    },
    component: () => import('views/home/Home'),
    children: [
      {
        path: '/configuration',
        name: 'Configuration',
        redirect: '/configuration/Devices',
        meta: {
          title: '组织管理'
        },
        component: () => import('views/configuration/Configuration'),
        children: [
          {
            path: '/configuration/Devices',
            name: 'Devices',
            meta: {
              title: '设备'
            },
            component: () => import('views/configuration/devices/Devices')
          }
        ]
      },
      {
        path: '/configuration/deviceConfig',
        name: 'DeviceConfig',
        meta: {
          title: '设备配置'
        },
        component: () => import('views/configuration/config/Config'),
        children: [
          {
            path: '/configuration/deviceConfig/schedule',
            name: 'Schedules',
            meta: {
              title: '定时'
            },
            component: () => import('views/configuration/schedule/Schedule')
          },
          {
            path: '/configuration/deviceConfig/VPNConfigFile',
            name: 'VPNConfigFile',
            meta: {
              title: 'VPN Config File'
            },
            component: () => import('views/configuration/vpn/VPNConfigFile')
          }
        ]
      },
      {
        path: '/administration',
        name: 'Administration',
        redirect: '/administration/Organize',
        meta: {
          title: '组织管理'
        },
        component: () => import('views/administration/Administration'),
        children: [
          {
            path: '/administration/Organize',
            name: 'Organizations',
            meta: {
              title: '组织'
            },
            component: () => import('views/administration/organize/Organize')
          },
          {
            path: '/administration/organize-users',
            name: 'OrganizationUsers',
            meta: {
              title: '组织成员'
            },
            component: () =>
              import('views/administration/organizeUsers/OrganizeUsers')
          }
        ]
      },
      {
        // workflows页面组
        path: '/workflows',
        name: 'Workflows',
        redirect: '/workflows/templates',
        meta: {
          title: '设备'
        },
        component: () => import('views/workflows/Workflows'),
        children: [
          {
            // workflows templates页面
            path: '/workflows/templates',
            name: 'Templates',
            meta: {
              title: '模板'
            },
            component: () => import('views/workflows/templates/Templates')
          },
          {
            path: '/workflows/spoke-groups',
            name: 'SpokeGroups',
            meta: {
              title: '组织'
            },
            component: () => import('views/workflows/spokeGroups/SpokeGroups')
          },
          {
            path: '/workflows/devices',
            name: 'Device',
            meta: {
              title: '设备'
            },
            component: () => import('views/workflows/devices/Devices')
          },
          {
            path: '/workflows/deviceGroup',
            name: 'DeviceGroup',
            meta: {
              title: '设备组'
            },
            component: () => import('views/workflows/deviceGroup/deviceGroup')
          },
          {
            path: '/workflows/Associate Interface Network',
            name: 'Associate Interface Network',
            meta: {
              title: '网络接口'
            },
            component: () =>
              import(
                'views/workflows/Associate Interface Network/Associate Interface Network'
              )
          }
        ]
      },
      ...otherRouter
    ]
  }
];
//本地开发时启用本地登录
if (process.env.VUE_APP_BUILD_MODE !== 'poc') {
  routes.push({
    path: '/login',
    name: 'Login',
    component: () => import('views/login/Login')
  });
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const token = vuex.state.common.token;
  if (!token && to.meta?.auth) {
    vuex.commit('common/to_login', { to, from, next });
  } else {
    next();
  }
  //if (to.path === '/login' || token) {
  //  next();
  //} else {
  //  next('/login');
  //}
});

export default router;
