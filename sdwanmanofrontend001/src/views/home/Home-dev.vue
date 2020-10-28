<template>
  <div id="home">
    <div id="components-layout-demo-basic">
      <a-layout>
        <!-- 头部区域 -->
        <a-layout-header
          class="nav-wrap"
          :style="{
            padding: '5px 15px 0 5px',
            lineHeight: 'normal',
            height: '63px'
          }"
        >
          <!-- 头部top区 -->
          <a-row type="flex" justify="space-between" align="top">
            <!-- 头部左侧logo -->
            <a-col>
              <a href="/versa">
                <div class="versa-logo icon-task"></div>
              </a>
            </a-col>
            <!-- 头部右侧导航区 -->
            <a-col class="pull-right">
              <a-row type="flex" justify="space-between" align="top">
                <a-col class="task-iconbtn" title="Tasks">
                  <a-icon type="profile" />
                </a-col>
                <a-col class="info-iconbtn" pull="2" title="Information">
                  <a-icon type="info-circle" />
                </a-col>
                <!-- 导航下拉组件内容 -->
                <a-col>
                  <a-dropdown>
                    <a
                      class="ant-dropdown-link"
                      @click="e => e.preventDefault()"
                    >
                      <!-- {{ userInfo.username.toUpperCase() }} (
                      {{ userInfo.orgId }} ) -->
                      <a-icon type="down" />
                    </a>
                    <a-menu slot="overlay">
                      <a-sub-menu title="Language">
                        <a-menu-item
                          class="change-btn"
                          @click="changeLanguage('en')"
                          >English</a-menu-item
                        >
                        <a-menu-item
                          class="change-btn"
                          @click="changeLanguage('zh')"
                          >Chinese</a-menu-item
                        >
                      </a-sub-menu>
                      <a-menu-item @click="logOut()">Logout</a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <!-- 头部bottom -->
          <a-row
            class="nav-bottom"
            type="flex"
            justify="space-between"
            align="middle"
          >
            <a-col class="nav-bottom-item">
              <router-link class="link-btn" to="/configuration">
                {{ $t('Configuration') }}
              </router-link>
              <router-link class="link-btn" to="/workflows">
                {{ $t('Workflows') }}
              </router-link>
              <router-link class="link-btn" to="/administration">
                {{ $t('Administration') }}
              </router-link>
            </a-col>
            <a-col class="commit-btn">{{ $t('CommitTemplate') }}</a-col>
          </a-row>
        </a-layout-header>
        <!-- 加载条 -->
        <a-row
          class="reload"
          type="flex"
          justify="space-between"
          align="middle"
        >
          <a-col class="select-wrap">
            <a-row
              v-show="
                this.$route.name === 'Organization Users' ||
                  this.$route.name === 'Templates' ||
                  this.$route.name === 'Devices' ||
                  this.$route.name === 'Device'
              "
              type="flex"
              justify="start"
              align="middle"
            >
              <a-col
                style="color: #626c82;
    margin-right: 5px;font-size:14px"
                >Organization:</a-col
              >
              <a-col>
                <a-select
                  size="small"
                  placeholder="select"
                  style="width: 375px;"
                  @change="handleChange"
                >
                  <a-select-option
                    :value="item"
                    v-for="(item, index) in admNameList"
                    :key="index"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-col>
            </a-row>
          </a-col>
          <a-col style="color: #838b9c;font-size:18px; cursor:pointer">
            <a-icon type="redo" />
          </a-col>
        </a-row>
        <!-- 主体区域 -->
        <a-layout-content :style="{ height: screenHeight + 'px' }">
          <router-view></router-view>
        </a-layout-content>
        <!-- 底部信息 -->
        <a-layout-footer
          :style="{
            height: '18px',
            padding: '0',
            fontSize: '12px',
            background: 'rgb(208, 220, 228)',
            textAlign: 'right',
            zIndex: 66
          }"
        >
          <a-row type="flex" align="middle">
            <a-col :span="12">COPYRIGHT@CMCC</a-col>
            <a-col :span="12" :style="{ paddingRight: '15px' }">
              <b>Last Successful Login :</b> Wed, Sep 16 2020, 08:50 from
              117.186.242.158
            </a-col>
          </a-row>
        </a-layout-footer>
      </a-layout>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'Home',
  data() {
    return {
      screenHeight: document.body.clientHeight - 111
    };
  },
  computed: {
    ...mapState({
      admNameList: state => state.admNameList
      // userInfo: state => state.common.userInfo,
      // level: state => state.common.level
    })
  },
  mounted() {
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight;
        that.screenHeight = window.screenHeight - 111;
      })();
    };
  },
  methods: {
    ...mapMutations('common', ['clear']),
    changeLanguage(language) {
      this.$i18n.locale = language;
    },
    async handleChange(name) {
      if (this.$route.name === 'Organization Users') {
        this.$store.dispatch('adminUsersList', name);
      } else if (this.$route.name === 'Templates') {
        this.$store.dispatch('templateList', name);
      } else if (this.$route.name === 'Devices') {
        this.$store.dispatch('TableForm', {
          organization: name,
          offset: 0,
          limit: 2000,
          name
        });
      } else if (this.$route.name === 'Device') {
        this.$store.dispatch('Tabledevice', {
          deep: true,
          orgname: name,
          offset: 0,
          limit: 1000,
          name
        });
      } else {
        return false;
      }
    },
    logOut() {
      this.clear();
      localStorage.clear('user-token');
      this.$router.replace('/login');
    }
  },
  watch: {
    screenHeight(val) {
      if (!this.timer) {
        this.screenHeight = val;
        this.timer = true;
        let that = this;
        setTimeout(function() {
          that.timer = false;
        }, 400);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.nav-wrap {
  background-color: #36536b;
  .change-btn {
    padding: 2px;
    font-size: 12px;
    line-height: 18px;
    color: #626c82;
    &:hover {
      background: #798e95;
      color: #fff;
    }
  }
  .versa-logo {
    height: 34px;
    width: 180px;
    background: url('~@/assets/images/home/logo.png') no-repeat;
    background-size: contain;
    position: relative;
  }
  .pull-right {
    width: 305px;
    .task-iconbtn,
    .info-iconbtn {
      width: 30px;
      height: 21px;
      text-align: center;
      color: #fff;
    }
    .info-iconbtn {
      width: 46px;
      position: relative;
      &::before {
        position: absolute;
        content: '';
        border-right: 1px solid #5b636e;
        height: 14px;
        width: 1px;
        top: 4px;
        left: -3px;
      }
    }
    .ant-dropdown-link {
      font-size: 12px;
      color: #fff;
      transition: all 0.3s;
      &:hover {
        color: #a5a8ad;
      }
    }
  }
  .nav-bottom-item {
    padding: 1px 0 3px 197px;
    .link-btn {
      font-size: 14px;
      color: #fff;
      transition: all 0.3s;
      margin-right: 35px;
      line-height: 20px;
      padding: 0 5px;
      &:hover {
        color: #a5a8ad;
      }
    }
    .router-link-active {
      color: #0f2c3e;
      background: #a7d054;
      border-radius: 4px;
      &:hover {
        color: #0f2c3e;
      }
    }
  }
  .commit-btn {
    font-size: 12px;
    font-family: open_sansregular;
    transition: all 0.5s ease-out;
    display: inline-block;
    text-indent: 0;
    margin: 0;
    padding: 0 15px;
    text-align: center;
    text-decoration: none;
    color: #fff;
    line-height: 20px;
    &:hover {
      color: #a5a8ad;
    }
  }
}
/deep/ {
  .ant-dropdown-menu-submenu-title,
  .ant-dropdown-menu-item {
    padding: 2px;
    font-size: 12px;
    line-height: 18px;
    color: #626c82;
    &:hover {
      background: #798e95;
      color: #fff;
    }
  }
  .ant-dropdown-menu-submenu-arrow {
    display: none;
  }
}
.change-btn {
  padding: 2px;
  font-size: 12px;
  line-height: 18px;
  color: #626c82;
  padding: 3px 5px;
  &:hover {
    background: #798e95;
    color: #fff;
  }
}
.reload {
  height: 30px;
  background-color: #d0dce4;
  overflow: hidden;
  padding: 0 24px 0 36px;
  .select-wrap {
    width: 475px;
  }
}
</style>
