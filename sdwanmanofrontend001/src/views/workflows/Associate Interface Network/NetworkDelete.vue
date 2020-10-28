<template>
  <div>
    <a-modal v-model="visible" title="Confirm Delete" on-ok="handleOk">
      <template slot="footer">
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="handleOk"
          style="baclGround:#a7d054"
          >Yes</a-button
        >
        <a-button key="back" @click="handleCancel">No</a-button>
      </template>
      <p>Are you sure want to delete the selected record(s)?</p>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      visible: false
    };
  },
  methods: {
    showModalDelete() {
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
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.ant-modal-content {
  max-height: 325px;
  .ant-modal-header {
    height: 36px;
    background-color: #e9f4fc;
    .ant-modal-title {
      line-height: 8px;
    }
  }
  .ant-modal-body {
    padding: 3px;
    background-color: #ffffff;
    height: 100px;
    p {
      margin-left: 20px;
      margin-top: 20px;
    }
  }
  .ant-modal-footer {
    background-color: #e9f4fc;
    height: 50px;
  }
}

// 按钮
/deep/.ant-btn-primary {
  width: 70px;
  height: 30px;
  background-color: #a7d054;
  border: none;
}
/deep/button[data-v-36f0eb6c]:nth-child(2) {
  width: 70px;
  height: 30px;
  background-color: #3f4a5b;
  border: none;
  color: #ffffff;
}
</style>
