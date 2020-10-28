<template>
  <a-layout :style="{ height: '100%' }">
    <SideNav :navCon="navCon" />
    <a-layout-content>
      <keep-alive>
        <a-spin :spinning="isLoading">
          <router-view></router-view>
        </a-spin>
      </keep-alive>
    </a-layout-content>
  </a-layout>
</template>

<script>
import SideNav from 'views/components/SideNav';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      navCon: [
        {
          title: this.$t('Devices'),
          path: '/configuration/Devices'
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

<style lang="scss" scoped></style>
