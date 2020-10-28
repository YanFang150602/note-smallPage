<template>
  <div>
    <span>
      Are you sure you want to delete the selected device workflow(s)? Clicking
      on "Yes" will perform the following for the selected devices, this action
      can not be reverted.
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
      <a-radio :style="radioStyle" :value="2">Reset to Factory Default</a-radio>
      <a-radio :style="radioStyle" :value="3"
        >Erase Running Configuration and Load Device Defaults</a-radio
      >
    </a-radio-group>
    <!-- </a-modal> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      // 单选框
      value: 1,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      }
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
    },
    // 单选框
    onChange(e) {
      // console.log('radio checked', e.target.value);
      console.log(e);
    }
  }
};
</script>
<style lang="scss" scoped></style>
