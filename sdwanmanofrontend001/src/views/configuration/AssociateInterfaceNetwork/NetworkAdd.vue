<template>
  <div>
    <a-modal
      v-model="visible"
      title="Associate Interface/Network"
      on-ok="handleOk"
      width="420px"
    >
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleOk">Ok</a-button>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
      </template>
      <a-form-model :model="form" ref="ruleForm" :rules="rules">
        <div class="title">
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-radio-group v-model="form.value" @change="onChange">
                  <a-radio :value="1">Interface</a-radio>
                  <a-radio :value="2">Network</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="Name" prop="name">
                <a-select v-model="form.name">
                  <a-select-option
                    v-for="item in seleList"
                    :value="item"
                    :key="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="Description">
                <a-input v-model="form.description" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="Tags">
                <a-select
                  mode="tags"
                  style="width: 100%"
                  :token-separators="[',']"
                  @change="handleChange"
                  size="small"
                  :open="false"
                >
                  <!-- <a-select-option
                      v-for="i in 25"
                      :key="(i + 9).toString(36) + i"
                  >{{ (i + 9).toString(36) + i }}</a-select-option>-->
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div class="main">
          <div class="subscrition">Shaping</div>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="Burst Size(Bytes)">
                <a-input v-model="form.BurstSize" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="Rate(Kbps)">
                <a-input v-model="form.Rate" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div class="footer">
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="DSCP Rewrite Rule">
                <a-select v-model="form.dscpRewriteRule" :disabled="isDisabled">
                  <a-select-option
                    value="item"
                    v-for="(item, index) in RewriteSelect"
                    :key="index"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="DSCP6 Rewrite Rule">
                <a-select
                  v-model="form.dscp6RewriteRule"
                  :disabled="isDisabled"
                >
                  <a-select-option
                    value="item"
                    v-for="(item, index) in RewriteRuleSelect"
                    :key="index"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="802.1p Rewrite Rule">
                <a-select v-model="form.pRewriteRule" :disabled="isDisabled">
                  <a-select-option
                    value="item"
                    v-for="(item, index) in eightRewriteRuleSelect"
                    :key="index"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="Scheduler Map">
                <a-select v-model="form.SchedulerMap">
                  <a-select-option value="test">test</a-select-option>
                  <a-select-option value="testSchedule"
                    >testSchedule</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="Logging Interval(Secs)">
                <a-input v-model="form.LoggingInterval" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="Bandwidth sharing">
                <a-select v-model="form.BandwidthSharing">
                  <a-select-option value="Off">Off</a-select-option>
                  <a-select-option value="On">On</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import {
  AssInterfaceAdd,
  AssInterfaceSelect,
  AssNetWorkSelect,
  AssInterfaceSchedulerMap,
  AssInterfaceDSCPRewriteRuleSelect,
  DSCPRewriteRule,
  AssInterfaceDSCPRewriteRule
} from 'apis/AssInterface';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      // loading: false,
      visible: false,
      disabled: false,
      form: {
        value: 1,
        name: '',
        description: '',
        tags: '',
        BurstSize: '',
        Rate: '',
        dscpRewriteRule: '',
        dscp6RewriteRule: '',
        pRewriteRule: '',
        SchedulerMap: '',
        LoggingInterval: '',
        BandwidthSharing: ''
      },
      netWorkAdd: {
        deviceName: '',
        orgName: '',
        data: {
          name: '',
          description: '',
          tags: [],
          dscpRewriteRule: '',
          dscp6RewriteRule: '',
          mode: '111111'
        }
      },
      InterfaceSelectAdd: [],
      NetworkSelectAdd: [],
      RewriteSelect: [],
      RewriteRuleSelect: [],
      eightRewriteRuleSelect: [],
      rules: {
        name: [
          {
            required: true,
            message: 'Please select Activity zone',
            trigger: 'change'
          }
        ]
      }
    };
  },
  created() {
    console.log(this.form.value);
    this.init();
    this.SchedulerSelect();
    this.RewriteRule();
    this.eightRewriteRule();
    this.Rewrite();
  },
  computed: {
    isDisabled() {
      return this.form.value === 1;
    },
    seleList() {
      if (this.form.value == 1) return this.InterfaceSelectAdd;
      return this.NetworkSelectAdd;
    },
    ...mapState(['organization', 'deviceName'])
  },
  watch: {
    'form.value'() {
      this.form.name = '';
    }
  },
  methods: {
    showModalAdd() {
      this.visible = true;
    },
    handleOk() {
      // this.loading = true;
      // setTimeout(() => {
      //   this.visible = false;
      //   this.loading = false;
      // }, 3000);
      this.netWorkAdd.data.name = this.form.name;
      this.netWorkAdd.data.description = this.form.description;
      this.netWorkAdd.data.tags = this.form.tags;
      this.netWorkAdd.data.dscpRewriteRule = this.form.dscpRewriteRule;
      this.netWorkAdd.data.dscp6RewriteRule = this.form.dscp6RewriteRule;
      if (this.netWorkAdd.data.description == '') {
        this.netWorkAdd.data.description = null;
      }
      if (this.netWorkAdd.data.dscp6RewriteRule == '') {
        this.netWorkAdd.data.dscp6RewriteRule = null;
      }
      if (this.netWorkAdd.data.dscpRewriteRule == '') {
        this.netWorkAdd.data.dscpRewriteRule = null;
      }
      if (this.netWorkAdd.data.tags == '') {
        this.netWorkAdd.data.tags = null;
      }
      if (this.form.value === 1) {
        this.netWorkAdd.data.mode = 'interface';
      } else {
        this.netWorkAdd.data.mode = 'network';
      }
      this.netWorkAdd.deviceName = this.deviceName;
      this.netWorkAdd.orgName = this.organization;
      this.$refs.ruleForm.validate(async (valid, res) => {
        console.log(res);
        if (valid) {
          // alert('submit!');
          const res = await AssInterfaceAdd(this.netWorkAdd);
          console.log(res);
          if (res.message === 'success') {
            this.visible = false;
            this.$message.success('创建成功');
            this.$parent.tableForm();
            this.clear();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleCancel() {
      this.visible = false;
      this.clear();
    },
    // 单选框的值
    onChange(e) {
      console.log('radio checked', e.target.value);
    },
    init() {
      this.AssInterfaceSelectAdd();
      this.AssNetworkSelectAdd();
    },
    async AssInterfaceSelectAdd() {
      const res = await AssInterfaceSelect(this.deviceName, this.organization);
      console.log(res.result);
      this.InterfaceSelectAdd = res.result;
    },
    async AssNetworkSelectAdd() {
      const res = await AssNetWorkSelect(this.deviceName, this.organization);
      console.log(res.result);
      this.NetworkSelectAdd = res.result;
    },
    //下拉框Scheduler Map
    async SchedulerSelect() {
      const res = await AssInterfaceSchedulerMap(
        this.deviceName,
        this.organization
      );
      console.log(res);
    },

    //下拉框DSCPRewriteRule
    async Rewrite() {
      const res = await AssInterfaceDSCPRewriteRule(
        this.deviceName,
        this.organization
      );
      console.log(res.result);
      this.RewriteSelect = res.result;
    },
    //下拉框DSCP6RewriteRule
    async RewriteRule() {
      const res = await AssInterfaceDSCPRewriteRuleSelect(
        this.deviceName,
        this.organization
      );
      console.log(res.result);
      this.RewriteRuleSelect = res.result;
    },
    //下拉框802.1pRewriteRule
    async eightRewriteRule() {
      const res = await DSCPRewriteRule(this.deviceName, this.organization);
      console.log(res.result);
      this.eightRewriteRuleSelect = res.result;
    },

    clear() {
      this.form.name = '';
      this.form.description = '';
      this.form.tags = [];
      this.form.dscpRewriteRule = '';
      this.form.dscp6RewriteRule = '';
      // this.form.mode = '';
      // this.form.data.name = '';
      // this.form.data.description = '';
      // this.form.data.tags = [];
      // this.form.data.dscpRewriteRule = '';
      // this.form.data.dscp6RewriteRule = '';
      // this.form.data.mode = '';
    },
    // tags
    handleChange(value) {
      console.log(`selected ${value}`);
      console.log(value);
      this.form.tags = value;
      console.log(this.form.tags);
    }
  }
};
</script>
<style lang="scss">
.ant-form-item-required {
  &::before {
    display: none;
  }
  &::after {
    content: '*' !important;
    color: #f5222d !important;
    font-size: 18px !important;
    margin-left: 4px !important;
    display: inline-block !important;
  }
}
</style>
<style lang="scss" scoped>
/deep/.ant-form-explain {
  display: none !important;
}
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
    height: 390px;
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
    .ant-select-selection--single {
      height: 20px;
    }
    .ant-select-selection__rendered {
      line-height: unset;
    }
  }
}

.main {
  /deep/.ant-form-item-label > label {
    color: #f9f9f9;
  }
  /deep/.ant-form-item {
    padding: 0;
    width: 185px;
    margin-bottom: 0;
    margin-left: 4px;

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
    .ant-select-selection__rendered {
      line-height: unset;
    }
  }
  width: 400px;
  height: 78px;
  margin: auto;
  margin-top: 14px;
  border-radius: 5px;
  border: solid 3px #456880;
  position: relative;
  padding-top: 5px;
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
.footer {
  /deep/.ant-form-item-label > label {
    color: #f9f9f9;
  }
  /deep/.ant-form-item {
    padding: 0;
    width: 195px;
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
