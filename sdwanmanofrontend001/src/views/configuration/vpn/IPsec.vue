<template>
  <div>
    <a-form-model layout="vertical" :model="ipsec">
      <a-row type="flex" justify="start" align="top">
        <a-col>
          <a-form-model-item :label="$t('VPNIPsecModel')">
            <a-select v-model="ipsec.mode" style="width:250px" size="small">
              <a-select-option
                :value="item.value"
                v-for="(item, index) in modeList"
                :key="index"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col>
          <a-form-model-item :label="$t('VPNIPsecBackReplay')">
            <a-select
              v-model="ipsec.antiReplay"
              placeholder="--Select--"
              style="width:250px"
              size="small"
            >
              <a-select-option
                :value="item.value"
                v-for="(item, index) in backReplayList"
                :key="index"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col>
          <a-form-model-item :label="$t('VPNIPsecFragment')">
            <a-select
              v-model="ipsec.fragmentation"
              placeholder="--Select--"
              style="width:250px"
              size="small"
            >
              <a-select-option
                :value="item.value"
                v-for="(item, index) in fragmentList"
                :key="index"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row type="flex" justify="start" align="top">
        <a-col>
          <a-form-model-item :label="$t('VPNIPsecNatCfg')">
            <a-select
              v-model="ipsec.forceNatT"
              placeholder="--Select--"
              style="width:250px"
              size="small"
            >
              <a-select-option
                :value="item.value"
                v-for="(item, index) in natCfgList"
                :key="index"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col>
          <a-form-model-item :label="$t('VPNIPsecKeepActiveTimeout')">
            <a-input
              size="small"
              v-model="ipsec.keepaliveTimeout"
              :placeholder="placeholders.keepaliveTimeout"
              style="width:250px;"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row type="flex" justify="start" align="top">
        <a-col>
          <a-form-model-item :label="$t('VPNIPsecRestartTime')">
            <a-select style="width:90px" size="small" default-value="seconds">
              <a-select-option
                :value="item.value"
                v-for="(item, index) in restartTimeTypeOptions"
                :key="index"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
            <a-input
              size="small"
              v-model="ipsec.life.duration"
              :placeholder="placeholders.duration"
              style="width:160px;"
            />
          </a-form-model-item>
        </a-col>
        <a-col>
          <a-form-model-item :label="$t('VPNIPsecRestatVolumne')">
            <a-select style="width:90px" size="small" default-value="MB">
              <a-select-option
                :value="item.value"
                v-for="(item, index) in restartVolumneTypeOptions"
                :key="index"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
            <a-input
              size="small"
              v-model="ipsec.life.volume"
              :placeholder="placeholders.volume"
              style="width:160px;"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <div class="change-cls">
        <div class="change-icon">{{ $t('VPNIKEChange') }}</div>
        <a-row type="flex" justify="start" align="top">
          <a-col>
            <a-radio-group
              v-model="cVPNProfile.tempIpsecNewOrOld"
              :options="newOrOldOptions"
              @change="changeRadio"
            />
          </a-col>
        </a-row>
        <a-row
          type="flex"
          justify="start"
          align="top"
          v-if="cVPNProfile.tempIpsecNewOrOld == 'New'"
        >
          <a-col>
            <a-form-model-item>
              <v-table
                is-horizontal-resize
                :columns="hashColumns"
                :table-data="hashList"
                :select-all="selectALLHash"
                :select-change="selectChangeHash"
                :height="80"
                style="width:275px;"
                isFrozen="true"
                :title-click="hashTitleClick"
                :cell-merge="hashCellMerge"
                @on-custom-comp="customFunc"
              ></v-table>
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item>
              <v-table
                is-horizontal-resize
                :columns="encryColumns"
                :table-data="encryList"
                :select-all="selectALLEncry"
                :select-change="selectChangeEncry"
                :height="80"
                style="width:275px;"
                isFrozen="true"
                :title-click="encryTitleClick"
                :cell-merge="encryCellMerge"
                @on-custom-comp="customFunc"
              ></v-table>
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item>
              <v-table
                is-horizontal-resize
                :columns="forwardModeColumns"
                :table-data="forwardModeList"
                :select-all="selectALLFMode"
                :select-change="selectChangeFMode"
                :height="80"
                style="width:275px;"
                isFrozen="true"
                :title-click="fModeTitleClick"
                :cell-merge="fModeCellMerge"
                @on-custom-comp="customFunc"
              ></v-table>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row
          type="flex"
          justify="start"
          align="middle"
          v-if="cVPNProfile.tempIpsecNewOrOld == 'Old'"
        >
          <a-col>
            <a-form-model-item :label="$t('VPNIKEChange')">
              <a-select
                v-model="ipsec.transform"
                style="width:320px"
                size="small"
              >
                <a-select-option
                  :value="item.value"
                  v-for="(item, index) in changeOptions"
                  :key="index"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item :label="$t('VPNIPsecForwardSecretMode')">
              <a-select
                v-model="ipsec.pfsGroup"
                style="width:320px"
                size="small"
              >
                <a-select-option
                  :value="item.value"
                  v-for="(item, index) in forwardModeOptions"
                  :key="index"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
    </a-form-model>
  </div>
