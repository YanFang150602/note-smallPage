<template>
  <a-spin :spinning="spinning" class="containters">
    <div class="login-con">
      <div class="login-top">
        <div class="logo"></div>
        <div class="title">CMCC SDWAN</div>
      </div>
      <div class="input-wrap">
        <a-form-model
          ref="loginRef"
          :model="loginData"
          :rules="loginRule"
          hideRequiredMark
          layout="vertical"
        >
          <a-form-model-item prop="username" ref="username">
            <a-input v-model="loginData.username" placeholder="User Name" />
          </a-form-model-item>
          <a-form-model-item prop="password" ref="password">
            <a-input-password
              v-model="loginData.password"
              type="password"
              placeholder="Password"
            />
          </a-form-model-item>
        </a-form-model>
        <div class="tip-message">{{ tipMessage }}</div>
        <div class="login-btn">
          <a-button type="primary" html-type="submit" @click="userlogin()"
            >Login</a-button
          >
        </div>
        <div class="controls-link">
          <a href="resetpassword" class="link">Forgot Password</a>
        </div>
      </div>
    </div>
  </a-spin>
</template>
<script>
import { login, getUserInfo } from 'apis/common';
import { mapMutations } from 'vuex';
export default {
  data() {
    const validatorUserName = (rule, value, callback) => {
      if (!value) {
        callback('Enter Username');
      } else {
        callback();
      }
    };
    const validatorPassword = (rule, value, callback) => {
      if (!value) {
        callback('Enter Password');
      } else {
        callback();
      }
    };
    return {
      spinning: false,
      // 表单错误信息
      tipMessage: '',
      loginData: {
        // 用户名
        username: 'core',
        // 用户密码
        password: '@e6vC3sj6d3J9@3##'
      },
      loginRule: {
        username: [{ required: true, validator: validatorUserName }],
        password: [{ required: true, validator: validatorPassword }]
      }
    };
  },
  methods: {
    ...mapMutations('common', ['set_token', 'set_user_info']),
    userlogin() {
      this.$refs.loginRef.validate(async (valid, messages) => {
        switch (true) {
          case Object.prototype.hasOwnProperty.call(messages, 'username'):
            this.tipMessage = messages.username[0].message;
            break;
          case Object.prototype.hasOwnProperty.call(messages, 'password'):
            this.tipMessage = messages.password[0].message;
            break;
        }
        if (valid) {
          this.spinning = true;
          const userData = {
            loginType: 'ACCOUNT',
            evidenceType: 'PASSWORD',
            userName: this.loginData.username,
            evidence: this.loginData.password,
            encrypted: false
          };
          const loginRes = await login(userData);
          if (loginRes.status !== '000_0000_0000')
            return (this.tipMessage = 'Invalid user name or password.');
          const token = loginRes.result.accessToken;
          this.set_token(token);
          const { accountId } = loginRes.result;
          if (accountId) {
            const userInfoRes = await getUserInfo(accountId);
            this.spinning = false;
            if (userInfoRes.status !== '0000')
              return this.$message.error(userInfoRes.message);
            this.set_user_info({ userInfoRes, accountId });
            userInfoRes.result.level === 3
              ? this.$router.replace('/configuration')
              : this.$router.replace('/administration');
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.ant-form-explain {
  display: none !important;
}
.containters {
  background: #0d496a url('~@/assets/images/login/waves.png') no-repeat center
    bottom;
  background-attachment: fixed;
  background-size: 100% auto;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  .login-con {
    width: 450px;
    height: 320px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    z-index: 111;
    background: #0b3d59;
    border-radius: 25px;
    overflow: hidden;
    .login-top {
      height: 75px;
      font-size: 18px;
      border-radius: 25px 25px 0 0;
      background: #fff;
      border: 1px solid;
      position: relative;
      &::before {
        position: absolute;
        content: '';
        width: 2px;
        height: 60px;
        background-color: #ccc;
        left: 200px;
        top: 8px;
      }
      .logo {
        width: 200px;
        height: 75px;
        background: url(~@/assets/images/login/versa-logo.png) no-repeat 30px
          20px;
        float: left;
      }
      .title {
        font-size: 18px;
        color: #0090bc;
        line-height: 75px;
        width: 240px;
        float: right;
        text-align: center;
      }
    }
    .input-wrap {
      /deep/.ant-form {
        margin: 20px 0 0 100px;
        width: 260px;
        .ant-form-item {
          width: 260px;
          margin: 0;
          height: 46px;
          padding: 10px 0;
          .ant-form-item-control-wrapper {
            margin: 0;
            height: 26px;
            line-height: 26px;
            .ant-form-item-control {
              height: 26px;
              line-height: 26px;
              .ant-input {
                background-color: #0b3d59;
                border: 2px solid #4b768e;
                box-shadow: none;
                color: #a5b0b8;
                font-size: 12px;
                line-height: 26px;
                height: 26px;
              }
            }
          }
        }
      }
      .tip-message {
        padding-left: 105px;
        font-size: 11px;
        color: #ee6978;
        margin-bottom: 10px;
      }
      .login-btn {
        padding-left: 289px;
        button {
          font-weight: 500;
          min-width: 70px;
          font-size: 14px;
          line-height: 20px;
          text-align: center;
          vertical-align: middle;
          border-color: #5aa2d0;
          background-color: #0090bc;
          background-image: none;
          text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
          &:hover {
            background-color: #0072bc;
            background-image: none;
          }
        }
      }
      .controls-link {
        padding-left: 273px;
      }
      .controls-link .link {
        color: #7bb7d4;
        font-size: 12px;
      }
    }
  }
}
</style>
