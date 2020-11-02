import { $http } from '@/utils/axios';
// /**
//  * @desc 获取轮询组列表
//  */
// 获取轮询组列表
// export const SPTableForm = (page, pageSize) =>
//   $http.get(
//     `/controller/sdwan/v1/spokegroup?offset=${page}&&limit=${pageSize}`
//   );
export const SPTableForm = (orgname, offset, limit) =>
  $http.get('/controller/sdwan/v1/spokegroup', { orgname, offset, limit });

// 轮询组删除设备
export const SPDelete = param =>
  $http.post('/controller/sdwan/v1/spokegroup/group/delete', param);

//新增弹框查询hub设备列表
export const DeviceHub = name =>
  $http.get(
    `/controller/sdwan/v1/device/device/type?orgname=${name}&deviceType=hub`
  );

//spoke组创建
export const spokeAdd = param =>
  $http.post('/controller/sdwan/v1/spokegroup', param);

// 组织查询Routing Instances对应的值
export const routingInstances = name =>
  $http.get(`/controller/sdwan/v1/organizations/modify/${name}`);

// spoke组查询
export const spokeCheck = name =>
  $http.get(`//controller/sdwan/v1/spokegroup/modify/${name}`);

// spoke组编辑
export const spokeEdit = (name, param) =>
  $http.post(`//controller/sdwan/v1/spokegroup/modify/${name}`, param);
