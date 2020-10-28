<template>
  <a-layout-sider width="200px" :style="{ heght: '100%', background: '#fff' }">
    <div class="switchover">
      <div
        v-for="tab in tabs"
        :key="tab.refObj"
        :ref="tab.refObj"
        :style="tab.style"
        class="devcfg-tab-common"
        @click="tabClick(tab.refObj)"
      >
        <a-icon :type="tab.icon" />
      </div>
    </div>
    <div v-if="showTabObj.firstTabRef">
      <a-menu
        mode="inline"
        :default-selected-keys="['1']"
        :default-open-keys="[menus.firstMenus[0].key]"
        :style="{ height: '100%', borderRight: 0 }"
        @click="menuClick"
      >
        <template v-for="item in menus.firstMenus">
          <a-menu-item v-if="!item.children" :key="item.key">
            <a-icon type="pie-chart" />
            <span>{{ item.title }}</span>
          </a-menu-item>
          <sub-menu v-else :key="item.key" :menu-info="item" />
        </template>
      </a-menu>
    </div>
    <div v-if="showTabObj.secondTabRef">
      <a-menu
        mode="inline"
        :default-selected-keys="['1']"
        :default-open-keys="[menus.secondMenus[0].key]"
        :style="{ height: '100%', borderRight: 0 }"
        @click="menuClick"
      >
        <template v-for="item in menus.secondMenus">
          <a-menu-item v-if="!item.children" :key="item.key">
            <a-icon type="pie-chart" />
            <span>{{ item.title }}</span>
          </a-menu-item>
          <sub-menu v-else :key="item.key" :menu-info="item" />
        </template>
      </a-menu>
    </div>
    <div v-if="showTabObj.thirdTabRef">
      <a-menu
        mode="inline"
        :default-selected-keys="['1']"
        :default-open-keys="[menus.thirdMenus[0].key]"
        :style="{ height: '100%', borderRight: 0 }"
        @click="menuClick"
      >
        <template v-for="item in menus.thirdMenus">
          <a-menu-item v-if="!item.children" :key="item.key">
            <a-icon type="pie-chart" />
            <span>{{ item.title }}</span>
          </a-menu-item>
          <sub-menu v-else :key="item.key" :menu-info="item" />
        </template>
      </a-menu>
    </div>
    <div v-if="showTabObj.fourthTabRef">
      <a-menu
        mode="inline"
        :default-selected-keys="['1']"
        :default-open-keys="[menus.fourthMenus[0].key]"
        :style="{ height: '100%', borderRight: 0 }"
        @click="menuClick"
      >
        <template v-for="item in menus.fourthMenus">
          <a-menu-item v-if="!item.children" :key="item.key">
            <a-icon type="pie-chart" />
            <span>{{ item.title }}</span>
          </a-menu-item>
          <sub-menu v-else :key="item.key" :menu-info="item" />
        </template>
      </a-menu>
    </div>
  </a-layout-sider>
</template>
<script>
import menus from '@/assets/json/menus.json';
import { Menu } from 'ant-design-vue';
const SubMenu = {
  template: `
      <a-sub-menu :key="menuInfo.key" v-bind="$props" v-on="$listeners">
        <span slot="title">
          <a-icon type="mail" /><span>{{ menuInfo.title }}</span>
        </span>
        <template v-for="item in menuInfo.children">
          <a-menu-item v-if="!item.children" :key="item.key">
            <a-icon type="pie-chart" />
            <span>{{ item.title }}</span>
          </a-menu-item>
          <sub-menu v-else :key="item.key" :menu-info="item" />
        </template>
      </a-sub-menu>
    `,
  name: 'SubMenu',
  isSubMenu: true,
  props: {
    ...Menu.SubMenu.props,
    menuInfo: {
      type: Object,
      default: () => ({})
    }
  }
};
export default {
  components: {
    SubMenu
  },
  name: 'Schedule',
  data() {
    return {
      tabs: [
        {
          refObj: 'firstTabRef',
          style: {
            backgroundColor: '#aac0d5'
          },
          icon: 'radar-chart'
        },
        {
          refObj: 'secondTabRef',
          style: {
            backgroundColor: '#8d9fb3'
          },
          icon: 'setting'
        },
        {
          refObj: 'thirdTabRef',
          style: {
            backgroundColor: '#8d9fb3'
          },
          icon: 'codepen-circle'
        },
        {
          refObj: 'fourthTabRef',
          style: {
            backgroundColor: '#8d9fb3'
          },
          icon: 'global'
        }
      ],
      showTabObj: {
        firstTabRef: true,
        secondTabRef: false,
        thirdTabRef: false,
        fourthTabRef: false
      },
      menus: menus
    };
  },
  beforeRouteEnter(to, from, next) {
    console.log(to.params);
    next(vm => {
      vm.curDeviceName = to.params.name;
      console.log(vm.menus);
    });
  },
  methods: {
    tabClick(ref) {
      this.changeTab(ref);
    },
    changeTab(curRef) {
      for (let ref in this.showTabObj) {
        if (ref === curRef) {
          this.showTabObj[ref] = true;
          this.$refs[ref][0].style.backgroundColor = '#aac0d5';
        } else {
          this.showTabObj[ref] = false;
          this.$refs[ref][0].style.backgroundColor = '#8d9fb3';
        }
      }
    },
    menuClick(menu) {
      this.$router.push({ name: menu.key });
    }
  }
};
</script>
<style lang="scss" scoped>
.switchover {
  overflow: hidden;
  .devcfg-tab-common {
    width: 50px;
    height: 22px;
    border-radius: 5px 3px 0px 0px;
    line-height: 22px;
    text-align: center;
    float: left;
  }
  .devcfg-tab-selected {
    background-color: #aac0d5;
  }
  .devcfg-tab-default {
    background-color: #8d9fb3;
  }
}
</style>
