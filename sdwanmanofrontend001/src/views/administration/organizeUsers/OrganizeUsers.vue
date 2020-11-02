<template>
  <div id="orguser">
    <!-- 头部信息 -->
    <div class="list-action">
      <a-row
        class="table-header"
        type="flex"
        justify="space-between"
        align="middle"
      >
        <!-- 搜索栏 -->
        <a-col class="search-bar" :style="{ width: 'calc(100% - 475px) ' }">
          <a-input
            ref="searchInput"
            v-model="keyworks"
            placeholder="Search"
            @keyup.enter="search"
          >
            <a-icon slot="prefix" type="search" />
            <a-icon
              @click="keyworks = ''"
              v-show="keyworks != ''"
              slot="suffix"
              type="close"
            />
          </a-input>
        </a-col>
        <!-- 表格头部右侧 -->
        <a-col>
          <a-row
            :style="{ width: '425px' }"
            type="flex"
            justify="end"
            align="middle"
          >
            <!-- 组织用户添加 -->
            <a-col
              @click="addUser"
              :style="{
                fontSize: '18px',
                cursor: 'pointer',
                marginRight: '20px'
              }"
            >
              <a-icon type="plus" />
            </a-col>
            <!-- 组织用户删除 -->
            <a-col
              @click="delAdmUser"
              :style="{
                fontSize: '18px',
                cursor: 'pointer',
                marginRight: '20px'
              }"
            >
              <a-icon type="minus" />
            </a-col>
            <!-- 分页功能模块 -->
            <a-col>
              <v-pagination
                :total="this.admUsersList.totalCount"
                size="small"
                :page-size="pageSize"
                :layout="['prev', 'jumper', 'total', 'next', 'sizer']"
                @page-change="pageChange"
                @page-size-change="pageSizeChange"
              ></v-pagination>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <!-- 表单主体内容 -->
    <v-table
      is-horizontal-resize
      is-vertical-resize
      column-width-drag
      :columns="columns"
      :table-data="admUsersList.list"
      :select-change="delItem"
      style="width:100%"
      isFrozen="true"
      @on-custom-comp="edtAdmUser"
    ></v-table>
    <!-- 数据添加编辑弹窗 -->
    <a-modal
      v-model="visible"
      :title="modalTitle"
      @ok="handleOk"
      :width="526"
      wrapClassName="form-wrap"
      cancelText="Cancel"
      okText="Ok"
      :afterClose="cleanData"
    >
      <!-- 添加修改表单 -->
      <a-form-model
        :model="formData.user"
        ref="orgUser"
        :rules="rules"
        layout="vertical"
        @validate="validate"
        hideRequiredMark
      >
        <a-row type="flex" justify="space-between" align="top">
          <!-- 组织用户名 -->
          <a-col :style="{ width: '162px' }">
            <a-form-model-item label="User Name" prop="name">
              <a-input
                size="small"
                :disabled="modalType === 'edt'"
                v-model="formData.user.name"
                @mouseenter="enter('name')"
                @mouseleave="leave"
                @mousemove="updateXY"
              />
            </a-form-model-item>
          </a-col>
          <!-- First Name -->
          <a-col :style="{ width: '162px' }">
            <a-form-model-item label="First Name" prop="firstname">
              <a-input
                size="small"
                v-model="formData.user.firstname"
                @mouseenter="enter('firstname')"
                @mouseleave="leave"
                @mousemove="updateXY"
              />
            </a-form-model-item>
          </a-col>
          <!-- Last Name -->
          <a-col :style="{ width: '162px' }">
            <a-form-model-item label="Last Name" prop="lastname">
              <a-input
                size="small"
                v-model="formData.user.lastname"
                @mouseenter="enter('lastname')"
                @mouseleave="leave"
                @mousemove="updateXY"
              />
            </a-form-model-item>
          </a-col>
          <!-- 密码 -->
          <a-col :style="{ width: '162px' }">
            <a-form-model-item label="Password" prop="password">
              <a-input
                :disabled="modalType === 'edt'"
                size="small"
                type="password"
                v-model="formData.user.password"
                @mouseenter="enter('password')"
                @mouseleave="leave"
                @mousemove="updateXY"
              />
            </a-form-model-item>
          </a-col>
          <!-- 确认密码 -->
          <a-col :style="{ width: '162px' }">
            <a-form-model-item label="Confirm Password" prop="confirm">
              <a-input
                :disabled="modalType === 'edt'"
                size="small"
                type="password"
                v-model="formData.user.confirm"
                @mouseenter="enter('confirm')"
                @mouseleave="leave"
                @mousemove="updateXY"
              />
            </a-form-model-item>
          </a-col>
          <!-- 邮箱地址 -->
          <a-col :style="{ width: '162px' }">
            <a-form-model-item label="Email Address" prop="email">
              <a-input
                :disabled="modalType === 'edt'"
                size="small"
                v-model="formData.user.email"
                @mouseenter="enter('email')"
                @mouseleave="leave"
                @mousemove="updateXY"
              />
            </a-form-model-item>
          </a-col>
          <!-- 组织角色列表 -->
          <a-col :style="{ marginTop: '10px' }">
            <a-form-model-item
              class="roles-select"
              label="Available Roles"
              v-model="formData.user.primaryRole"
              prop="primaryRole"
            >
              <a-select
                size="small"
                placeholder="-select-"
                v-model="formData.user.primaryRole"
                @mouseenter="enter('primaryRole')"
                @mouseleave="leave"
                @mousemove="updateXY"
              >
                <a-select-option
                  v-if="userInfo.level === 1"
                  value="TenantSuperAdmin"
                  >TenantSuperAdmin</a-select-option
                >
                <a-select-option
                  v-if="!(userInfo.level === 3)"
                  value="TenantOperator"
                  >TenantOperator</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>

    <!-- 表单验证悬浮提示框 -->
    <div
      v-show="formTips.flag"
      class="form-tips"
      :style="formTips.positionStyle"
    >
      {{ formTips.tipText }}
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { adminUserAdd, adminUserDel, adminUserEdt } from 'apis/administration';
export default {
  data() {
    // 自定义表单验证
    let name = (rule, value, callback) => {
      if (value === '') {
        callback('Field required');
      } else if (value.length > 50) {
        callback('Length must not be greater than 50.');
      } else if (!/^[A-Za-z0-9_-]{1,}$/.test(value)) {
        callback(
          'Name cannot contain special characters or spaces except "_","-","."'
        );
      } else {
        callback();
      }
    };
    let firstname = (rule, value, callback) => {
      if (value === '') {
        callback('Field required');
      } else if (value.length > 64 || value.length < 2) {
        callback('Length must be 2 to 64 characters.');
      } else if (!/^[A-Za-z0-9_-]{2,}$/.test(value)) {
        callback(
          'Name cannot contain special characters or spaces except "_","-","."'
        );
      } else {
        callback();
      }
    };
    let lastname = (rule, value, callback) => {
      if (value === '') {
        callback('Field required');
      } else if (!/^[A-Za-z0-9_-]*$/.test(value)) {
        callback(
          '1.Should begin with a character 2.Name cannot contain special characters or spaces except "_","-","."'
        );
      } else {
        callback();
      }
    };
    let password = (rule, value, callback) => {
      if (value === '') {
        callback('Field required');
      } else if (!/^[\S\n\s]{8,16}$/.test(value)) {
        callback('Password length should be 8 to 16 characters');
      } else {
        callback();
      }
    };
    let confirm = (rule, value, callback) => {
      if (value === '') {
        callback('Field required');
      } else if (value !== this.formData.user.password) {
        callback('Passwords do not match');
      } else {
        callback();
      }
    };
    let email = (rule, value, callback) => {
      if (value === '') {
        callback('Field required');
      } else if (
        !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
      ) {
        callback('Invalid email address');
      } else {
        callback();
      }
    };
    let primaryRole = (rule, value, callback) => {
      if (value === '') {
        callback('Select Role');
      } else {
        callback();
      }
    };
    return {
      //分页
      pageIndex: 1,
      pageSize: 20,
      totalCount: 100,
      keyworks: '', //搜索关键字
      tableData: [], //表格数据源
      visible: false, //弹出层开关
      modalTitle: '', //表单标题
      modalType: '', //表单编辑or新建
      userRoles: [], ////用户权限
      // 修改密码表单悬浮框
      formTips: {
        flag: false,
        tipText: '',
        x: 0,
        y: 0,
        positionStyle: { top: '20px', left: '20px' }
      },
      //表单提示信息
      message: {
        name: '',
        password: '',
        firstname: '',
        lastname: '',
        email: '',
        primaryRole: ''
      },
      // 表格列数据模型
      columns: [
        {
          width: 36,
          titleAlign: 'center',
          columnAlign: 'center',
          type: 'selection'
        },
        {
          field: 'name',
          title: 'User Name',
          width: 246,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          componentName: 'organzeUsers-name'
        },
        {
          field: 'firstname',
          title: 'First Name',
          width: 246,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'lastname',
          title: 'Last Name',
          width: 246,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'primaryRole',
          title: 'Primary Role',
          width: 246,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        }
      ],
      // 表单提交更新模型
      formData: {
        user: {
          name: '',
          password: '',
          confirm: '',
          firstname: '',
          lastname: '',
          email: '',
          organization: '',
          primaryRole: ''
        }
      },
      //用户删除参数
      admUserDel: {
        id: ''
      },
      // 表单校验规则
      rules: {
        name: [{ validator: name }],
        firstname: [{ validator: firstname }],
        lastname: [{ validator: lastname }],
        password: [{ validator: password }],
        confirm: [{ validator: confirm }],
        email: [{ validator: email }],
        primaryRole: [{ validator: primaryRole }]
      }
    };
  },
  computed: {
    ...mapState({
      // 获取当前组织
      organization: state => state.organization,
      // 获取用户信息 level
      userInfo: state => state.common.userInfo,
      // 获取用户租户列表数据
      admUsersList: state => state.admUsersList
    })
  },
  created() {
    //获取组织列表
    if (this.organization) {
      this.adminUsersList({
        organization: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    } else {
      this.getNameList();
    }
  },
  methods: {
    ...mapActions(['getNameList', 'adminUsersList']),
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.adminUsersList({
        organization: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.adminUsersList({
        organization: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    },
    search() {
      console.log(this.keyworks);
    },
    selectChange(selection, rowData) {
      console.log('select-change', selection, rowData);
    },
    // 输入框同步提示信息
    validate(field, valid, message) {
      if (valid) {
        this.message[field] = '';
      } else {
        this.message[field] = message;
      }
    },
    // 修改密码悬浮提示
    enter(field) {
      if (this.message) {
        this.formTips.tipText = '';
        switch (field) {
          case 'name':
            this.formTips.tipText = this.message.name;
            break;
          case 'firstname':
            this.formTips.tipText = this.message.firstname;
            break;
          case 'lastname':
            this.formTips.tipText = this.message.lastname;
            break;
          case 'password':
            this.formTips.tipText = this.message.password;
            break;
          case 'confirm':
            this.formTips.tipText = this.message.confirm;
            break;
          case 'email':
            this.formTips.tipText = this.message.email;
            break;
          case 'primaryRole':
            this.formTips.tipText = this.message.primaryRole;
            break;
        }

        this.formTips.flag = true;
      }
    },
    leave() {
      this.formTips.flag = false;
    },
    updateXY(event) {
      this.x = event.pageX;
      this.y = event.pageY;
      this.formTips.positionStyle = {
        top: this.y + 14 + 'px',
        left: this.x - 2 + 'px'
      };
    },
    //添加组织用户
    async addUser() {
      console.log(this.organization);
      if (!this.organization) {
        this.$message.error('请选择组织用户！');
        return false;
      }
      this.modalTitle = `Add user for Organization ${this.organization}`;
      this.modalType = 'add';
      //获取当前组织并赋值
      this.formData.user.organization = this.organization;
      this.visible = true;
    },
    //获取删除表单的name
    delItem(selection, rowData) {
      this.admUserDel.id = rowData.name;
    },
    // 删除选中组织用户
    async delAdmUser() {
      const res = await adminUserDel(this.admUserDel);
      if (res.status !== '0000') return this.$message.error(res.status.message);
      this.$message.success('组织用户删除成功！');
      this.adminUsersList({
        organization: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    },
    //编辑组织用户
    async edtAdmUser(params) {
      this.modalTitle = 'Edit Organization User';
      this.modalType = 'edt';
      this.visible = true;
      this.formData.user = params.rowData;
    },
    async handleOk() {
      if (this.modalType === 'add') {
        this.$refs.orgUser.validate(async valid => {
          if (valid) {
            const result = await adminUserAdd(this.formData);
            if (result.status !== '0000')
              return this.$message.error(result.message);
            this.$message.success('组织用户创建成功！');
            this.visible = false;
            this.adminUsersList({
              organization: this.organization,
              offset: (this.pageIndex - 1) * this.pageSize,
              limit: this.pageSize
            });
          }
        });
      }
      if (this.modalType === 'edt') {
        this.$refs.orgUser.validateField(
          ['firstname', 'lastname', 'primaryRole'],
          async () => {
            if (
              !this.message.firstname &&
              !this.message.lastname &&
              !this.message.primaryRole
            ) {
              const res = await adminUserEdt(
                this.formData.user.name,
                this.formData
              );
              if (res.status !== '0000')
                return this.$message.error(res.message);
              this.$message.success('组织用户更新成功！');
              this.visible = false;
              this.adminUsersList({
                organization: this.organization,
                offset: (this.pageIndex - 1) * this.pageSize,
                limit: this.pageSize
              });
            }
          }
        );
      }
    },
    cleanData() {
      this.$refs.orgUser.clearValidate();
      this.formData = {
        user: {
          name: '',
          password: '',
          confirm: '',
          firstname: '',
          lastname: '',
          email: '',
          organization: '',
          primaryRole: ''
        }
      };
      this.message = {
        name: '',
        password: '',
        firstname: '',
        lastname: '',
        email: '',
        primaryRole: ''
      };
    }
  }
};
import Vue from 'vue';
Vue.component('organzeUsers-name', {
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  template: `<span>
        <a href="" @click.stop.prevent="update(rowData,index)">{{rowData.name}}</a>&nbsp;
        </span>`,
  methods: {
    update() {
      // 参数根据业务场景随意构造
      let params = { index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    }
  }
});
import { FormModel } from 'ant-design-vue';
Vue.use(FormModel);
</script>
<style lang="scss" scoped>
/deep/.ant-form-explain {
  display: none !important;
}
#orguser {
  padding: 5px 20px 30px 15px;
  height: 100%;
  overflow: hidden;
  min-height: 503px;
  .list-action {
    line-height: 18px;
    color: #0f2c3e;
    font-size: 12px;
    margin-bottom: 10px;
    .table-header {
      margin-bottom: 10px;
      height: 22px;
    }
  }
}
.roles-select {
  position: relative;
  width: 225px;
  padding: 10px 10px 10px;
  border: 1px solid #456880;
  border-radius: 4px;
  margin-top: 40px;
  &::before {
    content: 'Roles';
    background: #507691;
    border-radius: 4px;
    padding: 2px 5px;
    position: absolute;
    left: 5px;
    top: -10px;
    font-size: 12px;
    color: #fff;
  }
}
/deep/ .search-bar {
  .ant-input {
    color: #6a6f75;
    border: 1px solid #b0c7d5;
    height: 20px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 18px;
    &:focus {
      box-shadow: none;
      border-color: #b0c7d5;
    }
  }
}
</style>
