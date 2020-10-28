<template>
  <div class="add-device">
    <!-- <a-modal v-model="visible" title="Add Device" on-ok="handleOk"> -->
    <template slot="footer">
      <a-button key="back" @click="handleCancel">Cancel</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk"
        >Save</a-button
      >
    </template>
    <!--  三个切换tab -->
    <div class="switchover">
      <div class="basic" @click="handleClick">Basic</div>
      <div class="location" @click="ShowClick">Location information</div>
      <div class="bid" @click="bidClick">Bid Data</div>
    </div>
    <!-- basic -->
    <div v-if="isShow" class="form_basic">
      <a-form-model layout="inline" :model="form">
        <!-- <a-form-model-item label="Name">
          <a-input v-model="form.name"/>
        </a-form-model-item>
        <a-form-model-item label="Global Device ID">
          <a-input v-model="form.global"/>
        </a-form-model-item>
        <a-form-model-item label="Organization">
          <a-input v-model="form.organization"/>
        </a-form-model-item>
        <a-form-model-item label="Depoyment Type">
          <a-select v-model="form.depoyment" placeholder="please select your zone">
            <a-select-option value="shanghai">Zone one</a-select-option>
            <a-select-option value="beijing">Zone two</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Serial Number">
          <a-input v-model="form.serial"/>
        </a-form-model-item>
        <a-form-model-item label="Device Groups">
          <a-select v-model="form.groups" placeholder="please select your zone">
            <a-select-option value="shanghai">Zone one</a-select-option>
            <a-select-option value="beijing">Zone two</a-select-option>
          </a-select>
          <span @click="deviceGroups">+Device Groups</span>
        </a-form-model-item>-->
        <a-row type="flex" justify="space-between" align="middle">
          <a-col>
            <a-form-model-item label="Name">
              <a-input v-model="form.name" />
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item label="Description">
              <a-input v-model="form.description" />
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item label="Global Organization ID">
              <a-input v-model="form.orgId" />
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item label="Organization Label">
              <a-input v-model="form.orgLab" />
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item label="Parent Organization">
              <a-select
                v-model="form.parOrg"
                placeholder="please select your zone"
              >
                <a-select-option value="shanghai">Zone one</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item label="Authentication Connector">
              <a-select
                v-model="form.parOrg"
                placeholder="please select your zone"
              >
                <a-select-option value="shanghai">Zone one</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <!-- <a-col>
            <a-form-model-item label="IDP Connector">
              <a-select v-model="form.idpCon" placeholder="please select your zone">
                <a-select-option value="shanghai">Zone one</a-select-option>
                <a-select-option value="shangh">Zone o</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>-->
        </a-row>
        <!-- 方框 -->
        <div class="serviceBand">
          <div class="subscrition">Subscrition</div>
          <a-form-model-item>
            <span>Service Bandwith</span>
            <a-select
              v-model="form.depoyment"
              placeholder="please select your zone"
            >
              <a-select-option value="shanghai">Zone one</a-select-option>
              <a-select-option value="beijing">Zone two</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item>
            <span>Aggregate Bandwith</span>
            <a-input v-model="form.organization" />
          </a-form-model-item>
        </div>
      </a-form-model>
    </div>
    <!-- Location Information -->
    <div class="form_location" v-if="isDemonstrate">
      <a-form-model
        layout="inline"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <div class="location_title">
          <a-form-model
            layout="inline"
            :model="form"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-form-model-item>
              <span>Address 1</span>
              <a-input v-model="form.address1" />
            </a-form-model-item>
            <a-form-model-item>
              <span>Address 2</span>
              <a-input v-model="form.address2" />
            </a-form-model-item>
          </a-form-model>
        </div>
        <div class="location_main">
          <a-form-model-item>
            <span>City</span>
            <a-input v-model="form.city" />
          </a-form-model-item>
          <a-form-model-item>
            <span>State</span>
            <a-input v-model="form.state" />
          </a-form-model-item>
          <a-form-model-item>
            <span>Country</span>
            <a-input v-model="form.country" />
          </a-form-model-item>
          <a-form-model-item>
            <span>Zip</span>
            <a-input v-model="form.zip" />
          </a-form-model-item>
        </div>
        <div class="location_footer">
          <a-form-model-item>
            <span>Latitude</span>
            <a-input v-model="form.latitude" />
          </a-form-model-item>
          <a-form-model-item>
            <span>Longitude</span>
            <a-input v-model="form.longitude" />
          </a-form-model-item>
          <a-button type="primary">Get Coordinates</a-button>
        </div>
      </a-form-model>
    </div>
    <!--Bind Data  -->
    <div class="form_bind" v-if="isExhibition">
      <span>Post Staging Template - Shanghai-CMCC-D</span>
      <!-- 上表格 -->
      <a-table
        :columns="columns"
        :data-source="data"
        bordered
        size="small"
        :scroll="{ x: 'calc(700px + 50%)', y: 240 }"
        :pagination="false"
      />
      <div class="remark">
        <span>Service Template variable</span>
        <span>Template:Shanghai-CMCC-D</span>
        <span>Device Groups:DeviceGroupYuan</span>
      </div>
      <!-- 下拉框 -->
      <div>
        <a-form-model
          :model="form"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="Service Template:">
            <a-select
              v-model="form.region"
              placeholder="please select your zone"
            >
              <a-select-option value="shanghai">Zone one</a-select-option>
              <a-select-option value="beijing">Zone two</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </div>
      <!-- User input表格 -->
      <span>User Input</span>
      <!-- 下表格 -->
      <div>
        <div style="margin-bottom: 16px">
          <span style="margin-left: 8px">
            <template v-if="hasSelected">{{
              `Selected ${selectedRowKeys.length} items`
            }}</template>
          </span>
        </div>
        <a-table
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange
          }"
          :columns="columnsUnder"
          :data-source="dataUnder"
          :pagination="false"
          bordered
          size="small"
        />
      </div>
    </div>
    <!-- </a-modal> -->
  </div>
