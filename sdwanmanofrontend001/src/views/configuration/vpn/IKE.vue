<template>
  <div>
    <a-form-model layout="vertical" :model="ike">
      <a-row type="flex" justify="start" align="top">
        <a-col>
          <a-form-model-item :label="$t('VPNIKEVersion')">
            <a-select
              v-model="ike.version"
              size="small"
              style="width:200px;"
              @change="changeVersion"
            >
              <a-select-option
                :value="item.value"
                v-for="(item, index) in versionOptions"
                :key="index"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item :label="$t('VPNIKETime')">
            <a-select size="small" style="width:200px;" default-value="seconds">
              <a-select-option
                :value="item.value"
                v-for="(item, index) in rekeyTimeOptions"
                :key="index"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col>
          <a-form-model-item :label="$t('VPNIKEAuth')">
            <a-input
              size="small"
              v-model="ike.authDimain"
              style="width:200px;"
            />
          </a-form-model-item>
          <a-form-model-item label=" ">
            <br />
            <a-input
              size="small"
              v-model="ike.lifetime"
              :placeholder="placeholders.lifetime"
              style="width:200px;"
              @blur="validIkeData"
            />
          </a-form-model-item>
        </a-col>
        <a-col>
          <a-form-model-item :label="$t('VPNIKETimeout')">
            <a-input
              size="small"
              v-model="ike.dpdTimeout"
              style="width:200px;"
              :placeholder="placeholders.dpdTimeout"
              @blur="validIkeData"
            />
          </a-form-model-item>
         <!--  <a-form-model-item :label="$t('VPNIKEBackCheck')">
            <a-select
              v-model="ike.revocationCheck"
              size="small"
              style="width:200px;"
            >
              <a-select-option
                :value="item.value"
                v-for="(item, index) in backCheckOptions"
                :key="index"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item> -->
        </a-col>
        <a-col v-show="showMode">
          <a-form-model-item :label="$t('VPNIKEModel')">
            <a-select
              v-model="ike.mode"
              placeholder="--Select--"
              size="small"
              style="width:200px;"
            >
              <a-select-option
                :value="item.value"
                v-for="(item, index) in modelOptions"
                :key="index"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <a-tabs default-active-key="1" @change="changeATabs">
      <a-tab-pane key="1" :tab="$t('VPNIKEChangeAndGroup')">
        <a-form-model layout="vertical" :model="ike">
          <a-row type="flex" justify="start" align="middle">
            <a-col>
              <a-radio-group
                v-model="cVPNProfile.tempIkeNewOrOld"
                :options="newOrOldOptions"
                @change="changeRadio"
              />
            </a-col>
          </a-row>
          <a-row
            type="flex"
            justify="start"
            align="top"
            v-if="cVPNProfile.tempIkeNewOrOld == 'New'"
          >
            <a-col>
              <v-table
                is-horizontal-resize
                :columns="hashColumns"
                :table-data="hashList"
                :select-all="selectALLHash"
                :select-change="selectChangeHash"
                :height="80"
                style="width:290px;"
                isFrozen="true"
                :title-click="hashTitleClick"
                :cell-merge="hashCellMerge"
                @on-custom-comp="customFunc"
              ></v-table>
            </a-col>
            <a-col>
              <v-table
                is-horizontal-resize
                :columns="entryColumns"
                :table-data="encryList"
                :select-all="selectALLEntry"
                :select-change="selectChangeEntry"
                :height="80"
                style="width:290px;"
                isFrozen="true"
                :title-click="entryTitleClick"
                :cell-merge="entryCellMerge"
                @on-custom-comp="customFunc"
              ></v-table>
            </a-col>
            <a-col>
              <v-table
                is-horizontal-resize
                :columns="dhColumns"
                :table-data="dhList"
                :select-all="selectALLDH"
                :select-change="selectChangeDH"
                :height="80"
                style="width:290px;"
                isFrozen="true"
                :title-click="dhTitleClick"
                :cell-merge="dhCellMerge"
                @on-custom-comp="customFunc"
              ></v-table>
            </a-col>
          </a-row>
          <a-row
            type="flex"
            justify="start"
            align="middle"
            v-if="cVPNProfile.tempIkeNewOrOld == 'Old'"
          >
            <a-col>
              <a-form-model-item :label="$t('VPNIKEChange')">
                <a-select
                  v-model="ike.transform"
                  style="width:320px"
                  size="small"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in changeOptions"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item :label="$t('VPNIKEDHGroup')">
                <a-select v-model="ike.group" style="width:320px" size="small">
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in dhOptions"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('VPNIKELocalValid')" force-render>
        <a-form-model
          layout="vertical"
          :model="localAuthInfo"
          :rules="localRules"
          ref="localAuthRef"
        >
          <a-row type="flex" justify="start" align="top">
            <a-col>
              <a-form-model-item :label="$t('VPNIKEAuthType')" prop="authType">
                <a-select
                  v-model="localAuthInfo.authType"
                  style="width:200px"
                  size="small"
                  @change="changeLocalAuthType"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in authTypeOptions"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item
                :label="$t('VPNIKECertName')"
                prop="certName"
                v-show="showCert"
              >
                <a-select
                  v-model="localAuthInfo.certName"
                  placeholder="--Select--"
                  size="small"
                  style="width:200px"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in certNameOptions"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item
                :label="$t('VPNIKEPass')"
                prop="key"
                v-show="showPsk"
              >
                <a-input
                  size="small"
                  v-model="localAuthInfo.key"
                  style="width:200px;"
                />
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item
                :label="$t('VPNIKECA')"
                prop="caChain"
                v-show="showCert"
              >
                <a-select
                  v-model="localAuthInfo.caChain"
                  placeholder="--Select--"
                  size="small"
                  style="width:200px"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in localCAOptions"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item
                :label="$t('VPNIKEIdType')"
                prop="idType"
                v-show="showPsk"
              >
                <a-select
                  v-model="localAuthInfo.idType"
                  size="small"
                  style="width:200px"
                  @change="changeLocalIdType"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in idTypeOptions"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item
                :label="$t('VPNIKECertArea')"
                v-show="showCert"
              >
                <a-select
                  v-model="localAuthInfo.certDomain"
                  placeholder="--Select--"
                  size="small"
                  style="width:200px"
                  @change="changeCertArea"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in certAreaOptions"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item
                :label="$t('VPNIKEId')"
                prop="idString"
                v-show="showPsk"
              >
                <a-input
                  size="small"
                  v-model="localAuthInfo.idString"
                  style="width:200px;"
                  :placeholder="placeholders.localIdString"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="start" align="top" v-show="showTenant">
            <a-col>
              <a-form-model-item :label="$t('VPNIKEProviderTenant')">
                <a-select
                  v-model="localAuthInfo.tenant"
                  placeholder="--Select--"
                  size="small"
                  style="width:200px"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in tenantOptions"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-tab-pane>
      <a-tab-pane
        key="3"
        :tab="$t('VPNIKEPeerIdValid')"
        force-render
        class="peerAuthInfo"
      >
        <a-form-model
          layout="vertical"
          :model="peerAuthInfo"
          :rules="peerRules"
          ref="peerAuthRef"
        >
          <a-row
            type="flex"
            justify="start"
            align="top"
            v-show="!showCertAuthTable"
          >
            <a-col>
              <a-form-model-item :label="$t('VPNIKEAuthType')" prop="authType">
                <a-select
                  v-model="peerAuthInfo.authType"
                  style="width:200px"
                  size="small"
                  @change="changePeerAuthType"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in authTypeOptions"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item
                :label="$t('VPNIKECA')"
                prop="caChain"
                v-show="showPeerCert"
              >
                <a-select
                  v-model="peerAuthInfo.caChain"
                  placeholder="--Select--"
                  size="small"
                  style="width:200px"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in peerCAOptions"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item
                :label="$t('VPNIKEPass')"
                prop="key"
                v-show="showPeerPsk"
              >
                <a-input
                  size="small"
                  v-model="peerAuthInfo.key"
                  style="width:200px;"
                />
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item
                :label="$t('VPNIKEIdType')"
                prop="idType"
                v-show="showPeerPsk"
              >
                <a-select
                  v-model="peerAuthInfo.idType"
                  size="small"
                  style="width:200px"
                  @change="changePeerIdType"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in idTypeOptions"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item
                :label="$t('VPNIKEId')"
                prop="idString"
                v-show="showPeerPsk"
              >
                <a-input
                  size="small"
                  v-model="peerAuthInfo.idString"
                  style="width:200px;"
                  :placeholder="placeholders.peerIdString"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row
            type="flex"
            justify="start"
            align="top"
            v-show="showCertAuthTable"
          >
            <a-col>
              <a-form-model-item :label="$t('VPNIKEAuthType')" prop="authType">
                <a-select
                  v-model="peerAuthInfo.authType"
                  placeholder="--Select--"
                  style="width:200px"
                  size="small"
                  @change="changeConPeerAuthType"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in authTypeOptions"
                    :key="index"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row v-show="showCertAuthTable && showConCert">
            <a-col>
              <v-table
                is-horizontal-resize
                column-width-drag
                :columns="certAuthColumns"
                :table-data="certAuthList"
                :height="150"
                style="width:800px"
                @on-custom-comp="customFunc"
              ></v-table>
            </a-col>
          </a-row>
          <!-- </div> -->
          <a-row v-show="showCertAuthTable && showConPsk">
            <a-col>
              <v-table
                is-horizontal-resize
                column-width-drag
                :columns="pskColumns"
                :table-data="pskList"
                :height="150"
                style="width:800px"
                isFrozen="true"
                @on-custom-comp="customFunc"
              ></v-table>
            </a-col>
          </a-row>
        </a-form-model>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import Vue from 'vue';
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'IKE',
  props: ['vpnProfile', 'conSDWAN'],
  data() {
    return {
      cVPNProfile: {
        tempIkeNewOrOld: 'Old'
      },
      ike: {
        version: 'v2',
        mode: '',
        group: '',
        transform: '',
        authDimain: '',
        dpdTimeout: '30',
        lifetime: '28800',
        hashAlgorithms: [],
        encryptionAlgorithms: [],
        groups: []
      },
      placeholders: {
        dpdTimeout: '10-180',
        lifetime: '132-28800',
        localIdString: '',
        peerIdString: ''
      },
      localAuthInfo: {},
      peerAuthInfo: {},
      versionOptions: [
        {
          label: this.$t('SelectNull'),
          value: ''
        },
        {
          label: 'v1',
          value: 'v1'
        },
        {
          label: 'v2',
          value: 'v2'
        },
        {
          label: 'v2-or-v1',
          value: 'v2-or-v1'
        }
      ],
      showMode: false,
      rekeyTimeOptions: [
        {
          label: 'Hours',
          value: 'hours'
        },
        {
          label: 'Minutes',
          value: 'minutes'
        },
        {
          label: 'Seconds',
          value: 'seconds'
        }
      ],
      backCheckOptions: [
        {
          label: this.$t('SelectNull'),
          value: ''
        },
        {
          label: this.$t('VPNIKEBackCheckNull'),
          value: 'none'
        },
        {
          label: 'OCSP',
          value: 'ocsp'
        }
      ],
      modelOptions: [
        {
          label: this.$t('SelectNull'),
          value: ''
        },
        {
          label: 'Aggressive',
          value: 'aggressive'
        },
        {
          label: 'Main',
          value: 'main'
        }
      ],
      newOrOldOptions: [
        {
          label: this.$t('VPNIKENew'),
          value: 'New'
        },
        {
          label: this.$t('VPNIKEOld'),
          value: 'Old'
        }
      ],
      selection: {
        field: 'custom',
        width: 30,
        columnAlign: 'center',
        titleAlign: 'center',
        type: 'selection'
      },
      plus: {
        field: 'plus',
        title: `<span><button class="plus" style="width:30px">+</button></span>`,
        width: 20,
        columnAlign: 'left',
        titleCellClassName: 'no-border',
        isResize: true
      },
      minus: {
        field: 'minus',
        title: `<span><button class="minus" style="width:30px">-</button></span>`,
        width: 20,
        columnAlign: 'left',
        isResize: true
      },
      hashList: [{}],
      encryList: [{}],
      dhList: [{}],
      delHashList: [],
      deleEncryList: [],
      delDHList: [],
      changeOptions: [
        { label: '3des-md5' },
        { label: '3des-sha1' },
        { label: 'aes128-sha1' },
        { label: 'aes128-md5' },
        { label: 'aes256-sha1' },
        { label: 'aes256-md5' },
        { label: 'aes128-sha256' },
        { label: 'aes256-sha256' },
        { label: 'aes128-sha384' },
        { label: 'aes256-sha384' },
        { label: 'aes128-sha512' },
        { label: 'aes256-sha512' }
      ],
      dhOptions: [
        {
          label: 'No PFS',
          value: 'mod-none'
        },
        {
          label: 'Diffie-Hellman Group 1 - 768-bit modulus',
          value: 'mod1'
        },
        {
          label: 'Diffie-Hellman Group 2 – 1024-bit modulus',
          value: 'mod2'
        },
        {
          label: 'Diffie-Hellman Group 5 - 1536-bit modulus',
          value: 'mod5'
        },
        {
          label: 'Diffie-Hellman Group 14 – 2048 bit modulus',
          value: 'mod14'
        },
        {
          label: 'Diffie-Hellman Group 15 – 3072 bit modulus',
          value: 'mod15'
        },
        {
          label: 'Diffie-Hellman Group 16 – 4096 bit modulus',
          value: 'mod16'
        },
        {
          label: 'Diffie-Hellman Group 19 – 256 bit elliptic curve',
          value: 'mod19'
        },
        {
          label: 'Diffie-Hellman Group 20 – 384 bit elliptic curve',
          value: 'mod20'
        },
        {
          label: 'Diffie-Hellman Group 21– 251 bit elliptic curve',
          value: 'mod21'
        },
        {
          label: 'Diffie-Hellman Group 25– 192 bit elliptic curve',
          value: 'mod25'
        },
        {
          label: 'Diffie-Hellman Group 26– 224 bit elliptic curve',
          value: 'mod26'
        }
      ],
      authTypeOptions: [
        /* {
          label: this.$t('VPNIKECert'),
          value: 'certificate'
        }, */
        {
          label: 'psk',
          value: 'psk'
        }
      ],
      certNameOptions: [{ label: '', value: '' }],
      localCAOptions: [{ label: '', value: '' }],
      peerCAOptions: [{ label: '', value: '' }],
      showCert: false,
      showPsk: true,
      certAreaOptions: [
        {
          label: this.$t('SelectNull'),
          value: ''
        },
        {
          label: this.$t('VPNIKESystem'),
          value: 'system'
        },
        {
          label: this.$t('VPNIKETenant'),
          value: 'tenant'
        }
      ],
      showTenant: false,
      idTypeOptions: [
        {
          label: this.$t('VPNIKEEmail'),
          value: 'email'
        },
        {
          label: 'FQDN',
          value: 'fqdn'
        },
        {
          label: 'IP',
          value: 'ip'
        }
      ],
      showPeerCert: false,
      showPeerPsk: true,
      tenantOptions: [
        {
          label: '',
          value: ''
        }
      ],
      certAuthColumns: [
        {
          field: 'idTypeSelect',
          title: `<span>${this.$t(
            'VPNIKEIdType'
          )}<label style="color:red">*</label></span>`,
          width: 350,
          columnAlign: 'left',
          isResize: true,
          componentName: 'idtype-opration'
        },
        {
          field: 'idStringInput',
          title: `<span>${this.$t(
            'VPNIKEId'
          )}<label style="color:red">*</label></span>`,
          width: 350,
          columnAlign: 'left',
          isResize: true,
          componentName: 'id-opration'
        },
        {
          field: 'operation',
          title: '',
          width: 100,
          columnAlign: 'left',
          isResize: true,
          componentName: 'certoper-opration'
        }
      ],
      certAuthList: [{ type: 'certificate' }],
      pskColumns: [
        {
          field: 'idTypeSelect',
          title: `<span>${this.$t(
            'VPNIKEIdType'
          )}<label style="color:red">*</label></span>`,
          width: 250,
          columnAlign: 'left',
          isResize: true,
          componentName: 'idtype-opration'
        },
        {
          field: 'idStringInput',
          title: `<span>${this.$t(
            'VPNIKEId'
          )}<label style="color:red">*</label></span>`,
          width: 200,
          columnAlign: 'left',
          isResize: true,
          componentName: 'id-opration'
        },
        {
          field: 'keyInput',
          title: `<span>Key<label style="color:red">*</label></span>`,
          width: 250,
          columnAlign: 'left',
          isResize: true,
          componentName: 'key-opration'
        },
        {
          field: 'operation',
          title: '',
          width: 100,
          columnAlign: 'left',
          isResize: true,
          componentName: 'pskoper-opration'
        }
      ],
      pskList: [{ type: 'psk' }],
      localRules: {
        authType: [
          {
            required: true,
            message: `${this.$t('VPNIKEAuthType')} is required`,
            trigger: 'blur'
          }
        ],
        /* certName: [
          {
            required: true,
            message: `${this.$t('VPNIKECertName')} is required`,
            trigger: 'blur'
          }
        ],
        caChain: [
          {
            required: true,
            message: `${this.$t('VPNIKECA')} is required`,
            trigger: 'blur'
          }
        ], */
        key: [
          {
            required: true,
            message: `${this.$t('VPNIKEPass')} is required`,
            trigger: 'blur'
          }
        ],
        idType: [
          {
            required: true,
            message: `${this.$t('VPNIKEIdType')} is required`,
            trigger: 'blur'
          }
        ],
        idString: [
          {
            required: true,
            message: `${this.$t('VPNIKEId')} is required`,
            trigger: 'blur'
          }
        ]
      },
      peerRules: {
        authType: [
          {
            required: true,
            message: `${this.$t('VPNIKEAuthType')} is required`,
            trigger: 'blur'
          }
        ],
        /* ca: [
          {
            required: true,
            message: `${this.$t('VPNIKECA')} is required`,
            trigger: 'blur'
          }
        ],
        caChain: [
          {
            required: true,
            message: `${this.$t('VPNIKECA')} is required`,
            trigger: 'blur'
          }
        ],*/
        key: [
          {
            required: true,
            message: `${this.$t('VPNIKEPass')} is required`,
            trigger: 'blur'
          }
        ],
        idType: [
          {
            required: true,
            message: `${this.$t('VPNIKEIdType')} is required`,
            trigger: 'blur'
          }
        ],
        idString: [
          {
            required: true,
            message: `${this.$t('VPNIKEId')} is required`,
            trigger: 'blur'
          }
        ]
      },
      showConPsk: false,
      showConCert: false
    };
  },
  computed: {
    hashColumns() {
      let column = {
        field: 't-hash',
        title: this.$t('VPNIKEHash'),
        width: 140,
        columnAlign: 'left',
        isResize: true,
        componentName: 'peerfqdn-opration'
      };
      return [this.selection, column, this.plus, this.minus];
    },
    entryColumns() {
      let column = {
        field: 't-encry',
        title: this.$t('VPNIKEEntry'),
        width: 140,
        columnAlign: 'left',
        isResize: true,
        componentName: 'peerfqdn-opration'
      };
      return [this.selection, column, this.plus, this.minus];
    },
    dhColumns() {
      let column = {
        field: 't-dh',
        title: this.$t('VPNIKEDHGroup'),
        width: 140,
        columnAlign: 'left',
        isResize: true,
        componentName: 'peerfqdn-opration'
      };
      return [this.selection, column, this.plus, this.minus];
    },
    showCertAuthTable() {
      return this.conSDWAN;
    }
  },
  mounted() {
    console.log('ike mounted...',this.vpnProfile);
    this.localAuthInfo = this.vpnProfile.localAuthInfo
      ? this.vpnProfile.localAuthInfo
      : {
          authType: 'psk',
          idType: 'fqdn',
          key: '',
          idString: '',
          caChain: '',
          certDomain: '',
          certName: ''
        };
    this.peerAuthInfo = this.vpnProfile.peerAuthInfo
      ? this.vpnProfile.peerAuthInfo
      : {
          authType: 'psk',
          idType: 'email',
          idString: '',
          key: '',
          caChain: ''
        };

    if (this.vpnProfile.ike) {
      this.ike = this.vpnProfile.ike;
      this.hashList = [];
      this.encryList = [];
      this.dhList = [];
      this.ike.hashAlgorithms && this.ike.hashAlgorithms.forEach(hash => {
        let row = { hash };
        this.hashList.push(row);
      });
      this.ike.encryptionAlgorithms && this.ike.encryptionAlgorithms.forEach(encry => {
        let row = { encry };
        this.encryList.push(row);
      });
      this.ike.groups && this.ike.groups.forEach(dh => {
        let row = { dh };
        this.dhList.push(row);
      });
    }
    this.vpnTableSelectsAll({ key: 'vpnIKEHash' });
    this.vpnTableSelectsAll({ key: 'vpnIKEEntry' });
    this.vpnTableSelectsAll({ key: 'vpnIKEDH' });
    this.cVPNProfile.localAuthInfo = this.localAuthInfo;
    this.cVPNProfile.peerAuthInfo = this.peerAuthInfo;
    this.cVPNProfile.ike = this.ike;
    this.changePeerIdType(this.peerAuthInfo.idType);
    this.$emit('passChildContent', this.cVPNProfile);
  },
  updated() {
    this.cVPNProfile.localAuthInfo = this.localAuthInfo;
    this.cVPNProfile.peerAuthInfo = this.peerAuthInfo;
    this.cVPNProfile.ike = this.ike;
    this.$emit('passChildContent', this.cVPNProfile);
  },
  methods: {
    ...mapMutations([
      'vpnTableSelectsPlus',
      'vpnTableSelectsMinus',
      'vpnTableSelectsAll'
    ]),
    changeRadio(e) {
      if (e.target.value === 'New') {
        this.ike.transform = '';
        this.ike.group = '';
      } else {
        this.ike.hashAlgorithms = [];
        this.ike.encryptionAlgorithms = [];
        this.ike.groups = [];
        this.ike.transform = 'aes128-sha1';
        this.ike.group = 'mod2';
      }
    },
    changeLocalIdType(value) {
      if (value === 'email') {
        this.placeholders.localIdString = this.$t('IKE_IDTYPE_EMAIL');
      } else {
        this.placeholders.localIdString = '';
      }
    },
    changePeerIdType(value) {
      console.log('changePeerIdType', value);
      if (value === 'email') {
        this.placeholders.peerIdString = this.$t('IKE_IDTYPE_EMAIL');
      } else {
        this.placeholders.peerIdString = '';
      }
    },
    validIkeData() {
      let lifetime = Number(this.ike.lifetime) || 132;
      let dpdTimeout = Number(this.ike.dpdTimeout) || 10;
      if (lifetime && isNaN(lifetime)) {
        this.$message.error(this.$t('IKE_ERROR'));
        return false;
      } else if (dpdTimeout && isNaN(dpdTimeout)) {
        this.$message.error(this.$t('IKE_ERROR'));
        return false;
      } else {
        if (lifetime < 132 || lifetime > 28800) {
          this.$message.error(this.$t('IKE_ERROR'));
          return false;
        }
        if (dpdTimeout < 10 || dpdTimeout > 180) {
          this.$message.error(this.$t('IKE_ERROR'));
          return false;
        }
      }
    },
    changeVersion(value) {
      if (value === 'v1' || value === 'v2-or-v1') {
        this.showMode = true;
      } else {
        this.showMode = false;
      }
    },
    changeATabs(value) {
      console.log('changeATabs ', value);
      if (value === 3) {
        console.log(value);
      }
    },
    hashTitleClick(title) {
      if (/class="plus"/.test(title)) {
        this.hashList.push({});
      } else if (/class="minus"/.test(title)) {
        // 删除选中的
        if (this.delHashList.length) {
          this.hashList = this.hashList.filter(item => {
            let filter = true;
            for (let i = 0; i < this.delHashList.length; i++) {
              if (item['hash'] === this.delHashList[i]) {
                this.vpnTableSelectsPlus({
                  key: 'vpnIKEHash',
                  label: item['hash']
                });
                filter = false;
                break;
              }
            }
            return filter;
          });
        } else {
          this.$message.info('请至少选中一条记录！');
        }
        this.delHashList = [];
      }
    },
    hashCellMerge(rowIndex, rowData, field) {
      if (field === 't-hash') {
        return {
          colSpan: 3,
          rowSpan: 1,
          content: '',
          componentName: 'ikehash-opration'
        };
      }
    },
    entryTitleClick(title) {
      if (/class="plus"/.test(title)) {
        this.encryList.push({});
      } else if (/class="minus"/.test(title)) {
        // 删除选中的
        if (this.deleEncryList.length) {
          this.encryList = this.encryList.filter(item => {
            let filter = true;
            for (let i = 0; i < this.deleEncryList.length; i++) {
              if (item['encry'] === this.deleEncryList[i]) {
                this.vpnTableSelectsPlus({
                  key: 'vpnIKEEntry',
                  label: item['encry']
                });
                filter = false;
                break;
              }
            }
            return filter;
          });
        } else {
          this.$message.info('请至少选中一条记录！');
        }
        this.deleEncryList = [];
      }
    },
    entryCellMerge(rowIndex, rowData, field) {
      if (field === 't-encry') {
        return {
          colSpan: 3,
          rowSpan: 1,
          content: '',
          componentName: 'ikeencry-opration'
        };
      }
    },
    dhTitleClick(title) {
      if (/class="plus"/.test(title)) {
        this.dhList.push({});
      } else if (/class="minus"/.test(title)) {
        // 删除选中的
        if (this.delDHList.length) {
          this.dhList = this.dhList.filter(item => {
            let filter = true;
            for (let i = 0; i < this.delDHList.length; i++) {
              if (item['dh'] === this.delDHList[i]) {
                this.vpnTableSelectsPlus({
                  key: 'vpnIKEDH',
                  label: item['dh'],
                  value: item['dh']
                });
                filter = false;
                break;
              }
            }
            return filter;
          });
        } else {
          this.$message.info('请至少选中一条记录！');
        }
        this.delDHList = [];
      }
    },
    dhCellMerge(rowIndex, rowData, field) {
      if (field === 't-dh') {
        return {
          colSpan: 3,
          rowSpan: 1,
          content: '',
          componentName: 'dh-opration'
        };
      }
    },
    selectALLHash(checkdList) {
      this.delHashList = [];
      checkdList.forEach(item => {
        this.delHashList.push(item['hash']);
      });
    },
    selectChangeHash(checked) {
      this.delHashList = [];
      checked.forEach(item => {
        this.delHashList.push(item['hash']);
      });
    },
    selectALLEntry(checkdList) {
      this.deleEncryList = [];
      checkdList.forEach(item => {
        this.deleEncryList.push(item['encry']);
      });
    },
    selectChangeEntry(checked) {
      this.deleEncryList = [];
      checked.forEach(item => {
        this.deleEncryList.push(item['encry']);
      });
    },
    selectALLDH(checkdList) {
      this.delDHList = [];
      checkdList.forEach(item => {
        this.delDHList.push(item['dh']);
      });
    },
    selectChangeDH(checked) {
      this.delDHList = [];
      checked.forEach(item => {
        this.delDHList.push(item['dh']);
      });
    },
    customFunc(params) {
      switch (params.type) {
        case 'hash':
          this.hashList[params.index]['hash'] = params.label;
          this.hashList = [...this.hashList];
          this.ike.hashAlgorithms = [];
          this.hashList.forEach(obj => {
            this.ike.hashAlgorithms.push(obj.hash);
          });
          this.vpnTableSelectsMinus({ key: 'vpnIKEHash', label: params.label });
          break;
        case 'encry':
          this.encryList[params.index]['encry'] = params.label;
          this.encryList = [...this.encryList];
          this.ike.encryptionAlgorithms = [];
          this.encryList.forEach(obj => {
            this.ike.encryptionAlgorithms.push(obj.encry);
          });
          this.vpnTableSelectsMinus({
            key: 'vpnIKEEntry',
            label: params.label
          });
          break;
        case 'idType':
          params.rowData.type === 'certificate'
            ? (this.certAuthList[params.index]['idType'] = params.label)
            : (this.pskList[params.index]['idType'] = params.label);
          break;
        case 'idString':
          params.rowData.type === 'certificate'
            ? (this.certAuthList[params.index]['idString'] = params.label)
            : (this.pskList[params.index]['idString'] = params.label);
          console.log(params.rowData);
          break;
        case 'key':
          this.pskList[params.index]['key'] = params.label;
          break;
        case 'cert_plus':
          this.certAuthList.push({ type: 'certificate' });
          break;
        case 'psk_plus':
          this.pskList.push({ type: 'psk' });
          break;
        default:
          this.dhList[params.index]['dh'] = params.label;
          this.dhList = [...this.dhList];

          this.ike.groups = [];
          this.dhList.forEach(obj => {
            this.ike.groups.push(obj.dh);
          });
          this.vpnTableSelectsMinus({ key: 'vpnIKEDH', label: params.label, value: params.label });
          break;
      }
    },
    changeLocalAuthType(value) {
      if (value === 'certificate') {
        this.showCert = true;
        this.showPsk = false;
        this.changeCertArea(this.localAuthInfo.certDomain);
      } else {
        this.showPsk = true;
        this.showCert = false;
        this.showTenant = false;
      }
    },
    changePeerAuthType(value) {
      if (value === 'certificate') {
        this.showPeerCert = true;
        this.showPeerPsk = false;
      } else {
        this.showPeerPsk = true;
        this.showPeerCert = false;
      }
    },
    changeConPeerAuthType(value) {
      if (value === 'certificate') {
        this.showConCert = true;
        this.showConPsk = false;
      } else {
        this.showConPsk = true;
        this.showConCert = false;
      }
    },
    changeCertArea(value) {
      if (value == 'tenant') {
        this.showTenant = true;
      } else {
        this.showTenant = false;
      }
    }
  }
};
let props = {
  rowData: {
    type: Object
  },
  field: {
    type: String
  },
  index: {
    type: Number
  }
};
Vue.component('ikehash-opration', {
  template: `<span>
     <a-select
        v-if="!rowData['hash']"
        placeholder="--Select--"
        size="small"
        @change="change"
      >
        <a-select-option
          :value="item.label"
          v-for="(item, index) in vpnTableSelects.vpnIKEHash"
          v-if="!item.used"
          :key="index"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
      <label>{{ rowData['hash'] }} </label>
    </span>`,
  props,
  computed: {
    ...mapState(['vpnTableSelects'])
  },
  methods: {
    change(label) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'hash',
        index: this.index,
        rowData: this.rowData,
        label
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('ikeencry-opration', {
  template: `<span>
     <a-select
        v-if="!rowData['encry']"
        placeholder="--Select--"
        size="small"
        @change="change"
      >
        <a-select-option
          :value="item.label"
          v-for="(item, index) in vpnTableSelects.vpnIKEEntry"
          v-if="!item.used"
          :key="index"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
      <label>{{ rowData['encry'] }} </label>
    </span>`,
  props,
  computed: {
    ...mapState(['vpnTableSelects'])
  },
  methods: {
    change(label) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'encry',
        index: this.index,
        rowData: this.rowData,
        label
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('dh-opration', {
  template: `<span>
     <a-select
        v-if="!rowData['dh']"
        placeholder="--Select--"
        size="small"
        @change="change"
      >
        <a-select-option
          :value="item.value"
          v-for="(item, index) in vpnTableSelects.vpnIKEDH"
          v-if="!item.used"
          :key="index"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
      <label>{{ showValue }} </label>
    </span>`,
  props,
  computed: {
    ...mapState(['vpnTableSelects']),
    showValue() {
      for (let i = 0; i < this.vpnTableSelects.vpnIKEDH.length; i++) {
        if (this.rowData['dh'] == this.vpnTableSelects.vpnIKEDH[i].value) {
          return this.vpnTableSelects.vpnIKEDH[i].label;
        }
      }
      return '';
    }
  },
  methods: {
    change(label) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'dh',
        index: this.index,
        rowData: this.rowData,
        label
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('idtype-opration', {
  template: `<span>
     <a-select
        :default-value="rowData['idType']"
        placeholder="--Select--"
        size="small"
        @change="change"
      >
        <a-select-option
          :value="item.label"
          v-for="(item, index) in vpnTableSelects.idTypeOptions"
          v-if="!item.used"
          :key="index"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
    </span>`,
  props,
  computed: {
    ...mapState(['vpnTableSelects'])
  },
  methods: {
    change(label) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'idtype',
        index: this.index,
        rowData: this.rowData,
        label
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('id-opration', {
  template: `<span>
    <a-input
      size="small"
      v-model="rowData['idString']"
      style="width:250px;"
      @change="change"
    />
    </span>`,
  props,
  methods: {
    change(label) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'idString',
        index: this.index,
        rowData: this.rowData,
        label
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('key-opration', {
  template: `<span>
    <a-input
      size="small"
      v-model="rowData['key']"
      style="width:250px;"
      @change="change"
    />
    </span>`,
  props,
  methods: {
    change(label) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'key',
        index: this.index,
        rowData: this.rowData,
        label
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('certoper-opration', {
  template: `<span>
     <a-icon type="plus" @click="clickHandle"/>
    </span>`,
  props,
  methods: {
    clickHandle() {
      // 参数根据业务场景随意构造
      let params = {
        type: 'cert_plus',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});

Vue.component('pskoper-opration', {
  template: `<span>
     <a-icon type="plus" @click="clickHandle"/>
    </span>`,
  props,
  methods: {
    clickHandle() {
      // 参数根据业务场景随意构造
      let params = {
        type: 'psk_plus',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
</script>
<style lang="scss" scoped>
.peerAuthInfo {
  /deep/.v-table-rightview {
    width: 800px !important;
    /deep/.v-table-header {
      width: 800px !important;
    }
    /deep/.v-table-body {
      width: 800px !important;
    }
  }
}
</style>
