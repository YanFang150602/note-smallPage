<template>
  <div>
    <div class="switchover">
      <div
        v-for="tab in tabs"
        :key="tab.refObj"
        :ref="tab.refObj"
        :style="tab.style"
        class="tab-common-cls"
        @click="tabClick(tab.refObj)"
      >
        {{ tab.title }}
      </div>
      <div v-show="showTabObj.firstTabRef" class="tabpan-common-cls">
        <a-form-model
          layout="vertical"
          :model="cVPNProfile"
          :rules="rules"
          ref="normalRef"
        >
          <a-form-model-item :label="$t('VPNConfigFileName')" prop="name">
            <a-input
              size="small"
              v-model="cVPNProfile.name"
              prop="name"
              style="width:250px;"
              :disabled="cVPNProfile.tempDisabledName"
            />
          </a-form-model-item>
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="一般">
              <a-row type="flex" justify="start" align="top">
                <a-col>
                  <a-form-model-item :label="$t('VPNType')" prop="vpnType">
                    <a-select
                      v-model="cVPNProfile.vpnType"
                      style="width:250px;"
                      size="small"
                      placeholder="--Select--"
                      :default-value="cVPNProfile.vpnType"
                      @change="changeVPNType"
                    >
                      <a-select-option
                        :value="item.value"
                        v-for="(item, index) in vpnTypeOptions"
                        :key="index"
                      >
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item :label="$t('VPNTunnelStart')">
                    <a-select
                      v-model="cVPNProfile.tunnelInitiate"
                      style="width:250px;"
                      size="small"
                      :disabled="disableTunnerStart"
                    >
                      <a-select-option
                        :value="item.value"
                        v-for="(item, index) in tunnelOptions"
                        :key="index"
                      >
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item v-show="showRemoteServer">
                    <a-input
                      v-model="cVPNProfile.tunnelInitiate"
                      style="width:250px;"
                      size="small"
                    />
                  </a-form-model-item>
                  <a-form-model-item v-show="showRemoteServer">
                    <a-checkbox @change="changeCheckBox"></a-checkbox>
                  </a-form-model-item>
                </a-col>
                <a-col>
                  <!-- alarm -->
                  <div class="box-cls" style="width:250px;height: 190px;">
                    <div class="box-icon">Alarms</div>
                    <a-row type="flex" justify="start" align="top">
                      <a-checkbox-group
                        v-model="cVPNProfile.tempAlarms"
                        :options="alarmOptions"
                        @change="changeAlarms"
                      />
                    </a-row>
                  </div>
                </a-col>
                <a-col>
                  <a-form-model-item :label="$t('VPNHardwareAccelerator')">
                    <a-select
                      v-model="cVPNProfile.hardwareAccelerator"
                      style="width:250px;"
                      size="small"
                    >
                      <a-select-option
                        :value="item.value"
                        v-for="(item, index) in hardwareOptions"
                        :key="index"
                      >
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item
                    :label="$t('VPNRouteInstance')"
                    prop="routingInstance"
                  >
                    <a-select
                      v-model="cVPNProfile.routingInstance"
                      style="width:250px;"
                      size="small"
                      @change="changeRouteIns"
                    >
                      <a-select-option
                        v-for="(item, index) in routeOptions"
                        :value="item.value"
                        :key="index"
                      >
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item :label="$t('VPNBranchSDWANCF')">
                    <a-select
                      v-model="cVPNProfile.branchSdwanProfile"
                      style="width:250px;"
                      size="small"
                      :disabled="disableBRSDWAN"
                    >
                      <a-select-option
                        :value="item.value"
                        v-for="(item, index) in brSDWCfgFileOptions"
                        :key="index"
                      >
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <div class="box-cls">
                <div class="box-icon">Peer</div>
                <a-row type="flex" justify="start" align="top">
                  <a-col>
                    <a-form-model-item>
                      <a-radio-group
                        v-model="peerFQDNChecked"
                        :disabled="disablePeerFQDNRadio"
                        :options="peerOptions[0]"
                        @change="changeRadio"
                      />
                    </a-form-model-item>
                    <a-form-model-item>
                      <v-table
                        is-horizontal-resize
                        :columns="fqdnColumns"
                        :table-data="peerFQDNList"
                        :select-all="selectALLFQDN"
                        :select-change="selectChangeFQDN"
                        :height="80"
                        style="width:250px;"
                        isFrozen="true"
                        :title-click="peerFQDNTitleClick"
                        :cell-merge="peerFQDNCellMerge"
                        @on-custom-comp="customFQDNFunc"
                      ></v-table>
                    </a-form-model-item>
                  </a-col>
                  <a-col>
                    <a-form-model-item>
                      <a-radio-group
                        v-model="peerIPChecked"
                        :disabled="disablePeerIPRadio"
                        :options="peerOptions[1]"
                        @change="changeRadio"
                      />
                    </a-form-model-item>
                    <a-form-model-item>
                      <v-table
                        is-horizontal-resize
                        column-width-drag
                        :columns="ipColumns"
                        :table-data="peerIPList"
                        :select-all="selectALLIP"
                        :select-change="selectChangeIP"
                        :height="80"
                        style="width:250px;"
                        isFrozen="true"
                        :title-click="peerIPTitleClick"
                        :cell-merge="peerIPCellMerge"
                        @on-custom-comp="customIPFunc"
                      ></v-table>
                    </a-form-model-item>
                  </a-col>
                  <a-col>
                    <a-form-model-item>
                      <a-radio-group
                        v-model="peerHostChecked"
                        :disabled="disablePeerHostsRadio"
                        :options="peerOptions[2]"
                        @change="changeRadio"
                      />
                    </a-form-model-item>
                    <a-form-model-item>
                      <a-input
                        size="small"
                        v-model="cVPNProfile.peer.hostname"
                        style="width:250px;"
                        :disabled="disablePeerHost"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </div>
              <br />
              <div class="box-cls">
                <div class="box-icon">Local</div>
                <a-row type="flex" justify="start" align="top">
                  <a-col>
                    <a-form-model-item>
                      <a-radio-group
                        v-model="localIP"
                        :options="localOptions[0]"
                        @change="changeRadio"
                      />
                    </a-form-model-item>
                    <a-form-model-item>
                      <a-input
                        size="small"
                        v-model="cVPNProfile.local.address"
                        style="width:250px;"
                        :disabled="disableLocalIP"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col>
                    <a-form-model-item>
                      <a-radio-group
                        v-model="localInterface"
                        :options="localOptions[1]"
                        @change="changeRadio"
                      />
                    </a-form-model-item>
                    <a-form-model-item>
                      <a-select
                        size="small"
                        v-model="cVPNProfile.local.interfaceName"
                        style="width:250px;"
                        :disabled="disableLocalInterface"
                      >
                        <a-select-option
                          v-for="(item, index) in localInterfaceOptions"
                          :value="item.value"
                          :key="index"
                        >
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col>
                    <a-form-model-item>
                      <a-radio-group
                        v-model="localHost"
                        :options="localOptions[2]"
                        @change="changeRadio"
                      />
                    </a-form-model-item>
                    <a-form-model-item>
                      <a-input
                        size="small"
                        v-model="cVPNProfile.local.hostname"
                        style="width:250px;"
                        :disabled="disableLocalHost"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </div>
              <div style="padding-top:10px;">
                <a-row type="flex" justify="start" align="top">
                  <a-col :span="8">
                    <a-form-model-item>
                      <a-radio-group
                        v-model="baseOptionVal"
                        :options="baseOptions"
                        @change="changeRadio"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row
                  type="flex"
                  justify="start"
                  align="top"
                  v-show="showBaseRoute"
                >
                  <a-col>
                    <a-form-model-item :label="$t('VPNTunnelRoutingInstance')">
                      <a-select
                        v-model="cVPNProfile.tunnelRoutingInstance"
                        style="width:250px;"
                        size="small"
                        @change="changeTunnelRouteIns"
                      >
                        <a-select-option
                          v-for="(item, index) in tunnelRouteInsOptions"
                          :value="item.value"
                          :key="index"
                        >
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col>
                    <a-form-model-item :label="$t('VPNTunnelInterface')" prop="tunnelInterface" :required="tunnelInfcIsRequired">
                      <a-select
                        v-model="cVPNProfile.tunnelInterface"
                        style="width:250px;"
                        size="small"
                      >
                        <a-select-option
                          v-for="(item, index) in tunnelInterfaceOptions"
                          :value="item.value"
                          :key="index"
                        >
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row
                  type="flex"
                  justify="start"
                  align="top"
                  v-show="showBaseStrategy"
                >
                  <a-col v-show="showP2PStrategy">
                    <a-form-model-item :label="$t('VPNTunnelRoutingInstance')">
                      <a-select
                        v-model="cVPNProfile.tunnelRoutingInstance"
                        style="width:250px;"
                        size="small"
                      >
                        <a-select-option
                          :value="item.value"
                          v-for="(item, index) in tunnelRouteInsOptions"
                          :key="index"
                        >
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col>
                    <a-form-model-item :label="$t('VPNBasePriority')">
                      <a-input
                        size="small"
                        v-model="cVPNProfile.precedence"
                        style="width:250px;"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row
                  type="flex"
                  justify="start"
                  align="middle"
                  v-show="showBaseStrategy"
                >
                  <a-col :span="24">
                    <a-form-model-item :label="$t('VPNBaseStrategyCfg')">
                      <a-row type="flex" justify="end" align="middle">
                        <!--表格功能按钮-->
                        <a-col>
                          <a-row
                            :style="{ width: '425px' }"
                            type="flex"
                            justify="end"
                            align="middle"
                          >
                            <a-col
                              :style="{
                                fontSize: '18px',
                                cursor: 'pointer',
                                marginRight: '10px'
                              }"
                            >
                              <a-icon @click="showAddWinModal" type="plus" />
                            </a-col>
                            <a-col
                              :style="{
                                fontSize: '18px',
                                cursor: 'pointer',
                                marginRight: '10px'
                              }"
                            >
                              <a-icon @click="showDelWinModal" type="minus" />
                            </a-col>
                            <a-col>
                              <v-pagination
                                size="small"
                                :total="totalCount"
                                :page-size="pageSize"
                                :layout="[
                                  'prev',
                                  'jumper',
                                  'total',
                                  'next',
                                  'sizer'
                                ]"
                                @page-change="pageChange"
                                @page-size-change="pageSizeChange"
                              ></v-pagination>
                            </a-col>
                          </a-row>
                        </a-col>
                      </a-row>
                      <v-table
                        is-horizontal-resize
                        column-width-drag
                        :columns="strategyColumns"
                        :table-data="strategyList"
                        :select-all="selectALLStrategy"
                        :select-change="selectChangeStrategy"
                        :height="250"
                        style="width:100%;"
                        isFrozen="true"
                        @on-custom-comp="customStrategyFunc"
                      ></v-table>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="地址池" :disabled="disableAddressPool">
              <a-row type="flex" justify="start" align="top">
                <a-col>
                  <a-form-model-item
                    :label="$t('VPNAddressFrom')"
                    prop="addressFrom"
                  >
                    <a-input
                      size="small"
                      v-model="cVPNProfile.addressFrom"
                      style="width:250px;"
                    />
                  </a-form-model-item>
                  <a-form-model-item
                    :label="$t('VPNAddressTo')"
                    prop="addressTo"
                  >
                    <a-input
                      size="small"
                      v-model="cVPNProfile.addressTo"
                      style="width:250px;"
                    />
                  </a-form-model-item>
                  <a-form-model-item :label="$t('VPNMask')">
                    <a-input
                      size="small"
                      v-model="cVPNProfile.mask"
                      style="width:250px;"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col>
                  <a-form-model-item>
                    <v-table
                      is-horizontal-resize
                      :columns="networkColumns"
                      :table-data="networkList"
                      :select-all="selectAllNetwork"
                      :select-change="selectChangeNetwork"
                      :height="150"
                      style="width:275px;"
                      isFrozen="true"
                      :title-click="networkTitleClick"
                      :cell-merge="networkCellMerge"
                      @on-custom-comp="customNetworkFunc"
                    ></v-table>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <div class="box-cls">
                <div class="box-icon"></div>
                <a-row type="flex" justify="start" align="top">
                  <a-col>
                    <a-form-model-item>
                      <a-input
                        size="small"
                        v-model="cVPNProfile.localIP"
                        style="width:250px;"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col>
                    <a-form-model-item>
                      <v-table
                        is-horizontal-resize
                        :columns="serverColumns"
                        :table-data="serverList"
                        :select-all="selectAllServer"
                        :select-change="selectChangeServer"
                        :height="150"
                        style="width:275px;"
                        isFrozen="true"
                        :title-click="serverTitleClick"
                        :cell-merge="serverCellMerge"
                        @on-custom-comp="customServerFunc"
                      ></v-table>
                    </a-form-model-item>
                  </a-col>
                  <a-col>
                    <a-form-model-item>
                      <v-table
                        is-horizontal-resize
                        :columns="domainColumns"
                        :table-data="domainList"
                        :select-all="selectAllDomain"
                        :select-change="selectChangeDomain"
                        :height="150"
                        style="width:275px;"
                        isFrozen="true"
                        :title-click="domainTitleClick"
                        :cell-merge="domainCellMerge"
                        @on-custom-comp="customDomainFunc"
                      ></v-table>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-form-model>
      </div>
      <div v-show="showTabObj.secondTabRef" class="tabpan-common-cls">
        <IKE
          ref="ikeRef"
          :vpnProfile="cVPNProfile"
          :conSDWAN="conSDWAN"
          @passChildContent="ikePassContent"
        ></IKE>
      </div>
      <div v-show="showTabObj.thirdTabRef" class="tabpan-common-cls">
        <IPsec
          ref="ipsecRef"
          :vpnProfile="cVPNProfile"
          @passChildContent="ipsecPassContent"
        ></IPsec>
      </div>
    </div>
    <!-- 组群弹框 -->
    <div>
      <a-modal
        v-model="delWinVisible"
        title="Confirm Decommission"
        width="430px"
      >
        <template slot="footer">
          <a-button
            key="submit"
            type="primary"
            :loading="delLoading"
            @click="delOK"
            >OK</a-button
          >
          <a-button key="back" @click="delCancel">Cancel</a-button>
        </template>
        <span style="color:#fff;margin:12px 0;"
          >Are you sure you want to delete the selected record(s)?</span
        >
      </a-modal>
      <a-modal
        v-model="addOrEditWinVisible"
        :title="strategyTitle"
        :destroyOnClose="true"
        width="940px"
      >
        <StrategyAddOrEdit
          ref="strategyAddOrEditRef"
          :strategy="curEditStrategy"
          @passChildContent="passChildContent"
        ></StrategyAddOrEdit>
        <template slot="footer">
          <a-button
            key="submit"
            type="primary"
            :loading="addOrEditLoading"
            @click="addOrEditOK"
            >OK</a-button
          >
          <a-button key="back" @click="addOrEditCancel">Cancel</a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import IKE from './IKE';
