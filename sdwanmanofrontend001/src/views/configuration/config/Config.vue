<template>
  <a-layout id="device_config_page" :style="{ height: '100%' }">
    <DevSideNav></DevSideNav>
    <a-layout-content style="margin: 5px 0 30px 15px">
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
</template>
<script>
import DevSideNav from '@/views/configuration/config/DevSideNav';
export default {
  name: 'DevConfig',
  components: {
    DevSideNav
  },
  data() {
    return {
      curDeviceName: ''
    };
  },
  beforeRouteEnter(to, from, next) {
    console.log(to.params);
    next(vm => {
      vm.curDeviceName = to.params.name;
      console.log(vm.menus);
    });
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
#device_config_page {
  /deep/.ant-layout-sider {
    background: #f0f2f5;
  }
  /deep/.ant-menu-item {
    height: 18px;
    line-height: 18px;
    font-size: 12px;
  }
  /deep/.ant-menu-submenu-title {
    height: 18px;
    line-height: 18px;
    font-size: 12px;
  }
  /deep/.ant-layout-content {
    min-height: 200px;
  }
}
</style>
