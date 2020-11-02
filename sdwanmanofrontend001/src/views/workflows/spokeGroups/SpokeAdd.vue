<template>
  <div>
    <a-form-model
      layout="inline"
      :model="formInline"
      @submit.native.prevent
      :rules="rules"
      ref="ruleForm"
    >
      <div class="title">
        <!-- 头部input框和下拉框 -->
        <a-row type="flex" justify="space-between" align="middle">
          <a-col>
            <a-form-model-item label="Name" prop="name">
              <a-input v-model="formInline.name"/>
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item label="Organization" prop="org">
              <a-select
                v-model="formInline.org"
                @change="handleChange"
                default-value="---Please select---"
              >
                <a-select-option value="---Please select---">---Please Select---</a-select-option>
                <a-select-option
                  :value="item.name"
                  v-for="(item, index) in organ"
                  :key="index"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
      <a-row type="flex">
        <a-col :flex="3">
          <!-- 左侧列表 -->
          <div class="left">
            <div class="left-top">
              <span>Routing Instances</span>
              <span>Spoke Group Type</span>
              <span></span>
            </div>
            <div class="left-bottom" v-if="isShow">
              <a-row>
                <a-col :span="8">
                  <!-- <span>cmcc_shanghai-LAN-VR</span> -->
                  <a-form-model-item>
                    <a-input v-model="formInline.vrfs[0].name" disabled/>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item>
                    <a-select
                      default-value="---Please select---"
                      style="width: 150px"
                      @change="handleChangeLeft"
                      placeholder="请选择"
                      v-model="formInline.vrfs[0].groupType"
                    >
                      <a-select-option value="---Please select---">---Please Select---</a-select-option>
                      <a-select-option value="SpokeToSpokeViaHub">SpokeToSpokeViaHub</a-select-option>
                      <a-select-option value="HubAndSpoke">HubAndSpoke</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </div>
        </a-col>
        <a-col :flex="2">
          <!-- 右侧列表 -->
          <div class="right">
            <div class="right-top">
              <span>Hubs</span>
              <span>Priority</span>
            </div>
            <div class="right-bottom" v-if="isHubs">
              <a-row v-for="(item, index) in hubs" :key="index">
                <a-col :span="12">
                  <a-form-model-item>
                    <a-input v-model="formInline.vrfs[0].hubs[index].name" disabled/>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item>
                    <a-select
                      default-value="0"
                      style="width: 120px"
                      @change="handleChangeRightPr"
                      v-model="formInline.vrfs[0].hubs[index].priority"
                      placeholder="Not Used"
                    >
                      <a-select-option value="0">Not Used</a-select-option>
                      <a-select-option value="1">1</a-select-option>
                      <a-select-option value="2">2</a-select-option>
                      <a-select-option value="3">3</a-select-option>
                      <a-select-option value="4">4</a-select-option>
                      <a-select-option value="5">5</a-select-option>
                      <a-select-option value="6">6</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>
<script>
import { devicesOrg } from 'apis/workFlows';
import { DeviceHub, routingInstances } from 'apis/spokeGroups';
export default {
  data() {
    return {
      formInline: {
        name: '',
        org: '',
        vrfs: [
          {
            name: '',
            groupType: '',
            hubs: [
              {
                name: '',
                priority: ''
              }
            ]
          }
        ]
      },
      isShow: false,
      // isReveal: false,
      //轮询组中Organization获取到的值
      organ: [],
      // hubs的值
      hubs: [],
      // 控制hubs显隐
      isHubs: false,
      // 校验
      rules: {
        name: [
          {
            required: true,
            // message: 'Please input Activity name',
            trigger: 'blur'
          }
        ],
        org: [
          {
            required: true,
            // message: 'Please select Activity zone',
            trigger: 'change'
          }
        ]
      }
    };
  },
  created() {
    this.orange();
  },
  updated() {
    this.$emit('add', this.formInline);
  },
  methods: {
    // 下拉框的方法
    handleChangeLeft(value) {
      console.log('1111', `selected ${value}`);
    },
    handleChangeRight(value) {
      console.log(`selected ${value}`);
    },
    handleChangeRightPr(value) {
      console.log(`selected ${value}`);
    },
    async handleChange(value) {
      console.log(`selected ${value}`);
      if (this.formInline.org === '---Please select---') {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
      const res = await DeviceHub(value);
      console.log(res.result.hubs);
      this.hubs = res.result.hubs;
      this.formInline.vrfs[0].hubs = res.result.hubs;
      console.log(this.hubs);

      if (this.hubs !== null && this.hubs.length > 0) {
        this.isHubs = true;
        // this.formInline.vrfs[0].hubs
      } else {
        this.isHubs = false;
      }
      const resRouting = await routingInstances(value);
      console.log(resRouting.result);
      this.formInline.vrfs[0].name = resRouting.result.vrfs[0].name;
    },
    // Organization下拉框获取值
    async orange() {
      const res = await devicesOrg();
      console.log(res.result.organizations);
      this.organ = res.result.organizations;
    },
    showX() {
      this.hubs = [];
      this.isShow = false;
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.ant-form-explain {
  display: none !important;
}
.title {
  background-color: #36536b;
  // color: #ffffff;
  .ant-input {
    width: 142px;
    height: 20px;
  }
  /deep/.ant-select-selection__rendered {
    width: 194px;
    line-height: 16px;
  }
  /deep/.ant-select-selection--single {
    height: 20px;
  }
}
/deep/.ant-form-item-label > label {
  color: #ffffff;
}
/deep/.ant-input[disabled] {
  height: 20px;
}
/deep/.ant-select-selection--single {
  height: 20px;
  line-height: 20px;
}
/deep/.ant-select-selection__rendered {
  line-height: 20px;
}

.left {
  // float: left;
  .left-top {
    margin-top: 20px;

    span {
      display: inline-block;
      width: 180px;
      height: 30px;
      line-height: 30px;
      background-color: #36536b;
      margin-left: 12px;
      color: #ffffff;
      height: 20px;
    }
  }
  .left-bottom {
    span {
      display: inline-block;
      width: 210px;
      height: 30px;
      line-height: 30px;
    }
    /deep/.ant-select-selection--single {
      width: 175px;
      margin-left: 6px;
    }
  }
}
.right {
  // float: right;
  .right-top {
    margin-top: 20px;
    span {
      display: inline-block;
      width: 200px;
      height: 30px;
      line-height: 30px;
      background-color: #36536b;
      color: #ffffff;
    }
  }
  .right-bottom {
    span {
      display: inline-block;
      width: 240px;
      height: 30px;
      line-height: 30px;
      background-color: #507691;
      text-indent: 5px;
    }
  }
}
</style>
