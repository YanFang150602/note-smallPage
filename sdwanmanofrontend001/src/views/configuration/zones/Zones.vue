<template>
  <div class="main-con">
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
              @click="createItem"
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
              @click="deleteItem"
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
                :total="totalCount"
                size="small"
                :pageSize="listParam.pageSize"
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
      :table-data="tableData"
      :select-change="delItem"
      style="width:100%;"
      isFrozen="true"
      @on-custom-comp="modifyItem"
    ></v-table>
    <!-- 数据添加编辑弹窗 -->
    <a-modal
      v-model="visible"
      :title="modalTitle"
      @ok="handleOk"
      :width="645"
      wrapClassName="form-wrap"
      cancelText="Cancel"
      okText="Ok"
      :afterClose="cleanData"
    >
      <!-- 添加修改表单 -->
      <a-form-model
        :model="formData.data"
        ref="form"
        :rules="rules"
        layout="vertical"
        @validate="validate"
        hideRequiredMark
      >
        <!-- Name -->
        <a-col>
          <a-form-model-item class="mandatory" label="Name" prop="name">
            <a-input
              :disabled="modalType === 'edt'"
              @mouseenter="enter('name')"
              @mouseleave="leave"
              @mousemove="updateXY"
              v-model="formData.data.name"
              size="small"
            />
          </a-form-model-item>
        </a-col>
        <!-- Description -->
        <a-col>
          <a-form-model-item label="Description">
            <a-input v-model="formData.data.description" size="small" />
          </a-form-model-item>
        </a-col>
        <!-- Tags -->
        <a-col>
          <a-form-model-item label="Tags">
            <TagInput
              @addtag="addtag"
              :tags="formData.data.tags ? formData.data.tags : []"
            />
          </a-form-model-item>
        </a-col>
        <a-row type="flex" justify="space-between" align="top">
          <!-- Zone Protection Profile -->
          <a-col :span="11">
            <a-form-model-item label="Zone Protection Profile">
              <a-select placeholder="-select-">
                <a-select-option
                  v-for="(item, index) in zoneProtectProfilesData"
                  :key="index"
                  :value="item"
                  >{{ item }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
          <!-- Log Profile -->
          <a-col :span="11">
            <a-form-model-item label="Log Profile">
              <a-select
                placeholder="-select-"
                v-model="formData.data.logProfile"
              >
                <a-select-option
                  v-for="(item, index) in logProfilesData"
                  :key="index"
                  :value="item"
                  >{{ item }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row
          class="create-btn"
          type="flex"
          justify="space-between"
          align="top"
        >
          <!-- Create Zone Protection Profile -->
          <a-col :span="11"
            ><a href="javascript:;">+ Create Zone Protection Profile</a></a-col
          >
          <!-- Create Log Profile -->
          <a-col :span="11"
            ><a href="javascript:;">+ Create Log Profile</a></a-col
          >
        </a-row>
        <a-radio-group class="add-modle-type" v-model="admodleShow">
          <a-radio :value="1">
            Interface and Networks
          </a-radio>
          <a-radio :value="2">
            Routing Instance
          </a-radio>
          <a-radio :value="3">
            Organization
          </a-radio>
        </a-radio-group>
        <a-row
          class="add-modle-con"
          type="flex"
          justify="space-between"
          align="top"
        >
          <a-col class="add-modle-item">
            <AddModle
              :listdate="interfacesData"
              :title="interfaceTit"
              @subdata="interfaceSub"
            />
            <div v-show="admodleShow !== 1" class="disabled-component"></div>
          </a-col>
          <a-col class="add-modle-item">
            <AddModle
              :listdate="routingInstanceData"
              :title="routingTit"
              @subdata="routingSub"
            />
            <div v-show="admodleShow !== 2" class="disabled-component"></div>
          </a-col>
          <a-col class="add-modle-item">
            <AddModle
              :listdate="networksData"
              :title="networkTit"
              @subdata="networkSub"
            />
            <div v-show="admodleShow !== 1" class="disabled-component"></div>
          </a-col>
          <a-col class="add-modle-item">
            <AddModle
              :listdate="organizationsData"
              :title="organTit"
              @subdata="organSub"
            />
            <div v-show="admodleShow !== 3" class="disabled-component"></div>
          </a-col>
        </a-row>
      </a-form-model>
      <template slot="footer">
        <a-button type="primary" key="Ok" @click="handleOk">
          Ok
        </a-button>
        <a-button key="Cancel" @click="visible = false">
          Cancel
        </a-button>
      </template>
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
import TagInput from '@/views/components/TagInput';
import AddModle from '@/views/components/AddModle';

import {
  zoneLists,
  zoneSearch,
  zoneCreate,
  zoneModify,
  zoneDelete,
  zoneProtection,
  logProfile,
  interfaces,
  networks,
  routingInstance,
  organizations
} from 'apis/zoneQos';

import { mapState } from 'vuex';
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
    return {
      // 列表查询参数
      listParam: {
        deviceName: '',
        orgName: '',
        offset: 0,
        pageSize: 1000
      },
      totalCount: 0,
      keyworks: '', //搜索关键字
      tableData: [], //表格数据源
      visible: false, //弹出层开关
      modalTitle: '', //表单标题
      modalType: '', //表单编辑or新建
      admodleShow: 0, //addModle显示隐藏
      // addModle 标题
      interfaceTit: 'Interfaces',
      routingTit: 'Routing Instances',
      networkTit: 'Networks',
      organTit: 'Organizations',
      // 表单提示悬浮框
      formTips: {
        flag: false,
        tipText: '',
        x: 0,
        y: 0,
        positionStyle: { top: '20px', left: '20px' }
      },
      //表单提示信息
      message: {
        name: ''
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
          title: 'Name',
          width: 100,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          componentName: 'zone-name'
        },
        {
          field: 'logProfile',
          title: 'Log Profile',
          width: 100,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'zoneProtectProfile',
          title: 'Zone Protection Profile',
          width: 100,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'interfaceList',
          title: 'Interface List',
          width: 100,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'routingInstance',
          title: 'Routing Instance',
          width: 100,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'networks',
          title: 'Networks',
          width: 100,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'org',
          title: 'Org',
          width: 100,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        }
      ],
      // 新建更新数据模型
      formData: {
        deviceName: '',
        orgName: '',
        data: {
          name: null,
          description: null,
          zoneProtectProfile: null,
          tags: null,
          logProfile: null,
          interfaceList: null,
          networks: null,
          routingInstance: null,
          orgs: null
        }
      },
      // zoneProtectProfile列表数据
      zoneProtectProfilesData: [],
      // logProfile列表数据
      logProfilesData: [],
      // interfaces列表数据
      interfacesData: [],
      // networks列表数据
      networksData: [],
      // routingInstance列表数据
      routingInstanceData: [],
      // organizations列表数据
      organizationsData: [],
      //查询数据模型
      searchData: {
        deviceName: '',
        orgName: '',
        name: ''
      },
      //删除数据模型
      delData: {
        deviceName: '',
        orgName: '',
        data: ''
      },
      // 表单校验规则
      rules: {
        name: [{ validator: name }]
      }
    };
  },
  computed: {
    ...mapState(['organization', 'deviceName'])
  },
  created() {
    //获取zone列表
    this.lists();
  },
  methods: {
    // 分页查询
    pageChange(pageIndex) {
      this.listParam.offset = (pageIndex - 1) * this.listParam.pageSize;
      this.lists();
    },
    pageSizeChange(pageSize) {
      this.listParam.pageSize = pageSize;
      this.lists();
    },
    search() {
      console.log(this.keyworks);
    },

    // 添加tag标签
    addtag(tag) {
      this.formData.data.tags = tag;
    },
    // 获取Zone Protection Profile 列表
    async zoneProtectionList() {
      const { result } = await zoneProtection({
        deviceName: this.deviceName,
        orgName: this.organization
      });
      if (result && result.length > 0) this.zoneProtectProfilesData = result;
    },
    // 获取Log Profile 列表
    async logProfileList() {
      const { result } = await logProfile({
        deviceName: this.deviceName,
        orgName: this.organization
      });
      if (result && result.length > 0) this.logProfilesData = result;
    },
    // 获取Interfaces
    async interfacesList() {
      const { result } = await interfaces({
        deviceName: this.deviceName,
        orgName: this.organization
      });
      if (result && result.length > 0) this.interfacesData = result;
    },
    // 获取Networks
    async networksList() {
      const { result } = await networks({
        deviceName: this.deviceName,
        orgName: this.organization
      });
      if (result && result.length > 0) this.networksData = result;
    },
    // 获取Routing Instances
    async routingInstanceList() {
      const { result } = await routingInstance({
        deviceName: this.deviceName,
        orgName: this.organization
      });
      if (result && result.length > 0) this.routingInstanceData = result;
    },
    // 获取Organizations
    async organizations() {
      const { result } = await organizations({
        deviceName: this.deviceName,
        orgName: this.organization
      });
      if (result && result.length > 0) this.organizationsData = result;
    },
    //验证表单提示信息
    validate(field, valid, message) {
      if (valid) {
        this.message[field] = '';
      } else {
        this.message[field] = message;
      }
    },
    enter(field) {
      if (this.message) {
        this.formTips.tipText = '';
        switch (field) {
          case 'name':
            this.formTips.tipText = this.message.name;
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

    // addModle 数据提交
    interfaceSub(data) {
      if (data.length > 0) {
        this.formData.data.interfaceList = data;
      } else {
        this.formData.data.interfaceList = null;
      }
    },
    routingSub(data) {
      if (data.length > 0) {
        this.formData.data.routingInstance = data;
      } else {
        this.formData.data.routingInstance = null;
      }
    },
    networkSub(data) {
      if (data.length > 0) {
        this.formData.data.networks = data;
      } else {
        this.formData.data.networks = null;
      }
    },
    organSub(data) {
      if (data.length > 0) {
        this.formData.data.orgs = data;
      } else {
        this.formData.data.orgs = null;
      }
    },

    // 获取zone列表
    async lists() {
      this.listParam.deviceName = this.deviceName;
      this.listParam.orgName = this.organization;
      const { result } = await zoneLists(this.listParam);
      if (result) {
        // result.forEach(item => {
        //   item.forEach(i => {
        //     return (i = Array.isArray(i) ? i.join(';') : '');
        //   });
        // });
        this.totalCount = result.total;
        this.tableData = result.data;
      } else {
        this.tableData = [];
      }
    },

    //新建zone
    async createItem() {
      this.modalTitle = 'Add Zone';
      this.modalType = 'add';
      this.zoneProtectionList();
      this.logProfileList();
      this.interfacesList();
      this.networksList();
      this.routingInstanceList();
      this.organizations();
      this.visible = true;
    },

    //编辑zone
    async modifyItem({ rowData }) {
      this.modalTitle = 'Edit Zone';
      this.modalType = 'edt';
      this.searchData = {
        deviceName: this.deviceName,
        orgName: this.organization,
        name: rowData.name
      };
      this.zoneProtectionList();
      this.logProfileList();
      this.interfacesList();
      this.networksList();
      this.routingInstanceList();
      this.organizations();
      const { result } = await zoneSearch(this.searchData);
      this.formData.data = result;
      this.visible = true;
    },

    //获取删除表单的name
    delItem(selection, rowData) {
      this.delData.data = rowData.name;
    },
    // 删除选中zone
    async deleteItem() {
      this.delData.deviceName = this.deviceName;
      this.delData.orgName = this.organization;
      const res = await zoneDelete(this.delData);
      if (res.status !== '0000') return this.$message.error(res.message);
      this.$message.success('zone删除成功！');
      this.lists();
    },

    //表单提交
    async handleOk() {
      this.formData.deviceName = this.deviceName;
      this.formData.orgName = this.organization;
      // 新建zone数据
      if (this.modalType === 'add') {
        this.$refs.form.validate(async valid => {
          if (valid) {
            const addRes = await zoneCreate(this.formData);
            console.log(addRes);
            if (addRes.status !== '0000')
              return this.$message.error(addRes.message);
            this.$message.success('zone创建成功！');
            this.visible = false;
            this.lists();
          }
        });
      }
      // 修改zone数据
      if (this.modalType === 'edt') {
        this.$refs.form.validateField(['name'], async () => {
          if (!this.message.name) {
            const edtRes = await zoneModify(this.formData);
            if (edtRes.status !== '0000')
              return this.$message.error(edtRes.message);
            this.$message.success('zone更新成功！');
            this.visible = false;
            this.lists();
          }
        });
      }
    },
    // 关闭弹窗清楚表单 验证信息
    cleanData() {
      this.$refs.form.clearValidate();
      this.formData = {
        deviceName: '',
        orgName: '',
        data: {
          name: null,
          description: null,
          zoneProtectProfile: null,
          tags: null,
          logProfile: null,
          interfaceList: null,
          networks: null,
          routingInstance: null,
          orgs: null
        }
      };
      this.message = {
        name: ''
      };
    }
  },
  components: {
    TagInput,
    AddModle
  }
};
import Vue from 'vue';
Vue.component('zone-name', {
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
.form-wrap {
  .create-btn {
    a {
      color: #aac0d5;
      line-height: 20px;
      font-size: 12px;
    }
  }
  .add-modle-type {
    padding: 5px 0;
    /deep/span:nth-of-type(2) {
      color: #f9f9f9;
      font-size: 12px;
      margin-left: 5px;
      vertical-align: top;
    }
  }
  .add-modle-con {
    .add-modle-item {
      width: 300px;
      height: 140px;
      overflow: hidden;
      position: relative;
      margin-bottom: 20px;
      background: #fff;
      .disabled-component {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #8fa7b7;
        cursor: not-allowed;
        opacity: 0.5;
        top: 0;
        left: 0;
      }
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
/deep/.ant-form-explain {
  display: none !important;
}
/deep/.ant-form-item-label {
  label {
    &::after {
      display: none !important;
    }
  }
}
/deep/.mandatory.ant-form-item {
  .ant-form-item-label {
    label {
      &::after {
        display: block !important;
      }
    }
  }
}
</style>
