<template>
  <div class="devices">
    <!-- 搜索框 -->
    <a-row
      class="table-header"
      type="flex"
      justify="space-between"
      align="middle"
    >
      <!--搜索栏-->
      <a-col :style="{ width: 'calc(100%-475px)' }">
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
      <!--表格功能按钮-->
      <a-col>
        <a-row
          :style="{ width: '425px' }"
          type="flex"
          justify="end"
          align="middle"
        >
          <a-col
            :style="{
              fontSize: '18px',
              cursor: 'pointer',
              marginRight: '20px'
            }"
          >
            <a-icon @click="showModal" type="plus" />
          </a-col>
          <a-col
            :style="{
              fontSize: '18px',
              cursor: 'pointer',
              marginRight: '20px'
            }"
          >
            <a-icon @click="showModalDelete" type="minus" />
          </a-col>
          <a-col>
            <v-pagination
              :total="device.totalCount"
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
    <!-- 列表 -->
    <!-- 表单主体内容 -->
    <v-table
      is-horizontal-resize
      column-width-drag
      :columns="columns"
      :table-data="device['versanms.sdwan-device-list']"
      :select-all="selectALL"
      :select-change="selectChange"
      :select-group-change="selectGroupChange"
      :height="540"
      style="width:100%;"
      isFrozen="true"
      @on-custom-comp="customCompFunc"
    ></v-table>
    <!-- 新增弹框 -->
    <div class="add">
      <a-modal
        v-model="visible"
        title="Add Device"
        on-ok="handleOk"
        width="865px"
        height="365px"
        :afterClose="clearData"
        :destroyOnClose="true"
      >
        <DevicesAdd
          ref="devicesAddRef"
          @dew="dew"
          @tab="tab"
          @show="show"
        ></DevicesAdd>
        <template slot="footer">
          <span style="float:left;">
            <a-button key="back" @click="handleBack" v-if="!showAdd.isShow"
              >&lt; Back</a-button
            >
          </span>
          <a-button key="cancel" @click="handleCancel">Cancel</a-button>
          <a-button
            key="submit"
            type="primary"
            :loading="loading"
            @click="handleOk"
            v-if="isSave"
            >Save</a-button
          >
          <a-button
            key="Deploy"
            type="primary"
            @click="handleOkDeploy"
            v-if="showAdd.isExhibition"
            >Deploy</a-button
          >
          <a-button
            key="Continue"
            @click="handleContinue"
            v-if="!showAdd.isExhibition"
            >Continue &gt;</a-button
          >
        </template>
      </a-modal>
    </div>
    <!-- 删除的弹框 -->
    <div>
      <a-modal
        v-model="visibleDelete"
        title="Confirm Decommission"
        @ok="handleOkDelete"
        width="430px"
      >
        <template slot="footer">
          <a-button key="back" @click="handleCancelDelete">Yes</a-button>
          <a-button
            key="submit"
            type="primary"
            :loading="loading"
            @click="handleOkDelete"
            >No</a-button
          >
        </template>
        <!-- <DevicesDelete></DevicesDelete> -->
        <span>
          Are you sure you want to delete the selected device workflow(s)?
          Clicking on "Yes" will perform the following for the selected devices,
          this action can not be reverted.
        </span>
        <ul>
          <li>Deletes Appliance</li>
          <li>Disassociates device from device-group</li>
          <li>Deletes device from Hardware Inventory</li>
          <li>
            Deletes devices IPSec VPN profile information on all the Controllers
          </li>
        </ul>
        <!-- 单选框 -->
        <a-radio-group v-model="value" @change="onChange">
          <a-radio :style="radioStyle" :value="1"
            >Erase Running Configuration</a-radio
          >
          <a-radio :style="radioStyle" :value="2"
            >Reset to Factory Default</a-radio
          >
          <a-radio :style="radioStyle" :value="3"
            >Erase Running Configuration and Load Device Defaults</a-radio
          >
        </a-radio-group>
      </a-modal>
    </div>
    <!-- 查看弹框 -->
    <div>
      <a-modal
        v-model="visibleCheck"
        title="Edit Device"
        width="865px"
        :destroyOnClose="true"
      >
        <DevicesCheck
          ref="devicesCheckRef"
          :formCheck="DeviceCheck"
          @DevCheck="DevCheck"
          @edit="edit"
        ></DevicesCheck>
        <template slot="footer">
          <span style="float:left;">
            <a-button
              key="back"
              @click="handleBackCheck"
              v-if="!showEdit.isShow"
              >&lt; Back</a-button
            >
          </span>
          <a-button key="back" @click="handleCancelCheck">Cancel</a-button>
          <a-button
            key="submit"
            type="primary"
            :loading="loading"
            @click="handleOkCheck"
            >Save</a-button
          >
          <a-button
            key="Deploy"
            type="primary"
            @click="handleOkDeployCheck"
            v-if="showEdit.isExhibition"
            >Deploy</a-button
          >
          <a-button
            key="Continue"
            @click="handleContinueCheck"
            v-if="!showEdit.isExhibition"
            >Continue &gt;</a-button
          >
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
import DevicesAdd from './DevicesAdd';
// import DevicesDelete from './DevicesDelete';
import DevicesCheck from './DevicesCheck';
import { mapState } from 'vuex';
import {
  devicesDelete,
  addDevices,
  DeviceCheck,
  DeviceEdit,
  DeviceSearch,
  DeviceDeploy
} from 'apis/workFlows';
import {
  DEVICES_HANDLE,
  DEVICES_SHOW,
  DEVICES_BID,
  DEVICES_SHOWADD,
  DEVICES_HANDLEADD,
  DEVICES_BIDADD
} from '@/store/mutation-types';
export default {
  components: {
    DevicesAdd,
    // DevicesDelete,
    DevicesCheck
  },
  data() {
    return {
      //分页
      pageIndex: 1,
      pageSize: 20,
      totalCount: 100,
      // 搜索框
      keyworks: '',
      // 新增弹框
      visible: false,
      // 删除弹框
      visibleDelete: false,
      // 查看弹框
      visibleCheck: false,
      // 表格
      tableData: [],
      columns: [
        {
          width: 36,
          columnAlign: 'center',
          titleAlign: 'center',
          type: 'selection'
        },
        {
          field: 'deviceName',
          title: 'Name',
          width: 246,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          componentName: 'table-operationDevice'
        },
        {
          field: 'siteId',
          title: 'Global Device ID',
          width: 246,
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
          title: 'Last Modified Time',
          width: 246,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'lastModifiedBy',
          title: 'Last Modified By',
          width: 245,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        }
      ],
      // 删除弹框
      loading: false,
      // 删除参数
      dele: {
        ids: [],
        cleanConfig: '',
        restConfig: '',
        loadDeviceDefaults: ''
      },
      // 新增的参数
      devAdd: {},
      // 查看的数据
      DeviceCheck: {},
      // 编辑需要传入的参数
      dev: {},
      // 当行的数据
      paramsCheck: {},
      // 接收子组件传递来的部署的数据
      dep: {},
      // 部署传参新增
      depl: { id: '' },
      isSave: true,
      // 部署传参查看
      deplCheck: { id: '' },
      // 编辑数据
      editCheck: {},
      // 接收查看弹框里面的显示与隐藏
      showCheck: {},
      // 查看显示与隐藏
      sdShow: {},
      // 单选框
      value: 1,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      }
    };
  },
  activated() {
    this.$store.dispatch('getNameList');
  },
  computed: {
    ...mapState(['device', 'organization', 'showAdd']),
    ...mapState({
      showEdit: 'show'
    })
  },
  created() {
    this.$store.dispatch('getNameList');
    this.$store.dispatch('Tabledevice', {
      deep: true,
      orgname: this.organization,
      offset: 0,
      limit: this.pageSize
    });
    // this.queryDevice();
  },
  methods: {
    // 分页
    queryDevice() {
      this.$store.dispatch('Tabledevice', {
        organization: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    },
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.$store.dispatch('Tabledevice', {
        organization: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.$store.dispatch('Tabledevice', {
        organization: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    },
    // 新增弹框
    showModal() {
      this.visible = true;
    },
    async handleOk() {
      this.$refs.devicesAddRef.$refs.ruleForm.validate(async (valid, res) => {
        console.log(this.$refs.devicesAddRef.$refs.ruleForm);
        console.log(res);
        if (valid) {
          this.showMessage();
          const res = await addDevices(this.devAdd);
          console.log(res);
          if (!res.message || res.message !== 'Success')
            return this.$message.error(res.message);
          this.visible = false;
          this.$store.commit(DEVICES_HANDLEADD);
          this.clearAddDevice();
          this.$message.success('Add device successfully.');
          this.$store.dispatch('Tabledevice', {
            deep: true,
            orgname: this.organization,
            offset: 0,
            limit: this.pageSize
          });
        } else {
          console.log(res);
        }
      });
    },
    async showMessage() {
      const res = await addDevices(this.devAdd);
      console.log(res, 43569823479);
      if (res.message && res.message === 'Success') {
        this.visible = false;
        this.$store.commit(DEVICES_HANDLEADD);
        this.clearAddDevice();
        this.$message.success('Add device successfully.');
      } else {
        this.$message.error(res.message);
      }
      // 刷新表格数据
      this.$store.dispatch('Tabledevice', {
        deep: true,
        orgname: this.organization,
        offset: 0,
        limit: this.pageSize
      });
    },
    handleCancel() {
      this.visible = false;
      this.$store.commit(DEVICES_HANDLEADD);
      this.clearAddDevice();
      this.$refs.devicesAddRef.$refs.ruleForm.resetFields();
    },
    // 删除弹框
    showModalDelete() {
      this.visibleDelete = true;
    },
    handleOkDelete() {
      this.visibleDelete = false;
    },
    async handleCancelDelete() {
      const res = await devicesDelete(this.dele);
      console.log(res);
      // console.log(this.organization);
      if (res.message === 'Success') {
        this.$message.success('Successfully deleted');
        this.visibleDelete = false;
      } else {
        this.$message.error(res.message);
      }
      this.$store.dispatch('Tabledevice', {
        deep: true,
        orgname: this.organization,
        offset: 0,
        limit: this.pageSize
      });
    },
    // 表格方法
    selectALL(selection) {
      console.log('select-aLL', selection);
      selection.forEach(item => {
        console.log(item.deviceName);
        this.dele.ids.push(item.deviceName);
        // this.dele.id = item.deviceName;
      });
      const newArr = Array.from(new Set(this.dele.ids));
      this.dele.ids = newArr;
      console.log(this.dele);
    },
    selectChange(selection, rowData) {
      console.log('select-change', selection, rowData);
      selection.forEach(item => {
        console.log(item.deviceName);
        this.dele.ids.push(item.deviceName);
        // this.dele.id = item.deviceName;
      });
      const newArr = Array.from(new Set(this.dele.ids));
      this.dele.ids = newArr;
      console.log(this.dele);
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    async customCompFunc(params) {
      if (params.type === 'delete') {
        this.$delete(this.tableData, params.index);
      } else if (params.type === 'edit') {
        this.visibleCheck = true;
        this.lastCheckDevice = this.curCheckDevice;
        this.curCheckDevice = params.rowData.deviceName;
        if (this.lastCheckDevice != this.curCheckDevice) {
          this.$store.commit(DEVICES_HANDLE);
        }
      }
      const res = await DeviceCheck(params.rowData.deviceName);
      this.DeviceCheck = res.result;
      console.log(this.DeviceCheck);
      this.paramsCheck = params;
      this.$refs.devicesCheckRef.DeviceGroups();
      const orgName = this.DeviceCheck.orgName;
      localStorage.ogn = orgName;
      // localStorage.setItem('ogn', orgName);
      console.log(localStorage.ogn);
    },
    // 接受表单的值
    dew(aa) {
      this.devAdd = { ...aa };
    },
    // 编辑接口
    handleCancelCheck() {
      this.$store.commit(DEVICES_HANDLE);
      this.visibleCheck = false;
    },
    async handleOkCheck() {
      let isOK = this.satisfyCheckValidation();

      if (isOK) {
        const res = await DeviceEdit(this.paramsCheck.rowData.deviceName, {
          ...this.dev
        });
        if (res.message && res.message === 'Success') {
          this.visibleCheck = false;
          this.$store.commit(DEVICES_HANDLE);
          this.$message.success('Edit device successfully.');
        } else {
          this.$message.error(res.message);
        }
      }
    },
    // 接收查看编辑表单的数据
    DevCheck(check) {
      this.dev = { ...check };
    },
    // 设备查询
    async search() {
      const res = await DeviceSearch(this.keyworks);
      console.log(res);

      this.$store.dispatch('Tabledevice', {
        deep: true,
        orgname: this.organization,
        offset: 0,
        limit: this.pageSize
      });
    },
    // 新增中的部署按钮
    async handleOkDeploy() {
      console.log('deploy', this.$refs.devicesAddRef.dev);

      this.depl.id = this.devAdd.deviceName;
      await addDevices(this.devAdd);
      const res = await DeviceDeploy(this.depl);
      if (res.message && res.message === 'Success') {
        this.visible = false;
        this.$store.commit(DEVICES_HANDLEADD);
        this.clearAddDevice();
        this.$message.success('Deploy device successfully.');
        this.$store.dispatch('Tabledevice', {
          deep: true,
          orgname: this.organization,
          offset: 0,
          limit: this.pageSize
        });
      } else {
        this.$message.error(res.message);
      }

      this.$store.dispatch('Tabledevice', {
        deep: true,
        orgname: this.organization,
        offset: 0,
        limit: this.pageSize
      });
    },
    // 查看编辑中的部署
    async handleOkDeployCheck() {
      this.visibleCheck = false;
      this.$store.commit(DEVICES_HANDLE);
      this.deplCheck.id = this.dev.deviceName;
      await DeviceEdit(this.paramsCheck.rowData.deviceName, { ...this.dev });
      const res = await DeviceDeploy(this.deplCheck);
      if (res.message !== 'Success') return this.$message.error(res.message);
      this.visibleCheck = false;
      this.$store.commit(DEVICES_HANDLE);
      this.$message.success('Deploy device successfully.');
    },
    // 接收子组件传递过来的部署的数据
    tab(deploy) {
      this.dep = { ...deploy };
    },
    // 查看编辑中的编辑按钮
    async handleOkEditCheck() {
      this.visibleCheck = false;
      this.$store.commit(DEVICES_HANDLE);
      await DeviceEdit(this.dev.deviceName, { ...this.editCheck });
    },
    // 接受编辑数据
    edit(edit) {
      this.editCheck = { ...edit };
    },
    clearData() {
      this.dep = {};
      this.clearAddDevice();
    },
    show(xs) {
      this.sdShow = { ...xs };
    },
    handleBack() {
      let method =
        this.showAdd.curIndex === 1 ? DEVICES_HANDLEADD : DEVICES_SHOWADD;
      this.$store.commit(method);
    },
    handleContinue() {
      let isJump = this.satisfyAddValidation();

      if (isJump) {
        let method =
          this.showAdd.curIndex === 0 ? DEVICES_SHOWADD : DEVICES_BIDADD;
        this.$store.commit(method);
      }
    },
    handleBackCheck() {
      let method = this.showEdit.curIndex === 1 ? DEVICES_HANDLE : DEVICES_SHOW;
      this.$store.commit(method);
    },
    handleContinueCheck() {
      let isJump = this.satisfyCheckValidation();

      if (isJump) {
        let method = this.showEdit.curIndex === 0 ? DEVICES_SHOW : DEVICES_BID;
        this.$store.commit(method);
      }
    },
    satisfyAddValidation() {
      let isOK = true;
      if (this.showAdd.curIndex != 2) {
        this.$refs.devicesAddRef.$refs.ruleForm.validate(valid => {
          if (!valid) {
            isOK = false;
            return false;
          }
        });
      }
      return isOK;
    },
    satisfyCheckValidation() {
      let isOK = true;
      if (this.showEdit.curIndex != 2) {
        this.$refs.devicesCheckRef.$refs.ruleForm.validate(valid => {
          if (!valid) {
            isOK = false;
            return false;
          }
        });
      }
      return isOK;
    },
    clearAddDevice() {
      this.$store.commit(DEVICES_HANDLEADD);
      this.$refs.devicesAddRef.dev.deviceName = '';
      this.$refs.devicesAddRef.dev.orgName = '';
      this.$refs.devicesAddRef.dev.serialNumber = '';
      this.$refs.devicesAddRef.dev.deviceGroup = '';
      this.$refs.devicesAddRef.dev.region = '';
      this.$refs.devicesAddRef.dev.bandwidth = '';
      this.$refs.devicesAddRef.initBandwidth();
      this.$refs.devicesAddRef.dev.locationInfo = {};
      this.devAdd.deviceName = '';
      this.devAdd.orgName = '';
      this.devAdd.serialNumber = '';
      this.devAdd.deviceGroup = '';
      this.devAdd.region = '';
      this.devAdd.bandwidth = '';
      this.devAdd.locationInfo = {};
    },
    // 单选框
    onChange(e) {
      console.log('radio checked', e.target.value);
      if (e.target.value == 1) {
        this.dele.cleanConfig = true;
        this.dele.restConfig = false;
        this.dele.loadDeviceDefaults = false;
      } else if (e.target.value == 2) {
        this.dele.cleanConfig = false;
        this.dele.restConfig = true;
        this.dele.loadDeviceDefaults = false;
      } else if (e.target.value == 3) {
        this.dele.cleanConfig = false;
        this.dele.restConfig = false;
        this.dele.loadDeviceDefaults = true;
      }
    }
  },
  watch: {
    a(val, oldVal) {
      //普通的watch监听
      console.log('a: ' + val, oldVal);
    },
    b: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        console.log('b.c: ' + val.c, oldVal.c);
      },
      deep: true //true 深度监听
    }
  }
};
import Vue from 'vue';
Vue.component('table-operationDevice', {
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
        <a href="" @click.stop.prevent="update(rowData,index)">{{rowData.deviceName}}</a>&nbsp;
        </span>`,
  methods: {
    update() {
      // 参数根据业务场景随意构造
      let params = { type: 'edit', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    }
  }
});
</script>

<style lang="scss" scoped>
.devices {
  padding: 5px 20px 30px 15px;
  /deep/.search-bar {
    .ant-input {
      width: 700px;
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
}

/deep/.ant-modal-content {
  max-height: 325px;
  .ant-modal-header {
    background-color: #e9f4fc;
    .ant-modal-title {
      line-height: 8px;
    }
  }
  .ant-modal-body {
    padding: 3px;
    background-color: #36536b;
  }
  .ant-modal-footer {
    background-color: #e9f4fc;
  }
}
</style>
