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
                      {{
                        userInfo.username ? userInfo.username.toUpperCase() : ''
                      }}
                      ( {{ userInfo.orgId }} )
                      <a-icon type="down" />
                    </a>
                    <a-menu slot="overlay">
                      <a-menu-item @click="visible = true"
                        >Change Password</a-menu-item
                      >
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
              <router-link
                v-if="!(userInfo.level === 3)"
                class="link-btn"
                to="/workflows"
              >
                {{ $t('Workflows') }}
              </router-link>
              <router-link
                v-if="!(userInfo.level === 3)"
                class="link-btn"
                to="/administration"
              >
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
            <a-row type="flex" justify="start" align="middle">
              <a-col
                v-show="showDevcieConfig"
                style="margin-right:5px;font-size:14px"
              >
                <a-button
                  size="small"
                  key="back_device"
                  type="primary"
                  @click="backDevicePage"
                >
                  Back
                </a-button>
              </a-col>
              <!-- v-model="curDeviceName" -->
              <a-col
                v-show="showDevcieConfig"
                style="color:#626c82;margin-right:5px;font-size:14px"
              >
                <!-- <a-select
                  size="small"
                  placeholder
                  @change="changeDevice"
                  style="width: 200px;margin-left:16px"
                >
                  <a-select-option
                    :default-value="curDeviceName"
                    v-for="deviceName in deviceNameList"
                    :key="deviceName"
                  >
                    {{ deviceName }}
                  </a-select-option>
                </a-select> -->
                <a-input
                  v-model="curDeviceName"
                  size="small"
                  style="width:200px"
                />
              </a-col>
              <a-col
                v-show="organShow"
                style="color: #626c82;
    margin-right: 5px;font-size:14px"
                >Organization:</a-col
              >
              <a-col v-show="organShow">
                <a-select
                  size="small"
                  placeholder="select"
                  style="width: 350px;"
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
            <a-icon @click="key = Math.random()" type="redo" />
          </a-col>
        </a-row>
        <!-- 主体区域 -->
        <a-layout-content :style="{ height: screenHeight + 'px' }">
          <router-view ref="main" :key="key"></router-view>
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
      <!-- 修改密码弹窗 -->
      <a-modal
        v-model="visible"
        title="Change  Password"
        @ok="handleOk"
        :bodyStyle="{
          backgroundColor: 'rgb(54, 83, 107)',
          padding: '0 10px 10px'
        }"
        :width="300"
        wrapClassName="from-wrap"
        cancelText="Cancel"
        okText="Ok"
        :afterClose="cleanData"
      >
        <a-form-model ref="passWordChange" :model="passWordData" :rules="rules">
          <a-form-model-item>
            <a-input size="small" type="hidden" v-model="passWordData.userId" />
          </a-form-model-item>
          <a-form-model-item label="Current Password" prop="oldPassword">
            <a-input-password
              size="small"
              type="password"
              v-model="passWordData.oldPassword"
              @mouseenter="enter('oldPassword')"
              @mouseleave="leave"
              @mousemove="updateXY"
            />
          </a-form-model-item>
          <a-form-model-item label="New Password" prop="newPassword">
            <a-input-password
              size="small"
              type="password"
              v-model="passWordData.newPassword"
              @mouseenter="enter('newPassword')"
              @mouseleave="leave"
              @mousemove="updateXY"
            />
          </a-form-model-item>
          <a-form-model-item label="Confirm New Password" prop="confirm">
            <a-input-password
              size="small"
              type="password"
              v-model="passWordData.confirm"
              @mouseenter="enter('confirm')"
              @mouseleave="leave"
              @mousemove="updateXY"
            />
          </a-form-model-item>
          <a-form-model-item>
            <a-input
              size="small"
              type="hidden"
              v-model="passWordData.systemId"
            />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 修改密码悬浮提示框 -->
      <div
        v-show="changePassword.flag"
        class="change-passwrod"
        :style="changePassword.positionStyle"
      >
        {{ changePassword.tipText }}
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { passWordEdt } from 'apis/administration';
export default {
  name: 'Home',
  data() {
    // 右上角修改密码表单验证
    let oldPassword = (rule, value, callback) => {
      if (value === '') {
        callback('Field required');
      } else {
        callback();
      }
    };
    let newPassword = (rule, value, callback) => {
      if (value === '') {
        callback('Field required');
      } else {
        if (
          this.passWordData.newPassword.length < 8 ||
          this.passWordData.newPassword.length > 16
        ) {
          callback();
        }
        callback('Password length should be 8 to 16 characters');
      }
    };
    let confirm = (rule, value, callback) => {
      if (value === '') {
        callback('Field required');
      } else if (value !== this.passWordData.newPassword) {
        callback('Passwords do not match');
      } else {
        callback();
      }
    };
    return {
      // 组织名称列表下拉框显示
      organShow: false,
      // 组织名称下拉需要显示的页面对应得路由名称
      rotuerName: [
        'OrganizationUsers',
        'Templates',
        'Devices',
        'Device',
        'VPNConfigFile',
        'Schedules'
      ],
      // 弹框开关
      visible: false,
      // 主体区域高度自适应屏幕
      screenHeight: document.body.clientHeight - 111,
      // 修改密码提交字段
      passWordData: {
        userId: '',
        oldPassword: '',
        newPassword: '',
        confirm: '',
        systemId: ''
      },
      // 密码表单验证
      rules: {
        oldPassword: [{ validator: oldPassword }],
        newPassword: [{ validator: newPassword }],
        confirm: [{ validator: confirm }]
      },
      key: 1,
      // 修改密码表单悬浮框
      changePassword: {
        flag: false,
        tipText: 'czzczcxzczcxzczcxzczxczxczc',
        x: 0,
        y: 0,
        positionStyle: { top: '20px', left: '20px' }
      }
    };
  },
  computed: {
    ...mapState({
      admNameList: state => state.admNameList,
      // 获取用户信息
      userInfo: state => state.common.userInfo,
      // 获取用户accountId
      accountId: state => state.common.accountId,
      deviceNameList: 'deviceNameList',
      curDeviceName: 'deviceName'
    }),
    showDevcieConfig() {
      return this.$route.path.indexOf('/configuration/deviceConfig') == 0;
    },
    showOrganization() {
      return (
        this.$route.name === 'Organization Users' ||
        this.$route.name === 'Templates' ||
        this.$route.name === 'Devices' ||
        this.$route.name === 'Device' ||
        this.$route.path.indexOf('/configuration/deviceConfig') == 0
      );
    }
  },
  created() {
    // 页面创建判断是否要显示组织下拉框
    this.organShow = this.rotuerName.includes(this.$route.name);
    // home页组织下拉数据获取
    if (this.organShow) {
      this.getNameList();
    }
  },
  mounted() {
    // 表单高度屏幕缩放自适应
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
    ...mapMutations(['saveOrganization']),
    ...mapActions([
      'getNameList',
      'adminUsersList',
      'templateList',
      'TableForm',
      'Tabledevice'
    ]),
    // 右上角国际化切换
    changeLanguage(language) {
      this.$i18n.locale = language;
    },
    backDevicePage() {
      this.$router.go(-1);
    },
    changeDevice(value) {
      console.log('changeDevice', value);
    },
    // 组织对应查询数据列表
    async handleChange(name) {
      if (this.$route.name === 'OrganizationUsers') {
        // 下拉组织对于租户列表jw
        this.adminUsersList({
          organization: name,
          offset: 0,
          limit: 100
        });
      } else if (this.$route.name === 'Templates') {
        // 下拉组织对于模板列表jw
        this.templateList({
          orgname: name,
          offset: 0,
          limit: 100
        });
      } else if (this.$route.name === 'Devices') {
        // 下拉组织对于Devices列表zwj
        this.TableForm({
          organization: name,
          offset: 0,
          limit: 100,
          name
        });
      } else if (this.$route.name === 'Device') {
        // 下拉组织对于Device列表zwj
        this.Tabledevice({
          deep: true,
          orgname: name,
          offset: 0,
          limit: 100,
          name
        });
      } else {
        this.saveOrganization({ organization: name });
        return false;
      }
    },
    // 修改密码提交事件
    handleOk() {
      this.passWordData.systemId = this.userInfo.systemId;
      this.passWordData.userId = this.accountId;
      this.$refs.passWordChange.validate(async (valid, res) => {
        if (valid) {
          const changePassWordRes = await passWordEdt(this.passWordData);
          if (changePassWordRes.status !== '0000')
            return this.$message.error(changePassWordRes.message);
          this.$message.success('密码修改成功！');
          this.visible = false;
        } else {
          if (res.oldPassword) {
            this.$message.error(res.oldPassword[0].message);
          } else if (res.newPassword) {
            this.$message.error(res.newPassword[0].message);
          } else {
            this.$message.error(res.confirm[0].message);
          }
        }
      });
    },
    // 用户退出登录操作 清除用户信息和token 跳转登录页
    logOut() {
      this.clear();
      localStorage.clear('user-token');
      this.$router.replace('/login');
    },
    // 关闭弹窗表单重置
    cleanData() {
      this.$refs.passWordChange.resetFields();
    },
    // 修改密码悬浮提示
    enter(field) {
      if (field === 'oldPassword') {
        console.log(111);
      }
      this.changePassword.flag = true;
    },
    leave() {
      this.changePassword.flag = false;
    },
    updateXY(event) {
      this.x = event.pageX;
      this.y = event.pageY;
      this.changePassword.positionStyle = {
        top: this.y + 14 + 'px',
        left: this.x - 2 + 'px'
      };
    }
  },
  watch: {
    // 屏幕高度监视
    screenHeight(val) {
      if (!this.timer) {
        this.screenHeight = val;
        this.timer = true;
        let that = this;
        setTimeout(function() {
          that.timer = false;
        }, 400);
      }
    },
    // 用户信息监视 根据level 获取权限页面 并跳转
    userInfo: {
      handler(data) {
        if (data.level) {
          data.level === 3
            ? this.$router.replace('/configuration')
            : this.$router.replace('/administration');
        }
      },
      deep: true
    },
    // 监视路由变化通过路由name判断是否显示下拉框
    $route: {
      handler: function(val) {
        this.rotuerName.includes(val.name)
          ? (this.organShow = true)
          : (this.organShow = false);
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.ant-form-explain {
  display: none !important;
}
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
    min-width: 475px;
  }
}
/deep/ .from-wrap {
  .ant-modal-header {
    color: rgb(13, 73, 106);
    background-color: rgb(233, 244, 252);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    padding: 6px 10px;
    .ant-modal-title {
      font-size: 12px;
    }
  }
  .ant-modal-close {
    color: rgb(13, 73, 106);
    font-weight: 700;
    .ant-modal-close-x {
      width: 30px;
      height: 34px;
      .anticon {
        vertical-align: 0.5em;
      }
    }
  }
  .ant-modal-footer {
    background-color: rgb(220, 237, 248);
    .ant-btn {
      line-height: 30px;
      padding: 0px 12px;
      background: rgb(63, 74, 91);
      color: rgb(255, 255, 255);
      transition: all 0.5s ease-out 0s;
      border-radius: 4px;
      font-size: 12px;
      border: 0;
      min-width: 70px;
      &:hover {
        background: rgb(153, 190, 77) rgb(79, 93, 114);
      }
    }
    .ant-btn-primary {
      background: rgb(167, 208, 84);
      &:hover {
        background: rgb(153, 190, 77);
      }
    }
  }
  .ant-modal-body {
    .ant-form-item {
      margin: 0;
      .ant-form-item-label {
        line-height: 20px;
        padding: 0;
        label {
          color: rgb(249, 249, 249);
          font-size: 12px;
          line-height: 18px;
          &::after {
            content: '*';
            color: #ee6978;
            font-size: 14px;
            padding-left: 1px;
            vertical-align: top;
          }
        }
      }
      .ant-form-item-control {
        line-height: normal;
      }
    }
  }
}
.change-passwrod {
  position: fixed;
  background: #ffffb1;
  line-height: 26px;
  padding: 0 10px;
  border-radius: 6px;
  left: 50%;
  top: 45%;
  z-index: 9999;
}
</style>
