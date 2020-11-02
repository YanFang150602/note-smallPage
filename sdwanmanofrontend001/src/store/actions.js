import {
  adminNameLists,
  adminUsersLists,
  adminTempList
} from 'apis/administration';
import { CfTableForm } from 'apis/Configuration';
import { devicesTableForm, DeviceGroups } from 'apis/workFlows';
import { SPTableForm } from 'apis/spokeGroups';
import { DeviceCheck } from 'apis/workFlows';
import {
  ADM_NAME_LIST,
  ADM_USERS_LIST,
  TEMPLATE_LIST,
  TABLE_DEVICE_FORM,
  DEVICE_FORM,
  DEVICEGROUP_FORM,
  SPOKEGROUP_FORM
} from '@/store/mutation-types';
export default {
  //home页面下拉组织名称列表
  async getNameList({ commit }) {
    const { result } = await adminNameLists();
    const adminNameList = [];
    result.organizations.forEach(item => {
      adminNameList.push(item.name);
    });
    commit(ADM_NAME_LIST, { adminNameList });
  },

  //home页面下拉组织对应租户列表
  async adminUsersList(context, { organization, offset, limit }) {
    const { result } = await adminUsersLists({ organization, offset, limit });
    context.commit(ADM_USERS_LIST, { result, organization });
  },

  // 设备模板列表
  async templateList(context, { orgname, offset, limit }) {
    if (orgname) {
      // home页面下拉组织对应设备模板列表
      const { result } = await adminTempList({ orgname, offset, limit });
      context.commit(TEMPLATE_LIST, { result, orgname });
    } else {
      // 设备全部模板列表
      const { result } = await adminTempList({
        offset,
        limit
      });
      context.commit(TEMPLATE_LIST, { result });
    }
  },

  //home页根据设备获取组织名称列表
  async getNameListDevice({ commit }, name) {
    const { result } = await DeviceCheck(name);
    const adminNameList = [];
    adminNameList.push(result.orgName);
    commit(ADM_NAME_LIST, { adminNameList });
  },

  // zwj#########################################################################################
  async TableForm({ commit }, { organization, offset, limit }) {
    const { result } = await CfTableForm({
      organization,
      offset,
      limit
    });
    commit(TABLE_DEVICE_FORM, { result, organization });
  },
  async Tabledevice({ commit }, { deep, orgname, offset, limit }) {
    const res = await devicesTableForm(deep, orgname, offset, limit);
    commit(DEVICE_FORM, { res, organization: orgname });
  },
  async DeviceGroups({ commit }, { organization, offset, limit }) {
    const res = await DeviceGroups({ organization, offset, limit });
    commit(DEVICEGROUP_FORM, res);
  },
  // spoke组
  async SPTableForm({ commit }, { orgname, offset, limit }) {
    const res = await SPTableForm(orgname, offset, limit);
    console.log(res, orgname, offset, limit);
    commit(SPOKEGROUP_FORM, res);
  }
};
