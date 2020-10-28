<template>
  <tr>
    <td align="center">
      <a-form-model-item style="width:45px">
        <a-input size="small" v-model="wandata.portid" />
      </a-form-model-item>
    </td>
    <td align="center">
      <a-form-model-item style="width:60px">
        <a-input size="small" v-model="wandata.interfaceName" />
      </a-form-model-item>
    </td>
    <td align="center">
      <a-form-model-item v-show="!wandata.pppoe" style="width:60px">
        <a-input size="small" v-model="wandata.unitInfo[0].vlanId" />
      </a-form-model-item>
    </td>
    <td align="center">
      <a-form-model-item style="width:200px">
        <a-select
          @change="networkChange"
          size="small"
          v-model="wandata.unitInfo[0].networkName"
        >
          <a-select-option value="add">+ Create WAN Network</a-select-option>
          <a-select-option
            v-for="(item, index) in names"
            :key="index"
            :value="item"
            >{{ item }}</a-select-option
          >
        </a-select>
      </a-form-model-item>
    </td>
    <td align="center">
      <a-form-model-item style="width:100px">
        <a-input size="small" v-model="wandata.unitInfo[0].linkPriority" />
      </a-form-model-item>
    </td>
    <td align="center">
      <a-form-model-item style="width:60px">
        <a-checkbox size="small" v-model="ipv4off" />
      </a-form-model-item>
    </td>
    <td align="center">
      <a-form-model-item style="width:60px">
        <a-checkbox size="small" v-model="ipv4" />
      </a-form-model-item>
    </td>
    <td align="center">
      <a-form-model-item style="width:60px">
        <a-checkbox size="small" v-model="ipv6off" />
      </a-form-model-item>
    </td>
    <td align="center">
      <a-form-model-item style="width:60px">
        <a-checkbox size="small" v-model="ipv6" />
      </a-form-model-item>
    </td>
    <td align="center">
      <a-form-model-item style="width:60px">
        <a-checkbox size="small" v-model="wandata.unitInfo[0].allowSSH" />
      </a-form-model-item>
    </td>
    <td align="center">
      <a-form-model-item style="width:60px">
        <a-checkbox v-model="nexthop" />
      </a-form-model-item>
    </td>
    <td align="center">
      <a-form-model-item v-show="remote" style="width:100px">
        <a-input size="small" v-model="monitorIPv4Address" />
      </a-form-model-item>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    wandata: Object,
    names: Array
  },
  data() {
    return {
      ipv4off: false,
      ipv4: true,
      ipv6off: false,
      ipv6: false,
      nexthop: false,
      remote: true,
      monitorIPv4Address: ''
    };
  },
  created() {
    this.ipv4off = this.wandata.unitInfo[0].pv4Static;
    this.ipv4 = this.wandata.unitInfo[0].ipv4Dhcp;
    this.ipv6off = this.wandata.unitInfo[0].ipv6Static;
    this.ipv6 = this.wandata.unitInfo[0].ipv6Dhcp;
    this.nexthop = this.wandata.unitInfo[0].monitor.monitorNexthop;
    this.remote = !this.wandata.unitInfo[0].monitor.monitorNexthop;
    this.monitorIPv4Address = this.wandata.unitInfo[0].monitor.monitorIPv4Address;
  },
  methods: {
    networkChange(value) {
      if (value === 'add') {
        this.$emit('addname');
      }
    }
  },
  watch: {
    ipv4off(data) {
      if (data) {
        this.ipv4 = !data;
        this.wandata.unitInfo[0].ipv4Static = this.ipv4off;
        this.wandata.unitInfo[0].ipv4Dhcp = this.ipv4;
      }
    },
    ipv4(data) {
      if (data) {
        this.ipv4off = !data;
        this.wandata.unitInfo[0].ipv4Static = this.ipv4off;
        this.wandata.unitInfo[0].ipv4Dhcp = this.ipv4;
      }
    },
    ipv6off(data) {
      if (data) {
        this.ipv6 = !data;
        this.wandata.unitInfo[0].ipv6Static = this.ipv6off;
        this.wandata.unitInfo[0].ipv6Dhcp = this.ipv6;
      }
    },
    ipv6(data) {
      if (data) {
        this.ipv6off = !data;
        this.wandata.unitInfo[0].ipv6Static = this.ipv6off;
        this.wandata.unitInfo[0].ipv6Dhcp = this.ipv6;
      }
    },
    nexthop(data) {
      if (data) {
        this.remote = false;
        this.wandata.unitInfo[0].monitor = { monitorNexthop: true };
      } else {
        this.remote = true;
        this.wandata.unitInfo[0].monitor = {
          monitorIPv4Address: this.monitorIPv4Address
        };
      }
    },
    wandata(data) {
      this.rowData = data;
    },
    names() {
      this.wandata.unitInfo[0].networkName = this.names[0];
    }
  }
};
</script>

<style lang="scss" scoped>
tr {
  height: 24px;
  text-align: center;
  line-height: 24px;
  font-size: 12px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  input {
    padding: 0px 3px;
    height: 20px;
    border-radius: 4px;
    color: #0f2c3e;
    font-size: 12px;
    line-height: 18px;
    border: 1px solid #b0c7d5;
    border-left: 1px solid #dee3e8;
  }
  .ant-select {
    font-size: 12px;
  }
}
</style>
