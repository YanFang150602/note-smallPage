<template>
  <div class="vpn-cfg-file">
    <!-- 搜索框 -->
    <a-row
      class="table-header"
      type="flex"
      justify="space-between"
      align="middle"
    >
      <!--搜索栏-->
      <a-col :style="{ width: 'calc(100%-465px)' }">
        <a-input
          size="small"
          ref="searchInput"
          v-model="keywords"
          placeholder="Search"
          @keyup="search"
        >
          <a-icon slot="prefix" type="search" />
          <a-icon
            @click="keywords = ''"
            v-show="keywords != ''"
            slot="suffix"
            type="close"
          />
        </a-input>
      </a-col>
      <!--表格功能按钮-->
      <a-col>
        <a-row
          :style="{ width: '435px' }"
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
            <a-icon @click="showAddWinModal" type="plus" />
          </a-col>
          <a-col
            :style="{
              fontSize: '18px',
              cursor: 'pointer',
              marginRight: '20px'
            }"
          >
            <a-icon @click="showDelWinModal" type="minus" />
          </a-col>
          <a-col
            :style="{
              fontSize: '18px',
              cursor: 'pointer',
              marginRight: '20px'
            }"
          >
            <a-icon type="filter" />
          </a-col>
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
    <!-- 列表 -->
    <!-- 表单主体内容 -->
    <v-table
      is-horizontal-resize
      column-width-drag
      :columns="columns"
      :table-data="tableDataList"
      :select-all="selectALL"
      :select-change="selectChange"
      :height="550"
      style="width:100%;"
      @on-custom-comp="customTableFunc"
    ></v-table>
    <!-- 组群弹框 -->
    <div>
      <a-modal
        v-model="delWinVisible"
        title="Confirm Decommission"
        width="430px"
      >
        <template slot="footer">
          <a-button
            key="submit"
            type="primary"
            :loading="delLoading"
            @click="delOK"
            >OK</a-button
          >
          <a-button key="back" @click="delCancel">Cancel</a-button>
        </template>
        <span style="color:#fff;margin:12px 0;"
          >Are you sure you want to delete the selected record(s)?</span
        >
      </a-modal>
      <a-modal
        v-model="addOrEditWinVisible"
        :title="title"
        :destroyOnClose="true"
        width="940px"
      >
        <VPNCfgFileAddOrEdit
          ref="vpnProfileAddOrEditRef"
          :vpnProfile="curEditVPNProfile"
          @passChildContent="passChildContent"
        ></VPNCfgFileAddOrEdit>
        <template slot="footer">
          <a-button
            key="submit"
            type="primary"
            :loading="addOrEditLoading"
            @click="addOrEditOK"
            >OK</a-button
          >
          <a-button key="back" @click="addOrEditCancel">Cancel</a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import VPNCfgFileAddOrEdit from './VPNCfgFileAddOrEdit';
