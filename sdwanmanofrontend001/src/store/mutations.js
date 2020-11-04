import {
  ADM_NAME_LIST,
  ADM_USERS_LIST,
  TEMPLATE_LIST,
  DEVICES_SHOW,
  DEVICES_BID,
  DEVICES_HANDLE,
  DEVICES_SHOWADD,
  DEVICES_BIDADD,
  DEVICES_HANDLEADD,
  TABLE_DEVICE_FORM,
  DEVICE_FORM,
  DEVICEGROUP_FORM,
  VPN_PLUS_OPTIONS,
  VPN_MINUS_OPTIONS,
  VPN_ALL_OPTIONS,
  DEVICE_NAME_SAVE,
  ORGANIZATION_SAVE,
  VPN_PEERFQDN_OPTIONS,
  SPOKEGROUP_FORM
} from '@/store/mutation-types';

export default {
  // 修改home组织名称列表数据
  [ADM_NAME_LIST](state, { adminNameList }) {
    state.admNameList = [...adminNameList];
  },
  // 修改租户列表数据
  [ADM_USERS_LIST](state, { result, organization }) {
    console.log(result, organization);
    state.admUsersList = { ...result };
    if (organization) {
      state.organization = organization;
    }
  },
  // 修改模板列表数据
  [TEMPLATE_LIST](state, { result, orgname }) {
    state.tempList = { ...result };
    if (orgname) {
      state.organization = orgname;
    }
  },
  // ###################################zwj
  [DEVICES_BID](state) {
    state.show = {
      isShow: false,
      isDemonstrate: false,
      isExhibition: true,
      curIndex: 2
    };
  },
  [DEVICES_SHOW](state) {
    state.show = {
      isShow: false,
      isDemonstrate: true,
      isExhibition: false,
      curIndex: 1
    };
  },
  [DEVICES_HANDLE](state) {
    state.show = {
      isShow: true,
      isDemonstrate: false,
      isExhibition: false,
      curIndex: 0
    };
  },
  [DEVICES_BIDADD](state) {
    state.showAdd = {
      isShow: false,
      isDemonstrate: false,
      isExhibition: true,
      curIndex: 2
    };
  },
  [DEVICES_SHOWADD](state) {
    state.showAdd = {
      isShow: false,
      isDemonstrate: true,
      isExhibition: false,
      curIndex: 1
    };
  },
  [DEVICES_HANDLEADD](state) {
    state.showAdd = {
      isShow: true,
      isDemonstrate: false,
      isExhibition: false,
      curIndex: 0
    };
  },
  [TABLE_DEVICE_FORM](state, { result, organization }) {
    if (result.appliances) {
      state.deviceFrom = [...result.appliances];
    } else {
      state.deviceFrom = [];
    }
    state.organization = organization;
  },
  [DEVICE_FORM](state, { result, organization }) {
    console.log(result);
    if (result.totalCount !== 0) {
      console.log(result);
      state.device = { ...result };
    } else {
      state.device = {};
    }
    console.log(state.device);
    state.organization = organization;
  },
  [DEVICEGROUP_FORM](state, { result }) {
    if (result.totalCount) {
      state.deviceGroupResult = result;
    } else {
      state.deviceGroupResult = [];
    }
  },
  [SPOKEGROUP_FORM](state, { result }) {
    console.log(state);
    if (result.totalCount) {
      state.spoke = result;
      console.log(state.spoke);
    } else {
      state.spoke = [];
    }
  },

  UpdateLoading(state, status = 0) {
    console.log(state.isLoading, status);
    if (status) state.isLoading += status;
    state.isLoading = status;
  },
  [VPN_PLUS_OPTIONS](state, { key, label, value }) {
    for (let i = 0; i < state.vpnTableSelects[key].length; i++) {
      if ((label && state.vpnTableSelects[key][i].label === label) || (value && state.vpnTableSelects[key][i].value === value)) {
        state.vpnTableSelects[key][i].used = false;
        break;
      }
    }
  },
  [VPN_MINUS_OPTIONS](state, { key, label, value }) {
    for (let i = 0; i < state.vpnTableSelects[key].length; i++) {
      if ((label && state.vpnTableSelects[key][i].label === label) || (value && state.vpnTableSelects[key][i].value === value)) {
        state.vpnTableSelects[key][i].used = true;
        break;
      }
    }
  },
  [VPN_ALL_OPTIONS](state, { key }) {
    for (let i = 0; i < state.vpnTableSelects[key].length; i++) {
      state.vpnTableSelects[key][i].used = false;
    }
  },
  [DEVICE_NAME_SAVE](state, { deviceName }) {
    state.deviceName = deviceName;
    localStorage.setItem('deviceName', deviceName);
  },
  [ORGANIZATION_SAVE](state, { organization }) {
    state.organization = organization;
  },
  [VPN_PEERFQDN_OPTIONS](state, { peerFQDNOptions }) {
    state.vpnTableSelects.vpnPeerFQDN = peerFQDNOptions;
  }
};
