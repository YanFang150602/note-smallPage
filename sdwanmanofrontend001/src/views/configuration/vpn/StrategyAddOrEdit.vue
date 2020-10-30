<template>
  <div>
    <a-form-model
      layout="vertical"
      :model="cStrategy"
      :rules="rules"
      ref="strategyForm"
    >
      <a-row type="flex" justify="start" align="top">
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
            <a-select
              size="small"
              v-model="cStrategy.protocol"
              style="width:250px;"
            >
              <a-select-option
                :value="item.value"
                v-for="(item, index) in httpOptions"
                :key="index"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <div class="address-cls">
        <div class="address-icon">{{ $t('VPNStrategeSource') }}</div>
        <a-row type="flex" justify="start" align="top">
          <a-col>
            <a-form-model-item :label="$t('VPNStrategeAddress')">
              <a-select
                size="small"
                style="width:250px;"
                default-value="ipv4"
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
            <a-form-model-item :label="$t('VPNStrategeFront')" prop="src.inet">
              <a-input
                size="small"
                v-model="cStrategy.src.inet"
                placeholder="0.0.0.0/0"
                prop="name"
                style="width:250px;"
              />
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item :label="$t('VPNStrategePort')">
              <a-input
                size="small"
                v-model="cStrategy.src.port"
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
                size="small"
                style="width:250px;"
                default-value="ipv4"
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
            <a-form-model-item :label="$t('VPNStrategeFront')" prop="dst.inet">
              <a-input
                size="small"
                v-model="cStrategy.dst.inet"
                placeholder="0.0.0.0/0"
                prop="name"
                style="width:250px;"
              />
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item :label="$t('VPNStrategePort')">
              <a-input
                size="small"
                v-model="cStrategy.dst.port"
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
      cStrategy: {
        protocol: 'any'
      },
      optionList: [
        {
          label: 'IPv4',
          value: 'ipv4'
        }
      ],
      httpOptions: [
        {
          label: 'Any',
          value: 'any'
        },
        {
          label: 'UDP',
          value: 'udp'
        },
        {
          label: 'ICMP',
          value: 'icmp'
        },
        {
          label: 'TCP',
          value: 'tcp'
        }
      ],
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
        protocol: '',
        src: {
          inet: '',
          port: ''
        },
        dst: {
          inet: '',
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
