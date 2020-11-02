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
            <a-col
              @click="addTemplate"
              :style="{
                fontSize: '18px',
                cursor: 'pointer',
                marginRight: '20px'
              }"
              ><a-icon type="plus"
            /></a-col>
            <a-col
              @click="delTemplate"
              :style="{
                fontSize: '18px',
                cursor: 'pointer',
                marginRight: '20px'
              }"
              ><a-icon type="minus"
            /></a-col>
            <a-col>
              <v-pagination
                :total="tempList.totalCount"
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
      is-vertical-resize
      is-horizontal-resize
      column-width-drag
      :columns="columns"
      :table-data="tempList['versanms.sdwan-template-list']"
      :select-change="delItem"
      style="width:100%"
      isFrozen="true"
      @on-custom-comp="edtTemplate"
    >
    </v-table>
    <!-- 数据添加编辑弹窗 -->
    <a-modal
      v-model="visible"
      :title="modalTitle"
      :width="1250"
      wrapClassName="form-wrap"
      cancelText="Cancel"
      okText="Ok"
      :afterClose="cleanData"
    >
      <a-form-model
        ref="tempForm"
        :rules="rules"
        :model="templateData.template"
        layout="vertical"
        @validate="validate"
        hideRequiredMark
      >
        <a-tabs
          @tabClick="tabClick"
          class="tabs-wrap"
          type="card"
          :activeKey="actKey"
        >
          <!-- Base -->
          <a-tab-pane key="1" tab="Basic">
            <a-row type="flex" justify="space-between" align="middle">
              <!-- 模板名称 -->
              <a-col>
                <a-form-model-item
                  style="width:392px"
                  label="Name"
                  prop="templateName"
                >
                  <a-input
                    size="small"
                    :disabled="modalType === 'edt'"
                    v-model="templateData.template.templateName"
                    @mouseenter="enter('templateName')"
                    @mouseleave="leave"
                    @mousemove="updateXY"
                  />
                </a-form-model-item>
              </a-col>
              <!-- 模板风格 -->
              <a-col>
                <a-form-model-item
                  size="small"
                  style="width:392px"
                  label="Type"
                >
                  <a-select
                    size="small"
                    v-model="templateData.template.templateType"
                    placeholder="-select-"
                  >
                    <a-select-option value="sdwan-post-staging">
                      sdwan-post-staging
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <!-- 模板父级组织 -->
              <a-col
                @mouseenter="enter('providerOrg.name')"
                @mouseleave="leave"
                @mousemove="updateXY"
              >
                <a-form-model-item
                  style="width:392px"
                  label="Organization"
                  prop="providerOrg.name"
                >
                  <a-select
                    size="small"
                    placeholder="-select-"
                    v-model="templateData.template.providerOrg.name"
                    @change="organChange"
                  >
                    <a-select-option
                      v-for="(item, index) in admNameList"
                      :key="index"
                      :value="item"
                    >
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row
              style="width:750px"
              type="flex"
              justify="space-between"
              align="middle"
              class="device-type"
            >
              <!-- device类型 -->
              <a-col>
                <a-form-model-item prop="deviceType">
                  <a-radio-group
                    size="small"
                    style="width:300px"
                    @change="getValue"
                    v-model="templateData.template.deviceType"
                  >
                    <a-radio value="full-mesh">
                      Full Mesh
                    </a-radio>
                    <a-radio value="hub">
                      Hub
                    </a-radio>
                    <a-radio value="spoke">
                      Spoke
                    </a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-col>
              <!-- spoke组列表 -->
              <a-col>
                <a-form-model-item style="width:292px" label="Spoke Group">
                  <a-select
                    size="small"
                    v-model="spokeSelect"
                    :disabled="spockOff"
                    placeholder="-select-"
                  >
                    <a-select-option
                      v-for="(item, index) in spokeOption"
                      :key="index"
                      :value="item"
                    >
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row
              class="subscription"
              type="flex"
              justify="space-between"
              align="top"
            >
              <a-col
                @mouseenter="enter('controllers')"
                @mouseleave="leave"
                @mousemove="updateXY"
              >
                <a-form-model-item
                  style="width:252px"
                  label="Controllers"
                  prop="controllers"
                >
                  <a-select
                    size="small"
                    mode="multiple"
                    @change="contrChange"
                    placeholder="Organizations must exist"
                    v-model="templateData.template.controllers"
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
              <a-col
                @mouseenter="enter('serviceBandwidth')"
                @mouseleave="leave"
                @mousemove="updateXY"
              >
                <a-form-model-item
                  style="width: 185px"
                  label="Service Bandwidth"
                  prop="serviceBandwidth"
                >
                  <a-select
                    size="small"
                    mode="multiple"
                    placeholder="Select options"
                    option-label-prop="label"
                    v-model="templateData.template.serviceBandwidth"
                    @change="handleChange"
                    maxTagPlaceholder="..."
                  >
                    <a-select-option :value="5" label="5 Mbps">
                      5 Mbps
                    </a-select-option>
                    <a-select-option :value="10" label="10 Mbps">
                      10 Mbps
                    </a-select-option>
                    <a-select-option :value="25" label="25 Mbps">
                      25 Mbps
                    </a-select-option>
                    <a-select-option :value="50" label="50 Mbps">
                      50 Mbps
                    </a-select-option>
                    <a-select-option :value="100" label="100 Mbps">
                      100 Mbps
                    </a-select-option>
                    <a-select-option :value="200" label="200 Mbps">
                      200 Mbps
                    </a-select-option>
                    <a-select-option :value="500" label="500 Mbps">
                      500 Mbps
                    </a-select-option>
                    <a-select-option :value="1000" label="1 Gbps">
                      1 Gbps
                    </a-select-option>
                    <a-select-option :value="5000" label="5 Gbps">
                      5 Gbps
                    </a-select-option>
                    <a-select-option :value="10000" label="10 Gbps">
                      10 Gbps
                    </a-select-option>
                    <a-select-option :value="20000" label="20 Gbps">
                      20 Gbps
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col>
                <a-form-model-item
                  style="width:252px"
                  label="Aggregate Bandwidth"
                >
                  <a-input
                    size="small"
                    disabled
                    v-model="templateData.template.bandwidthNew"
                  />
                </a-form-model-item>
                <a-row
                  class="check-btn"
                  type="flex"
                  justify="start"
                  align="middle"
                >
                  <a-col
                    ><a-checkbox
                      default-checked
                      disabled
                      v-model="templateData.template.isAnalyticsEnabled"
                    />&nbsp;Primary</a-col
                  >
                  <a-col
                    ><a-checkbox
                      default-checked
                      v-model="templateData.template.isPrimary"
                    />&nbsp;Analytics Enabled</a-col
                  >
                </a-row>
              </a-col>
            </a-row>
          </a-tab-pane>
          <!-- Interfaces -->
          <a-tab-pane class="firm-factor" key="2" tab="Interfaces">
            <div class="factor-title">Device Port Configuration</div>
            <a-row
              class="factor-con"
              type="flex"
              justify="start"
              align="middle"
            >
              <a-col class="factor-select">
                <div class="select-title">Number of Ports</div>
                <a-select
                  v-model="templateData.template.deviceFirmfactor"
                  size="small"
                  style="width: 85px"
                  @change="changePort"
                >
                  <a-select-option value="4">
                    4
                  </a-select-option>
                  <a-select-option value="6">
                    6
                  </a-select-option>
                  <a-select-option value="8">
                    8
                  </a-select-option>
                  <a-select-option value="10">
                    10
                  </a-select-option>
                  <a-select-option value="12">
                    12
                  </a-select-option>
                  <a-select-option value="14">
                    14
                  </a-select-option>
                  <a-select-option value="16">
                    16
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col class="factor-list">
                <a-row>
                  <a-col class="list-item">
                    <div class="port-value">0</div>
                    <div class="port-icon">
                      <img
                        width="100%"
                        src="@/assets/images/template/wf5.jpg"
                        alt=""
                      />
                    </div>
                    <div class="port-title">Mgmt</div>
                  </a-col>
                  <FactorSelect
                    @addport="addport"
                    :index="index"
                    v-for="(item, index) in factorNum"
                    :key="index"
                  />
                </a-row>
              </a-col>
            </a-row>

            <div class="factor-table">
              <div class="mandatory">
                Please enable at least one Frequency (2.4 GHz or 5 GHz).
              </div>
              <div class="wan-title">
                WAN Interfaces
              </div>
              <table class="table-bordered">
                <thead>
                  <tr>
                    <th rowspan="2" style="width:58px;">
                      Port #
                    </th>
                    <th rowspan="2" style="width:108px">
                      Interface
                    </th>
                    <th rowspan="2" style="width:114px">
                      VLAN ID
                    </th>
                    <th rowspan="2" style="width:226px">
                      Network Name
                    </th>
                    <th rowspan="2" style="width:114px">
                      Priority
                    </th>
                    <th colspan="2" style="text-align:center;width:128px">
                      IPv4
                    </th>
                    <th colspan="2" style="text-align:center;width:128px">
                      IPv6
                    </th>
                    <th rowspan="2" style="text-align:center;width:70px">
                      Allow SSH To CPE
                    </th>
                    <th colspan="2" style="text-align:center;width:210px">
                      Link Monitor
                    </th>
                  </tr>
                  <tr>
                    <th>
                      Static
                    </th>
                    <th>
                      DHCP
                    </th>
                    <th>
                      Static
                    </th>
                    <th>
                      DHCP
                    </th>
                    <th style="width:105px">
                      Nexthop
                    </th>
                    <th style="width:105px">
                      Remote IP
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <WanRowData
                    ref="rowWan"
                    :names="networkNames"
                    @addname="netWorkNameAdd"
                    :wandata="item"
                    v-for="(item, index) in templateData.template.wanInterfaces"
                    :key="index"
                  />
                </tbody>
              </table>
            </div>
            <!-- <div class="factor-table">
              <div class="wan-title">
                LAN Interfaces
              </div>
              <table class="table-bordered">
                <thead>
                  <tr>
                    <th rowspan="2" style="width:58px;">
                      Port #
                    </th>
                    <th rowspan="2" style="width:108px">
                      Interface
                    </th>
                    <th rowspan="2" style="width:114px">
                      VLAN ID
                    </th>
                    <th rowspan="2" style="width:226px">
                      Network Name
                    </th>
                    <th rowspan="2" style="width:114px">
                      Organization
                    </th>
                    <th rowspan="2" style="text-align:center;width:128px">
                      Zones
                    </th>
                    <th rowspan="2" style="text-align:center;width:128px">
                      Routing Instance
                    </th>

                    <th colspan="2" style="text-align:center;width:128px">
                      IPv4
                    </th>
                    <th colspan="2" style="text-align:center;width:128px">
                      IPv6
                    </th>
                  </tr>
                  <tr>
                    <th>
                      Static
                    </th>
                    <th>
                      DHCP
                    </th>
                    <th>
                      Static
                    </th>
                    <th>
                      DHCP
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in lanInter" :key="index">
                    <td>
                      <input style="width:45px" type="text" value="0" />
                    </td>
                    <td>
                      <input type="text" style="width:60px" value="vni-0/0" />
                    </td>
                    <td>
                      <input type="text" style="width:60px" name="" value="" />
                    </td>
                    <td>
                      <input style="width:200px" type="text" name="" value="" />
                    </td>
                    <td>
                      <input type="text" style="width:210px" name="" value="" />
                    </td>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td align="center">
                      <input type="checkbox" />
                    </td>
                    <td align="center">
                      <input type="checkbox" />
                    </td>
                    <td align="center">
                      <input type="checkbox" />
                    </td>
                    <td align="center">
                      <input type="checkbox" />
                    </td>
                    <td align="center">
                      <input type="checkbox" />
                    </td>
                    <td>
                      <input style="width:80px" type="text" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div> -->
          </a-tab-pane>
        </a-tabs>
      </a-form-model>

      <template slot="footer">
        <a-button
          style="float:left"
          v-show="!(actKey === '1')"
          key="Back"
          @click="tabPrev"
        >
          Back
        </a-button>
        <a-button type="primary" key="Cancel" @click="visible = false">
          Cancel
        </a-button>
        <a-button key="Save" @click="handleOk" style="background:#0095da">
          Save
        </a-button>
        <a-button v-show="!(actKey === '2')" key="Continue" @click="tabNext">
          Continue
        </a-button>
        <a-button
          v-show="actKey === '2'"
          key="Create"
          style="background:#0095da"
          @click="createTem"
        >
          Create
        </a-button>
      </template>
    </a-modal>
    <!-- 添加networkname 弹窗 -->
    <a-modal
      v-model="netVisble"
      title="Create  WAN Network"
      :bodyStyle="{
        backgroundColor: 'rgb(54, 83, 107)',
        padding: '0 10px 10px'
      }"
      :width="400"
      wrapClassName="from-wrap"
      :afterClose="CleanNetData"
    >
      <a-form-model
        ref="netWorkNameRef"
        :model="netWorkNameData"
        :rules="netWorkNameRule"
        hideRequiredMark
      >
        <a-form-model-item label="Name" prop="name">
          <a-input size="small" v-model="netWorkNameData.name" />
        </a-form-model-item>
        <a-form-model-item label="Description" prop="description">
          <a-input size="small" v-model="netWorkNameData.description" />
        </a-form-model-item>
        <a-form-model-item label="Transport Domain" prop="domains">
          <a-select
            mode="multiple"
            size="small"
            style="width: 100%"
            placeholder="Please select"
            v-model="netWorkNameData.domains"
            @change="handleNetWorkName"
          >
            <a-select-option
              v-for="(item, index) in traDomainList"
              :key="index"
            >
              {{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button key="submit" @click="handleNet">
          Ok
        </a-button>
        <a-button type="primary" @click="netVisble = false" key="back">
          Cancel
        </a-button>
      </template>
    </a-modal>
    <!-- task 提示信息 -->
    <TaskNotice :taskinfo="taskinfo" @task-complete="taskComplete" />
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
import FactorSelect from './factorSelect';
import WanRowData from './wanRowData';
import TaskNotice from '@/views/components/TaskNotice';
import { mapState, mapActions } from 'vuex';
import {
  spokeList,
  controllerWrap,
  templateAdd,
  templateDel,
  templateSearch,
  templateEdt,
  networkName,
  templateCrt,
  TraDomain,
  netWrokNameCre
} from 'apis/administration';
export default {
  data() {
    // 自定义表单验证
    let templateName = (rule, value, callback) => {
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
    let providerOrgName = (rule, value, callback) => {
      if (value === '') {
        callback('Select Organization');
      } else {
        callback();
      }
    };
    let controllers = (rule, value, callback) => {
      if (value.length === 0) {
        callback('Select Controllers');
      } else {
        callback();
      }
    };
    let serviceBandwidth = (rule, value, callback) => {
      if (value.length === 0) {
        callback('Field required');
      } else {
        callback();
      }
    };
    return {
      //分页
      pageIndex: 1,
      pageSize: 20,
      totalCount: 100,
      keyworks: '',
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
        templateName: '',
        ['providerOrg.name']: '',
        controllers: '',
        serviceBandwidth: ''
      },
      columns: [
        {
          width: 36,
          titleAlign: 'center',
          columnAlign: 'center',
          type: 'selection'
        },
        {
          field: 'templateName',
          title: 'Name',
          width: 50,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          componentName: 'templates-name'
        },
        {
          field: 'workflowStatus',
          title: 'Status',
          width: 50,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'lastModifiedTime',
          title: 'Last Modified By',
          width: 50,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'lastModifiedBy',
          title: 'Last Modified By',
          width: 50,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        }
      ],
      visible: false,
      factorNum: 0,
      networkNames: [],
      spokeOption: [],
      spokeSelect: '',
      spockOff: true,
      controllerList: [], //表单标题
      modalTitle: '', //表单类型
      modalType: '', //模板删除参数
      //任务进度查询
      taskinfo: {
        taskId: '',
        type: ''
      },
      //模板表单内容
      templateData: {
        template: {
          templateName: '',
          templateType: 'sdwan-post-staging',
          controllers: [],
          providerOrg: {
            name: ''
          },
          deviceFirmfactor: '0',
          //wan端口数据
          wanInterfaces: [],
          deviceType: 'hub',
          solutionTier: 'advanced-sdwan-plus-utm',
          bandwidth: '',
          // 带宽转换单位
          bandwidthNew: '',
          // 带宽下拉选中的tag
          serviceBandwidth: [],
          isAnalyticsEnabled: true,
          isPrimary: true
        }
      },
      templDel: {
        ids: []
      },
      //Lan端口新建数据
      lanInter: [],

      //表单校验
      rules: {
        templateName: [{ validator: templateName }],
        ['providerOrg.name']: [{ validator: providerOrgName }],
        controllers: [{ validator: controllers }],
        serviceBandwidth: [{ validator: serviceBandwidth }]
      },
      //tab当前页
      actKey: '1',
      // networkname添加开关
      netVisble: false,
      //networkname提交内容
      netWorkNameData: {
        orguuid: '',
        name: '',
        domains: [],
        description: ''
      },
      // networkname Transport Domain下拉
      traDomainList: [],
      // networkname校验
      netWorkNameRule: {
        name: [
          {
            required: true
          }
        ],
        domains: [
          {
            required: true
          }
        ]
      }
    };
  },
  computed: {
    num: function() {
      if (this.templateData.template.bandwidth) {
        return this.templateData.template.bandwidth > 1000
          ? this.templateData.template.bandwidth / 1000 + ' Gbps'
          : this.templateData.template.bandwidth + 'Mbps';
      } else {
        return '';
      }
    },
    ...mapState(['admNameList', 'tempList', 'organization'])
  },
  created() {
    //获取所有模板
    if (this.organization) {
      this.templateList({
        orgname: this.organization,
        limit: this.pageSize,
        offset: this.pageIndex
      });
    } else {
      //获取组织对应模板
      this.getNameList();
      this.templateList({
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    }
  },

  methods: {
    ...mapActions(['getNameList', 'templateList']),
    // 搜索框事件
    search() {
      console.log(this.keyworks);
    },
    // networkname Transport Domain选项
    handleNetWorkName() {},
    // networkname弹出关闭
    CleanNetData() {
      this.$refs.netWorkNameRef.resetFields();
    },
    // 模板Transport Domain查询
    async netWorkNameAdd() {
      const { result } = await TraDomain();
      this.traDomainList = result.domainList;
      this.netVisble = true;
    },
    // networkname提交
    async handleNet() {
      this.$refs.netWorkNameRef.validate(async valid => {
        if (valid) {
          //组织详细信息 获取uuid

          this.netWorkNameData.orguuid = this.templateData.template.providerOrg.name;

          const resNetWorkName = await netWrokNameCre(this.netWorkNameData);
          if (resNetWorkName.status !== '0000')
            return this.$message.error(resNetWorkName.message);
          this.$message.success('NetWork Name 创建成功！');
          this.networkNames.unshift(this.netWorkNameData.name);
          this.netVisble = false;
        }
      });
    },
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.templateList({
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    },
    // 分页切换操作
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.templateList({
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    },
    // 带宽下拉选中的tag清除
    handleReset() {
      this.templateData.template.serviceBandwidth = [];
    },
    // tab 按钮切换效果 返回上一步
    tabPrev() {
      if (this.actKey !== '1') {
        this.actKey = String(Number(this.actKey) - 1);
        console.log(this.actKey);
      }
    },
    // tab 去下一页
    tabNext() {
      if (this.actKey === '1') {
        this.$refs.tempForm.validate(valid => {
          if (valid) {
            this.actKey = '2';
          }
        });
        if (this.actKey !== '2' && this.actKey !== '1') {
          this.actKey = String(Number(this.actKey) + 1);
          console.log(this.actKey);
        }
      }
    },
    // tab 验证切换
    tabClick(key) {
      if (key === '1') {
        this.actKey = '1';
      } else if (key === '2') {
        this.$refs.tempForm.validate(valid => {
          if (valid) {
            this.actKey = '2';
          }
        });
      }
    },
    //controller 获取
    contrChange(selectedItems) {
      this.templateData.template.controllers = selectedItems;
    },
    // 组织列表下拉事件
    async organChange(value) {
      //控制器查询
      this.controllerList = [];
      const { result } = await controllerWrap({
        organization: value
      });
      result['appliance-list'].forEach(item => {
        this.controllerList.push(item.name);
      });
      // spoke列表
      const spokeRes = await spokeList({
        offset: 0,
        limit: 25,
        orgname: value
      });
      if (spokeRes) {
        spokeRes.result.data.forEach(item => {
          this.spokeOption.push(item.name);
        });
      }
      //组织对应network 信息
      const netRes = await networkName({
        id: this.templateData.template.providerOrg.name
      });
      this.networkNames = [];
      if (netRes.result[0].wanNetworkGroups) {
        netRes.result[0].wanNetworkGroups.forEach(item => {
          this.networkNames.push(item.name);
        });
      }
    },
    //添加模板
    async addTemplate() {
      this.modalTitle = 'Create Template';
      this.modalType = 'add';
      this.visible = true;
    },
    // 计算带宽
    handleChange(value) {
      this.templateData.template.serviceBandwidth = value;
      if (value.length > 0) {
        this.templateData.template.bandwidth = value.reduce(function(
          prev,
          cur
        ) {
          return parseInt(prev) + parseInt(cur);
        });
        this.templateData.template.bandwidthNew = this.num;
      } else {
        this.templateData.template.bandwidth = '';
        this.templateData.template.bandwidthNew = '';
      }
    },
    // 控制port显示数量
    changePort(value) {
      this.factorNum = value - 1;
      this.templateData.template.deviceFirmfactor = value;
    },
    getValue(e) {
      e.target.value === 'spoke'
        ? (this.spockOff = false)
        : (this.spockOff = true);
    },
    // 添加创建设备表格栏
    addport(val) {
      console.log(val);
      const wRowData = {
        portid: '',
        interfaceName: '',
        pppoe: false,
        unitInfo: [
          {
            subUnit: 0,
            vlanId: 0,
            networkName: '',
            ipv4Static: false,
            ipv4Dhcp: true,
            ipv6Static: false,
            ipv6Dhcp: false,
            allowSSH: false,
            monitor: {},
            linkPriority: '',
            transportDomains: ['Internet']
          }
        ]
      };
      wRowData.portid = String(val.index);
      wRowData.interfaceName = 'vni-0/' + val.index;
      this.templateData.template.wanInterfaces.forEach((item, i) => {
        if (item.portid === String(val.index)) {
          this.templateData.template.wanInterfaces.splice(i, 1);
        }
      });

      if (val.id === '0' || val.id === '2') {
        if (val.id === '2') {
          wRowData.pppoe = true;
        }
        this.templateData.template.wanInterfaces.push(wRowData);
      }
    },
    // 输入框同步提示信息
    validate(field, valid, message) {
      if (valid) {
        this.message[field] = '';
      } else {
        this.message[field] = message;
      }
    },
    // 表单提示悬浮框
    enter(field) {
      console.log(field);
      if (this.message) {
        this.formTips.tipText = '';
        switch (field) {
          case 'templateName':
            this.formTips.tipText = this.message.templateName;
            break;
          case 'providerOrg.name':
            this.formTips.tipText = this.message['providerOrg.name'];
            break;
          case 'controllers':
            this.formTips.controllers = this.message.controllers;
            break;
          case 'serviceBandwidth':
            this.formTips.tipText = this.message.serviceBandwidth;
            break;
        }
        console.log(this.message);
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
    //编辑模板
    async edtTemplate(params) {
      this.modalTitle = 'Edit Template - ' + params.rowData.templateName;
      this.modalType = 'edt';
      const { result } = await templateSearch(params.rowData.templateName);
      this.templateData = result;
      this.templateData.template.bandwidthNew = this.num;
      this.templateData.template.wanInterfaces.forEach(item => {
        item.portid = item.interfaceName.charAt(item.interfaceName.length - 1);
      });

      //控制器查询
      this.controllerList = [];
      const resOrgan = await controllerWrap({
        organization: this.templateData.template.providerOrg.name
      });
      resOrgan.result['appliance-list'].forEach(item => {
        this.controllerList.push(item.name);
      });
      //  port 下拉对应图标
      this.factorNum = this.templateData.template.deviceFirmfactor - 1;

      //组织对应network 信息
      const netRes = await networkName({
        id: this.templateData.template.providerOrg.name
      });
      this.networkNames = [];
      netRes.result[0].wanNetworkGroups.forEach(item => {
        this.networkNames.push(item.name);
      });

      this.visible = true;
    },
    // 表单提交更新
    async handleOk() {
      if (this.modalType === 'add') {
        this.$refs.tempForm.validate(async valid => {
          if (valid) {
            const wanInfo = [];
            if (this.$refs.rowWan) {
              this.$refs.rowWan.forEach(item => {
                wanInfo.push(item.wandata);
              });
            }
            this.templateData.template.wanInterfaces = wanInfo;
            const res = await templateAdd(this.templateData);
            if (res.status !== '0000') return this.$message.error(res.message);
            this.$message.success('模板创建成功！');
            this.visible = false;
            if (this.organization) {
              this.templateList({
                orgname: this.organization,
                limit: this.pageSize,
                offset: this.pageIndex
              });
            } else {
              this.templateList({
                offset: (this.pageIndex - 1) * this.pageSize,
                limit: this.pageSize
              });
            }
            // 任务进度
            this.taskinfo = {
              taskId: res.result.TaskResponse['task-id'],
              visible: true
            };
            this.visible = false;
          }
        });
      }
      if (this.modalType === 'edt') {
        this.$refs.tempForm.validate(async valid => {
          if (valid) {
            const res = await templateEdt(
              this.templateData.template.templateName,
              this.templateData
            );
            console.log(res);
            if (res.status !== '0000') return this.$message.error(res.message);
            this.$message.success('模板更新成功！');
            this.visible = false;
            // 任务进度
            this.taskinfo = {
              taskId: res.result.TaskResponse['task-id'],
              visible: true
            };
            this.visible = false;
          }
        });
      }
    },
    // 模板部署
    async createTem() {
      if (this.modalType === 'add') {
        const wanInfo = [];
        if (this.$refs.rowWan) {
          this.$refs.rowWan.forEach(item => {
            wanInfo.push(item.wandata);
          });
        }
        this.templateData.template.wanInterfaces = wanInfo;
        // 模板新建
        const res = await templateAdd(this.templateData);
        if (res.status !== '0000') return this.$message.error(res.message);
        //this.$message.success('模板创建成功！');
        // 模板部署
        const resCrt = await templateCrt({
          id: this.templateData.template.templateName,
          verifyDiff: true
        });

        if (resCrt.status !== '0000')
          return this.$message.error(resCrt.message);
        // 刷新表格数据
        if (this.organization) {
          this.templateList({
            orgname: this.organization,
            limit: this.pageSize,
            offset: this.pageIndex
          });
        } else {
          this.templateList({
            offset: (this.pageIndex - 1) * this.pageSize,
            limit: this.pageSize
          });
        }

        this.visible = false;
      }
      if (this.modalType === 'edt') {
        // 模板更新
        const res = await templateEdt(
          this.templateData.template.templateName,
          this.templateData
        );
        if (res.status !== '0000') return this.$message.error(res.message);
        this.$message.success('模板更新成功！');
        // 模板部署
        const resCrt = await templateCrt({
          id: this.templateData.template.templateName,
          verifyDiff: true
        });

        if (resCrt.status !== '0000')
          return this.$message.error(resCrt.message);
        // 刷新表格数据
        if (this.organization) {
          this.templateList({
            orgname: this.organization,
            limit: this.pageSize,
            offset: this.pageIndex
          });
        } else {
          this.templateList({
            offset: (this.pageIndex - 1) * this.pageSize,
            limit: this.pageSize
          });
        }
        this.visible = false;
      }
    },

    //获取选中模板名称
    delItem(selection) {
      selection.forEach(item => {
        this.templDel.ids.push(item.templateName);
      });
      const newArr = Array.from(new Set(this.templDel.ids));
      this.templDel.ids = newArr;
    },
    //删除模板操作
    async delTemplate() {
      const res = await templateDel(this.templDel);
      this.templDel = {
        ids: []
      };
      if (res.status !== '0000') return this.$message.error(res.message);
      this.taskinfo = {
        taskId: res.result.TaskResponse['task-id'],
        type: 'del'
      };
    },
    // tasknotice 关闭
    taskComplete() {
      if (this.organization) {
        this.templateList({
          orgname: this.organization,
          limit: this.pageSize,
          offset: this.pageIndex
        });
      } else {
        this.templateList({
          offset: (this.pageIndex - 1) * this.pageSize,
          limit: this.pageSize
        });
      }
    }, // 关闭弹出清楚数据
    cleanData() {
      this.$refs.tempForm.clearValidate();
      this.templateData = {
        template: {
          templateName: '',
          templateType: 'sdwan-post-staging',
          controllers: [],
          providerOrg: {
            name: ''
          },
          deviceFirmfactor: '0',
          //wan端口数据
          wanInterfaces: [],
          deviceType: 'hub',
          solutionTier: 'advanced-sdwan-plus-utm',
          bandwidthNew: '',
          bandwidth: '',
          isAnalyticsEnabled: true,
          isPrimary: true
        }
      };
      // model 切换到第一页
      this.actKey = '1';
      //this.$refs.portnum.value = 0;
      this.factorNum = 0;
      this.handleReset();
      // 删错数据清空提交表单
      this.templDel = {
        ids: []
      };
      this.message = {
        templateName: '',
        ['providerOrg.name']: '',
        controllers: '',
        serviceBandwidth: ''
      };
    }
  },
  components: { TaskNotice, FactorSelect, WanRowData }
};
import Vue from 'vue';
Vue.component('templates-name', {
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
        <a href="javascript:;" @click.stop.prevent="update(rowData,index)">{{rowData.templateName}}</a>
        </span>`,
  methods: {
    update() {
      let params = { type: 'edit', index: this.index, rowData: this.rowData };
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

.ant-select {
  font-size: 12px;
}
/deep/ .tabs-wrap {
  padding-top: 10px;
  .ant-tabs-bar {
    border: none;
    .ant-tabs-nav-container {
      height: auto;
    }
    .ant-tabs-tab {
      background: #8d9fb3;
      border-radius: 4px 4px 0 0;
      border: none;
      color: #0f2c3e;
      padding: 2px 12px;
      line-height: 18px;
      height: auto;
    }
    .ant-tabs-tab-active {
      background: #aac0d5;
      font-weight: 400;
    }
  }
}
.device-type,
.subscription {
  border: 1px solid #456880;
  padding: 3px 10px 10px;
  border-radius: 4px;
  margin-bottom: 5px;
  position: relative;
  margin-top: 18px;
  &::before {
    position: absolute;
    content: 'Device Type ';
    background: #507691;
    border-radius: 4px;
    padding: 2px 5px;
    position: absolute;
    left: 10px;
    top: -10px;
    font-size: 12px;
    color: #fff;
  }
}
.subscription {
  width: 812px;
  padding: 12px 70px 10px 30px;
}
/deep/ .ant-radio-wrapper {
  span:nth-of-type(2) {
    color: #f9f9f9;
    font-size: 14px;
  }
  .ant-radio-inner {
    background-color: #dedede !important;
    &::after {
      background: #666666;
    }
    .ant-radio-checked::after {
      border-color: #666 !important;
    }
  }
}

.check-btn .ant-col {
  color: #f9f9f9;
  font-size: 12px;
  line-height: 18px;
  margin-right: 5px;
}
.mandatory {
  color: #ee6978;
  font-size: 11px;
  padding-left: 1px;
  vertical-align: top;
}
.firm-factor {
  padding-top: 12px;
  .factor-title {
    color: #f9f9f9;
    font-size: 12px;
    line-height: 18px;
  }
  .factor-con {
    border: 1px solid #bbb;
    margin-top: 0;
    padding: 0 20px;
    height: 88px;
    background-color: #fff;
    width: 100%;
    .factor-select {
      width: 85px;
      .select-title {
        font-size: 12px;
        color: #000;
        line-height: 18px;
      }
    }
    .factor-list {
      padding: 0 12px;
      .list-item {
        width: 32px;
        text-align: center;
        float: left;
        .port-value {
          font-size: 12px;
          text-align: center;
          line-height: 18px;
          color: #000;
        }
        .port-icon {
          padding: 0 2px;
        }
        .port-title {
          font-size: 10px;
          color: #000;
          line-height: 18px;
        }
      }
    }
    .x-scroll {
      overflow-x: scroll;
    }
  }
  .factor-table {
    margin-top: 10px;
    .wan-title {
      font-size: 12px;
      line-height: 18px;
      margin-bottom: 0px;
      color: #fff;
    }
    .table-bordered {
      margin-bottom: 0px;
      border-radius: 4px;
      border-collapse: collapse;
      border: 1px solid #ddd;
      thead {
        tr th {
          background: #aac0d5;
          color: #0f2c3e;
          text-align: left;
          font-weight: normal;
          border: 1px solid #ddd;
          vertical-align: middle;
          padding: 0 5px;
          font-size: 12px;
        }
      }
    }
  }
}
.v-table-title-class .v-table-title-cell {
  height: auto;
}
</style>