</template>
<script>
import Vue from 'vue';
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'IPsec',
  props: ['vpnProfile'],
  data() {
    return {
      cVPNProfile: {
        tempIpsecNewOrOld: 'Old'
      },
      ipsec: {
        forceNatT: 'disable',
        fragmentation: 'pre-fragmentation',
        transform: '',
        pfsGroup: '',
        mode: 'tunnel',
        pfsGroups: [],
        hashAlgorithms: [],
        encryptionAlgorithms: [],
        antiReplay: 'enable',
        keepaliveTimeout: '10',
        life: {
          duration: '28800',
          volume: ''
        }
      },
      placeholders: {
        keepaliveTimeout: '3-30',
        duration: '120-28800',
        volume: '512-4294967295'
      },
      modeList: [
        {
          label: this.$t('VPNIPsecTunnel'),
          value: 'tunnel'
        }
      ],
      backReplayList: [
        {
          label: 'enable',
          value: 'enable'
        },
        {
          label: 'disable',
          value: 'disable'
        }
      ],
      fragmentList: [
        {
          label: this.$t('VPNIPsecPreFrag'),
          value: 'pre-fragmentation'
        },
        {
          label: this.$t('VPNIPsecBackFrag'),
          value: 'back'
        }
      ],
      natCfgList: [
        {
          label: this.$t('VPNIPsecDisable'),
          value: 'disable'
        },
        {
          label: this.$t('VPNIPsecEnable'),
          value: 'enable'
        }
      ],
      restartTimeTypeOptions: [
        {
          label: 'Hours',
          value: 'hours'
        },
        {
          label: 'Minutes',
          value: 'minutes'
        },
        {
          label: 'Seconds',
          value: 'seconds'
        }
      ],
      restartVolumneTypeOptions: [
        {
          label: 'MB',
          value: 'MB'
        },
        {
          label: 'GB',
          value: 'GB'
        },
        {
          label: 'TB',
          value: 'TB'
        }
      ],
      newOrOldOptions: [
        {
          label: this.$t('VPNIKENew'),
          value: 'New'
        },
        {
          label: this.$t('VPNIKEOld'),
          value: 'Old'
        }
      ],
      selection: {
        field: 'custom',
        width: 30,
        columnAlign: 'center',
        titleAlign: 'center',
        type: 'selection'
      },
      plus: {
        field: 'plus',
        title: `<span><button class="plus" style="width:30px">+</button></span>`,
        width: 37,
        columnAlign: 'left',
        isResize: true
      },
      minus: {
        field: 'minus',
        title: `<span><button class="minus" style="width:28px">-</button></span>`,
        width: 40,
        columnAlign: 'left',
        isResize: true
      },
      hashList: [{}],
      encryList: [{}],
      forwardModeList: [{}],
      delHashList: [],
      delEncryList: [],
      delFModeList: [],
      changeOptions: [
        {
          label: 'esp-aes128-sha1'
        },
        {
          label: 'esp-aes128-ctr-sha1'
        },
        {
          label: 'esp-aes128-ctr-xcbc'
        },
        {
          label: 'esp-aes128-gcm'
        },
        {
          label: 'esp-aes128-md5'
        },
        {
          label: 'esp-aes128-sha256'
        },
        {
          label: 'esp-aes128-sha384'
        },
        {
          label: 'esp-aes128-sha512'
        },
        {
          label: 'esp-3des-md5'
        },
        {
          label: 'esp-3des-sha1'
        },
        {
          label: 'esp-null-md5'
        }
      ],
      forwardModeOptions: [
        {
          label: 'No PFS',
          value: 'mod-none'
        },
        {
          label: 'Diffie-Hellman Group 1 - 768-bit modulus',
          value: 'mod1'
        },
        {
          label: 'Diffie-Hellman Group 2 – 1024-bit modulus',
          value: 'mod2'
        },
        {
          label: 'Diffie-Hellman Group 5 - 1536-bit modulus',
          value: 'mod5'
        },
        {
          label: 'Diffie-Hellman Group 14 – 2048 bit modulus',
          value: 'mod14'
        },
        {
          label: 'Diffie-Hellman Group 15 – 3072 bit modulus',
          value: 'mod15'
        },
        {
          label: 'Diffie-Hellman Group 16 – 4096 bit modulus',
          value: 'mod16'
        },
        {
          label: 'Diffie-Hellman Group 19 – 256 bit elliptic curve',
          value: 'mod19'
        },
        {
          label: 'Diffie-Hellman Group 20 – 384 bit ellipticcurve',
          value: 'mod20'
        },
        {
          label: 'Diffie-Hellman Group 21– 251 bit elliptic curve',
          value: 'mod21'
        },
        {
          label: 'Diffie-Hellman Group 25– 192 bit elliptic curve',
          value: 'mod25'
        },
        {
          label: 'Diffie-Hellman Group 26– 224 bit elliptic curve',
          value: 'mod26'
        }
      ]
    };
  },
  computed: {
    hashColumns() {
      let column = {
        field: 't-hash',
        title: this.$t('VPNIKEHash'),
        width: 140,
        columnAlign: 'left',
        isResize: true,
        componentName: 'hash-opration'
      };
      return [this.selection, column, this.plus, this.minus];
    },
    encryColumns() {
      let column = {
        field: 't-encry',
        title: this.$t('VPNIKEEntry'),
        width: 140,
        columnAlign: 'left',
        isResize: true,
        componentName: 'encry-opration'
      };
      return [this.selection, column, this.plus, this.minus];
    },
    forwardModeColumns() {
      let column = {
        field: 't-forward',
        title: this.$t('VPNIPsecForwardSecretMode'),
        width: 140,
        columnAlign: 'left',
        isResize: true,
        componentName: 'forward-opration'
      };
      return [this.selection, column, this.plus, this.minus];
    }
  },
  mounted() {
    if (this.vpnProfile.ipsec) {
      this.ipsec = this.vpnProfile.ipsec;
      this.hashList = [];
      this.encryList = [];
      this.forwardModeList = [];
      this.ipsec.hashAlgorithms &&
        this.ipsec.hashAlgorithms.forEach(hash => {
          let row = { hash };
          this.hashList.push(row);
        });
      this.ipsec.encryptionAlgorithms &&
        this.ipsec.encryptionAlgorithms.forEach(encry => {
          let row = { encry };
          this.encryList.push(row);
        });
      this.ipsec.pfsGroups &&
        this.ipsec.pfsGroups.forEach(forward => {
          let row = { forward };
          this.forwardModeList.push(row);
        });
    }
    this.vpnTableSelectsAll({ key: 'vpnIPsecHash' });
    this.vpnTableSelectsAll({ key: 'vpnIPsecEntry' });
    this.vpnTableSelectsAll({ key: 'vpnIPsecForward' });
    this.cVPNProfile.ipsec = this.ipsec;
    this.$emit('passChildContent', this.cVPNProfile);
  },
  updated() {
    this.cVPNProfile.ipsec = this.ipsec;
    this.$emit('passChildContent', this.cVPNProfile);
  },
  methods: {
    ...mapMutations([
      'vpnTableSelectsPlus',
      'vpnTableSelectsMinus',
      'vpnTableSelectsAll'
    ]),
    changeRadio(e) {
      if (e.target.value === 'New') {
        this.ipsec.transform = '';
        this.ipsec.pfsGroup = '';
      } else {
        this.ipsec.hashAlgorithms = [];
        this.ipsec.encryptionAlgorithms = [];
        this.ipsec.pfsGroups = [];
        this.ipsec.transform = 'esp-aes128-sha1';
        this.ipsec.pfsGroup = 'mod-none';
      }
    },
    hashTitleClick(title) {
      if (/class="plus"/.test(title)) {
        this.hashList.push({});
      } else if (/class="minus"/.test(title)) {
        // 删除选中的
        if (this.delHashList.length) {
          this.hashList = this.hashList.filter(item => {
            let filter = true;
            for (let i = 0; i < this.delHashList.length; i++) {
              if (item['hash'] === this.delHashList[i]) {
                this.vpnTableSelectsPlus({
                  key: 'vpnIPsecHash',
                  label: item['hash'],
                  value: item['hash']
                });
                filter = false;
                break;
              }
            }
            return filter;
          });
        } else {
          this.$message.info('请至少选中一条记录！');
        }
        this.delHashList = [];
      }
    },
    hashCellMerge(rowIndex, rowData, field) {
      if (field === 't-hash') {
        return {
          colSpan: 3,
          rowSpan: 1,
          content: '',
          componentName: 'hash-opration'
        };
      }
    },
    encryTitleClick(title) {
      if (/class="plus"/.test(title)) {
        this.encryList.push({});
      } else if (/class="minus"/.test(title)) {
        // 删除选中的
        if (this.delEncryList.length) {
          this.encryList = this.encryList.filter(item => {
            let filter = true;
            for (let i = 0; i < this.delEncryList.length; i++) {
              if (item['encry'] === this.delEncryList[i]) {
                this.vpnTableSelectsPlus({
                  key: 'vpnIPsecEntry',
                  label: item['encry']
                });
                filter = false;
                break;
              }
            }
            return filter;
          });
        } else {
          this.$message.info('请至少选中一条记录！');
        }
        this.delEncryList = [];
      }
    },
    encryCellMerge(rowIndex, rowData, field) {
      if (field === 't-encry') {
        return {
          colSpan: 3,
          rowSpan: 1,
          content: '',
          componentName: 'encry-opration'
        };
      }
    },
    fModeTitleClick(title) {
      if (/class="plus"/.test(title)) {
        this.forwardModeList.push({});
      } else if (/class="minus"/.test(title)) {
        // 删除选中的
        if (this.delFModeList.length) {
          this.forwardModeList = this.forwardModeList.filter(item => {
            let filter = true;
            for (let i = 0; i < this.delFModeList.length; i++) {
              if (item['forward'] === this.delFModeList[i]) {
                this.vpnTableSelectsPlus({
                  key: 'vpnIPsecForward',
                  label: item['forward'],
                  value: item['forward']
                });
                filter = false;
                break;
              }
            }
            return filter;
          });
        } else {
          this.$message.info('请至少选中一条记录！');
        }
        this.delFModeList = [];
      }
    },
    fModeCellMerge(rowIndex, rowData, field) {
      if (field === 't-forward') {
        return {
          colSpan: 3,
          rowSpan: 1,
          content: '',
          componentName: 'forward-opration'
        };
      }
    },
    selectALLHash(checkdList) {
      this.delHashList = [];
      checkdList.forEach(item => {
        this.delHashList.push(item['hash']);
      });
    },
    selectChangeHash(checked) {
      this.delHashList = [];
      checked.forEach(item => {
        this.delHashList.push(item['hash']);
      });
    },
    selectALLEncry(checkdList) {
      this.delEncryList = [];
      checkdList.forEach(item => {
        this.delEncryList.push(item['encry']);
      });
    },
    selectChangeEncry(checked) {
      this.delEncryList = [];
      checked.forEach(item => {
        this.delEncryList.push(item['encry']);
      });
    },
    selectALLFMode(checkdList) {
      this.delFModeList = [];
      checkdList.forEach(item => {
        this.delFModeList.push(item['forward']);
      });
    },
    selectChangeFMode(checked) {
      this.delFModeList = [];
      checked.forEach(item => {
        this.delFModeList.push(item['forward']);
      });
    },
    customFunc(params) {
      switch (params.type) {
        case 'hash':
          this.hashList[params.index]['hash'] = params.label;
          this.hashList = [...this.hashList];
          this.ipsec.hashAlgorithms = [];
          this.hashList.forEach(obj => {
            this.ipsec.hashAlgorithms.push(obj.hash);
          });
          this.vpnTableSelectsMinus({
            key: 'vpnIPsecHash',
            label: params.label
          });
          break;
        case 'encry':
          this.encryList[params.index]['encry'] = params.label;
          this.encryList = [...this.encryList];
          this.ipsec.encryptionAlgorithms = [];
          this.encryList.forEach(obj => {
            this.ipsec.encryptionAlgorithms.push(obj.encry);
          });
          this.vpnTableSelectsMinus({
            key: 'vpnIPsecEntry',
            label: params.label
          });
          break;
        default:
          this.forwardModeList[params.index]['forward'] = params.label;
          this.forwardModeList = [...this.forwardModeList];
          this.ipsec.pfsGroups = [];
          this.forwardModeList.forEach(obj => {
            this.ipsec.pfsGroups.push(obj.forward);
          });
          this.vpnTableSelectsMinus({
            key: 'vpnIPsecForward',
            label: params.label,
            value: params.label
          });
          break;
      }
    }
  }
};
let props = {
  rowData: {
    type: Object
  },
  field: {
    type: String
  },
  index: {
    type: Number
  }
};
Vue.component('hash-opration', {
  template: `<span>
     <a-select
        v-if="!rowData['hash']"
        placeholder="--Select--"
        size="small"
        @change="change"
      >
        <a-select-option
          :value="item.label"
          v-for="(item, index) in vpnTableSelects.vpnIPsecHash"
          v-if="!item.used"
          :key="index"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
      <label>{{ rowData['hash'] }} </label>
    </span>`,
  props,
  computed: {
    ...mapState(['vpnTableSelects'])
  },
  methods: {
    change(label) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'hash',
        index: this.index,
        rowData: this.rowData,
        label
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('encry-opration', {
  template: `<span>
     <a-select
        v-if="!rowData['encry']"
        placeholder="--Select--"
        size="small"
        @change="change"
      >
        <a-select-option
          :value="item.label"
          v-for="(item, index) in vpnTableSelects.vpnIPsecEntry"
          v-if="!item.used"
          :key="index"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
      <label>{{ rowData['encry'] }} </label>
    </span>`,
  props,
  computed: {
    ...mapState(['vpnTableSelects'])
  },
  methods: {
    change(label) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'encry',
        index: this.index,
        rowData: this.rowData,
        label
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('forward-opration', {
  template: `<span>
     <a-select
        v-if="!rowData['forward']"
        placeholder="--Select--"
        size="small"
        @change="change"
      >
        <a-select-option
          :value="item.value"
          v-for="(item, index) in vpnTableSelects.vpnIPsecForward"
          v-if="!item.used"
          :key="index"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
      <label>{{ showValue }} </label>
    </span>`,
  props,
  computed: {
    ...mapState(['vpnTableSelects']),
    showValue() {
      for (let i = 0; i < this.vpnTableSelects.vpnIPsecForward.length; i++) {
        if (this.rowData['forward'] == this.vpnTableSelects.vpnIPsecForward[i].value) {
          return this.vpnTableSelects.vpnIPsecForward[i].label;
        }
      }
      return '';
    }
  },
  methods: {
    change(label) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'forward',
        index: this.index,
        rowData: this.rowData,
        label
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
</script>
<style lang="scss" scoped>
.change-cls {
  min-height: 78px;
  border-radius: 5px;
  border: solid 3px #456880;
  position: relative;
  padding: 10px;
  .change-icon {
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
</style>
