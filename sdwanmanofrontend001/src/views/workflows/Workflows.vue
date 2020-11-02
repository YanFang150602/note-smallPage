<template>
  <a-layout :style="{ height: '100%' }">
    <SideNav :navCon="navCon" />
    <a-layout-content>
      <a-spin :spinning="isLoading">
        <router-view></router-view>
      </a-spin>
    </a-layout-content>
  </a-layout>
</template>

<script>
import SideNav from '@/views/components/SideNav';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      navCon: [
        {
          title: 'Templates',
          path: '/workflows/templates'
        },
        {
          title: 'SpokeGroups',
          path: '/workflows/spoke-groups'
        },
        {
          title: 'Devices',
          path: '/workflows/devices'
        },
        {
          title: 'DeviceGroup',
          path: '/workflows/deviceGroup'
        }
      ]
    };
  },
  computed: {
    ...mapState({
      isLoading: state => !!state.isLoading
    })
  },
  components: {
    SideNav
  }
};
</script>

<style lang="scss" scoped>
/deep/.ant-spin-nested-loading {
  height: 100%;
  .ant-spin-container {
    height: 100%;
  }
}
</style>
