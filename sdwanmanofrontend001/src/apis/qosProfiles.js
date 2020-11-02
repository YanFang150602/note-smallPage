import { $http } from '@/utils/axios';
// /**
//  * @desc 获取设备列表
//  */
// 获取列表
export const qosProfilesForm = param =>
  $http.get('/controller/sdwan/v1/profiles', param);

// qosProfile创建
export const qosProfilesAdd = param =>
  $http.post('/controller/sdwan/v1/profiles', param);

// qosProfile创建删除
export const qosProfilesDelete = param =>
  $http.post('/controller/sdwan/v1/profiles/profile/delete', param);

// qosProfile编辑
export const qosProfilesEdit = param =>
  $http.post('/controller/sdwan/v1/profiles/profile/modify', param);

// qosProfile查看
export const qosProfilesCheck = (deviceName, name, orgName) =>
  $http.get(
    `/controller/sdwan/v1/profiles/profile/get?deviceName=${deviceName}&orgName=${orgName}&name=${name}`
  );

// // 新增弹框Organization数据获取
// export const devicesOrg = () =>
//   $http.get('/controller/sdwan/v1/organizations/organization/name');
