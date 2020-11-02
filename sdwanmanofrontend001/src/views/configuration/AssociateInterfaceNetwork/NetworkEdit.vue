<template>
  <div>
    <a-modal v-model="visible" title="Edit Address" on-ok="handleOk" width="420px">
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleOk">Ok</a-button>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
      </template>
      <a-form-model :model="form">
        <div class="title">
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-radio-group v-model="form.resource" disabled>
                  <a-radio value="1">Interface</a-radio>
                  <a-radio value="2">Network</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Name">
                  <a-input v-model="AssocNetworkCheck.name" disabled/>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Description">
                  <a-input v-model="AssocNetworkCheck.description"/>
                </a-form-model-item>
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
                  size="small"
                  :open="false"
                  v-model="AssocNetworkCheck.tags"
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
                <a-input v-model="AssocNetworkCheck.burstSize" disabled/>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="Rate(Kbps)">
                <a-input v-model="AssocNetworkCheck.rate" disabled/>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div class="footer">
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="DSCP Rewrite Rule">
                <a-select v-model="AssocNetworkCheck.dscpRewriteRule">
                  <a-select-option
                    value="item"
                    v-for="(item, index) in RewriteSelect"
                    :key="index"
                  >{{ item }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="DSCP6 Rewrite Rule">
                <a-select v-model="AssocNetworkCheck.dscp6RewriteRule">
                  <a-select-option
                    value="item"
                    v-for="item in RewriteRuleSelect"
                    :key="item"
                  >{{ item }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="802.1p Rewrite Rule">
                <a-select v-model="AssocNetworkCheck.pRewriteRule" disabled>
                  <a-select-option value="tttt1">tttt1</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="Scheduler Map">
                <a-select v-model="AssocNetworkCheck.schedulerMap" disabled>
                  <a-select-option value="test">test</a-select-option>
                  <a-select-option value="testSchedule">testSchedule</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="Logging Interval(Secs)">
                <a-input v-model="AssocNetworkCheck.loggingInterval" disabled/>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="Bandwidth sharing">
                <a-select v-model="AssocNetworkCheck.BandwidthSharing" disabled>
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
  AssInterfaceEdit,
  AssInterfaceSchedulerMap,
  AssInterfaceDSCPRewriteRuleSelect,
  DSCPRewriteRule,
  AssInterfaceDSCPRewriteRule
} from 'apis/AssInterface';
import { mapState } from 'vuex';

export default {
  props: ['AssocNetworkCheck'],
  data() {
    return {
      // loading: false,
      visible: false,
      form: {
        resource: '',
        name: '',
        description: '',
        tags: [],
        BurstSize: '',
        Rate: '',
        DSCPRewriteRule: '',
        DSCP6RewriteRule: '',
        pRewriteRule: '',
        SchedulerMap: '',
        LoggingInterval: '',
        BandwidthSharing: ''
      },
      netWorkEdit: {
        deviceName: '',
        orgName: '',
        data: {
          name: '',
          description: '',
          tags: [],
          dscpRewriteRule: '',
          dscp6RewriteRule: '',
          mode: ''
        }
      },
      tags: [],
      RewriteSelect: [],
      RewriteRuleSelect: [],
      eightRewriteRuleSelect: []
    };
  },
  created() {
    this.form.tags = this.tags;
    this.SchedulerSelect();
    this.RewriteRule();
    this.eightRewriteRule();
    this.Rewrite();
  },
  computed: {
    ...mapState(['organization', 'deviceName'])
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    async handleOk() {
      // this.loading = true;
      // setTimeout(() => {
      //   this.visible = false;
      //   this.loading = false;
      // }, 3000);

      this.netWorkEdit.data.name = this.AssocNetworkCheck.name;
      this.netWorkEdit.data.description = this.AssocNetworkCheck.description;
      this.netWorkEdit.data.tags = this.AssocNetworkCheck.tags;
      this.netWorkEdit.data.dscpRewriteRule = this.AssocNetworkCheck.dscpRewriteRule;
      this.netWorkEdit.data.dscp6RewriteRule = this.AssocNetworkCheck.dscp6RewriteRule;
      this.netWorkEdit.data.mode = this.AssocNetworkCheck.mode;
      this.netWorkEdit.deviceName = this.deviceName;
      this.netWorkEdit.orgName = this.organization;
      const res = await AssInterfaceEdit(this.netWorkEdit);
      console.log(res);
      if (res.message === 'success') {
        this.visible = false;
        this.$message.success('编辑成功');
        this.$parent.tableForm();
      }
    },
    handleCancel() {
      this.visible = false;
    },
    // tags
    // handleChange(value) {
    //   console.log(`selected ${value}`);
    //   console.log(value);
    //   this.form.tags = value;
    //   console.log(this.form.tags);
    // },
    //下拉框Scheduler Map
    async SchedulerSelect() {
      const res = await AssInterfaceSchedulerMap();
      console.log(res);
    },

    //下拉框DSCPRewriteRule
    async Rewrite() {
      const res = await AssInterfaceDSCPRewriteRule();
      console.log(res.result);
      this.RewriteSelect = res.result;
    },
    //下拉框DSCP6RewriteRule
    async RewriteRule() {
      const res = await AssInterfaceDSCPRewriteRuleSelect();
      console.log(res.result);
      this.RewriteRuleSelect = res.result;
    },
    //下拉框802.1pRewriteRule
    async eightRewriteRule() {
      const res = await DSCPRewriteRule();
      console.log(res.result);
      this.eightRewriteRuleSelect = res.result;
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
  /deep/.ant-radio-disabled + span {
    color: #fff;
  }
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
</style>
