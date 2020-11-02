import { $http } from '@/utils/axios';
// /**
//  * @desc 获取设备列表
//  */
// 获取列表
console.log($http.create, 98438);
export const AssInterfaceForm = param =>
  $http.get('/controller/sdwan/v1/associateInterfaces', param);

// // qosProfile创建
export const AssInterfaceAdd = param =>
  $http.post('/controller/sdwan/v1/associateInterfaces', param);

// AssInterface删除
export const AssInterfaceDelete = param =>
  $http.post(
    '/controller/sdwan/v1/associateInterfaces/associateInterface/delete',
    param
  );

// AssInterface查看
export const AssInterfaceCheck = (deviceName, orgName, name, mode) =>
  $http.get(
    `/controller/sdwan/v1/associateInterfaces/associateInterface/get?deviceName=${deviceName}&orgName=${orgName}&name=${name}&mode=${mode}`
  );

// 新增弹框里面Interface下拉框
export const AssInterfaceSelect = (deviceName, orgName) =>
  $http.get(
    `/controller/sdwan/v1/associateInterfaces/params/interface?deviceName=${deviceName}&orgName=${orgName}`
  );

// 新增弹框里面Network下拉框
export const AssNetWorkSelect = (deviceName, orgName) =>
  $http.get(
    `/controller/sdwan/v1/objects/zones/params/networks?deviceName=${deviceName}&orgName=${orgName}`
  );

// 编辑接口
export const AssInterfaceEdit = param =>
  $http.post(
    '/controller/sdwan/v1/associateInterfaces/associateInterface/modify',
    param
  );

//下拉框Scheduler Map
export const AssInterfaceSchedulerMap = (deviceName, orgName) =>
  $http.get(
    `/controller/sdwan/v1/associateInterfaces/params/scheduleMap?deviceName=${deviceName}&orgName=${orgName}`
  );

//下拉框DSCPRewriteRule
export const AssInterfaceDSCPRewriteRule = (deviceName, orgName) =>
  $http.get(
    `/controller/sdwan/v1/associateInterfaces/params/reWriteRule?deviceName=${deviceName}&orgName=${orgName}&type=ieee-802.1p`
  );

//下拉框DSCP6RewriteRule
export const AssInterfaceDSCPRewriteRuleSelect = (deviceName, orgName) =>
  $http.get(
    `/controller/sdwan/v1/associateInterfaces/params/reWriteRule?deviceName=${deviceName}&orgName=${orgName}&type=dscp-ipv6`
  );
//下拉框802.1pRewriteRule
export const DSCPRewriteRule = (deviceName, orgName) =>
  $http.get(
    `/controller/sdwan/v1/associateInterfaces/params/reWriteRule?deviceName=${deviceName}&orgName=${orgName}&type=dscp`
  );