import {
  VPNProfileQuery,
  VPNProfileCreate,
  VPNProfileDelete
} from 'apis/Configuration';
export default {
  name: 'VPNConfigFile',
  components: {
    VPNCfgFileAddOrEdit
  },
  data() {
    return {
      keywords: '',
      columns: [
        {
          field: 'custome',
          width: 36,
          columnAlign: 'center',
          titleAlign: 'center',
          type: 'selection'
        },
        {
          field: 'name',
          title: 'VPN Profile',
          width: 100,
          columnAlign: 'left',
          isResize: true,
          componentName: 'vpncfgfile-opration'
        },
        {
          field: 'vpnType',
          title: 'VPN Type',
          width: 80,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'local-ip-interface-host',
          title: 'Local IP/Interface/Hostname',
          width: 160,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'peerip-fqdn-host',
          title: 'Peer IP/FQDN/Hostname',
          width: 160,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'local-auth-type',
          title: 'Auth Type',
          width: 100,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'local-auth-info',
          title: 'Auth Info',
          width: 100,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'peer-auth-type',
          title: 'Auth Type',
          width: 100,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'peer-auth-type',
          title: 'Auth Info',
          width: 100,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'peer-psk-auth',
          title: 'Psk Auth Clients',
          width: 120,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ipsec-fragmentation',
          title: 'IPSec Fragmentation',
          width: 160,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ipsec-forceNatT',
          title: 'Force NAT-T Configuration',
          width: 160,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ipsec-algorithm',
          title: 'Encryption and Hashing Algorithm',
          width: 220,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ipsec-mode',
          title: 'IPSec Mode',
          width: 80,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ipsec-pfsGroup',
          title: 'Forward Secrecy Mode',
          width: 140,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ipsec-antiReplay',
          title: 'Anti Replay',
          width: 100,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ike-version',
          title: 'IKE Version',
          width: 80,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ike-mode',
          title: 'DH Mode',
          width: 80,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ike-algorithm',
          title: 'Encryption and Hashing Algorithm',
          width: 220,
          columnAlign: 'left',
          isResize: true
        }
      ],
      titleRows: [
        [
          {
            fields: ['custome'],
            titleAlign: 'center',
            type: 'selection',
            rowspan: 2
          },
          {
            field: 'name',
            title: 'VPN Profile',
            componentName: 'vpncfgfile-opration',
            rowspan: 2
          },
          {
            field: 'vpnType',
            title: 'VPN Type',
            isResize: true,
            rowspan: 2
          },
          {
            field: 'local-ip-interface-host',
            title: 'Local IP/Interface/Hostname',
            isResize: true,
            rowspan: 2
          },
          {
            field: 'peer-ip-fqdn-host',
            title: 'Peer IP/FQDN/Hostname',
            isResize: true,
            rowspan: 2
          },
          {
            fields: ['local-auth-type', 'local-auth-info'],
            title: 'Local Auth Info',
            titleAlign: 'center',
            colspan: 2
          },
          {
            fields: ['peer-auth-type', 'peer-auth-type', 'peer-psk-auth'],
            title: 'Peer Auth Info',
            titleAlign: 'center',
            colspan: 3
          },
          {
            fields: [
              'ipsec-frag',
              'ipsec-nat',
              'ipsec-algorithm',
              'ipsec-mode',
              'ipsec-forward',
              'ipsec-replay'
            ],
            title: 'IPSec',
            titleAlign: 'center',
            colspan: 6
          },
          {
            fields: ['ike-version', 'ike-mode', 'ike-algorithm'],
            title: 'IKE',
            titleAlign: 'center',
            colspan: 3
          }
        ],
        [
          {
            field: 'local-auth-type',
            title: 'Auth Type'
          },
          {
            field: 'local-auth-info',
            title: 'Auth Info'
          },
          {
            field: 'peer-auth-type',
            title: 'Auth Type'
          },
          {
            field: 'peer-auth-type',
            title: 'Auth Info'
          },
          {
            field: 'peer-psk-auth',
            title: 'Psk Auth Clients'
          },
          {
            field: 'ipsec-frag',
            title: 'IP Sec Fragmentation'
          },
          {
            field: 'ipsec-nat',
            title: 'Force NAT-T Configuration'
          },
          {
            field: 'ipsec-algorithm',
            title: 'Encryption and Hashing Algorithm'
          },
          {
            field: 'ipsec-mode',
            title: 'Mode'
          },
          {
            field: 'ipsec-forward',
            title: 'Forward Secrecy Mode'
          },
          {
            field: 'ipsec-replay',
            title: 'Anti Replay'
          },
          {
            field: 'ike-version',
            title: 'IKE Version'
          },
          {
            field: 'ike-mode',
            title: 'DH Mode'
          },
          {
            field: 'ike-algorithm',
            title: 'Encryption and Hashing Algorithm'
          }
        ]
      ],
      tableDataList: [],
      totalCount: 0,
      pageIndex: 1,
      pageSize: 20,
      title: '',
      addOrEditWinVisible: false,
      addOrEditLoading: false,
      delWinVisible: false,
      delLoading: false,
      curEditVPNProfile: {},
      curAddVPNProfile: {},
      delVPNProfileList: {
        deviceName: '',
        orgName: '',
        profileNames: []
      },
      vpnProfile: {}
    };
  },
  computed: {
    ...mapState(['organization', 'deviceName'])
  },
  mounted() {
    this.queryTableDataList();
  },
  methods: {
    // 表格操作Table start
    search() {
      this.queryTableDataList();
    },
    customTableFunc(params) {
      this.curEditVPNProfile = params.rowData;
      this.curEditVPNProfile.tempDisabledName = true;
      this.title = 'Edit IPsec VPN';
      this.addOrEditWinVisible = true;
    },
    selectALL(selection) {
      this.delVPNProfileList.profileNames = [];
      for (let row of selection) {
        this.delVPNProfileList.profileNames.push(row.name);
      }
    },
    selectChange(selection) {
      this.delVPNProfileList.profileNames = [];
      for (let row of selection) {
        this.delVPNProfileList.profileNames.push(row.name);
      }
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    async queryTableDataList() {
      const res = await VPNProfileQuery({
        orgName: this.organization,
        deviceName: this.deviceName,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
      if (res.message === 'Success') {
        let vpnProfileList = res.vpnProfile;
        this.tableDataList = [];
        vpnProfileList.forEach(item => {
          let vpnProFile = {};
          let curKey = '';
          this.forVPNProfileProperties(item, vpnProFile, curKey);
          this.tableDataList.push(vpnProFile);
        });
        this.totalCount = res.totalCount;
      } else {
        this.tableDataList = [];
        this.totalCount = 0;
      }
    },
    forVPNProfileProperties(item, vpnProFile, curKey) {
      for (let key in item) {
        if (Object.prototype.toString.call(item[key]) === '[object Object]') {
          if (key === 'ike' || key === 'ipsec' || key === 'local') {
            curKey = key;
          } else if(key === 'local') {
            
          }else {
            curKey = '';
          }
          this.forVPNProfileProperties(item[key], vpnProFile, curKey);
        } else if (key.indexOf('temp') == -1) {
          if (curKey === 'ike' || curKey === 'ipsec') {
            vpnProFile[curKey + '-' + key] = item[key];
          } else if (curKey === 'local') {
            curKey = curKey + ' ' + key;
            vpnProFile[curKey] = item[key];
          } else {
            vpnProFile[key] = item[key];
          }
        }
      }
    },
    // 表格操作Table end
    // 分页操作Page start
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.queryTableDataList();
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.queryTableDataList();
    },
    // 分页操作Page end
    // VPN Config file Add start
    showAddWinModal() {
      this.curEditVPNProfile = {};
      this.title = 'Add IPsec VPN';
      this.addOrEditWinVisible = true;
    },
    async addOrEditOK() {
      let isOK = this.satisfyValidation();
      if (isOK) {
        this.addOrEditLoading = true;
        this.vpnProfile.orgName = this.organization;
        this.vpnProfile.deviceName = this.deviceName;
        let params = { vpnProfile: this.vpnProfile };
        if (this.curAddVPNProfile.name) {
          let curVPNProfile = {};
          for (let key in this.curAddVPNProfile) {
            if (!(key.indexOf('temp') == 0)) {
              curVPNProfile[key] = this.curAddVPNProfile[key];
            }
          }
          Object.assign(this.vpnProfile, curVPNProfile);
        } else {
          let curVPNProfile = {};
          for (let key in this.curEditVPNProfile) {
            if (!(key.indexOf('temp') == 0)) {
              curVPNProfile[key] = this.curEditVPNProfile[key];
            }
          }
          Object.assign(this.vpnProfile, curVPNProfile);
        }
        const res = await VPNProfileCreate(params);
        this.addOrEditLoading = false;
        if (res.message === 'Success') {
          this.addOrEditWinVisible = false;
          this.queryTableDataList();
        }
      }
    },
    addOrEditCancel() {
      this.addOrEditWinVisible = false;
      this.curAddVPNProfile = {};
      this.curEditVPNProfile = {};
    },
    passChildContent(vpnProfile) {
      this.curAddVPNProfile = vpnProfile;
    },
    satisfyValidation() {
      let isOK = true;
      this.$refs.vpnProfileAddOrEditRef.$refs.normalRef.validate(valid => {
        if (!valid) {
          isOK = false;
          return false;
        }
      });
      return isOK;
    },
    // VPN Config file Add end
    // VPN Config file Delete start
    showDelWinModal() {
      this.delWinVisible = true;
    },
    async delOK() {
      // coding
      this.delVPNProfileList.orgName = this.organization;
      this.delVPNProfileList.deviceName = this.deviceName;
      const res = await VPNProfileDelete(this.delVPNProfileList);
      if (res.message === 'Success') {
        this.delWinVisible = false;
        this.pageIndex = 1;
        this.queryTableDataList();
      }
    },
    delCancel() {
      this.delWinVisible = false;
    }
    // VPN Config file Delete end
  }
};
Vue.component('vpncfgfile-opration', {
  template: `<span>
    <a href="" @click.stop.prevent="update(rowData,index)">{{ rowData.name }}</a>
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
.vpn-cfg-file {
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
