<template>
  <a-layout :style="{ height: '100%' }">
    <SideNav :navCon="navCon" />
    <a-layout-content>
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
</template>

<script>
import SideNav from 'views/components/SideNav';
export default {
  data() {
    return {
      navCon: [
        {
          title: 'Organize',
          path: '/administration/Organize'
        },
        {
          title: 'OrganUsers',
          path: '/administration/organize-users'
        }
      ]
    };
  },
  components: {
    SideNav
  }
};
</script>

<style lang="scss" scoped></style>
