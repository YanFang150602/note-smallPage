import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import common from './modules/common';

Vue.use(Vuex);

const state = {
  // 当前组织名称
  organization: localStorage.getItem('organization') || '',
  // home页下拉宽数据
  admNameList: [],
  // 租户列表数据
  admUsersList: {},
  // 模板列表数据
  tempList: {},
  // ######################zwj
  show: {
    isShow: true,
    isDemonstrate: false,
    isExhibition: false,
    curIndex: 0
  },
  // 设备新增
  showAdd: {
    isShow: true,
    isDemonstrate: false,
    isExhibition: false,
    curIndex: 0
  },
  deviceFrom: [],
  device: {},
  deviceGroupResult: {},
  spoke: {},
  deviceName: localStorage.getItem('deviceName') || '',
  isLoading: 0,
  vpnTableSelects: {
    vpnPeerFQDN: [],
    vpnIKEHash: [
      {
        label: 'md5',
        used: false
      },
      {
        label: 'sha256',
        used: false
      },
      {
        label: 'sha384',
        used: false
      },
      {
        label: 'sha512',
        used: false
      },
      {
        label: 'sha1',
        used: false
      }
    ],
    vpnIKEEntry: [
      {
        label: '3des',
        used: false
      },
      {
        label: 'aes128',
        used: false
      },
      {
        label: 'aes256',
        used: false
      }
    ],
    vpnIKEDH: [
      {
        label: 'No PFS',
        value: 'mod-none',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 1 - 768-bit modulus',
        value: 'mod1',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 2 – 1024-bit modulus',
        value: 'mod2',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 5 - 1536-bit modulus',
        value: 'mod5',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 14 – 2048 bit modulus',
        value: 'mod14',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 15 – 3072 bit modulus',
        value: 'mod15',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 16 – 4096 bit modulus',
        value: 'mod16',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 19 – 256 bit elliptic curve',
        value: 'mod19',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 20 - 384 bit elliptic curve',
        value: 'mod20',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 21 - 521 bit elliptic curve',
        value: 'mod21',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 25 - 192 bit elliptic curve',
        value: 'mod25',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 26 - 224 bit elliptic curve',
        value: 'mod26',
        used: false
      }
    ],
    vpnIPsecHash: [
      {
        label: 'md5',
        used: false
      },
      {
        label: 'sha256',
        used: false
      },
      {
        label: 'sha384',
        used: false
      },
      {
        label: 'sha512',
        used: false
      },
      {
        label: 'sha1',
        used: false
      },
      {
        label: 'xcbc',
        used: false
      }
    ],
    vpnIPsecEntry: [
      {
        label: '3des',
        used: false
      },
      {
        label: 'aes128',
        used: false
      },
      {
        label: 'aes128-ctr',
        used: false
      },
      {
        label: 'aes128-gcm',
        used: false
      },
      {
        label: 'aes256',
        used: false
      },
      {
        label: 'aes256-gcm',
        used: false
      }
    ],
    vpnIPsecForward: [
      {
        label: 'No PFS',
        value: 'mod-none',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 1 - 768-bit modulus',
        value: 'mod1',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 2 – 1024-bit modulus',
        value: 'mod2',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 5 - 1536-bit modulus',
        value: 'mod5',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 14 – 2048 bit modulus',
        value: 'mod14',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 15 – 3072 bit modulus',
        value: 'mod15',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 16 – 4096 bit modulus',
        value: 'mod16',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 19 – 256 bit elliptic curve',
        value: 'mod19',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 20 - 384 bit elliptic curve',
        value: 'mod20',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 21 - 521 bit elliptic curve',
        value: 'mod21',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 25 - 192 bit elliptic curve',
        value: 'mod25',
        used: false
      },
      {
        label: 'Diffie-Hellman Group 26 - 224 bit elliptic curve',
        value: 'mod26',
        used: false
      }
    ],
    idTypeOptions: [
      {
        label: 'Email',
        value: 'email'
      },
      {
        label: 'FQDN',
        value: 'FQDN'
      },
      {
        label: 'IP',
        value: 'IP'
      }
    ],
    vpnServer: [],
    vpnDomain: [],
    vpnNetwork: []
  }
};
export default new Vuex.Store({
  modules: {
    common
  },
  state,
  getters,
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
});
