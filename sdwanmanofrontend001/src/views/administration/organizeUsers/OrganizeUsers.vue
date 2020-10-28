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
        <a-col :style="{ width: 'calc(100% - 475px) ' }">
          <a-input
            class="search-bar"
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
      column-width-drag
      :columns="columns"
      :table-data="admUsersList.list"
      :select-change="delItem"
      :height="350"
      style="width:100%"
      isFrozen="true"
      @on-custom-comp="edtAdmUser"
    ></v-table>
    <!-- 数据添加编辑弹窗 -->
    <a-modal
      v-model="visible"
      :title="modalTitle"
      @ok="handleOk"
      :bodyStyle="{
        backgroundColor: 'rgb(54, 83, 107)',
        padding: '0 10px 10px'
      }"
      :width="526"
      wrapClassName="from-wrap"
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
        hideRequiredMark
      >
        <a-row type="flex" justify="space-between" align="top">
          <!-- 组织用户名 -->
          <a-col>
            <a-form-model-item label="User Name" prop="name">
              <a-input
                size="small"
                :disabled="modalType === 'edt'"
                v-model="formData.user.name"
              />
            </a-form-model-item>
          </a-col>
          <!-- First Name -->
          <a-col>
            <a-form-model-item label="First Name" prop="firstname">
              <a-input size="small" v-model="formData.user.firstname" />
            </a-form-model-item>
          </a-col>
          <!-- Last Name -->
          <a-col>
            <a-form-model-item label="Last Name" prop="lastname">
              <a-input size="small" v-model="formData.user.lastname" />
            </a-form-model-item>
          </a-col>
          <!-- 密码 -->
          <a-col>
            <a-form-model-item label="Password" prop="password">
              <a-input
                :disabled="modalType === 'edt'"
                size="small"
                type="password"
                v-model="formData.user.password"
              />
            </a-form-model-item>
          </a-col>
          <!-- 邮箱地址 -->
          <a-col>
            <a-form-model-item label="Email Address" prop="email">
              <a-input
                :disabled="modalType === 'edt'"
                size="small"
                v-model="formData.user.email"
              />
            </a-form-model-item>
          </a-col>
          <!-- 组织角色列表 -->
          <a-col>
            <a-form-model-item
              class="roles-select"
              style="width:225px;padding:10px 10px 10px;border: 1px solid #456880;border-radius: 4px;margin-top:20px"
              label="Available Roles"
              prop="primaryRole"
            >
              <a-select
                size="small"
                placeholder="-select-"
                v-model="formData.user.primaryRole"
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
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { adminUserAdd, adminUserDel, adminUserEdt } from 'apis/administration';
export default {
  data() {
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
        name: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        firstname: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        lastname: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        primaryRole: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        personalizedLandingPage: [
          {
            required: true,
            trigger: 'change'
          }
        ]
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
    this.$store.dispatch('getNameList');
    if (this.organization) {
      this.$store.dispatch('adminUsersList', {
        organization: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    }
  },
  methods: {
    ...mapActions(['adminUsersList']),
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
      // 列表更新
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
        const result = await adminUserAdd(this.formData);
        if (result.status !== '0000')
          return this.$message.error(result.message);
        this.$message.success('组织用户创建成功！');
        // 列表更新
        this.adminUsersList({
          organization: this.organization,
          offset: (this.pageIndex - 1) * this.pageSize,
          limit: this.pageSize
        });
        this.visible = false;
      }
      if (this.modalType === 'edt') {
        const res = await adminUserEdt(this.formData.user.name, this.formData);

        if (res.status !== '0000') return this.$message.error(res.message);
        this.$message.success('组织用户更新成功！');
        this.visible = false;
      }
    },
    cleanData() {
      this.formData = {
        user: {
          name: '',
          password: '',
          firstname: '',
          lastname: '',
          email: '',
          role: [],
          organization: '',
          primaryRole: ''
        }
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
      background: rgb(167, 208, 84);
      color: rgb(255, 255, 255);
      transition: all 0.5s ease-out 0s;
      border-radius: 4px;
      font-size: 12px;
      border: 0;
      min-width: 70px;
      &:hover {
        background: rgb(153, 190, 77);
      }
    }
    .ant-btn-primary {
      background: rgb(63, 74, 91);
      &:hover {
        background: rgb(79, 93, 114);
      }
    }
  }
  .ant-modal-body {
    .ant-form-item {
      width: 162px;
      margin: 0;
      .ant-form-item-label {
        width: 100%;
        padding: 0;
        label {
          color: rgb(249, 249, 249);
          font-size: 12px;
          line-height: 18px;
        }
      }
    }
  }
}
</style>
