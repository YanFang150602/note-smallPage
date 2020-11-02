<template>
  <div class="add-device">
    <!--  三个切换tab -->
    <div class="switchover">
      <div ref="basicTabRef" class="basic" @click="handleClick">Basic</div>
      <div ref="locationTabRef" class="location" @click="ShowClick">Location information</div>
      <div ref="bindTabRef" class="bid" @click="bindClick">Bid Data</div>
    </div>
    <!-- basic -->
    <div v-if="showAdd.isShow" class="form_basic">
      <a-form-model layout="inline" :model="dev" :rules="rules" ref="ruleForm">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="Name" required prop="deviceName">
              <a-input v-model="dev.deviceName" title="名称不能包含特殊字符，但“-”除外，至少包含一个字母。"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="Global Device ID" required prop="siteId">
              <a-input v-model.number="dev.siteId"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="Organization" required prop="orgName">
              <a-select
                v-model="dev.orgName"
                placeholder="please select your zone"
                @change="change"
              >
                <a-select-option
                  :value="item.name"
                  v-for="(item, index) in organ"
                  :key="index"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="Depoyment Type">
              <a-select
                v-model="dev.deploymentType"
                placeholder="please select your zone"
                default-value="physical"
              >
                <a-select-option value="physical">CPE-Baremetal Device</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="Serial Number" prop="serialNumber">
              <a-input v-model="dev.serialNumber"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="Device Groups" required prop="deviceGroup">
              <a-select v-model="dev.deviceGroup">
                <a-select-option
                  :value="item"
                  v-for="(item, index) in group"
                  :key="index"
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
              @click="showModalGroup"
              class="deviceGroup"
              style="color:#fff;cursor:pointer;"
              >+ Device Group</span
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
              option-label-prop="label"
              placeholder="Select options"
              @change="handleChange"
              :maxTagPlaceholder="maxTagPlaceholder"
              autoClearSearchValue
              :maxTagCount="0"
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
    <div class="form_location" v-if="showAdd.isDemonstrate">
      <div class="box">
        <div class="loca">Location</div>
        <a-form-model layout="inline" :model="dev.locationInfo" :rules="rules" ref="ruleForm">
          <div class="location_title">
            <a-row>
              <a-col :span="12">
                <a-form-model-item label="Address 1" prop="address1">
                  <a-input v-model="dev.locationInfo.address1"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="Address 2" prop="address2">
                  <a-input v-model="dev.locationInfo.address2"/>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <div class="location_main">
            <a-row>
              <a-col :span="6">
                <a-form-model-item label="City" prop="city">
                  <a-input v-model="dev.locationInfo.city"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="State" prop="state">
                  <a-input v-model="dev.locationInfo.state"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="Country" required prop="country">
                  <a-input v-model="dev.locationInfo.country"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="Zip">
                  <a-input v-model="dev.locationInfo.zip" placeholder="e.g.000001"/>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <div class="location_footer">
            <a-row>
              <a-col :span="6">
                <a-form-model-item label="Latitude" prop="latitude">
                  <a-input v-model="dev.locationInfo.latitude" placeholder="e.g.32.000001"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="Longitude" prop="longitude">
                  <a-input v-model="dev.locationInfo.longitude" placeholder="e.g.120.000001"/>
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
    <div class="form_bind" v-if="showAdd.isExhibition">
      <a-form-model layout="inline" :model="dev.locationInfo" :rules="rules" ref="ruleForm">
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
      </a-form-model>
    </div>
    <!-- 组群弹框 -->
    <div>
      <a-modal
        v-model="visibleGroup"
        title="Create Device Group"
        on-ok="handleOk"
        width="940px"
        :destroyOnClose="true"
      >
        <template slot="footer">
          <a-button key="submit" type="primary" :loading="loading" @click="handleOk">ok</a-button>
          <a-button key="back" @click="handleCancel">cancel</a-button>
        </template>
        <DeviceGroup @createGroup="createGroup" ref="createGroupRf"></DeviceGroup>
      </a-modal>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import {
  DEVICES_SHOWADD,
  DEVICES_BIDADD,
  DEVICES_HANDLEADD
} from '@/store/mutation-types';
import {
  devicesOrg,
  devicesGroup,
  DeviceGroupAdd,
  DeviceID,
  DeviceBinding
} from 'apis/workFlows';
//表格数据
export default {
  name: 'frozen-title-columns',
  components: {
    DeviceGroup
  },
  computed: {
    num: function() {
      if (this.dev.bandwidth) {
        return this.dev.bandwidth > 1000
          ? this.dev.bandwidth / 1000 + ' Gbps'
          : this.dev.bandwidth + 'Mbps';
      } else {
        return '';
      }
    },
    ...mapState(['showAdd'])
  },
  created() {
    //给Organization下拉框赋值
    this.organization();
    // Global Device ID输入框的赋值
    this.GlobalID();
    //设备绑定信息查询
    this.binding();
  },
  updated() {
    //获取当前的Tab
    this.getCurrentTab();
    //更改tab背景色
    this.updateTabsBgColor();
    this.$emit('dew', this.dev);
    this.$emit('tab', this.deploy);
    this.$emit('band', this.bandwidth);
  },
  data() {
    return {
      bandwidth: [],
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
      isShow: true,
      isDemonstrate: false,
      isExhibition: false,
      dev: {
        deviceName: '',
        siteId: '',
        orgName: '',
        serialNumber: '',
        deviceGroup: '',
        deploymentType: 'physical',
        bandwidth: '',
        locationInfo: {
          address1: '',
          address2: '',
          state: '',
          country: '',
          city: '',
          zip: '',
          longitude: '',
          latitude: ''
        }
      },

      // Device Group的弹框
      visibleGroup: false,
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
      //新增设备中Organization获取到的值
      organ: [],
      // 新增设备中Device Groups获取到的值
      group: [],
      // 从子页面接受的表单数据
      createGrp: {},
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
      // 部署需要的参数
      deploy: {},
      curTab: 0,
      autoGenGroups: null,
      notAutoGenGroups: null,
      rules: {
        deviceName: [{ validator: this.validateName, trigger: 'change' }],
        siteId: [{ validator: this.validateDeviceId, trigger: 'change' }],
        orgName: [{ validator: this.validateOrganization, trigger: 'change' }],
        serialNumber: [
          { validator: this.validateSerialNumber, trigger: 'change' }
          // (pattern = '[\u4e00-\u9fa5]')
        ],

        deviceGroup: [
          { validator: this.validateDeviceGroup, trigger: 'change' }
        ],
        country: [{ validator: this.validateCountry, trigger: 'blur' }],
        address1: [{ validator: this.validateAddress1, trigger: 'blur' }],
        address2: [{ validator: this.validateAddress2, trigger: 'blur' }],
        city: [{ validator: this.validateCity, trigger: 'blur' }],
        state: [{ validator: this.validateState, trigger: 'blur' }],
        latitude: [{ validator: this.validateLatitude, trigger: 'blur' }],
        longitude: [{ validator: this.validateLongitude, trigger: 'blur' }]
      }
    };
  },

  methods: {
    validateName(rule, value, callback) {
      if (!value) {
        // this.$message.error('Name is required');
        return callback(new Error('Name is required'));
      }
      // if (/^(?=.*[a-zA-Z])([A-Za-z0-9-]{1,127})$/.test(value)) {
      //   this.$message.error(
      //     'The name cannot contain special characters, except ' -
      //       ', which contains at least one letter.'
      //   );
      //   return callback(
      //     new Error(
      //       'The name cannot contain special characters, except ' -
      //         ', which contains at least one letter.'
      //     )
      //   );
      // }
      callback();
    },
    validateDeviceId(rule, value, callback) {
      if (!value) {
        // this.$message.error('Global Device ID is required');
        return callback(new Error('Global Device ID is required'));
      } else {
        callback();
      }
    },
    validateOrganization(rule, value, callback) {
      if (!value) {
        // this.$message.error('Organization is required');
        return callback(new Error('Organization is required'));
      }
      callback();
    },
    //Serial Number
    validateSerialNumber(rule, value, callback) {
      if (/[\u4e00-\u9fa5]/.test(value)) {
        this.$message.error('Serial Number should not be chinese');
        return callback(new Error('Organization is required'));
      }
      callback();
    },
    validateDeviceGroup(rule, value, callback) {
      if (!value) {
        // this.$message.error('Device Group is required');
        callback(new Error('Device Group is required'));
      } else {
        callback();
      }
    },
    validateCountry(rule, value, callback) {
      if (/[\u4e00-\u9fa5]/.test(value)) {
        this.$message.error('Country should not be chinese');
        return callback(new Error('Country should not be chinese'));
      }
      if (!value) {
        this.$message.error('Country is required');
        return callback(new Error('Country is required'));
      }
      callback();
    },
    // Address 1
    validateAddress1(rule, value, callback) {
      if (/[\u4e00-\u9fa5]/.test(value)) {
        this.$message.error('Address 1 should not be chinese');
        return callback(new Error('Address 1 should not be chinese'));
      }
      callback();
    },

    // Address 2
    validateAddress2(rule, value, callback) {
      if (/[\u4e00-\u9fa5]/.test(value)) {
        this.$message.error('Address 2 should not be chinese');
        return callback(new Error('Address 2 should not be chinese'));
      }
      callback();
    },
    // validateCity
    validateCity(rule, value, callback) {
      if (/[\u4e00-\u9fa5]/.test(value)) {
        this.$message.error('city should not be chinese');
        return callback(new Error('city should not be chinese'));
      }
      callback();
    },
    // validateState
    validateState(rule, value, callback) {
      if (/[\u4e00-\u9fa5]/.test(value)) {
        this.$message.error('city should not be chinese');
        return callback(new Error('city should not be chinese'));
      }
      callback();
    },
    //Latitude
    validateLatitude(rule, value, callback) {
      if (
        /^[\\-\\+]?(0?\\d{1,2}\\.\\d{1,6}|1[0-7]?\\d{1}\\.\\d{1,6}|180\\.0{1,6})$/.test(
          value
        )
      ) {
        this.$message.error('Format: 32.000001');
        return callback(new Error('Format: 32.000001'));
      }
      callback();
    },
    //validateLongitude
    validateLongitude(rule, value, callback) {
      if (/^[\\-\\+]?([0-8]?\\d{1}\\.\\d{1,6}|90\\.0{1,6})$/.test(value)) {
        this.$message.error('Format: 120.000001');
        return callback(new Error('Format:120.000001'));
      }
      callback();
    },

    satisfyValidation() {
      if (this.showAdd.curIndex == 2) return true;
      let isOK = true;
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          isOK = false;
          return false;
        }
      });
      return isOK;
    },
    // 确定按钮
    async handleOk() {
      setTimeout(() => {
        this.visible = false;
        this.loading = false;
      }, 3000);

      this.$refs.createGroupRf.$refs.ruleForm.validate(async (valid, res) => {
        if (valid) {
          const res = await DeviceGroupAdd(this.createGrp);
          console.log(res);
          if (res.message === 'Success') {
            this.dev.deviceGroup = res.result.name;
            this.$message.success('Edit Device Group Succes');
            this.visibleGroup = false;
            this.$refs.createGroupRf.$refs.ruleForm.resetFields();
          } else {
            this.$message.error(res.message);
          }
        } else {
          this.$message.error(res.message);
          return false;
        }
      });
    },
    // 组群增加
    async addGroup() {
      const res = await DeviceGroupAdd(this.createGrp);
      console.log(res.result.name);
      this.dev.deviceGroup = res.result.name;
    },
    handleCancel() {
      this.visibleGroup = false;
      this.$refs.createGroupRf.$refs.ruleForm.resetFields();
    },
    // 显示与隐藏
    handleClick() {
      this.$store.commit(DEVICES_HANDLEADD);
    },
    ShowClick() {
      let isJump = this.satisfyValidation();
      if (isJump) {
        this.$store.commit(DEVICES_SHOWADD);
      }
    },
    bindClick() {
      let isJump = this.satisfyValidation();
      if (isJump) {
        this.bidHandler();
      }
    },
    async bidHandler() {
      this.$store.commit(DEVICES_BIDADD);

      const resBind = await DeviceBinding(this.dev);

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

          this.dev.postStagingTemplateInfo = postStagingTemplateInfo;
        }
      }
    },
    // 添加群组
    deviceGroups() {
      console.log(111);
    },
    // showModalGroup() {
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
    //给Organization下拉框赋值
    async organization() {
      const res = await devicesOrg();
      this.organ = res.result.organizations;
      console.log(res);
    },
    // 给Device Groups下拉框赋值
    async DeviceGroups() {
      const res = await devicesGroup(this.dev.orgName);
      console.log(res.result['device-group']);
      if (res.result['device-group'] !== null) {
        this.group = res.result['device-group'];
      }
    },
    // Global Device ID输入框的赋值
    async GlobalID() {
      const res = await DeviceID();
      console.log(res.result.AvailableIDResponseModel.branchId);
      this.dev.siteId = res.result.AvailableIDResponseModel.branchId;
    },
    // 从子页面获取表单的数据
    createGroup(grp) {
      this.createGrp = { ...grp };
      // console.log(this.create);
    },
    //Organization下拉框值发生变化时
    change() {
      this.DeviceGroups();
    },
    //设备绑定信息查询获取上列表数据
    async binding() {
      const res = await DeviceBinding(this.dev);
      console.log(res);
      // this.tableData
    },
    // Service Bandwidth下拉框
    handleChange(value) {
      if (value.length > 0) {
        this.maxTagPlaceholder = `${value.length} selected`;
        this.dev.bandwidth = value.reduce(function(prev, cur) {
          return parseInt(prev) + parseInt(cur);
        });
      } else {
        this.maxTagPlaceholder = '0 selected';
        this.dev.bandwidth = '';
      }
      console.log(this.dev.bandwidth);
      console.log(this.bandwidth);
    },
    getCurrentTab() {
      this.curTab = this.showAdd.curIndex;
    },
    updateTabsBgColor() {
      this.$refs.basicTabRef.style.backgroundColor = '#8d9fb3';
      this.$refs.locationTabRef.style.backgroundColor = '#8d9fb3';
      this.$refs.bindTabRef.style.backgroundColor = '#8d9fb3';

      let curRef =
        this.showAdd.curIndex === 0
          ? 'basicTabRef'
          : this.curTab === 1
          ? 'locationTabRef'
          : 'bindTabRef';
      this.$refs[curRef].style.backgroundColor = '#aac0d5';
    },
    initBandwidth() {
      this.bandwidth = [];
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
              <input type="text"/>
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
  & > div {
    cursor: pointer;
  }
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
