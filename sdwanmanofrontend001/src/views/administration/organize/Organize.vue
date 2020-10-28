<template>
  <div id="organize">
    <!-- 头部信息 -->
    <div class="list-action">
      <!-- 表头部分 -->
      <a-row
        class="table-header"
        type="flex"
        justify="space-between"
        align="middle"
      >
        <!-- 搜索栏 -->
        <a-col :style="{ width: 'calc(100% - 475px) ' }">
          <a-input
            size="small"
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
        <!-- 表格功能按钮 -->
        <a-col>
          <a-row
            :style="{ width: '425px' }"
            type="flex"
            justify="end"
            align="middle"
          >
            <!-- 添加组织按钮 -->
            <a-col
              v-if="userInfo.level === 1"
              @click="addAdm"
              :style="{
                fontSize: '18px',
                cursor: 'pointer',
                marginRight: '20px'
              }"
            >
              <a-icon type="plus" />
            </a-col>
            <!-- 删除组织按钮 -->
            <a-col
              v-if="userInfo.level === 1"
              @click="delAdm"
              :style="{
                fontSize: '18px',
                cursor: 'pointer',
                marginRight: '20px'
              }"
            >
              <a-icon type="minus" />
            </a-col>
            <!-- 分页功能 -->
            <a-col>
              <v-pagination
                :total="totalCount"
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
      :table-data="tableData"
      :select-change="delItem"
      :height="525"
      style="width:100%"
      isFrozen="true"
      @on-custom-comp="edtAdm"
    ></v-table>
    <!-- 数据添加编辑弹窗 -->
    <a-modal
      v-model="visible"
      :title="modalTitle"
      :bodyStyle="{
        backgroundColor: 'rgb(54, 83, 107)',
        padding: '0 10px 10px'
      }"
      :width="865"
      wrapClassName="from-wrap"
      :afterClose="cleanData"
    >
      <!-- 提交表单 -->
      <a-form-model
        :model="organization"
        ref="organization"
        :rules="rules"
        layout="vertical"
        hideRequiredMark
      >
        <a-row type="flex" justify="space-between" align="top">
          <!-- 组织名称 -->
          <a-col>
            <a-form-model-item
              @blur.native.capture="routeAdd"
              label="Name"
              prop="orgName"
            >
              <a-input
                size="small"
                :disabled="modalType === 'edt'"
                v-model="organization.orgName"
              />
            </a-form-model-item>
          </a-col>
          <!-- 全局组织ID -->
          <a-col>
            <a-form-model-item label="Global Organization ID">
              <a-input size="small" disabled v-model="organization.globalId" />
            </a-form-model-item>
          </a-col>
          <!-- 父级组织名称 -->
          <a-col>
            <a-form-model-item label="Parent Organization" prop="parentOrg">
              <a-select
                size="small"
                placeholder="select"
                :disabled="modalType === 'edt'"
                @change="organChange"
                v-model="organization.parentOrg"
              >
                <a-select-option
                  v-for="(item, index) in admNameList"
                  :key="index"
                  :value="item"
                  >{{ item }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
          <!-- 设备部署类型 -->
          <a-col>
            <a-form-model-item
              label="CPE Deployment Type"
              prop="cpeDeploymentType"
            >
              <a-select
                size="small"
                :disabled="modalType === 'edt'"
                v-model="organization.cpeDeploymentType"
                placeholder="select"
              >
                <a-select-option value="SDWAN">SDWAN</a-select-option>
                <a-select-option value="vCPE">vCPE</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <!-- 控制器选择 -->
          <a-col>
            <a-form-model-item
              style="width:400px"
              label="Controllers"
              prop="controllers"
            >
              <a-select
                size="small"
                mode="multiple"
                placeholder="Inserted are removed"
                :value="organization.controllers"
                @change="contrChange"
              >
                <a-select-option
                  v-for="(item, index) in controllerList"
                  :key="index"
                  :value="item"
                >
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 组织权限部分 -->
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="Routing Instance" force-render>
            <table class="organRole">
              <thead>
                <tr>
                  <th style="width:199px">Name</th>

                  <th style="width:199px">ID</th>
                  <th style="width:199px">VPN</th>
                  <th style="width:48px"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <a-input
                      v-model="vrfsData.name"
                      style="width:194px"
                      size="small"
                    />
                  </td>
                  <td>
                    <a-input
                      disabled
                      v-model="vrfsData.id"
                      style="width:194px"
                      size="small"
                    />
                  </td>
                  <td style="text-align:left">
                    <a-checkbox v-model="vrfsData.enableVpn"></a-checkbox>
                  </td>
                  <td>
                    <a-button class="addRow" @click="addVrfs">+</a-button>
                  </td>
                </tr>
                <tr v-for="(item, index) in organization.vrfs" :key="index">
                  <td>
                    <a-input
                      v-model="item.name"
                      style="width:194px"
                      size="small"
                    />
                  </td>

                  <td>
                    <a-input
                      disabled
                      v-model="item.id"
                      style="width:194px"
                      size="small"
                    />
                  </td>
                  <td style="text-align:left">
                    <a-checkbox v-model="item.enableVpn"></a-checkbox>
                  </td>
                  <td>
                    <span @click="delVrfs(index)"
                      ><img src="@/assets/images/organize/del.png" alt=""
                    /></span>
                  </td>
                </tr>
              </tbody>
            </table>
          </a-tab-pane>
          <!-- 角色路由添加 -->
          <!-- <a-tab-pane key="2" tab="Supported User Roles">
            <Transf :transfData="transfData" @add-right="addRight" />
          </a-tab-pane> -->
        </a-tabs>
      </a-form-model>
      <template slot="footer">
        <a-button key="back" type="primary" @click="visible = false">
          Cancel
        </a-button>
        <a-button v-if="userInfo.level === 1" key="submit" @click="handleOk">
          Ok
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import {
  adminList,
  //admRightList,
  controllerWrap,
  adminAdd,
  adminDel,
  adminId,
  adminRouerId,
  adminSearch,
  adminedit
} from 'apis/administration';
import { mapState, mapActions } from 'vuex';
export default {
  data() {
    return {
      //分页
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      keyworks: '', //搜索关键字
      modalTitle: '', //弹出层标题
      modalType: '', //弹出层类型 编辑or添加
      tableData: [], //表单数据源
      visible: false, //弹出层开关
      controllerList: [],
      //transfData: [], //角色添加删除转换
      //表单列数据模型
      columns: [
        {
          width: 36,
          titleAlign: 'center',
          columnAlign: 'center',
          type: 'selection'
        },
        {
          field: 'orgName',
          title: 'Name',
          width: 246,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          componentName: 'organize-name'
        },
        {
          field: 'globalOrgId',
          title: 'Global Organization ID',
          width: 245,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'workflowStatus',
          title: 'Status',
          width: 246,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'lastModifiedTime',
          title: 'Last Modified Date',
          width: 246,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'lastModifiedBy',
          title: 'Last Modified By',
          width: 246,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        }
      ],
      //新建组织提交表单模型
      organization: {
        globalId: '',
        ikeAuthType: 'psk',
        orgName: '',
        sharedControlPlane: false,
        cpeDeploymentType: '',
        supportedRoles: [],
        vrfs: [],
        controllers: [],
        parentOrg: ''
      },
      vrfsData: {
        id: '',
        name: '',
        enableVpn: false
      },
      //角色权限添加
      admRight: {
        orgName: '',
        roleNames: []
      },
      // 删除id
      admDel: {
        ids: []
      },
      // 表单校验规则
      rules: {
        orgName: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        parentOrg: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        cpeDeploymentType: [
          {
            required: true,
            trigger: 'change'
          }
        ]
      }
    };
  },
  created() {
    //组织列表获取
    this.admList();
  },
  computed: {
    ...mapState({
      userInfo: state => state.common.userInfo,
      admNameList: state => state.admNameList
    })
  },
  methods: {
    ...mapActions(['getNameList']),
    // 分页
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.admList();
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.admList();
    },

    // 头部搜索框
    search() {},
    // 组织添加
    async addAdm() {
      this.modalTitle = 'Add Organization';
      this.modalType = 'add';
      // 获取组织名称列表
      if (!this.admNameList.length) {
        this.getNameList();
      }
      //获取全局ID 10个
      const { result } = await adminId();
      //获取角色权限列表
      this.organization.globalId = result;
      this.visible = true;
    },
    async organChange(value) {
      //控制器查询
      console.log(value);
      this.controllerList = [];
      const { result } = await controllerWrap({
        organization: value
      });
      result['appliance-list'].forEach(item => {
        this.controllerList.push(item.name);
      });
      console.log(this.controllerList);
    },
    contrChange(selectedItems) {
      this.organization.controllers = selectedItems;
    },
    //组织角色列表
    // async rightList() {
    //   this.transfData = [];
    //   const { result } = await admRightList();
    //   result.roleNames.forEach(item => {
    //     this.transfData.push({ title: item, type: 0 });
    //   });
    // },
    // supportedRoles角色路由添加
    // addRight(right) {
    //   this.admRight.roleNames = right;
    // },
    // 路由添加
    async routeAdd() {
      const { result } = await adminRouerId();
      console.log(result);
      //路由name获取
      if (this.organization.vrfs.length == 0) {
        this.organization.vrfs.push({
          id: '',
          name: '',
          enableVpn: true
        });
        this.organization.vrfs[0].id = result.SdwanGlobalIds.globalIds[0];

        this.vrfsData.id = result.SdwanGlobalIds.globalIds[1];
        console.log(this.vrfsData.id);
      }
      this.organization.vrfs[0].name = this.organization.name + '-LAN-VR';
    },
    //routing Instance 添加
    async addVrfs() {
      if (this.vrfsData.name && this.vrfsData.id) {
        this.organization.vrfs.push(this.vrfsData);
        this.vrfsData = {
          id: '',
          name: '',
          enableVpn: false
        };
        const { result } = await adminRouerId();

        this.vrfsData.id = result.SdwanGlobalIds.globalIds[0];
      }
    },
    //routing Instance 删除
    delVrfs(index) {
      this.organization.vrfs.splice(index, 1);
      console.log(this.organization);
    },
    // 获取组织列表list
    async admList() {
      const { result } = await adminList({
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
      this.totalCount = result.totalCount;
      //表单源获取数据
      this.tableData = result.data;
    },
    // 表格单选
    delItem(selection) {
      selection.forEach(item => {
        this.admDel.ids.push(item.orgName);
      });
      const newArr = Array.from(new Set(this.admDel.ids));
      this.admDel.ids = newArr;
    },
    // 删除组织项
    async delAdm() {
      const res = await adminDel(this.admDel);
      this.admDel = {
        ids: []
      };
      if (res.status !== '0000') return this.$message.error(res.message);
      this.$message.success('组织删除成功！');

      this.admList();
      // 更新home页下拉组织列表
      this.getNameList();
    },
    // 编辑查看
    async edtAdm(params) {
      this.modalTitle = 'Edit Organization';
      this.modalType = 'edt';
      const { orgName } = params.rowData;
      const { result } = await adminSearch(orgName);
      this.organization = result;
      console.log(this.organization);
      this.organization.vrfs.forEach(item => {
        item.enableVpn = item.enableVpn === 'true' ? true : false;
      });
      const RouerIdRes = await adminRouerId();
      this.vrfsData.id = RouerIdRes.result.SdwanGlobalIds.globalIds[0];
      this.visible = true;
    },
    //组织创建更新提交
    async handleOk() {
      // 组织添加
      if (this.modalType === 'add') {
        const res = await adminAdd(this.organization);
        if (res.status !== '0000') return this.$message.error(res.message);
        this.$message.success('组织创建成功！');
        this.visible = false;
        // 跟新表单界面
        this.admList();
        // 更新home页下拉组织列表
        this.getNameList();
        //this.$refs.organization.resetFields();
      }
      // 组织编辑查看
      if (this.modalType === 'edt') {
        const res = await adminedit(
          this.organization.orgName,
          this.organization
        );

        if (res.status !== '0000') return this.$message.error(res.message);
        this.$message.success('组织更新成功！');

        this.visible = false;
        this.admList();
        //this.$refs.organization.resetFields();
      }
    },
    cleanData() {
      this.organization = {
        globalId: '',
        ikeAuthType: 'psk',
        orgName: '',
        sharedControlPlane: false,
        cpeDeploymentType: '',
        supportedRoles: [],
        vrfs: [],
        controllers: [],
        parentOrg: ''
      };
      this.vrfsData = {
        id: '',
        name: '',
        enableVpn: false
      };
    }
  }
  // components: { Transf }
};
import Vue from 'vue';
Vue.component('organize-name', {
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
  template: `<a href="" @click.stop.prevent="update(rowData,index)">{{rowData.orgName}}</a>`,
  methods: {
    update() {
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
#organize {
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
      width: 270px;
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

/deep/ .ant-tabs {
  .ant-tabs-bar {
    margin: 0 0 5px 0;
    .ant-tabs-nav .ant-tabs-tab-active {
      color: #fff;
      padding: 6px 0;
      font-size: 12px;
    }
    .ant-tabs-ink-bar {
      background: #a7d054;
      height: 3px;
    }
    border-bottom: 1px solid #456880;
    a {
      border-bottom: 3px solid #a7d054;
      color: #fff;
    }
    .ant-tabs-nav .ant-tabs-tab {
      color: #fff;
      margin-right: 10px;
    }
  }
  .ant-tabs-nav .ant-tabs-tab {
    padding: 0 3px;
  }
}
.organRole {
  width: 844px;
  thead {
    th {
      border: 1px solid #d3d3d3;
      border-right: 0;
      border-left: 1px solid #97acbe;
      background: #b6c9db;
      height: 22px;
      padding: 0 2px 0 2px;
      color: #0f2c3e;
      font-size: 12px;
      font-weight: normal;
    }
  }
  tbody {
    background: #fff;
    tr {
      height: 24px;
      text-align: center;
      line-height: 24px;
      font-size: 12px;
      background-color: #f5f5f5;
      border: 1px solid #ddd;
    }
    td {
      border-right-color: #ccc;
      padding-top: 2px;
      padding-bottom: 2px;
      border-top-color: #ccc;
      border-right-width: 1px;
      border-right-style: solid;
      font-weight: bold;
      overflow: hidden;
      white-space: nowrap;
      height: 21px;
      padding: 0 2px 0 2px;
      border-top-width: 1px;
      border-top-style: solid;
      font-size: 12px;
      font-weight: normal;
      input {
        padding: 0px 3px;
        height: 20px;
        border-radius: 4px;
        color: #0f2c3e;
        font-size: 12px;
        line-height: 18px;
        border: 1px solid #b0c7d5;
        border-left: 1px solid #dee3e8;
      }
      .addRow {
        min-width: 24px;
        background: none;
        padding: 0;
        background-color: #a7d054;
        font-size: 20px !important;
        color: #fff;
        display: inline-block;
        text-align: center;
      }
    }
    tr:nth-child(even) td {
      background: #e9eef4;
    }
  }
}
</style>
