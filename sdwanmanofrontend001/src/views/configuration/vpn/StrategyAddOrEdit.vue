<template>
  <div>
    <a-form-model
      layout="vertical"
      :model="cStrategy"
      :rules="rules"
      ref="strategyForm"
    >
      <a-row type="flex" justify="start" align="middle">
        <a-col>
          <a-form-model-item :label="$t('VPNStrategyName')" prop="name">
            <a-input
              size="small"
              v-model="cStrategy.name"
              prop="name"
              style="width:250px;"
              :disabled="cStrategy.disabledName"
            />
          </a-form-model-item>
        </a-col>
        <a-col>
          <a-form-model-item :label="$t('VPNStrategyAgreement')">
            <a-input
              size="small"
              v-model="cStrategy.agreement"
              prop="name"
              style="width:250px;"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <div class="address-cls">
        <div class="address-icon">{{ $t('VPNStrategeSource') }}</div>
        <a-row type="flex" justify="start" align="top">
          <a-col>
            <a-form-model-item :label="$t('VPNStrategeAddress')">
              <a-select
                v-model="cStrategy.source.type"
                placeholder="please select your zone"
                size="small"
                style="width:250px;"
                @change="change"
              >
                <a-select-option
                  :value="item.value"
                  v-for="(item, index) in optionList"
                  :key="index"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item
              :label="$t('VPNStrategeFront')"
              prop="source.address"
            >
              <a-input
                size="small"
                v-model="cStrategy.source.address"
                prop="name"
                style="width:250px;"
              />
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item :label="$t('VPNStrategePort')">
              <a-input
                size="small"
                v-model="cStrategy.source.port"
                prop="name"
                style="width:250px;"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
      <div class="address-cls">
        <div class="address-icon">{{ $t('VPNStrategeDest') }}</div>
        <a-row type="flex" justify="start" align="top">
          <a-col>
            <a-form-model-item :label="$t('VPNStrategeAddress')">
              <a-select
                v-model="cStrategy.dest.type"
                placeholder="please select your zone"
                size="small"
                style="width:250px;"
                @change="change"
              >
                <a-select-option
                  :value="item.value"
                  v-for="(item, index) in optionList"
                  :key="index"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item
              :label="$t('VPNStrategeFront')"
              prop="dest.address"
            >
              <a-input
                size="small"
                v-model="cStrategy.dest.address"
                prop="name"
                style="width:250px;"
              />
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item :label="$t('VPNStrategePort')">
              <a-input
                size="small"
                v-model="cStrategy.dest.port"
                prop="name"
                style="width:250px;"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
    </a-form-model>
  </div>
</template>
<script>
export default {
  name: 'StrategyAddOrEdit',
  props: ['strategy'],
  data() {
    return {
      cStrategy: {},
      rules: {
        name: [
          { required: true, message: 'Name is required', trigger: 'blur' }
        ],
        'source.address': [
          { required: true, message: 'Name is required', trigger: 'blur' }
        ],
        'dest.address': [
          { required: true, message: 'Name is required', trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    if (this.strategy.name) {
      this.cStrategy = { ...this.strategy };
    } else {
      this.cStrategy = {
        name: '',
        agreement: '',
        source: {
          type: '',
          address: '',
          port: ''
        },
        dest: {
          type: '',
          address: '',
          port: ''
        }
      };
    }
  },
  updated() {
    this.$emit('passChildContent', this.cStrategy);
  }
};
</script>
<style lang="scss" scoped>
.address-cls {
  min-height: 78px;
  border-radius: 5px;
  border: solid 3px #456880;
  position: relative;
  padding: 10px;
  .address-icon {
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
  // 多选框换行
  /deep/.ant-checkbox-wrapper {
    display: block;
    margin-bottom: 20px;
  }
  /deep/.ant-form-vertical .ant-form-item {
    padding: 0;
    margin: 0;
  }
}
</style>