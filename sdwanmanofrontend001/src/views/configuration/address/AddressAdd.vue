<template>
  <div>
    <a-modal
      v-model="visible"
      title="Add Qos Profile"
      on-ok="handleOk"
      width="420px"
    >
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleOk">Ok</a-button>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
      </template>
      <a-form-model :model="form" ref="ruleForm">
        <div class="title">
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Name">
                  <a-input v-model="form.address.name" />
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Description">
                  <a-input v-model="form.address.description" />
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <!-- <a-form-model-item label="Tags">
                  <a-input v-model="form.tags"/>
                </a-form-model-item>-->
                <!-- 111111111111111111111 -->
                <a-form-model-item label="Tags">
                  <a-select
                    mode="tags"
                    size="small"
                    :open="false"
                    style="width: 100%"
                    :token-separators="[',']"
                    @change="handleChange"
                  >
                    <!-- <a-select-option
                      v-for="i in 25"
                      :key="(i + 9).toString(36) + i"
                    >{{ (i + 9).toString(36) + i }}</a-select-option>-->
                  </a-select>
                </a-form-model-item>

                <!-- 11111111111111111111 -->
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div class="footer">
          <!-- <div class="ForWardingClass">ForWarding Class</div> -->
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="Type">
                <a-select v-model="form.address.type">
                  <a-select-option value="ipv4-prefix">Ipv4</a-select-option>
                  <a-select-option value="Ipv4 Wildcard Mask"
                    >Ipv4 Wildcard Mask</a-select-option
                  >
                  <a-select-option value="ipv4-range"
                    >Ipv4 Range</a-select-option
                  >
                  <a-select-option value="ipv6-prefix"
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
                  <a-input v-model="form.address.value" />
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
import { addressAdd } from 'apis/address';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      // loading: false,
      visible: false,
      form: {
        deviceName: '',
        userName: '',
        address: {
          name: '',
          description: '',
          tags: [],
          type: '',
          value: ''
        }
      },
      tags: ''
    };
  },
  computed: {
    title() {
      if (this.form.address.type === 'Ipv4') {
        return 'IPv4 Address/Prefix';
      }
      if (this.form.address.type === 'Ipv4 Wildcard Mask') {
        return 'Ipv4 Wildcard Mask';
      }
      if (this.form.address.type === 'Ipv4 Range') {
        return 'Ipv4 Range';
      }
      if (this.form.address.type === 'ipv6-prefix') {
        return 'Ipv6 Address/Prefix';
      }
      if (this.form.address.type === 'fqdn') {
        return 'FQDN';
      }
      if (this.form.address.type === 'dynamic-address') {
        return 'Match';
      }
      return 'IPv4 Address/Prefix';
    },

    ...mapState(['organization', 'deviceName'])
  },
  methods: {
    showModalAdd() {
      this.visible = true;
    },
    async handleOk() {
      // this.loading = true;
      // setTimeout(() => {
      //   this.visible = false;
      //   this.loading = false;
      // }, 3000);
      // if (this.form.tags != '') {
      //   this.form.tags.split('');
      //   // this.form.tags = this.form.tags.push(this.form.tag.split(''));
      //   // delete this.form.tag;
      // }
      this.form.deviceName = this.deviceName;
      this.form.userName = this.organization;
      const res = await addressAdd(this.form);
      console.log(res);
      if (res.message === 'Success') {
        this.visible = false;
        this.$message.success('创建成功');
        this.$parent.tableForm();
        this.clear();
      }
    },
    handleCancel() {
      this.visible = false;
      this.clear();
    },
    handleChange(value) {
      console.log(`selected ${value}`);
      console.log(value);
      this.form.address.tags = value;
      console.log(this.form.address.tags);
    },
    clear() {
      (this.form.address.name = ''),
        (this.form.address.description = ''),
        (this.form.address.tags = []),
        (this.form.address.type = ''),
        (this.form.address.value = '');
    }
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
