<template>
  <div>
    <a-modal
      v-model="visible"
      title="Edit Address"
      on-ok="handleOk"
      width="420px"
    >
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleOk">Ok</a-button>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
      </template>
      <a-form-model :model="form">
        <div class="title">
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Name">
                  <a-input v-model="addressEdit.name" disabled />
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Description">
                  <a-input v-model="addressEdit.description" />
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Tags">
                  <a-select
                    mode="tags"
                    v-model="addressEdit.tags"
                    size="small"
                    :open="false"
                    style="width: 100%"
                    :token-separators="[',']"
                  >
                    <!-- <a-select-option
                      v-for="i in 25"
                      :key="(i + 9).toString(36) + i"
                    >{{ (i + 9).toString(36) + i }}</a-select-option>-->
                  </a-select>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div class="footer">
          <!-- <div class="ForWardingClass">ForWarding Class</div> -->
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="Type">
                <a-select v-model="addressEdit.type">
                  <a-select-option value="Ipv4">Ipv4</a-select-option>
                  <a-select-option value="Ipv4 Wildcard Mask"
                    >Ipv4 Wildcard Mask</a-select-option
                  >
                  <a-select-option value="Ipv4-Range"
                    >Ipv4 Range</a-select-option
                  >
                  <a-select-option value="Ipv6-prefix"
                    >Ipv6 Address/Prefix</a-select-option
                  >
                  <a-select-option value="fqdn">FQDN</a-select-option>
                  <a-select-option value="dynamic-address"
                    >Dynamic Address</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item>
                <a-form-model-item :label="title">
                  <a-input v-model="addressEdit.value" />
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { addressEdit } from 'apis/address';
import { mapState } from 'vuex';

export default {
  props: ['addressEdit'],
  computed: {
    title() {
      if (this.addressEdit.type === 'Ipv4') {
        return 'IPv4 Address/Prefix';
      }
      if (this.addressEdit.type === 'Ipv4 Wildcard Mask') {
        return 'IPv4 Ipv4 Wildcard Mask';
      }
      if (this.addressEdit.type === 'Ipv4 Range') {
        return 'Ipv4 Range';
      }
      if (this.addressEdit.type === 'Ipv6-prefix') {
        return 'Ipv6 Address/Prefix';
      }
      if (this.addressEdit.type === 'fqdn') {
        return 'FQDN';
      }
      if (this.addressEdit.type === 'dynamic-address') {
        return 'Match';
      }
      return 'IPv4 Address/Prefix';
    },

    ...mapState(['organization', 'deviceName'])
  },
  data() {
    return {
      // loading: false,
      visible: false,
      form: {
        name: '',
        description: '',
        tags: '',
        type: '',
        addressPrefix: ''
      },
      formEdit: {
        id: '',
        deviceName: '',
        userName: '',
        address: {
          name: '',
          description: '',
          tags: [],
          type: '',
          value: ''
        }
      }
    };
  },
  methods: {
    showModalEdit() {
      this.visible = true;
    },
    async handleOk() {
      // this.loading = true;
      // setTimeout(() => {
      //   this.visible = false;
      //   this.loading = false;
      // }, 3000);
      // console.log(this.addressEdit);
      this.formEdit.address = this.addressEdit;
      console.log(this.formEdit.address.tags);
      console.log(this.addressEdit.tags);
      this.formEdit.deviceName = this.deviceName;
      this.formEdit.userName = this.organization;
      this.formEdit.id = this.addressEdit.name;
      const res = await addressEdit(this.addressEdit.name, this.formEdit);
      console.log(res);
      if (res.message === 'Success') {
        this.visible = false;
        this.$message.success('编辑成功');
      }
    },
    handleCancel() {
      this.visible = false;
    }
    // handleChange(value) {
    //   console.log(`selected ${value}`);
    //   console.log(value);
    //   this.addressEdit.tags = value;
    // }
  }
};
</script>
<style lang="scss" scoped>
/deep/.ant-form-item-label > label::after {
  display: none;
}
// 弹框的样式
/deep/.ant-modal-content {
  max-height: 1000px;
  .ant-modal-header {
    height: 31px;
    background-color: #e9f4fc;
    .ant-modal-title {
      line-height: 8px;
    }
  }
  .ant-modal-body {
    height: 193px;
    padding: 3px;
    background-color: #36536b;
  }
  .ant-modal-footer {
    height: 50px;
    background-color: #e9f4fc;
  }
}
.title {
  /deep/.ant-radio-wrapper {
    color: #f9f9f9;
  }
  /deep/.ant-form-item-label > label {
    color: #f9f9f9;
  }
  /deep/.ant-form-item {
    padding: 0;
    width: 400px;
    margin-bottom: 0;
    margin: auto;
    .ant-form-item-label {
      line-height: 19px;
    }
    .ant-form-item-control {
      line-height: 19px;
    }
    .ant-input {
      width: 100%;
      height: 20px;
    }
  }
}

.footer {
  // margin-top: 14px;
  padding-top: 5px;
  /deep/.ant-form-item-label > label {
    color: #f9f9f9;
  }

  /deep/.ant-form-item {
    padding: 0;
    width: 196px;
    margin-bottom: 0;
    margin: auto;
    .ant-form-item-label {
      line-height: 19px;
    }
    .ant-form-item-control {
      line-height: 19px;
    }
    .ant-input {
      width: 100%;
      height: 20px;
    }
    .ant-select-selection--single {
      height: 20px;
    }
    .ant-select-selection__rendered {
      line-height: unset;
    }
  }
}

// 按钮
/deep/.ant-btn-primary {
  width: 70px;
  height: 30px;
  background-color: #a7d054;
  border: none;
}
/deep/.ant-btn:nth-child(2) {
  width: 70px;
  height: 30px;
  background-color: #3f4a5b;
  border: none;
  color: #ffffff;
}
</style>
