<template>
  <div class="add-device">
    <!--  三个切换tab -->
    <div class="switchover">
      <div ref="basicTabRef" class="basic" @click="handleClick">Basic</div>
      <div ref="locationTabRef" class="location" @click="ShowClick">Location information</div>
      <div ref="bindTabRef" class="bid" @click="bindClick">Bid Data</div>
    </div>
    <!-- basic -->
    <div v-if="show.isShow" class="form_basic">
      <a-form-model layout="inline" :model="fromFormCheck" :rules="rules" ref="ruleForm">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="Name" required>
              <a-input disabled v-model="fromFormCheck.deviceName"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="Global Device ID" required prop="siteId">
              <a-input v-model.number="fromFormCheck.siteId"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="Organization" required>
              <a-input disabled v-model="fromFormCheck.orgName"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="Depoyment Type">
              <a-input v-model="fromFormCheck.showDeploymentType"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <!-- <a-form-model-item label="Serial Number">
              <a-select disabled v-model="fromFormCheck.serialNumber">
                <a-select-option value="shanghai">Zone one</a-select-option>
              </a-select>
            </a-form-model-item>-->
            <a-form-model-item label="Serial Number">
              <a-input v-model="fromFormCheck.serialNumber"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="Device Groups" required prop="deviceGroup">
              <a-select v-model="fromFormCheck.deviceGroup">
                <a-select-option
                  v-for="(item, index) in group"
                  :key="index"
                  :value="item"
                >{{ item }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8"></a-col>
          <a-col :span="8"></a-col>
          <!-- <a-col :span="8">
            <span
              class="deviceGroup"
              @click="showModalGroup"
              style="color:#fff;cursor:pointer;"
              >+Device Group</span
            >
          </a-col>-->
        </a-row>

        <!-- 方框 -->
        <div class="serviceBand">
          <div class="subscrition">Subscrition</div>
          <a-form-model-item style="width: 185px" label="Service Bandwidth">
            <a-select
              size="small"
              mode="multiple"
              placeholder="Select options"
              option-label-prop="label"
              @change="handleChange"
              :maxTagPlaceholder="maxTagPlaceholder"
              :maxTagCount="0"
              v-model="fromFormCheck.serviceBandwidth"
            >
              <a-select-option
                v-for="option in bandwidthOptions"
                :value="option.value"
                :key="option.label"
              >{{ option.label }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="Aggregate Bandwith">
            <a-input disabled :value="num"/>
          </a-form-model-item>
        </div>
      </a-form-model>
    </div>
    <!-- Location Information -->
    <div class="form_location" v-if="show.isDemonstrate">
      <div class="box">
        <div class="loca">Location</div>
        <a-form-model
          layout="inline"
          :model="fromFormCheck.locationInfo"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="location_title">
            <a-row>
              <a-col :span="12">
                <a-form-model-item label="Address 1">
                  <a-input v-model="fromFormCheck.locationInfo.address1"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="Address 2">
                  <a-input v-model="fromFormCheck.locationInfo.address2"/>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <div class="location_main">
            <a-row>
              <a-col :span="6">
                <a-form-model-item label="City">
                  <a-input v-model="fromFormCheck.locationInfo.city"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="State">
                  <a-input v-model="fromFormCheck.locationInfo.state"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="Country" required prop="country">
                  <a-input v-model="fromFormCheck.locationInfo.country"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="Zip">
                  <a-input v-model="fromFormCheck.locationInfo.zip"/>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <div class="location_footer">
            <a-row>
              <a-col :span="6">
                <a-form-model-item label="Latitude">
                  <a-input v-model="fromFormCheck.locationInfo.latitude"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="Longitude">
                  <a-input v-model="fromFormCheck.locationInfo.longitude"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item>
                  <a-button type="primary">Get Coordinates</a-button>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
        </a-form-model>
      </div>
    </div>
    <!--Bind Data  -->
    <div class="form_bind" v-if="show.isExhibition">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="User Input">
          <span>Post Staging Template - Shanghai-CMCC-D</span>
          <div class="tableListBox">
            <table>
              <tr>
                <th
                  v-for="(item, index) in tableDataArr"
                  :key="index + '_tableTitle'"
                  style="padding:12px 0"
                >{{ item.name }}</th>
                <th></th>
              </tr>
              <tr>
                <td v-for="(item, index) in tableDataArr" :key="index + '_tableInput'">
                  <a-form-model-item>
                    <a-input placeholder disabled v-model="item.value"/>
                  </a-form-model-item>
                </td>
                <td></td>
              </tr>
            </table>

            <table v-for="(group, index) in autoGenGroups" :key="index + '_tableGroups'">
              <tr>
                <th :colspan="group[1].length">{{ group[0] }}</th>
              </tr>
              <tr>
                <td
                  v-for="(variable, index2) in group[1]"
                  :key="index2 + '_variableName'"
                >{{ variable.showName }}</td>
              </tr>
              <tr>
                <td v-for="(variable, index3) in group[1]" :key="index3 + '_variableValue'">
                  <a-form-model-item>
                    <a-input :placeholder="variable.type" v-model="variable.value"/>
                  </a-form-model-item>
                </td>
              </tr>
            </table>
          </div>
          <a-row>
            <a-col :span="8">Service Template Variable</a-col>
            <a-col :span="8">Template:Icst1</a-col>
            <a-col :span="8">Device Group:Icsdevg1</a-col>
          </a-row>
          <v-table
            is-horizontal-resize
            column-width-drag
            :columns="columnsUnder"
            :table-data="tableData"
            :select-all="selectALL"
            :select-change="selectChange"
            :select-group-change="selectGroupChange"
            :height="350"
            style="width:1266px;"
            isFrozen="true"
            @on-custom-comp="customCompFunc"
          ></v-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Auto-Generated" force-render>
          <span>Post Staging Template - Shanghai-CMCC-D</span>
          <div class="tableListBox">
            <table>
              <tr>
                <th
                  v-for="(item, index) in tableDataArr"
                  :key="index + '_tableTitle'"
                  style="padding:12px 0"
                >{{ item.name }}</th>
                <th></th>
              </tr>
              <tr>
                <td v-for="(item, index) in tableDataArr" :key="index + '_tableInput'">
                  <a-form-model-item>
                    <a-input placeholder v-model="item.value"/>
                  </a-form-model-item>
                </td>
                <td></td>
              </tr>
            </table>

            <table v-for="(group, index) in notAutoGenGroups" :key="index + '_tableGroups'">
              <tr>
                <th :colspan="group[1].length">{{ group[0] }}</th>
              </tr>
              <tr>
                <td
                  v-for="(variable, index2) in group[1]"
                  :key="index2 + '_variableName'"
                >{{ variable.showName }}</td>
              </tr>
              <tr>
                <td v-for="(variable, index3) in group[1]" :key="index3 + '_variableValue'">
                  <a-form-model-item>
                    <a-input placeholder="auto" v-model="variable.value"/>
                  </a-form-model-item>
                </td>
              </tr>
            </table>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div>
      <a-modal
        v-model="visibleGroup"
        title="Create Device Group"
        on-ok="handleOk"
        width="940px"
        :destroyOnClose="true"
      >
        <template slot="footer">
          <a-button key="submit" type="primary" @click="handleOk">ok</a-button>
          <a-button key="back" @click="handleCancel">cancel</a-button>
        </template>
        <DeviceGroup
          @createGroupEdit="createGroupEdit"
          ref="createGroupRf"
          :fromFormCheck="formCheck"
        ></DeviceGroup>
      </a-modal>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import {
  DEVICES_SHOW,
  DEVICES_BID,
  DEVICES_HANDLE
} from '@/store/mutation-types';
import { DeviceBinding, DeviceGroupAdd, devicesGroup } from 'apis/workFlows';
//表格数据
const columns = [
  {
    title: 'Serial',
    dataIndex: 'name',
    key: 'name',
    width: 149,
    fixed: 'left'
    // onFilter: (value, record) => record.name.indexOf(value) === 0
  },
  {
    title: 'Device Name',
    dataIndex: 'name',
    key: 'Device',
    width: 149,
    fixed: 'left'
    // onFilter: (value, record) => record.name.indexOf(value) === 0
  },
  {
    title: 'Interfaces with Mask',
    children: [
      {
        title: 'WAN1_IPv4_staticaddress',
        dataIndex: 'age',
        key: 'age',
        width: 200
      },
      {
        title: 'WAN1_IPv4_staticaddress'
      }
    ]
  },
  {
    title: 'Default Gateway',
    children: [
      {
        title: 'WAN1-Transport_IPv4_vrHopAddress',
        dataIndex: 'companyAddress',
        key: 'companyAddress',
        width: 200
      },
      {
        title: 'WAN1-Transport-VR-IPv4_vrHopAddress',
        dataIndex: 'companyName',
        key: 'companyName'
      }
    ]
  }
];
const data = [];
for (let i = 0; i <= 0; i++) {
  data.push({
    key: i,
    name: 'John Brown',
    age: i + 1,
    street: 'Lake Park',
    building: 'C',
    number: 2035,
    companyAddress: 'Lake Street 42',
    companyName: 'SoftLake Co',
    gender: 'M'
  });
}
export default {
  name: 'frozen-title-columns',
  components: {
    DeviceGroup
  },
  created() {
    this.$emit('show', this.show);
    // this.deviceCheck = this.formCheck;
  },
  computed: {
    num: function() {
      if (this.fromFormCheck.bandwidth) {
        return this.fromFormCheck.bandwidth > 1000
          ? this.fromFormCheck.bandwidth / 1000 + ' Gbps'
          : this.fromFormCheck.bandwidth + 'Mbps';
      } else {
        return '';
      }
    },
    ...mapState(['show']),
    fromFormCheck: function() {
      let deploymentTypes = {
        physical: 'CPE-Baremetal Device'
      };
      let formCheckBak = this.formCheck;
      formCheckBak.showDeploymentType =
        deploymentTypes[this.formCheck.deploymentType];
      console.log('formCheckBak', formCheckBak);
      return formCheckBak;
    }
  },
  data() {
    return {
      maxTagPlaceholder: '0 selected',
      bandwidthOptions: [
        {
          label: '5 Mbps',
          value: 5
        },
        {
          label: '10 Mbps',
          value: 10
        },
        {
          label: '25 Mbps',
          value: 25
        },
        {
          label: '50 Mbps',
          value: 50
        },
        {
          label: '100 Mbps',
          value: 100
        },
        {
          label: '200 Mbps',
          value: 200
        },
        {
          label: '500 Mbps',
          value: 500
        },
        {
          label: '1 Gbps',
          value: 1000
        },
        {
          label: '5 Gbps',
          value: 5000
        },
        {
          label: '10 Gbps',
          value: 10000
        },
        {
          label: '20 Gbps',
          value: 20000
        }
      ],
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      loading: false,
      visible: false,
      // 表单显影
      // labelCol: { span: 4 },
      // wrapperCol: { span: 14 },
      form: {
        name: '',
        global: '',
        organization: '',
        depoyment: '',
        serial: '',
        groups: ''
      },
      // Device Group的弹框
      visibleGroup: false,
      // 表格数据
      data,
      columns,
      // 下表格数据
      // 表格
      tableData: [
        {
          orgName: 'yff11Paren',
          workflowStatus: 'Deployed',
          lastModifiedTime: '2020-09-11 09:30',
          lastModifiedBy: '"Shanghai',
          globalOrgId: 81
        }
      ],
      columnsUnder: [
        {
          width: 36,
          titleAlign: 'center',
          columnAlign: 'center',
          type: 'selection'
        },
        {
          field: 'orgName',
          title: 'Organization Name',
          width: 50,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
          // componentName: 'table-operation'
        },
        {
          field: 'workflowStatus',
          title: 'Workflow Status',
          width: 246,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        }
      ],
      band: {
        bandwidth: ''
      },
      // 下拉框
      value: ['5Mbps'],
      // 表格的数据
      tableDataArr: [
        {
          name: this.$t('WFDeviceName'),
          value: ''
        },
        {
          name: this.$t('SerialNumber'),
          value: ''
        }
      ],
      curTab: 0,
      autoGenGroups: null,
      notAutoGenGroups: null,
      rules: {
        siteId: [{ validator: this.validateDeviceId, trigger: 'change' }],
        deviceGroup: [
          { validator: this.validateDeviceGroup, trigger: 'change' }
        ],
        country: [{ validator: this.validateCountry, trigger: 'change' }]
      },
      validateBasicDatas: {
        deviceName: '',
        siteId: '',
        orgName: '',
        deviceGroup: ''
      },
      validateLocDatas: {
        country: ''
      },
      createGrp: {},
      group: {},
      deviceCheck: {}
    };
  },
  props: ['formCheck'],

  updated() {
    //获取当前的Tab
    this.getCurrentTab();
    //更改tab背景色
    this.updateTabsBgColor();
    console.log(
      'this.fromFormCheck.serviceBandwidth',
      this.fromFormCheck.serviceBandwidth
    );
    this.maxTagPlaceholder = `${this.fromFormCheck.serviceBandwidth.length} selected`;
    this.$emit('DevCheck', this.fromFormCheck);
    this.$emit('edit', this.edit);
    // this.DeviceGroups();
  },
  methods: {
    validateDeviceId(rule, value, callback) {
      if (!value) {
        callback(new Error('Global Device ID is required'));
      } else {
        callback();
      }
    },
    validateDeviceGroup(rule, value, callback) {
      if (!value) {
        callback(new Error('Device Group is required'));
      } else {
        callback();
      }
    },
    validateCountry(rule, value, callback) {
      if (!value) {
        callback(new Error('Country is required'));
      } else {
        callback();
      }
    },
    satisfyValidation() {
      let isOK = true;
      if (this.show.curIndex != 2) {
        this.$refs.ruleForm.validate(valid => {
          if (!valid) {
            isOK = false;
            return false;
          }
        });
      }
      return isOK;
    },
    async handleOk() {
      let isOK = this.satisfyDeviceGroupValidation();
      if (isOK) {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
        }, 3000);
        const res = await DeviceGroupAdd(this.createGrp);
        if (res.message == 'Success') {
          this.visibleGroup = false;
          this.$message.success('Create device group successfully.');
          this.$refs.createGroupRf.$refs.ruleForm.resetFields();
          // this.dev.deviceGroup = res.result.name;
          this.fromFormCheck.deviceGroup = res.result.name;
        } else {
          this.$message.error(res.message);
        }
      }
      // const res = await DeviceGroupAdd(this.createGrp);
      // console.log(res.result.name);
      // this.fromFormCheck.deviceGroup = res.result.name;
      // this.$refs.createGroupEditRf.$refs.ruleForm.resetFields();
      // localStorage.ogn = '';
    },
    handleCancel() {
      this.visibleGroup = false;
      this.$refs.createGroupEditRf.$refs.ruleForm.resetFields();
    },
    // 显示与隐藏
    handleClick() {
      this.$store.commit(DEVICES_HANDLE);
    },
    ShowClick() {
      let isJump = this.satisfyValidation();
      if (isJump) {
        this.$store.commit(DEVICES_SHOW);
      }
    },
    bindClick() {
      let isJump = this.satisfyValidation();
      if (isJump) {
        this.bidHandler();
      }
    },
    async bidHandler() {
      this.$store.commit(DEVICES_BID);

      const resBind = await DeviceBinding(this.fromFormCheck);
      this.edit = resBind.result;

      if (resBind.result) {
        // 部署需要的参数
        this.deploy = resBind.result;
        this.tableDataArr[0].value = resBind.result.deviceName;
        this.tableDataArr[1].value = resBind.result.serialNumber;

        if (resBind.result.postStagingTemplateInfo) {
          const postStagingTemplateInfo =
            resBind.result.postStagingTemplateInfo;
          const {
            deviceTemplateVariable,
            variableMetadata
          } = postStagingTemplateInfo.templateData;
          const autoGenerateAttrs = deviceTemplateVariable.variableBinding.attrs.filter(
            attr => {
              if (attr.isAutogeneratable === false) {
                return true;
              }
              return false;
            }
          );
          const notAutoGenerateAttrs = deviceTemplateVariable.variableBinding.attrs.filter(
            attr => {
              if (attr.isAutogeneratable === true) {
                return true;
              }
              return false;
            }
          );

          this.autoGenGroups = new Map();
          this.notAutoGenGroups = new Map();

          for (let i = 0; i < autoGenerateAttrs.length; i++) {
            let aga = autoGenerateAttrs[i];

            for (let j = 0; j < variableMetadata.length; j++) {
              let vm = variableMetadata[j];

              if (vm.variable === aga.name) {
                aga.showName = aga.name.replace(/\{\$v_(.+)\}/, '$1');
                aga.type = vm.type;
                let vars = [aga];

                if (this.autoGenGroups.has(vm.group)) {
                  vars = this.autoGenGroups.get(vm.group);
                  vars.push(aga);
                }
                this.autoGenGroups.set(vm.group, vars);

                break;
              }
            }
          }

          for (let i = 0; i < notAutoGenerateAttrs.length; i++) {
            let naga = notAutoGenerateAttrs[i];

            for (let j = 0; j < variableMetadata.length; j++) {
              let vm = variableMetadata[j];

              if (vm.variable === naga.name) {
                naga.showName = naga.name.replace(/\{\$v_(.+)\}/, '$1');
                naga.value = naga.value ? naga.value : 'auto';
                let vars = [naga];

                if (this.notAutoGenGroups.has(vm.group)) {
                  vars = this.notAutoGenGroups.get(vm.group);
                  vars.push(naga);
                }
                this.notAutoGenGroups.set(vm.group, vars);

                break;
              }
            }
          }

          this.fromFormCheck.postStagingTemplateInfo = postStagingTemplateInfo;
        }
      }
    },
    // 添加群组
    deviceGroups() {
      console.log(111);
    },
    // showModalGroup() {
    //   localStorage.ogn = this.formCheck.orgName || '';
    //   this.visibleGroup = true;
    // },
    // 标签页的方法
    callback(key) {
      console.log(key);
    },
    // 下表格方法
    selectALL(selection) {
      console.log('select-aLL', selection);
    },
    selectChange(selection, rowData) {
      console.log('select-change', selection, rowData);
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    customCompFunc(params) {
      console.log(params);

      if (params.type === 'delete') {
        // do delete operation

        this.$delete(this.tableData, params.index);
      } else if (params.type === 'edit') {
        // do edit operation

        alert(`行号：${params.index} 姓名：${params.rowData['name']}`);
      }
    },
    // Service Bandwidth下拉框
    handleChange(value) {
      console.log('value=', value);
      if (value.length > 0) {
        this.fromFormCheck.serviceBandwidth = value;
        this.maxTagPlaceholder = `${value.length} selected`;
        this.fromFormCheck.bandwidth = value.reduce(function(prev, cur) {
          return parseInt(prev) + parseInt(cur);
        });
      } else {
        this.maxTagPlaceholder = '0 selected';
        this.fromFormCheck.bandwidth = '';
      }
      console.log(this.fromFormCheck.bandwidth);
    },
    getCurrentTab() {
      this.curTab = this.show.curIndex;
    },
    updateTabsBgColor() {
      this.$refs.basicTabRef.style.backgroundColor = '#8d9fb3';
      this.$refs.locationTabRef.style.backgroundColor = '#8d9fb3';
      this.$refs.bindTabRef.style.backgroundColor = '#8d9fb3';

      let curRef =
        this.show.curIndex === 0
          ? 'basicTabRef'
          : this.curTab === 1
          ? 'locationTabRef'
          : 'bindTabRef';
      this.$refs[curRef].style.backgroundColor = '#aac0d5';
    },
    // 从子页面获取表单的数据
    createGroupEdit(grp) {
      this.createGrp = { ...grp };
    },
    // 给Device Groups下拉框赋值
    async DeviceGroups() {
      const res = await devicesGroup(this.fromFormCheck.orgName);
      console.log(res.result);
      if (res.result !== null) {
        this.group = res.result['device-group'];
      }
    },
    satisfyDeviceGroupValidation() {
      let isOK = true;
      this.$refs.createGroupRf.$refs.ruleForm.validate(valid => {
        if (!valid) {
          isOK = false;
          return false;
        }
        return true;
      });
      return isOK;
    }
  },
  watch: {
    curTab: function(newCurTab) {
      if (newCurTab === 2) {
        this.bidHandler();
      }
    },
    'fromFormCheck.orgName': function() {
      if (this.fromFormCheck.orgName !== '') {
        this.DeviceGroups();
      }
    },
    visibleGroup(newVal) {
      console.log(newVal, 'visibleGroup');
      if (!newVal) localStorage.ogn = '';
    }
  }
};
import { FormModel } from 'ant-design-vue';
import Vue from 'vue';
Vue.use(FormModel);
import DeviceGroup from './DeviceGroup';
// 自定义列组件
Vue.component('table-cell-merge', {
  template: `<span style="color:red">
               单元格 rowSpan 和 colSpan 同时使用
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
  }
});
</script>
<style lang="scss" scoped>
/deep/.ant-form-item-label > label::after {
  display: none !important;
}
/deep/.ant-form-explain {
  display: none !important;
}
/deep/.ant-form-inline .ant-form-item-with-help {
  margin-bottom: 0;
}
.deviceGroup:hover {
  text-decoration: underline;
  color: #fff;
}
.switchover {
  overflow: hidden;
  .basic {
    width: 53px;
    height: 22px;
    background-color: #aac0d5;
    border-radius: 5px 3px 0px 0px;
    line-height: 22px;
    text-align: center;
    float: left;
  }
  .location {
    width: 142px;
    height: 22px;
    background-color: #8d9fb3;
    border-radius: 5px 3px 0px 0px;
    float: left;
    line-height: 22px;
    text-align: center;
    margin: 0 3px;
  }
  .bid {
    width: 79px;
    height: 22px;
    background-color: #8d9fb3;
    border-radius: 5px 3px 0px 0px;
    float: left;
    line-height: 22px;
    text-align: center;
  }
}
/deep/.ant-form-inline .ant-form-item > .ant-form-item-control-wrapper {
  width: 100%;
}
/deep/.ant-form-item label {
  color: #fff;
  // line-height: 0;
}
/deep/.ant-select-selection__rendered {
  line-height: 17px;
}

.form_basic {
  /deep/.ant-form-item {
    padding: 0;
    width: 270px;
    .ant-input {
      width: 100%;
      height: 20px;
    }

    .ant-select-selection--single {
      height: 20px;
    }
    .ant-form-item-label {
      line-height: 19px;
    }
    .ant-form-item-control {
      line-height: 22px;
    }
  }
  .serviceBand {
    height: 78px;
    border-radius: 5px;
    border: solid 3px #456880;
    position: relative;
    padding-top: 5px;
    margin-top: 10px;
    .subscrition {
      width: 80px;
      height: 21px;
      background-color: #507691;
      border-radius: 5px;
      position: absolute;
      left: 29px;
      top: -12px;
      line-height: 21px;
      text-align: center;
      color: #fff;
    }
  }
}
.form_location {
  .box {
    margin: 20px 10px 0 10px;
    width: 845px;
    padding: 8px 10px 10px;
    border-radius: 4px;
    // height: 163px;
    border: 1px solid #456880;
    position: relative;
    /deep/ .ant-form-item-label {
      line-height: 24px;
    }
    /deep/.ant-form-item-control {
      line-height: 18px;
    }
    .loca {
      width: 68px;
      height: 22px;
      color: #fff;
      background: #507691;
      border-radius: 4px;
      padding: 2px 5px;
      position: absolute;
      left: 10px;
      top: -10px;
    }
    .location_title {
      /deep/.ant-form-item {
        padding: 0;
        width: 402px;
        .ant-input {
          width: 100%;
          height: 20px;
        }
        .ant-select-selection--single {
          height: 20px;
        }
      }
    }
    .location_main {
      /deep/.ant-form-item {
        padding: 0;
        width: 192px;
        .ant-input {
          width: 100%;
          height: 20px;
        }
        .ant-select-selection--single {
          height: 20px;
        }
      }
    }
    .location_footer {
      /deep/.ant-form-item {
        padding: 0;
        width: 192px;
        .ant-input {
          width: 100%;
          height: 20px;
        }
        .ant-select-selection--single {
          height: 20px;
        }
      }
      .ant-btn,
      .ant-btn:active,
      .ant-btn:focus {
        width: 192px;
        margin-top: 14px;
      }
    }
  }
}
.form_bind {
  span {
    color: #fff;
  }
  color: #fff;
  /deep/ .ant-select-selection--single {
    width: 250px;
    height: 25px;
  }
  /deep/.ant-row {
    color: #fff;
    margin: 14px 0;
  }
}
// 1111111111111111111111111
/deep/.v-table-body {
  height: 120px !important;
}

/deep/.v-table-body-class {
  overflow-x: scroll !important;
}
/deep/.ant-table table {
  background: #ffffff;
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
    padding: 10px;
    background-color: #36536b;
  }
  .ant-modal-footer {
    background-color: #e9f4fc;
  }
}
.tableListBox {
  background-color: #b6c9db;
  // .tableListInner {
  //   display: flex;
  //   align-items: center;
  //   & > div {
  //     flex: 1;
  //   }
  // }
  overflow-x: scroll;
  display: flex;
  & > .ant-input {
    min-width: 150px;
  }
  & > table {
    th {
      white-space: nowrap;
    }
    td {
      white-space: nowrap;
    }
  }
}
</style>
