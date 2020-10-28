<template>
  <div>
    <a-form-model :model="deviceGroup" :rules="rules" ref="ruleForm">
      <!-- name和description -->
      <div class="title">
        <a-row type="flex">
          <a-col :span="24">
            <a-form-model-item label="Name" prop="name" required>
              <a-input v-model="deviceGroup.name" :disabled="isEdit" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="Description">
              <a-input v-model="deviceGroup.description" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
      <div class="main">
        <a-row type="flex">
          <a-col :span="8">
            <a-form-model-item
              label="Organization"
              prop="organization"
              required
            >
              <a-select
                v-model="deviceGroup.organization"
                placeholder="please select your zone"
                @change="change"
                :disabled="isEdit"
              >
                <a-select-option
                  :value="item.name"
                  v-for="(item, index) in organ"
                  :key="index"
                  >{{ item.name }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label=" " :colon="false">
              <a-checkbox-group
                v-model="checkedList"
                :options="checkBoxOptions"
                @change="onCheckBoxChange"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
      <div class="footer">
        <a-row type="flex">
          <a-col :span="8">
            <a-form-model-item label="Staging Template">
              <a-input v-model="deviceGroup.template" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="Post Staging Template">
              <a-select
                v-model="deviceGroup.poststagingTemplate"
                placeholder="select"
                @change="changeTemplate"
              >
                <a-select-option
                  :value="item.name"
                  v-for="(item, index) in post"
                  :key="index"
                  >{{ item.name }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
    </a-form-model>
    <!-- 列表 -->
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" :tab="pTitle">
        <v-table
          is-horizontal-resize
          column-width-drag
          :columns="taColumns"
          :table-data="deviceGroup.templateAssociation"
          :select-all="selectALL"
          :select-change="selectChange"
          :select-group-change="selectGroupChange"
          :height="350"
          style="width:1266px;"
          isFrozen="true"
          @on-custom-comp="customTATableFunc"
        ></v-table>
      </a-tab-pane>
      <a-tab-pane key="2" :tab="dTitle">
        <v-table
          is-horizontal-resize
          column-width-drag
          :columns="devColumns"
          :table-data="deviceDatas"
          :select-all="selectALL"
          :select-change="selectChange"
          :select-group-change="selectGroupChange"
          :height="350"
          style="width:1266px;"
          isFrozen="true"
          @on-custom-comp="customDevTableFunc"
        ></v-table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import Vue from 'vue';
import {
  devicesOrg,
  DevicePost,
  DeviceGropAssociation,
  DeviceGroupByName
} from 'apis/workFlows';
export default {
  props: {
    groupName: {
      type: String
    }
  },
  data() {
    return {
      // 弹框
      loading: false,
      visible: false,
      deviceDatas: [{}],
      taColumns: [
        {
          field: 'name',
          title: 'Name',
          width: 146,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'category',
          title: 'Category',
          width: 146,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'organization',
          title: 'Organization',
          width: 246,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        }
      ],
      devColumns: [
        {
          width: 36,
          titleAlign: 'center',
          columnAlign: 'center',
          type: 'selection'
        },
        {
          field: 'deviceName',
          title: 'Device Name',
          width: 246,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          componentName: 'device-table-operation'
        },
        {
          field: 'number',
          title: 'Serial Number',
          width: 246,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'location',
          title: 'Location',
          width: 246,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'siteName',
          title: 'Site Name',
          width: 246,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'globalOrgId',
          title: 'Global Organization Id',
          width: 245,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        }
      ],
      //新增设备中Device Group弹框中Organization获取到的值
      organ: [],
      // 新增弹框中Device Group弹框的创建中Post Staging Template获取到的值
      post: [],
      //双向绑定数据
      deviceGroup: {
        name: '',
        description: '',
        organization: '',
        caNotification: false,
        poststagingTemplate: '',
        templateAssociation: [{}]
      },
      checkedList: [],
      checkBoxOptions: ['CA In Data Center'],
      optionsToVars: {
        'CA In Data Center': 'caNotification'
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Name is required',
            trigger: 'blur'
          }
        ],
        organization: [
          {
            required: true,
            message: 'Organization is required',
            trigger: 'change'
          }
        ]
      },
      gn: '',
      pTitle: 'Post Staging Template Association(0)',
      dTitle: 'Devices(0)'
    };
  },
  created() {
    this.initDeviceGroup2Edit();
    //给Organization下拉框赋值
    this.organization();
    // 新增弹框中Device Group弹框的创建中Post Staging Template获取数据
    // this.postStaging();
    // this.deviceGroup.organization = this.fromFormCheck.orgName;
    // this.deviceGroup.organization = localStorage.ogn;
    this.postStaging();
  },
  updated() {
    this.$emit('createGroup', this.deviceGroup);
    this.$emit('createGroupEdit', this.deviceGroup);
  },
  methods: {
    async initDeviceGroup2Edit() {
      if (this.groupName || this.gn) {
        const res = await DeviceGroupByName(this.groupName);
        this.deviceGroup = res.result;
        this.deviceDatas = [];
        // this.deviceGroupName = true;
        for (let deviceName of res.result.inventoryName) {
          let obj = {
            deviceName
          };
          this.deviceDatas.push(obj);
        }
        this.pTitle = `Post Staging Template Association(${this.deviceGroup.templateAssociation.length})`;
        this.dTitle = `Devices(${this.deviceDatas.length})`;
        this.checkedList = [];
        for (let option in this.optionsToVars) {
          if (this.deviceGroup[this.optionsToVars[option]]) {
            this.checkedList.push(option);
          }
        }
        this.postStaging();
      }
    },
    showModal() {
      this.visible = true;
    },
    handleOk() {
      this.loading = true;
      setTimeout(() => {
        this.visible = false;
        this.loading = false;
      }, 3000);
    },
    handleCancel() {
      this.visible = false;
    },
    // 列表
    callback(key) {
      console.log(key);
    },
    // 表格的方法
    // 表格方法
    selectALL(selection) {
      console.log('select-aLL', selection);
    },
    selectChange(selection, rowData) {
      console.log('select-change', selection, rowData);
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    customTATableFunc(params) {
      console.log(params);
    },
    customDevTableFunc(params) {
      console.log(params);
      if (params.type === 'delete') {
        // do delete operation
        this.$delete(this.deviceDatas, params.index);
      } else if (params.type === 'edit') {
        // do edit operation

        alert(`行号：${params.index} 姓名：${params.rowData['name']}`);
      }
    },
    //给Organization下拉框赋值
    async organization() {
      const res = await devicesOrg();
      // console.log(res.result.organizations);
      this.organ = res.result.organizations;
    },
    // 新增弹框中Device Group弹框的创建中Post Staging Template获取数据
    async postStaging() {
      const res = await DevicePost(this.deviceGroup.organization);
      this.post = res.result['versanms.templates'].template;
    },
    //Create Device Group弹框中Organization下拉框值发生变化的时候
    change() {
      this.deviceGroup.poststagingTemplate = '';
      this.postStaging();
    },
    async changeTemplate() {
      const res = await DeviceGropAssociation({
        devGroupName: this.deviceGroup.name,
        templateName: this.deviceGroup.poststagingTemplate
      });
      this.pTitle = 'Post Staging Template Association(0)';
      if (res.result && res.result.templateAssociation) {
        this.deviceGroup.templateAssociation = res.result.templateAssociation;
        this.pTitle = `Post Staging Template Association(${this.deviceGroup.templateAssociation.length})`;
      }
    },
    onCheckBoxChange(checkedList) {
      this.checkedList = checkedList;
      for (let option in this.optionsToVars) {
        this.deviceGroup[this.optionsToVars[option]] = false;
      }
      for (let option of checkedList) {
        this.deviceGroup[this.optionsToVars[option]] = true;
      }
    }
  },
  watch: {
    gn(newValue) {
      if (newValue) {
        this.initDeviceGroup2Edit();
      }
    }
  },
  computed: {
    isEdit() {
      return !!this.deviceGroup.modifyDate;
    }
  }
};
// 自定义列组件
Vue.component('device-table-operation', {
  template: `<span>
    <a href="" @click.stop.prevent="update(rowData,index)">{{ rowData.deviceName }}</a>
    </span>`,
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
/deep/.ant-form-explain {
  display: none !important;
}
/deep/.ant-form-inline .ant-form-item-with-help {
  margin-bottom: 0;
}
.title {
  /deep/.ant-form-item {
    padding: 0;
    width: 920px;
    margin-bottom: 0;
    .ant-form-item-label {
      line-height: 19px;
    }
    .ant-form-item-control {
      line-height: 19px;
    }
    .ant-input {
      width: 100%;
      height: 20px;
    }
  }
}
.main {
  /deep/.ant-select-selection--single {
    width: 294px;
    height: 20px;
  }
  /deep/ .ant-form-item-label {
    line-height: 20px;
  }
  .ant-form-item-control {
    line-height: 20px;
  }
}
.footer {
  /deep/.ant-form-item {
    padding: 0;
    width: 294px;
    .ant-input {
      width: 100%;
      height: 20px;
    }
    .ant-form-item-label {
      line-height: 20px;
    }
    .ant-form-item-control {
      line-height: 23px;
    }
  }
  /deep/.ant-select-selection--single {
    width: 294px;
    height: 20px;
  }
}
</style>
