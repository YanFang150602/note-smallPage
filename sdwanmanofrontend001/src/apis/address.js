import { $http } from '@/utils/axios';
// /**
//  * @desc 获取设备列表
//  */
// 获取列表
export const addressForm = param =>
  $http.get('/controller/sdwan/v1/address', param);

// address创建
export const addressAdd = param =>
  $http.post('/controller/sdwan/v1/address', param);

// address创建删除;
export const addressDelete = (name, param) =>
  $http.post(`/controller/sdwan/v1/address/delete/${name}`, param);

// address编辑
export const addressEdit = (name, param) =>
  $http.post(`/controller/sdwan/v1/address/modify/${name}`, param);

// // qosProfile查看
// export const qosProfilesCheck = name =>
//   $http.get(
//     `/controller/sdwan/v1/profiles/profile/get?deviceName=ShanghaiF310&orgName=cmcc_shanghai&name=${name}`
//   );
