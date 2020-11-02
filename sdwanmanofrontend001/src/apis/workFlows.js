import { $http } from '@/utils/axios';
// /**
//  * @desc 获取设备列表
//  */
// 获取设备列表
export const devicesTableForm = (deep, orgname, offset, limit) =>
  $http.get('/controller/sdwan/v1/device', { deep, orgname, offset, limit });

// 删除设备
export const devicesDelete = param =>
  $http.post(
    '/controller/sdwan/v1/device/device/delete?cleanConfig=true&&restConfig=false',
    param
  );

// 新增设备
export const devicesAdd = param =>
  $http.post('/controller/sdwan/v1/device', param);

// 新增弹框Organization数据获取
export const devicesOrg = () =>
  $http.get('/controller/sdwan/v1/organizations/organization/name');

//新增弹框Device Groups数据获取
export const devicesGroup = name =>
  $http.get(`/controller/sdwan/v1/devicegroup/group/name?organization=${name}`);

//获取Device Groups数据
export const DeviceGroups = param =>
  $http.get('/controller/sdwan/v1/devicegroup', param);

//新增设备
export const addDevices = param =>
  $http.post('/controller/sdwan/v1/device', param);

// 新增弹框中Global Device ID的获取
export const DeviceID = () =>
  $http.get('/controller/sdwan/v1/device/device/id');

//新增弹框中Device Group弹框的创建中Post Staging Template获取数据
export const DevicePost = name =>
  $http.get(`/controller/sdwan/v1/template?orgname=${name}`);

// 新增弹框中Device Group弹框的增加
export const DeviceGroupAdd = param =>
  $http.post('/controller/sdwan/v1/devicegroup', param);

// 弹框中Device Group弹框的修改
export const DeviceGroupEdit = param =>
  $http.post(`/controller/sdwan/v1/devicegroup/modify/${param.name}`, param);

// 根据设备组名称查询设备组
export const DeviceGroupByName = name =>
  $http.get(`/controller/sdwan/v1/devicegroup/modify/${name}`);

export const DeviceGroupDelete = param =>
  $http.post(`/controller/sdwan/v1/devicegroup/group/delete`, param);

export const DeviceGropAssociation = param =>
  $http.get(
    `/controller/sdwan/v1/devicegroup/group/association?devGroupName=${param.devGroupName}&templateName=${param.templateName}`
  );

// 设备查看获取信息
export const DeviceCheck = name => {
  return $http.get(`/controller/sdwan/v1/device/modify/${name}`);
};

// 设备编辑
export const DeviceEdit = (name, param) => {
  return $http.post(`//controller/sdwan/v1/device/modify/${name}`, param);
};

// 设备查询
export const DeviceSearch = name => {
  return $http.get(
    `/controller/sdwan/v1/device?deep=true&orgname=${name}&offset=0&limit=1000`
  );
};

//设备绑定信息查询
export const DeviceBinding = param => {
  return $http.post('/controller/sdwan/v1/device/device/binddata', param);
};

// 设备部署
export const DeviceDeploy = param => {
  return $http.post('//controller/sdwan/v1/device/device/deploy', param);
};