import IPsec from './IPsec';
import StrategyAddOrEdit from './StrategyAddOrEdit';
import { mapState, mapMutations } from 'vuex';
import {
  RouteInstanceQuery,
  TunnelRouteInsQuery,
  TunnelRouteInsQueryByName,
  PeerFQDNQuery,
  LocalInterfaceQuery
} from 'apis/Configuration';
export default {
  name: 'VPNCfgFileAddOrEdit',
  props: ['vpnProfile'],
  components: {
    IKE,
    IPsec,
    StrategyAddOrEdit
  },
  data() {
    return {
      tabs: [
        {
          title: '一般',
          refObj: 'firstTabRef',
          style: {
            backgroundColor: '#aac0d5'
          }
        },
        {
          title: 'IKE',
          refObj: 'secondTabRef',
          style: {
            backgroundColor: '#8d9fb3'
          }
        },
        {
          title: 'IPsec',
          refObj: 'thirdTabRef',
          style: {
            backgroundColor: '#8d9fb3'
          }
        }
      ],
      showTabObj: {
        firstTabRef: true,
        secondTabRef: false,
        thirdTabRef: false
      },
      cVPNProfile: {
        name: '',
        vpnType: 'branch-sdwan',
        tunnelInitiate: 'automatic',
        hardwareAccelerator: 'any',
        routingInstance: '',
        branchSdwanProfile: '',
        tunnelRoutingInstance: '',
        tunnelInterface: '',
        alarms: {
          ipsecStateChange: 'enable',
          ikeStateChange: 'enable',
          ikeAuthFailure: 'enable'
        },
        tempAlarms: ['ikeAuthFailure', 'ikeStateChange', 'ipsecStateChange'],
        local: {
          address: '',
          inet: '',
          interfaceName: '',
          hostname: ''
        },
        peer: {
          address: [],
          inet: '',
          hostname: '',
          peerFqdnList: []
        }
      },
      disableAddressPool: true,
      disableBRSDWAN: false,
      disablePeerHost: true,
      vpnTypeOptions: [
        {
          label: this.$t('VPNTypeBRSDW'),
          value: 'branch-sdwan'
        },
        {
          label: this.$t('VPNTypeBRStagingSDW'),
          value: 'branch-staging-sdwan'
        },
        {
          label: 'Branch Prestaging SDWAN',
          value: 'branch-prestaging-sdwan'
        },
        {
          label: this.$t('VPNTypeRemoteVisitClient'),
          value: 'remote-access-client'
        },
        {
          label: this.$t('VPNTypeP2P'),
          value: 'site-to-site'
        }
        /*,
        {
          label: this.$t('VPNTypeConSDW'),
          value: 'controller-sdwan'
        },
        {
          label: this.$t('VPNTypeConBSDW'),
          value: 'controller-staging-sdwan'
        },
        {
          label: this.$t('VPNTypeRemoteVisitServer'),
          value: 'remote-access-server'
        } */
      ],
      tunnelOptions: [
        {
          label: this.$t('SelectNull'),
          value: ''
        },
        {
          label: this.$t('VPNTunnelAuto'),
          value: 'automatic'
        },
        {
          label: this.$t('VPNTunnelFlow'),
          value: 'traffic'
        }
      ],
      alarmOptions: [
        {
          label: 'IKE Auth Failure',
          value: 'ikeAuthFailure'
        },
        {
          label: 'IKE State Change',
          value: 'ikeStateChange'
        },
        {
          label: 'IPSec State Change',
          value: 'ipsecStateChange'
        }
      ],
      hardwareOptions: [
        {
          label: this.$t('SelectNull'),
          value: ''
        },
        {
          label: this.$t('VPNAnything'),
          value: 'any'
        },
        {
          label: this.$t('VPNNothing'),
          value: 'none'
        },
        {
          label: 'Nitrox',
          value: 'nitrox'
        },
        {
          label: 'QAT',
          value: 'qat'
        }
      ],
      routeOptions: [
        {
          label: this.$t('SelectNull'),
          value: ''
        }
      ],
      brSDWCfgFileOptions: [
        {
          label: this.$t('SelectNull'),
          value: ''
        },
        {
          label: 'b2b-sdwan',
          value: 'b2b-sdwan'
        }
      ],
      disableTunnerStart: false,
      disablePeerFQDNRadio: false,
      disablePeerIPRadio: false,
      disablePeerHostsRadio: false,
      peerFQDNChecked: '',
      peerIPChecked: '2',
      peerHostChecked: '',
      peerOptions: [
        [
          {
            label: this.$t('VPNPeerFQDN'),
            value: '1'
          }
        ],
        [
          {
            label: this.$t('VPNPeerIP'),
            value: '2'
          }
        ],
        [
          {
            label: this.$t('VPNPeerHost'),
            value: '3'
          }
        ]
      ],
      localIP: '4',
      localInterface: '',
      localHost: '',
      localOptions: [
        [
          {
            label: this.$t('VPNLocalIP'),
            value: '4'
          }
        ],
        [
          {
            label: this.$t('VPNLocalInterface'),
            value: '5'
          }
        ],
        [
          {
            label: this.$t('VPNLocalHost'),
            value: '6'
          }
        ]
      ],
      disableLocalIP: false,
      disableLocalInterface: true,
      disableLocalHost: true,
      baseOptionVal: '7',
      baseOptions: [
        {
          label: this.$t('VPNBaseRoute'),
          value: '7',
          disabled: false
        },
        {
          label: this.$t('VPNBaseStrategy'),
          value: '8',
          disabled: false
        }
      ],
      tunnelRouteInsOptions: [
        {
          label: this.$t('SelectNull'),
          value: ''
        }
      ],
      tunnelInterfaceOptions: [
        {
          label: this.$t('SelectNull'),
          value: ''
        }
      ],
      showP2PStrategy: false,
      rules: {
        name: [
          { required: true, message: 'Name is required', trigger: 'blur' }
        ],
        vpnType: [
          { required: true, message: 'VPN Type is required', trigger: 'blur' }
        ],
        routingInstance: [
          {
            required: true,
            message: `${this.$t('VPNRouteInstance')} is required`,
            trigger: 'change'
          }
        ],
        tunnelInterface: [{ validator: this.validateTunnelInterface, trigger: 'blur' }],
        addressFrom: [
          {
            required: true,
            message: `${this.$t('VPNAddressFrom')} is required`,
            trigger: 'blur'
          }
        ],
        addressTo: [
          {
            required: true,
            message: `${this.$t('VPNAddressTo')} is required`,
            trigger: 'blur'
          }
        ]
      },
      disablePeerInfo: false,
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
        width: 37,
        columnAlign: 'left',
        isResize: true
      },
      minus: {
        field: 'minus',
        title: `<span><button class="minus" style="width:28px">-</button></span>`,
        width: 40,
        columnAlign: 'left',
        isResize: true
      },
      peerFQDNList: [{}],
      peerIPList: [{ _disabled: true }],
      delPeerFQDNList: [],
      delPeerIPList: [],
      showBaseRoute: true,
      showBaseStrategy: false,
      totalCount: 0,
      pageIndex: 1,
      pageSize: 10,
      delLoading: false,
      addOrEditLoading: false,
      addOrEditWinVisible: false,
      delWinVisible: false,
      strategyTitle: '',
      strategyColumns: [
        {
          field: 'custom',
          width: 30,
          columnAlign: 'center',
          titleAlign: 'center',
          type: 'selection'
        },
        {
          field: 'name',
          title: this.$t('VPNStrategyName'),
          width: 120,
          columnAlign: 'left',
          isResize: true,
          componentName: 'strategy-opration'
        },
        {
          field: 'protocol',
          title: this.$t('VPNStrategyAgreement'),
          width: 120,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'src',
          title: this.$t('VPNStrategySource'),
          width: 120,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'dst',
          title: this.$t('VPNStrategyDest'),
          width: 120,
          columnAlign: 'left',
          isResize: true
        }
      ],
      strategyList: [{}],
      delStrategyList: [],
      curEditStrategy: {},
      curAddStrategy: {},
      networkList: [{}],
      delNetworkList: [],
      serverList: [{}],
      delServerList: [],
      domainList: [{}],
      delDomainList: [],
      conSDWAN: false,
      showRemoteServer: false,
      localInterfaceOptions: [
        {
          label: this.$t('SelectNull'),
          value: ''
        }
      ],
      tunnelInfcIsRequired: true
    };
  },
  computed: {
    fqdnColumns() {
      let column = {
        field: 'peer-fqdn',
        title: this.$t('VPNPeerFQDN'),
        width: 120,
        columnAlign: 'left',
        isResize: true,
        componentName: 'peerfqdn-opration'
      };
      return [this.selection, column, this.plus, this.minus];
    },
    ipColumns() {
      let column = {
        field: 'peer-ip',
        title: this.$t('VPNPeerIP'),
        width: 120,
        columnAlign: 'left',
        isResize: true,
        componentName: 'peerip-opration'
      };
      return [this.selection, column, this.plus, this.minus];
    },
    networkColumns() {
      let column = {
        field: 'network',
        title: this.$t('VPNAvailbaleNetwork'),
        width: 120,
        columnAlign: 'left',
        isResize: true,
        componentName: 'network-opration'
      };
      return [this.selection, column, this.plus, this.minus];
    },
    serverColumns() {
      let column = {
        field: 'server',
        title: this.$t('VPNServer'),
        width: 120,
        columnAlign: 'left',
        isResize: true,
        componentName: 'server-opration'
      };
      return [this.selection, column, this.plus, this.minus];
    },
    domainColumns() {
      let column = {
        field: 'domain',
        title: this.$t('VPNDomain'),
        width: 120,
        columnAlign: 'left',
        isResize: true,
        componentName: 'domain-opration'
      };
      return [this.selection, column, this.plus, this.minus];
    },
    ...mapState(['organization', 'deviceName'])
  },
  created() {
    console.log('addoredit created...', this.vpnProfile);
    if (this.vpnProfile.name) {
      this.cVPNProfile = { ...this.vpnProfile };
      this.peerFQDNList = [];
      this.peerIPList = [];
      this.cVPNProfile.peer.peerFqdnList &&
        this.cVPNProfile.peer.peerFqdnList.forEach(peerFqdn => {
          let row = { peerFqdn };
          this.peerFQDNList.push(row);
        });
      this.cVPNProfile.peer.address &&
        this.cVPNProfile.peer.address.forEach(peerIp => {
          let row = { peerIp };
          this.peerIPList.push(row);
        });
      this.cVPNProfile.tempAlarms = [];
      if (this.cVPNProfile.alarms) {
        for (let key in this.cVPNProfile.alarms) {
          this.cVPNProfile.alarms[key] === 'enable'
            ? this.cVPNProfile.tempAlarms.push(key)
            : '';
        }
      }
    } else {
      this.vpnTableSelectsAll({ key: 'vpnPeerFQDN' });
      this.vpnTableSelectsAll({ key: 'vpnNetwork' });
    }
    // 设置VPN Type
    this.changeVPNType(this.cVPNProfile.vpnType);
    this.queryRouteInsOptions();
    this.queryTunnelRouteInsOptions();
    this.queryPeerFQDN();
    this.queryLocalInterfaceOptions();
    this.queryTunnelInterfaceOptions();
  },
  updated() {
    if (this.showBaseStrategy) {
      this.cVPNProfile.precedence = Number(this.cVPNProfile.precedence) || 0;
    }
    console.log('updated cvpnprofile = ', this.cVPNProfile);
    this.$emit('passChildContent', this.cVPNProfile);
  },
  methods: {
    ...mapMutations([
      'vpnTableSelectsPlus',
      'vpnTableSelectsMinus',
      'vpnTableSelectsAll',
      'savePeerFQDNOptions'
    ]),
    validateTunnelInterface(rule, value, callback) {
      if (this.tunnelInfcIsRequired && !value) {
        return callback(new Error('Tunnel Interface is required'));
      }
    },
    async queryRouteInsOptions() {
      const res = await RouteInstanceQuery({ deviceName: this.deviceName });
      if (res.message === 'Success') {
        console.log('routing-instance = ', res.result['routing-instance']);
        this.existInterfaceRoute = new Map();
        this.nExistInterfaceRoute = new Map();
        res.result['routing-instance'].forEach(item => {
          if (item.name) {
            let option = {
              label: item.name,
              value: item.name
            };
            this.routeOptions.push(option);
            if (item.interfaces) {
              let interfaces = item.interfaces.map(item => {
                return {
                  label: item,
                  value: item
                };
              });
              this.existInterfaceRoute.set(item.name, interfaces);
            } else {
              this.nExistInterfaceRoute.set(item.name, item.networks);
            }
          }
        });
      }
    },
    async queryPeerFQDN() {
      const res = await PeerFQDNQuery({
        orgName: this.organization,
        deviceName: this.deviceName,
        offset: 0,
        limit: 10000
      });
      if (res.message === 'Success') {
        let addressList = res.result['address'];
        console.log('address = ', addressList);
        let peerFQDNOptions = [];
        let duFqdn = new Map();
        addressList.forEach(item => {
          if (item['fqdn']) {
            let option = {
              label: item['fqdn'],
              used: false
            };
            if (!duFqdn.get(item['fqdn'])) {
              duFqdn.set(item['fqdn'], option);
              peerFQDNOptions.push(option);
            }
          }
        });
        this.savePeerFQDNOptions({ peerFQDNOptions });
      }
    },
    // 查询隧道路由实例接口
    async queryTunnelRouteInsOptions() {
      const res = await TunnelRouteInsQuery({
        orgName: this.organization,
        deviceName: this.deviceName
      });
      if (res.message === 'Success') {
        console.log(
          'available-routing-instances = ',
          res.result['available-routing-instances']
        );
        this.allTunnelRouteInsNames = res.result['available-routing-instances'];
        this.allTunnelRouteInsNames.forEach(item => {
          let obj = {
            label: item,
            value: item
          };
          this.tunnelRouteInsOptions.push(obj);
        });
      }
    },
    async queryLocalInterfaceOptions() {
      const res = await LocalInterfaceQuery({ deviceName: this.deviceName });
      if (res.message === 'Success') {
        console.log('networks = ', res.result['network']);
        this.allLocalInterfaceList = res.result['network'];
      }
    },
    async queryTunnelInterfaceOptions() {
      const res = await TunnelRouteInsQueryByName({
        deviceName: this.deviceName
      });
      if (res.message === 'Success') {
        console.log('interfaces = ', res.result['interfaces']);
        this.allTunnelInterfaceList = res.result['interfaces'];
      }
    },
    changeTunnelRouteIns(value) {
      if (this.existInterfaceRoute.get(value)) {
        this.tunnelInterfaceOptions = [...this.existInterfaceRoute.get(value)];
        this.tunnelInterfaceOptions = this.tunnelInterfaceOptions.filter(item => {
          return item.label.indexOf('tvi') === 0;
        });
      } else {
        let networks = this.nExistInterfaceRoute.get(value);
        this.tunnelInterfaceOptions = [];
        networks.forEach(item => {
          for (let i = 0; i < this.allLocalInterfaceList.length; i++) {
            if (item === this.allLocalInterfaceList[i].name) {
              this.allLocalInterfaceList[i].interfaces.forEach(item2 => {
                let option = {
                  label: item2,
                  value: item2
                };
                item2.indexOf('tvi') === 0 ? this.tunnelInterfaceOptions.push(option) : 0;
              });
              break;
            }
          }
        });
      }
      this.tunnelInterfaceOptions.unshift({
        label: this.$t('SelectNull'),
        value: ''
      });
    },
    changeRouteIns(value) {
      if (this.existInterfaceRoute.get(value)) {
        this.localInterfaceOptions = [...this.existInterfaceRoute.get(value)];
        this.localInterfaceOptions.unshift({
          label: this.$t('SelectNull'),
          value: ''
        });
      } else {
        let networks = this.nExistInterfaceRoute.get(value);
        this.localInterfaceOptions = [];
        networks &&
          networks.forEach(item => {
            for (let i = 0; i < this.allLocalInterfaceList.length; i++) {
              if (item === this.allLocalInterfaceList[i].name) {
                this.allLocalInterfaceList[i].interfaces.forEach(item2 => {
                  let option = {
                    label: item2,
                    value: item2
                  };
                  this.localInterfaceOptions.push(option);
                });
                break;
              }
            }
          });
        this.localInterfaceOptions.unshift({
          label: this.$t('SelectNull'),
          value: ''
        });
      }
      this.cVPNProfile.local.interfaceName = '';
    },
    changeAlarms(checkedValues) {
      for (let key in this.cVPNProfile.alarms) {
        this.cVPNProfile.alarms[key] = 'disable';
      }
      let _that = this;
      checkedValues.forEach(checked => {
        for (let key in _that.cVPNProfile.alarms) {
          if (key === checked) {
            _that.cVPNProfile.alarms[key] = 'enable';
            break;
          }
        }
      });
    },
    changeCheckBox(e) {
      console.log('changeCheckBox e.target.checked = ', e.target.checked);
    },
    peerFQDNTitleClick(title) {
      if (this.peerFQDNChecked == '1' && !this.disablePeerInfo) {
        if (/class="plus"/.test(title)) {
          this.peerFQDNList.push({});
        } else if (/class="minus"/.test(title)) {
          // 删除选中的
          if (this.delPeerFQDNList.length) {
            this.peerFQDNList = this.peerFQDNList.filter(item => {
              let filter = true;
              for (let i = 0; i < this.delPeerFQDNList.length; i++) {
                if (item['peerFqdn'] === this.delPeerFQDNList[i]) {
                  this.vpnTableSelectsPlus({
                    key: 'vpnPeerFQDN',
                    label: item['peerFqdn']
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
          this.delPeerFQDNList = [];
        }
      }
    },
    peerIPTitleClick(title) {
      if (this.peerIPChecked == '2' && !this.disablePeerInfo) {
        if (/class="plus"/.test(title)) {
          this.peerIPList.push({});
        } else if (/class="minus"/.test(title)) {
          // 删除选中的
          if (this.delPeerIPList.length) {
            this.peerIPList = this.peerIPList.filter(item => {
              let filter = true;
              for (let i = 0; i < this.delPeerIPList.length; i++) {
                if (item['peerIp'] === this.delPeerIPList[i]) {
                  filter = false;
                  break;
                }
              }
              return filter;
            });
          } else {
            this.$message.info('请至少选中一条记录！');
          }
          this.delPeerIPList = [];
        }
      }
    },
    peerFQDNCellMerge(rowIndex, rowData, field) {
      if (field === 'peer-fqdn') {
        return {
          colSpan: 3,
          rowSpan: 1,
          content: '',
          componentName: 'peerfqdn-opration'
        };
      }
    },
    peerIPCellMerge(rowIndex, rowData, field) {
      if (field === 'peer-ip') {
        return {
          colSpan: 3,
          rowSpan: 1,
          content: '',
          componentName: 'peerip-opration'
        };
      }
    },
    networkTitleClick(title) {
      if (/class="plus"/.test(title)) {
        this.networkList.push({});
      } else if (/class="minus"/.test(title)) {
        // 删除选中的
        if (this.delNetworkList.length) {
          this.networkList = this.networkList.filter(item => {
            let filter = true;
            for (let i = 0; i < this.delNetworkList.length; i++) {
              if (item['network'] === this.delNetworkList[i]) {
                this.vpnTableSelectsPlus({
                  key: 'vpnNetwork',
                  label: item['network']
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
        this.delNetworkList = [];
      }
    },
    networkCellMerge(rowIndex, rowData, field) {
      if (field === 'network') {
        return {
          colSpan: 3,
          rowSpan: 1,
          content: '',
          componentName: 'network-opration'
        };
      }
    },
    serverTitleClick(title) {
      if (/class="plus"/.test(title)) {
        this.serverList.push({});
      } else if (/class="minus"/.test(title)) {
        // 删除选中的
        if (this.delServerList.length) {
          this.serverList = this.serverList.filter(item => {
            let filter = true;
            for (let i = 0; i < this.delServerList.length; i++) {
              if (item['server'] === this.delServerList[i]) {
                this.vpnTableSelectsPlus({
                  key: 'vpnServer',
                  label: item['server']
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
        this.delServerList = [];
      }
    },
    serverCellMerge(rowIndex, rowData, field) {
      if (field === 'server') {
        return {
          colSpan: 3,
          rowSpan: 1,
          content: '',
          componentName: 'server-opration'
        };
      }
    },
    domainTitleClick(title) {
      if (/class="plus"/.test(title)) {
        this.domainList.push({});
      } else if (/class="minus"/.test(title)) {
        // 删除选中的
        if (this.delDomainList.length) {
          this.domainList = this.domainList.filter(item => {
            let filter = true;
            for (let i = 0; i < this.delDomainList.length; i++) {
              if (item['domain'] === this.delDomainList[i]) {
                this.vpnTableSelectsPlus({
                  key: 'vpnDomain',
                  label: item['domain']
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
        this.delDomainList = [];
      }
    },
    domainCellMerge(rowIndex, rowData, field) {
      if (field === 'domain') {
        return {
          colSpan: 3,
          rowSpan: 1,
          content: '',
          componentName: 'domain-opration'
        };
      }
    },
    tabClick(ref) {
      this.changeTab(ref);
    },
    changeTab(curRef) {
      for (let ref in this.showTabObj) {
        if (ref === curRef) {
          this.showTabObj[ref] = true;
          this.$refs[ref][0].style.backgroundColor = '#aac0d5';
          if (curRef == 'secondTabRef') {
            if (!this.secondClickCount) {
              this.secondClickCount = 1;
              this.$refs.ikeRef.cVPNProfile.tempIkeNewOrOld = 'New';
              this.$refs.ikeRef.peerAuthInfo.authType = 'psk';
              this.$refs.ikeRef.changeConPeerAuthType('psk');
            }
          } else if (curRef == 'thirdTabRef') {
            if (!this.thirdClickCount) {
              this.thirdClickCount = 1;
              this.$refs.ipsecRef.cVPNProfile.tempIpsecNewOrOld = 'New';
            }
          } 
        } else {
          this.showTabObj[ref] = false;
          this.$refs[ref][0].style.backgroundColor = '#8d9fb3';
        }
      }
    },
    changeVPNType(value) {
      switch (value) {
        case 'branch-sdwan':
          this.conSDWAN = false;
          this.peerInfoEnableOrDisable(false);
          this.disableTunnerStart = false;
          this.disableAddressPool = true;
          this.disableBRSDWAN = false;
          this.baseOptions[1].disabled = true;
          this.showP2PStrategy = false;
          this.baseOptionVal = '7';
          this.showBaseRoute = true;
          this.showBaseStrategy = false;
          this.showRemoteServer = false;
          break;
        case 'controller-sdwan':
          this.conSDWAN = true;
          this.peerInfoEnableOrDisable(true);
          this.disableTunnerStart = true;
          this.disableBRSDWAN = true;
          this.baseOptions[1].disabled = false;
          this.showP2PStrategy = false;
          this.showRemoteServer = false;
          break;
        case 'controller-staging-sdwan':
          this.conSDWAN = false;
          this.peerInfoEnableOrDisable(true);
          this.disableTunnerStart = true;
          this.disableBRSDWAN = true;
          this.baseOptions[1].disabled = false;
          this.showP2PStrategy = false;
          this.showRemoteServer = false;
          break;
        case 'remote-access-client':
          this.conSDWAN = false;
          this.peerInfoEnableOrDisable(false);
          this.disableTunnerStart = false;
          this.disableAddressPool = true;
          this.disableBRSDWAN = true;
          this.baseOptions[1].disabled = false;
          this.showP2PStrategy = false;
          this.showRemoteServer = false;
          break;
        case 'site-to-site':
          this.conSDWAN = false;
          this.peerInfoEnableOrDisable(false);
          this.disableTunnerStart = false;
          this.disableAddressPool = true;
          this.disableBRSDWAN = true;
          this.baseOptions[1].disabled = false;
          this.showP2PStrategy = true;
          this.showRemoteServer = false;
          break;
        case 'remote-access-server':
          this.conSDWAN = false;
          this.peerInfoEnableOrDisable(true);
          this.disableTunnerStart = false;
          this.disableAddressPool = false;
          this.disableBRSDWAN = true;
          this.baseOptions[1].disabled = false;
          this.showP2PStrategy = false;
          this.showRemoteServer = true;
          break;
        default:
          this.conSDWAN = false;
          this.peerInfoEnableOrDisable(false);
          this.disableTunnerStart = false;
          this.disableAddressPool = true;
          this.disableBRSDWAN = true;
          this.baseOptions[1].disabled = true;
          this.showP2PStrategy = false;
          this.baseOptionVal = '7';
          this.showBaseRoute = true;
          this.showBaseStrategy = false;
          this.showRemoteServer = false;
          break;
      }
    },
    peerInfoEnableOrDisable(disabled) {
      this.disablePeerInfo = disabled;
      this.disablePeerFQDNRadio = disabled;
      this.disablePeerIPRadio = disabled;
      this.disablePeerHostsRadio = disabled;
      if (disabled) {
        this.loopListEnableOrDisable('peerFQDNList', disabled);
        this.loopListEnableOrDisable('peerIPList', disabled);
      } else {
        let checked = this.peerFQDNChecked
          ? this.peerFQDNChecked
          : this.peerIPChecked
          ? this.peerIPChecked
          : this.peerHostChecked;
        this.changeRadio({ target: { value: checked } });
      }
    },
    changeRadio(e) {
      switch (e.target.value) {
        // 对等FQDN
        case '1':
          this.peerFQDNChecked = '1';
          this.peerIPChecked = '';
          this.peerHostChecked = '';
          this.loopListEnableOrDisable('peerFQDNList', false);
          this.loopListEnableOrDisable('peerIPList', true);
          this.disablePeerHost = true;
          this.cVPNProfile.peer.address = [];
          this.cVPNProfile.peer.hostname = '';
          break;
        // 对等IP
        case '2':
          this.peerFQDNChecked = '';
          this.peerIPChecked = '2';
          this.peerHostChecked = '';
          this.loopListEnableOrDisable('peerFQDNList', true);
          this.loopListEnableOrDisable('peerIPList', false);
          this.disablePeerHost = true;
          this.cVPNProfile.peer.peerFqdnList = [];
          this.cVPNProfile.peer.hostname = '';
          break;
        // 对等Host
        case '3':
          this.peerFQDNChecked = '';
          this.peerIPChecked = '';
          this.peerHostChecked = '3';
          this.loopListEnableOrDisable('peerFQDNList', true);
          this.loopListEnableOrDisable('peerIPList', true);
          this.disablePeerHost = false;
          this.cVPNProfile.peer.peerFqdnList = [];
          this.cVPNProfile.peer.address = [];
          break;
        // 本地IP
        case '4':
          this.localIP = '4';
          this.localInterface = '';
          this.localHost = '';
          this.disableLocalIP = false;
          this.disableLocalInterface = true;
          this.disableLocalHost = true;
          this.cVPNProfile.local.interfaceName = '';
          this.cVPNProfile.local.hostname = '';
          break;
        case '5':
          this.localIP = '';
          this.localInterface = '5';
          this.localHost = '';
          this.disableLocalIP = true;
          this.disableLocalInterface = false;
          this.disableLocalHost = true;
          this.cVPNProfile.local.address = '';
          this.cVPNProfile.local.hostname = '';
          break;
        case '6':
          this.localIP = '';
          this.localInterface = '';
          this.localHost = '6';
          this.disableLocalIP = true;
          this.disableLocalInterface = true;
          this.disableLocalHost = false;
          this.cVPNProfile.local.address = '';
          this.cVPNProfile.local.interfaceName = '';
          break;
        // 基于路由
        case '7':
          this.tunnelInfcIsRequired = true;
          this.showBaseRoute = true;
          this.showBaseStrategy = false;
          delete this.cVPNProfile.precedence;
          delete this.cVPNProfile.rule;
          break;
        // 基于策略
        case '8':
          this.tunnelInfcIsRequired = false;
          this.showBaseRoute = false;
          this.showBaseStrategy = true;
          this.strategyList = this.cVPNProfile.rule ? this.cVPNProfile.rule : [];
          this.cVPNProfile.precedence = Number(this.cVPNProfile.precedence) || 0;
          break;
        default:
          break;
      }
    },
    loopListEnableOrDisable(listName, disabled) {
      this[listName] = this[listName].map(item => {
        item['_disabled'] = disabled;
        return item;
      });
      console.log(listName, this[listName]);
    },
    selectALLFQDN(checkdList) {
      this.delPeerFQDNList = [];
      checkdList.forEach(item => {
        this.delPeerFQDNList.push(item['peerFqdn']);
      });
    },
    selectChangeFQDN(checked) {
      this.delPeerFQDNList = [];
      checked.forEach(item => {
        this.delPeerFQDNList.push(item['peerFqdn']);
      });
    },
    customFQDNFunc(params) {
      this.peerFQDNList[params.index]['peerFqdn'] = params.label;
      // 通过刷新表格数据，实现对子组件刷新
      this.peerFQDNList = [...this.peerFQDNList];
      this.cVPNProfile.peer.peerFqdnList = [];
      this.peerFQDNList.forEach(obj => {
        this.cVPNProfile.peer.peerFqdnList.push(obj.peerFqdn);
      });
      // 隐藏store里下拉框已被使用的option
      this.vpnTableSelectsMinus({
        key: 'vpnPeerFQDN',
        label: params.label
      });
    },
    selectALLIP(checkdList) {
      this.delPeerIPList = [];
      checkdList.forEach(item => {
        this.delPeerIPList.push(item['peerIp']);
      });
    },
    selectChangeIP(checked) {
      this.delPeerIPList = [];
      checked.forEach(item => {
        this.delPeerIPList.push(item['peerIp']);
      });
    },
    customIPFunc(params) {
      this.peerIPList[params.index]['peerIp'] = params.label;
      // 通过刷新表格数据，实现对子组件刷新
      this.peerIPList = [...this.peerIPList];
      this.cVPNProfile.peer.address = [];
      this.peerIPList.forEach(obj => {
        this.cVPNProfile.peer.address.push(obj.peerIp);
      });
      this.cVPNProfile.peer.inet = this.peerIPList.length
        ? this.peerIPList[this.peerIPList.length - 1].peerIp
        : '';
    },
    selectAllNetwork(checkdList) {
      this.delNetworkList = [];
      checkdList.forEach(item => {
        this.delNetworkList.push(item['network']);
      });
    },
    selectChangeNetwork(checked) {
      this.delNetworkList = [];
      checked.forEach(item => {
        this.delNetworkList.push(item['network']);
      });
    },
    customNetworkFunc(params) {
      this.networkList[params.index]['network'] = params.label;
      // 通过刷新表格数据，实现对子组件刷新
      this.networkList = [...this.networkList];
      // 隐藏store里下拉框已被使用的option
      this.vpnTableSelectsMinus({
        key: 'vpnNetwork',
        label: params.label
      });
    },
    selectAllServer(checkdList) {
      this.delServerList = [];
      checkdList.forEach(item => {
        this.delServerList.push(item['server']);
      });
    },
    selectChangeServer(checked) {
      this.delServerList = [];
      checked.forEach(item => {
        this.delServerList.push(item['server']);
      });
    },
    customServerFunc(params) {
      this.serverList[params.index]['server'] = params.label;
      // 通过刷新表格数据，实现对子组件刷新
      this.serverList = [...this.serverList];
      // 隐藏store里下拉框已被使用的option
      this.vpnTableSelectsMinus({
        key: 'vpnServer',
        label: params.label
      });
    },
    selectAllDomain(checkdList) {
      this.delDomainList = [];
      checkdList.forEach(item => {
        this.delDomainList.push(item['server']);
      });
    },
    selectChangeDomain(checked) {
      this.delDomainList = [];
      checked.forEach(item => {
        this.delDomainList.push(item['server']);
      });
    },
    customDomainFunc(params) {
      this.domainList[params.index]['server'] = params.label;
      // 通过刷新表格数据，实现对子组件刷新
      this.domainList = [...this.domainList];
      // 隐藏store里下拉框已被使用的option
      this.vpnTableSelectsMinus({
        key: 'vpnDomain',
        label: params.label
      });
    },
    showAddWinModal() {
      this.operType = 'add';
      this.strategyTitle = 'Add Strategy';
      this.curEditStrategy = {};
      this.curAddStrategy = {};
      this.addOrEditWinVisible = true;
    },
    passChildContent(strategy) {
      this.curAddStrategy = strategy;
    },
    showDelWinModal() {
      this.delWinVisible = true;
    },
    async delOK() {
      this.delWinVisible = false;
      this.delStrategyList.forEach(item => {
        for (let i = 0; i < this.strategyList.length; i++) {
          if (item === this.strategyList[i].name) {
            this.strategyList.splice(i, 1);
          }
        }
      });
      this.cVPNProfile.rule = this.strategyList;
    },
    delCancel() {
      this.delWinVisible = false;
    },
    async addOrEditOK() {
      let isOK = this.satisfyValidation();
      if (isOK) {
        this.addOrEditLoading = true;
        let params =
          this.operType === 'add' ? this.curAddStrategy : this.curEditStrategy;
        this.addOrEditLoading = false;
        this.addOrEditWinVisible = false;
        this.strategyList.push(params);
        this.cVPNProfile.rule = this.strategyList;
      }
    },
    satisfyValidation() {
      let isOK = true;
      this.$refs.strategyAddOrEditRef.$refs.strategyForm.validate(valid => {
        if (!valid) {
          isOK = false;
          return false;
        }
      });
      return isOK;
    },
    addOrEditCancel() {
      this.addOrEditWinVisible = false;
      this.curAddVPNCfgFile = {};
      this.curEditVPNCfgFile = {};
    },
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.queryStrategyList();
    },
    pageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.queryStrategyList();
    },
    queryStrategyList() {
    },
    selectALLStrategy(checkdList) {
      this.delStrategyList = [];
      checkdList.forEach(item => {
        this.delStrategyList.push(item['name']);
      });
    },
    selectChangeStrategy(checked) {
      this.delStrategyList = [];
      checked.forEach(item => {
        this.delStrategyList.push(item['name']);
      });
    },
    customStrategyFunc(params) {
      this.operType = 'edit';
      this.curEditStrategy = params.rowData;
      this.curEditStrategy.disabledName = true;
      this.strategyTitle = 'Edit Strategy';
      this.addOrEditWinVisible = true;
    },
    ikePassContent(ikeVPNProfile) {
      Object.assign(this.cVPNProfile, ikeVPNProfile);
    },
    ipsecPassContent(ipsecVPNProfile) {
      Object.assign(this.cVPNProfile, ipsecVPNProfile);
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
Vue.component('peerfqdn-opration', {
  template: `<span>
      <a-select
        v-if="!rowData['peerFqdn']"
        placeholder="--Select--"
        :disabled="rowData['_disabled']"
        size="small"
        @change="change"
      >
        <a-select-option
          :value="item.label"
          v-for="(item, index) in vpnTableSelects.vpnPeerFQDN"
          v-if="!item.used"
          :key="index"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
      <label>{{ rowData['peerFqdn'] }} </label>
    </span>`,
  props,
  computed: {
    ...mapState(['vpnTableSelects'])
  },
  methods: {
    change(label) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'peerFqdn',
        index: this.index,
        rowData: this.rowData,
        label
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('peerip-opration', {
  template: `<span>
      <a-input
        v-if="!rowData['peerIp']"
        size="small"
        :disabled="rowData['_disabled']"
        @pressEnter="pressEnter"
      />
      <label>{{ rowData['peerIp']}} </label>
    </span>`,
  props,
  methods: {
    pressEnter(e) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'peerIp',
        index: this.index,
        rowData: this.rowData,
        label: e.target.value
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('network-opration', {
  template: `<span>
      <a-select
        v-if="!rowData['network']"
        placeholder="--Select--"
        size="small"
        @change="change"
      >
        <a-select-option
          :value="item.label"
          v-for="(item, index) in vpnTableSelects.vpnNetwork"
          v-if="!item.used"
          :key="index"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
      <label>{{ rowData['network'] }} </label>
    </span>`,
  props,
  computed: {
    ...mapState(['vpnTableSelects'])
  },
  methods: {
    change(label) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'network',
        index: this.index,
        rowData: this.rowData,
        label
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('server-opration', {
  template: `<span>
      <a-select
        v-if="!rowData['server']"
        placeholder="--Select--"
        size="small"
        @change="change"
      >
        <a-select-option
          :value="item.label"
          v-for="(item, index) in vpnTableSelects.vpnServer"
          v-if="!item.used"
          :key="index"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
      <label>{{ rowData['server'] }} </label>
    </span>`,
  props,
  computed: {
    ...mapState(['vpnTableSelects'])
  },
  methods: {
    change(label) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'server',
        index: this.index,
        rowData: this.rowData,
        label
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('domain-opration', {
  template: `<span>
      <a-select
        v-if="!rowData['domain']"
        placeholder="--Select--"
        size="small"
        @change="change"
      >
        <a-select-option
          :value="item.label"
          v-for="(item, index) in vpnTableSelects.vpnDomain"
          v-if="!item.used"
          :key="index"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
      <label>{{ rowData['domain'] }} </label>
    </span>`,
  props,
  computed: {
    ...mapState(['vpnTableSelects'])
  },
  methods: {
    change(label) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'domain',
        index: this.index,
        rowData: this.rowData,
        label
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('strategy-opration', {
  template: `<span>
    <a href="" @click.stop.prevent="update(rowData,index)">{{ rowData.name }}</a>
    </span>`,
  props,
  methods: {
    update() {
      // 参数根据业务场景随意构造
      let params = { type: 'edit', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    }
  }
});
</script>
<style lang="scss" scoped>
.no-border {
  border-right: 0;
}
.switchover {
  overflow: hidden;
  & > div {
    cursor: pointer;
  }
  .tab-common-cls {
    width: 50px;
    height: 22px;
    border-radius: 5px 3px 0px 0px;
    line-height: 22px;
    text-align: center;
    float: left;
  }
  .devcfg-tab-selected {
    background-color: #aac0d5;
  }
  .devcfg-tab-default {
    background-color: #8d9fb3;
  }
}
.tabpan-common-cls {
  clear: both;
  border-top: 1px solid #8d9fb3;
  padding: 10px;
  .box-cls {
    min-height: 78px;
    border-radius: 5px;
    border: solid 3px #456880;
    position: relative;
    padding: 10px;
    .box-icon {
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
      color: #fff;
    }
    /deep/.ant-form-vertical .ant-form-item {
      padding: 0;
      margin: 0;
    }
  }
}
/deep/.ant-form-item-label > label {
  color: #fff;
}
/deep/.ant-form-vertical .ant-form-item {
  margin-bottom: 8px;
}
/deep/.ant-col {
  padding-right: 10px;
}
/deep/.ant-radio-wrapper {
  color: #fff;
}
/deep/.ant-modal-content {
  max-height: 325px;
  .ant-modal-header {
    background-color: #e9f4fc;
    .ant-modal-title {
      line-height: 8px;
    }
  }
  .ant-modal-body {
    padding: 3px;
    background-color: #36536b;
  }
  .ant-modal-footer {
    background-color: #e9f4fc;
  }
}
</style>
