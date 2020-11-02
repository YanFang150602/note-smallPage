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
              @click="createItem"
              :style="{
                fontSize: '18px',
                cursor: 'pointer',
                marginRight: '20px'
              }"
              ><a-icon type="plus"
            /></a-col>
            <a-col
              @click="deleteItem"
              :style="{
                fontSize: '18px',
                cursor: 'pointer',
                marginRight: '20px'
              }"
              ><a-icon type="minus"
            /></a-col>
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
      :title-rows="titleRows"
      :table-data="tableData"
      :select-change="delItem"
      style="width:100%;height:100%"
      isFrozen="true"
      @on-custom-comp="modifyItem"
    ></v-table>
    <!-- 数据添加编辑弹窗 -->
    <a-modal
      v-model="visible"
      :title="modalTitle"
      :width="645"
      wrapClassName="form-wrap"
      cancelText="Cancel"
      okText="Ok"
      :afterClose="cleanData"
    >
      <a-form-model
        ref="form"
        :rules="rules"
        :model="formData.data"
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
          <!-- General -->
          <a-tab-pane key="1" tab="General">
            <a-row type="flex" justify="space-between" align="top">
              <!-- Name -->
              <a-col :span="17">
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
              <!-- Session Timeout(secs) -->
              <a-col :span="6">
                <a-form-model-item label="Session Timeout(secs)">
                  <a-input
                    v-model="formData.data.setSessionTimeout"
                    size="small"
                  />
                </a-form-model-item>
              </a-col>
              <!-- Description -->
              <a-col :span="24">
                <a-form-model-item label="Description">
                  <a-input v-model="formData.data.description" size="small" />
                </a-form-model-item>
              </a-col>
              <!-- Tags -->
              <a-col :span="24">
                <a-form-model-item label="Tags">
                  <TagInput
                    @addtag="addtag"
                    :tags="formData.data.tag ? formData.data.tag : []"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-tab-pane>
          <!-- Source/Destination -->
          <a-tab-pane key="2" tab="Source/Destination">
            <a-row
              class="add-modle-con"
              type="flex"
              justify="space-between"
              align="top"
            >
              <a-col class="add-modle-item">
                <AddModle
                  :listdate="zoneListData"
                  :title="sourceZone"
                  @subdata="zoneSub"
                />
              </a-col>
              <a-col class="add-modle-item">
                <AddModle
                  :listdate="zoneListData"
                  :title="destinationZone"
                  @subdata="desZoneSub"
                />
              </a-col>
              <a-col class="add-modle-item">
                <AddModle
                  :listdate="addressListData"
                  :title="sourceAddress"
                  @subdata="addressSub"
                />
              </a-col>
              <a-col class="add-modle-item">
                <AddModle
                  :listdate="addressListData"
                  :title="destinationAddress"
                  @subdata="desAddressSub"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <!-- Headers/Schedule -->
          <a-tab-pane key="3" tab="Headers/Schedule">
            <a-row type="flex" justify="space-between" align="top">
              <a-col :style="{ width: '305px' }">
                <a-row
                  class="ipInfo"
                  type="flex"
                  justify="space-between"
                  align="top"
                >
                  <a-col :style="{ width: '115px' }">
                    <a-form-model-item label="Ip Version">
                      <a-select
                        size="small"
                        placeholder="select"
                        v-model="formData.data.ipVersion"
                      >
                        <a-select-option value="ipv4">ipv4</a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :style="{ width: '115px', marginRight: '30px' }">
                    <a-form-model-item label="IP Flags">
                      <a-select
                        size="small"
                        placeholder="select"
                        v-model="formData.data.ipFlags"
                      >
                        <a-select-option value="DF">DF</a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="22">
                    <a-row type="flex" justify="space-between" align="middle">
                      <a-col :span="24">
                        <a-form-model-item label="DSCP">
                          <TagInput
                            @addtag="addDacp"
                            :tags="formData.data.dscp ? formData.data.dscp : []"
                          />
                        </a-form-model-item>
                      </a-col>
                    </a-row>
                    <a-row
                      class="ttlInfo"
                      type="flex"
                      justify="space-between"
                      align="middle"
                    >
                      <a-col :span="13">
                        <a-form-model-item label="Condition">
                          <a-select size="small" placeholder="select">
                            <a-select-option value="Greater than or equal to"
                              >Greater than or equal to</a-select-option
                            >
                            <a-select-option value="Less than or equal to"
                              >Less than or equal to</a-select-option
                            >
                            <a-select-option value="Equal to"
                              >Equal to</a-select-option
                            >
                          </a-select>
                        </a-form-model-item>
                      </a-col>
                      <a-col :span="10">
                        <a-form-model-item label="Value">
                          <a-input v-model="formData.data.ge" size="small" />
                        </a-form-model-item>
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col class="otherInfo" :span="24">
                    <a-form-model-item label="Schedules">
                      <a-select size="small" placeholder="select">
                        <a-select-option value="yffZone001"
                          >yffZone001</a-select-option
                        >
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :style="{ width: '305px', height: '230px' }">
                <a-form-model-item label="Services">
                  <AddModle
                    :title="servicesList"
                    :listdate="servicesListData"
                    @subdata="serviceSub"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-tab-pane>
          <!-- Applications/URL -->
          <a-tab-pane key="4" tab="Layer2">
            <a-row
              :style="{ width: '360px' }"
              type="flex"
              justify="space-between"
              align="middle"
            >
              <a-col :style="{ width: '150px' }">
                <a-form-model-item label="MAC Address Type">
                  <a-select
                    size="small"
                    placeholder="select"
                    v-model="formData.data.destinationMacAddressType"
                  >
                    <a-select-option value="broadcast"
                      >Broadcast</a-select-option
                    >
                    <a-select-option value="multicast"
                      >Multicast</a-select-option
                    >
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :style="{ width: '180px' }">
                <a-form-model-item label="IEEE 802 1p Values">
                  <a-input size="small" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <!-- <div class="ethernet">
              <a-radio-group name="radioGroup">
                <a-radio :value="1">
                  Ether Type
                </a-radio>
                <a-radio :value="2">
                  Ether Type Value
                </a-radio>
                <a-radio :value="3">
                  None
                </a-radio>
              </a-radio-group>
            </div> -->
          </a-tab-pane>
          <!-- Enforce -->
          <a-tab-pane key="5" tab="Enforce">
            <a-row type="flex" justify="space-between" align="top">
              <a-col :style="{ width: '305px' }">
                <div class="actionSet">
                  <a-radio-group
                    name="radioGroup"
                    v-model="formData.data.setAction"
                  >
                    <a-radio value="allow">
                      Allow
                    </a-radio>
                    <a-radio value="deny">
                      Deny
                    </a-radio>
                  </a-radio-group>
                </div>
                <a-form-model-item label="Anchor Core Class">
                  <a-select size="small" placeholder="select">
                    <a-select-option value="1">1</a-select-option>
                  </a-select>
                </a-form-model-item>
                <div class="permit">
                  <a-form-model-item label="Permit Existing Flow">
                    <a-select size="small" placeholder="select">
                      <a-select-option value="Allow">Allow</a-select-option>
                      <a-select-option value="validate"
                        >validate</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                </div>
              </a-col>
              <a-col :style="{ width: '305px' }">
                <div class="qosSet">
                  <a-form-model-item label="Qos Profile">
                    <a-select
                      size="small"
                      placeholder="select"
                      v-model="formData.data.setQosProfile"
                    >
                      <a-select-option
                        v-for="(item, index) in ProfileSetData"
                        :value="item"
                        :key="index"
                        >{{ item }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
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
    <!-- 表单验证提示 -->
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
  qosPolicyLists,
  qosPolicySearch,
  qosPolicyCreate,
  qosPolicyModify,
  qosPolicyDelete,
  zoneList,
  addressList,
  ProfileSetting,
  serviceList
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
        pageSize: 25
      },
      totalCount: 0,
      keyworks: '',
      actKey: '1', //tab切换控制
      tableData: [], //表格数据源
      visible: false, //弹出层开关
      modalTitle: '', //表单类型
      modalType: '', //表单编辑or新建
      // addModle 标题
      sourceZone: 'Source Zone',
      destinationZone: 'Destination Zone',
      sourceAddress: 'Source Address',
      destinationAddress: 'Destination Address',
      servicesList: 'Service List',
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
      columns: [
        {
          width: 36,
          field: 'checked',
          columnAlign: 'center',
          type: 'selection'
        },
        {
          field: 'name',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          componentName: 'qos-name'
        },

        {
          field: 'setAction',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'setQosProfile',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'predefinedServicesList',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'sourceZoneList',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'sourceRegion',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'sourceAddressList',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'sourceAddressGroupList',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'destinationZoneList',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'destinationRegion',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'destinationAddressList',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'destinationAddressGroupList',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'destinationMacAddressType',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ipVersion',
          width: 50,
          columnAlign: 'left',
          isResize: true
        }
      ],
      titleRows: [
        [
          {
            fields: ['checked'],
            title: '',
            titleAlign: 'center',
            rowspan: 2
          },
          {
            fields: ['name'],
            title: 'Name',
            titleAlign: 'center',
            rowspan: 2
          },
          {
            fields: ['setAction', 'setQosProfile'],
            title: 'Enforce',
            titleAlign: 'center',
            colspan: 2
          },
          {
            fields: ['predefinedServicesList'],
            title: 'Services',
            titleAlign: 'left',
            rowspan: 2
          },
          {
            fields: [
              'sourceZoneList',
              'sourceRegion',
              'sourceAddressList',
              'sourceAddressGroupList'
            ],
            title: 'Source',
            titleAlign: 'center',
            colspan: 4
          },
          {
            fields: [
              'destinationZoneList',
              'destinationRegion',
              'destinationAddressList',
              'destinationAddressGroupList',
              'destinationMacAddressType'
            ],
            title: 'Destination',
            titleAlign: 'center',
            colspan: 5
          },
          {
            fields: ['ipVersion'],
            title: 'IP Version',
            titleAlign: 'left',
            rowspan: 2
          }
        ],
        [
          {
            fields: ['setAction'],
            title: 'Action',
            titleAlign: 'left'
          },
          {
            fields: ['setQosProfile'],
            title: 'QoSProfiles',
            titleAlign: 'left'
          },
          {
            fields: ['sourceZoneList'],
            title: 'Zone',
            titleAlign: 'left'
          },
          {
            fields: ['sourceRegion'],
            title: 'Region',
            titleAlign: 'left'
          },
          {
            fields: ['sourceAddressList'],
            title: 'Address',
            titleAlign: 'left'
          },
          {
            fields: ['sourceAddressGroupList'],
            title: 'Address Group',
            titleAlign: 'left'
          },
          {
            fields: ['destinationZoneList'],
            title: 'Zone',
            titleAlign: 'left'
          },
          {
            fields: ['destinationRegion'],
            title: 'Region',
            titleAlign: 'left'
          },
          {
            fields: ['destinationZoneList'],
            title: 'Address',
            titleAlign: 'left'
          },
          {
            fields: ['destinationAddressGroupList'],
            title: 'Address Group',
            titleAlign: 'left'
          },
          {
            fields: ['destinationMacAddressType'],
            title: 'MAC Address Type',
            titleAlign: 'left'
          }
        ]
      ],
      formData: {
        deviceName: '',
        orgName: '',
        data: {
          name: null,
          description: null,
          tag: null,
          setAction: 'allow',
          setQosProfile: null,
          setSessionTimeout: null,
          setPermitExistingFlow: null,
          destinationMacAddressType: null,
          destinationRegion: null,
          destinationZoneList: null,
          destinationNegate: null,
          destinationAddressList: null,
          destinationAddressGroupList: null,
          dscp: null,
          etherType: null,
          ieee802Value: null,
          ipFlags: null,
          ipVersion: null,
          schedule: null,
          predefinedServicesList: null,
          sourceNegate: null,
          sourceAddressList: null,
          sourceAddressGroupList: null,
          sourceZoneList: null,
          sourceRegion: null,
          ge: null
        }
      },
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
      },
      // zone列表数据
      zoneListData: [],
      // address列表数据
      addressListData: [],
      // ProfileSetting列表数据
      ProfileSetData: [],
      // servicesListData
      servicesListData: []
    };
  },
  computed: {
    ...mapState(['organization', 'deviceName'])
  },
  created() {
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

    // tab 验证切换
    tabClick(key) {
      this.actKey = key;
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

    // 获取zoneList 列表
    async sourceDesZone() {
      const { result } = await zoneList({
        deviceName: this.deviceName,
        userName: this.organization
      });
      if (result && result.length > 0) this.zoneListData = result;
    },

    // 获取Zone Protection Profile 列表
    async sourceDesAddress() {
      const { result } = await addressList({
        deviceName: this.deviceName,
        orgName: this.organization
      });
      if (result && result.length > 0) this.addressListData = result;
    },

    // 获取ProfileSetting列表
    async ProfileSet() {
      const { result } = await ProfileSetting({
        deviceName: this.deviceName,
        userName: this.organization
      });
      if (result && result.length > 0) this.ProfileSetData = result;
    },

    // 获取Services列表
    async services() {
      const { result } = await serviceList({
        ddeviceName: this.deviceName,
        userName: this.organization
      });
      if (result && result.length > 0) this.servicesListData = result;
    },

    //addModle提交数据
    zoneSub(data) {
      if (data.length > 0) {
        this.formData.data.sourceZoneList = data;
      } else {
        this.formData.data.sourceZoneList = null;
      }
    },
    desZoneSub(data) {
      if (data.length > 0) {
        this.formData.data.destinationZoneList = data;
      } else {
        this.formData.data.destinationZoneList = null;
      }
    },
    addressSub(data) {
      if (data.length > 0) {
        this.formData.data.sourceAddressList = data;
      } else {
        this.formData.data.sourceAddressList = null;
      }
    },
    desAddressSub(data) {
      if (data.length > 0) {
        this.formData.data.destinationAddressList = data;
      } else {
        this.formData.data.destinationAddressList = null;
      }
    },
    serviceSub(data) {
      if (data.length > 0) {
        this.formData.data.predefinedServicesList = data;
      } else {
        this.formData.data.predefinedServicesList = null;
      }
    },

    // 添加tag标签
    addtag(tag) {
      this.formData.data.tag = tag;
    },
    addDacp(tag) {
      this.formData.data.dscp = tag;
    },
    // 获取qos列表
    async lists() {
      this.listParam.deviceName = this.deviceName;
      this.listParam.orgName = this.organization;
      const { result } = await qosPolicyLists(this.listParam);

      if (result) {
        console.log(result);
        this.tableData = result.data.forEach(item => {
          for (let key in item) {
            item[key] = Array.isArray(item[key])
              ? item[key].join(';')
              : item[key];
          }
        });
        // 获取总条数
        this.totalCount = result.total;
        this.tableData = result.data;
      } else {
        this.tableData = [];
      }
    },

    //新建qos
    async createItem() {
      this.modalTitle = 'Add Qos Rule';
      this.modalType = 'add';
      this.sourceDesZone();
      this.sourceDesAddress();
      this.ProfileSet();
      this.services();
      this.visible = true;
    },

    //编辑qos
    async modifyItem({ rowData }) {
      this.modalTitle = 'Edit Qos Rule';
      this.modalType = 'edt';
      this.searchData = {
        deviceName: this.deviceName,
        orgName: this.organization,
        name: rowData.name
      };
      const { result } = await qosPolicySearch(this.searchData);
      this.formData.data = result;
      this.visible = true;
    },
    //获取删除表单的name
    delItem(selection, rowData) {
      this.delData.data = rowData.name;
    },
    // 删除选中qos
    async deleteItem() {
      this.delData.deviceName = this.deviceName;
      this.delData.orgName = this.organization;
      const res = await qosPolicyDelete(this.delData);
      if (res.status !== '0000') return this.$message.error(res.message);
      this.$message.success('qos删除成功！');
      this.lists();
    },
    //表单提交
    handleOk() {
      this.formData.deviceName = this.deviceName;
      this.formData.orgName = this.organization;
      // 新建qos数据
      if (this.modalType === 'add') {
        this.$refs.form.validate(async valid => {
          if (valid) {
            const addRes = await qosPolicyCreate(this.formData);
            if (addRes.status !== '0000')
              return this.$message.error(addRes.message);
            this.$message.success('qos创建成功！');
            this.visible = false;
            this.lists();
          }
        });
      }
      // 修改qos数据
      if (this.modalType === 'edt') {
        this.$refs.form.validateField(['name'], async () => {
          if (!this.message.name) {
            const edtRes = await qosPolicyModify(this.formData);
            if (edtRes.status !== '0000')
              return this.$message.error(edtRes.message);
            this.$message.success('qos更新成功！');
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
        deviceName: this.deviceName,
        userName: this.organization,
        data: {
          name: null,
          description: null,
          tag: null,
          setAction: 'allow',
          setQosProfile: null,
          setSessionTimeout: null,
          setPermitExistingFlow: null,
          destinationMacAddressType: '',
          destinationRegion: null,
          destinationZoneList: null,
          destinationNegate: null,
          destinationAddressList: null,
          destinationAddressGroupList: null,
          dscp: null,
          etherType: null,
          ieee802Value: null,
          ipFlags: null,
          ipVersion: null,
          schedule: null,
          predefinedServicesList: null,
          sourceNegate: null,
          sourceAddressList: null,
          sourceAddressGroupList: null,
          sourceZoneList: null,
          sourceRegion: null,
          ge: null
        }
      };
      this.message = {
        name: ''
      };
      this.actKey = '1';
    }
  },
  components: { TagInput, AddModle }
};
import Vue from 'vue';
Vue.component('qos-name', {
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
        <a href="javascript:;" @click.stop.prevent="update(rowData,index)">{{rowData.name}}</a>
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
.form-wrap {
  .add-modle-con {
    .add-modle-item {
      width: 305px;
      height: 230px;
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
        display: none;
      }
    }
  }
  .ipInfo {
    border: 1px solid #456880;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 5px;
    position: relative;
    margin-top: 18px;
    &::before {
      position: absolute;
      content: 'IP';
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
  .otherInfo {
    &::before {
      content: 'Others';
    }
    @extend .ipInfo;
  }
  .ethernet {
    width: 360px;
    &::before {
      content: 'Ethernet';
    }
    @extend .ipInfo;
  }
  .actionSet {
    &::before {
      content: 'Action Setting';
    }
    @extend .ipInfo;
  }
  .permit {
    &::before {
      content: 'Permit Existing Flow';
    }
    @extend .ipInfo;
  }
  .qosSet {
    &::before {
      content: 'Qos Profile Setting';
    }
    @extend .ipInfo;
  }
  .ttlInfo {
    &::before {
      content: 'TTL';
    }
    @extend .ipInfo;
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
      margin: 0;
      .ant-form-item-label {
        line-height: 20px;
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