</template>
<script>
//上表格数据
const columns = [
  {
    title: 'Serial',
    dataIndex: 'serial',
    key: 'serial',
    width: 100,
    fixed: 'left',
    onFilter: (value, record) => record.name.indexOf(value) === 0
  },
  {
    title: 'Device Name',
    dataIndex: 'name',
    key: 'name',
    width: 100,
    fixed: 'left',
    onFilter: (value, record) => record.name.indexOf(value) === 0
  },
  {
    title: 'InterFaces With Mask',
    children: [
      {
        title: 'Internet_IPv4_staticaddress',
        dataIndex: 'Internet_IPv4_staticaddress',
        key: 'Internet_IPv4_staticaddress',
        width: 200,
        height: 100
      },
      {
        title: 'LAN1_IPv4_staticaddress',
        dataIndex: 'LAN1_IPv4_staticaddress',
        key: 'LAN1_IPv4_staticaddress',
        width: 200,
        height: 100
      },
      {
        title: 'LAN2_IPv4_staticaddress',
        dataIndex: 'LAN2_IPv4_staticaddress',
        key: 'LAN2_IPv4_staticaddress',
        width: 100,
        height: 100
      }
    ]
  },
  {
    title: 'DHCP',
    children: [
      {
        title: 'Company Address',
        dataIndex: 'companyAddress1',
        key: 'companyAddress1',
        width: 100
      },
      {
        title: 'Company Name',
        dataIndex: 'companyName',
        key: 'companyName'
      }
    ]
  },
  {
    title: 'OSPF',
    children: [
      {
        title: 'Company Address',
        dataIndex: 'companyAddressc',
        key: 'companyAddressc',
        width: 100
      },
      {
        title: 'Company Name',
        dataIndex: 'companyNamea',
        key: 'companyNamea'
      }
    ]
  },
  {
    title: 'OSPF',
    children: [
      {
        title: 'Company Address',
        dataIndex: 'companyAddressb',
        key: 'companyAddressb',
        width: 100
      },
      {
        title: 'Company Name',
        dataIndex: 'companyNamex',
        key: 'companyNamex'
      }
    ]
  }
];

const data = [];
for (let i = 0; i <= 0; i++) {
  data.push({
    key: i,
    serial: 'John Brown',
    age: i + 1,
    street: 'Lake Park',
    building: 'C',
    number: 2035,
    companyAddress: 'Lake Street 42',
    companyName: 'SoftLake Co',
    gender: 'M'
  });
}
// 下表格数据
const columnsUnder = [
  {
    title: 'Name',
    dataIndex: 'name'
  },
  {
    title: 'Age',
    dataIndex: 'age'
  },
  {
    title: 'Address',
    dataIndex: 'address'
  }
];

const dataUnder = [];
for (let i = 0; i <= 0; i++) {
  dataUnder.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`
  });
}
export default {
  data() {
    return {
      loading: false,
      visible: false,
      // 表单显影
      isShow: true,
      isDemonstrate: false,
      isExhibition: false,
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
      // 上表格数据
      data,
      columns,
      // 下表格数据
      dataUnder,
      columnsUnder,
      selectedRowKeys: [] // Check here to configure the default column
      // loadingUnder: false
    };
  },

  methods: {
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
    // 显示与隐藏
    handleClick() {
      this.isShow = true;
      this.isDemonstrate = false;
      this.isExhibition = false;
    },
    ShowClick() {
      this.isShow = false;
      this.isDemonstrate = true;
      this.isExhibition = false;
    },
    bidClick() {
      this.isShow = false;
      this.isDemonstrate = false;
      this.isExhibition = true;
    },
    // 下表格的方法
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    // 添加群组
    deviceGroups() {
      console.log(111);
    }
  },
  computed: {
    //  下表格
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    }
  }
};
import { FormModel } from 'ant-design-vue';
import Vue from 'vue';
Vue.use(FormModel);
</script>
<style lang="scss" scoped>
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
  line-height: 0;
}
/deep/.ant-col .ant-form-item-label {
  line-height: 0;
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
  }
  .serviceBand {
    height: 78px;
    border-radius: 5px;
    border: solid 3px #456880;
    position: relative;
    // margin-top: 30px;
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
  .location_main {
    .ant-form-inline .ant-form-item {
      width: 25%;
    }
    .location_footer {
      .ant-form-inline .ant-form-item {
        width: 25%;
      }
    }
  }
}
.form_bind {
  .remark {
    float: left;
    div {
      float: left;
    }
  }
}
/deep/.ant-table table {
  background: #ffffff;
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
      .ant-form-item-control-wrapper {
        width: 100%;
        .ant-select-selection {
          height: 22px;
          .ant-select-selection__rendered {
            line-height: 20px;
          }
        }
        input {
          height: 22px;
          line-height: 20px;
          border-color: rgb(176, 199, 213);
          padding: 0px 3px;
          border-radius: 4px;
          color: rgb(15, 44, 62);
          font-size: 12px;
        }
      }
    }
  }
}
/deep/ .ant-select-dropdown {
  .ant-select-dropdown-menu {
    padding: 0 3px;
    .ant-select-dropdown-menu-item {
      padding: 0;
      height: 20px !important;
    }
  }
}
/deep/ .ant-tabs {
  .ant-tabs-bar {
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
      margin-right: 0;
    }
  }
}
</style>
