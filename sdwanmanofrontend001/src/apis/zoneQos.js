import { $http } from '@/utils/axios';
// ---------------zone------------------
/**
 * @desc 获取zone列表
 * @param {Object}  //设备名称
 */

export const zoneLists = param =>
  $http.get('/controller/sdwan/v1/objects/zones', param);

/**
 * @desc 新建zone
 * @param {Object}
 */

export const zoneCreate = param =>
  $http.post('/controller/sdwan/v1/objects/zones', param);

/**
 * @desc 查询zone
 * @param {Object}
 */

export const zoneSearch = param =>
  $http.get('/controller/sdwan/v1/objects/zones/zone/get', param);

/**
 * @desc 修改zone
 * @param {Object}
 */

export const zoneModify = param =>
  $http.post('/controller/sdwan/v1/objects/zones/zone/modify', param);

/**
 * @desc 删除zone
 * @param {Object}
 */

export const zoneDelete = param =>
  $http.post('/controller/sdwan/v1/objects/zones/zone/delete', param);

/**
 * @desc 查询ZoneProtectFile
 * @param {Object}
 */

export const zoneProtection = param =>
  $http.get('/controller/sdwan/v1/objects/zones/params/zoneProtection', param);

/**
 * @desc 查询ZoneProtectFile
 * @param {Object}
 */

export const logProfile = param =>
  $http.get('/controller/sdwan/v1/objects/zones/params/logProfile', param);

/**
 * @desc 查询Interface
 * @param {Object}
 */
export const interfaces = param =>
  $http.get('/controller/sdwan/v1/objects/zones/params/interfaces', param);

/**
 * @desc 查询Networks
 * @param {Object}
 */
export const networks = param =>
  $http.get('/controller/sdwan/v1/objects/zones/params/networks', param);

/**
 * @desc 查询RoutingInstance
 * @param {Object}
 */
export const routingInstance = param =>
  $http.get('/controller/sdwan/v1/objects/zones/params/routingInstance', param);

/**
 * @desc 查询Oranizations
 * @param {Object}
 */
export const organizations = param =>
  $http.get('/controller/sdwan/v1/objects/zones/params/org', param);

// ---------------QosPolicy------------------
/**
 * @desc 获取QosPolicy列表
 * @param {Object}  //设备名称
 */

export const qosPolicyLists = param =>
  $http.get('/controller/sdwan/v1/qosPolicies', param);

/**
 * @desc 新建QosPolicy
 * @param {Object}
 */

export const qosPolicyCreate = param =>
  $http.post('/controller/sdwan/v1/qosPolicies', param);

/**
 * @desc 查询QosPolicy
 * @param {Object}
 */

export const qosPolicySearch = param =>
  $http.get('/controller/sdwan/v1/qosPolicies/qosPolicy/get', param);

/**
 * @desc 修改QosPolicy
 * @param {Object}
 */

export const qosPolicyModify = param =>
  $http.post('/controller/sdwan/v1/qosPolicies/qosPolicy/modify', param);

/**
 * @desc 删除QosPolicy
 * @param {Object}
 */

export const qosPolicyDelete = param =>
  $http.post('/controller/sdwan/v1/qosPolicies/qosPolicy/delete', param);

// ---------------AppQosPolicy------------------
/**
 * @desc 获取QosPolicy列表
 * @param {Object}  //设备名称
 */

export const appQosPolicyLists = param =>
  $http.get('/controller/sdwan/v1/policies', param);

/**
 * @desc 新建QosPolicy
 * @param {Object}
 */

export const appQosPolicyCreate = param =>
  $http.post('/controller/sdwan/v1/policies', param);

/**
 * @desc 查询QosPolicy
 * @param {Object}
 */

export const appQosPolicySearch = param =>
  $http.get('/controller/sdwan/v1/qosPolicies/qosPolicy/get', param);

/**
 * @desc 修改QosPolicy
 * @param {Object}
 */

export const appQosPolicyModify = param =>
  $http.post('/controller/sdwan/v1/policies/update/', param);

/**
 * @desc 删除QosPolicy
 * @param {Object}
 */

export const appQosPolicyDelete = param =>
  $http.post('/controller/sdwan/v1/policies/delete', param);

/**
 * @desc 查询Source Zone Destination Zone
 * @param {Object}
 */
export const zoneList = param =>
  $http.get('/controller/sdwan/v1/policies/getQOSZone', param);

/**
 * @desc 查询Destination Address Source Address
 * @param {Object}
 */
export const addressList = param =>
  $http.get('/controller/sdwan/v1/policies/getDestinationAddress', param);

/**
 * @desc 查询serviceList
 * @param {Object}
 */
export const serviceList = param =>
  $http.get('/controller/sdwan/v1/policies/getServiceList', param);

/**
 * @desc 查询ProfileSetting
 * @param {Object}
 */
export const ProfileSetting = param =>
  $http.get('/controller/sdwan/v1/policies/getProfileSetting', param);

/**
 * @desc 查询applicationList
 * @param {Object}
 */
export const applicationList = param =>
  $http.get('/controller/sdwan/v1/policies/getApplications', param);

/**
 * @desc 查询urlCategoryList
 * @param {Object}
 */
export const urlCategoryList = param =>
  $http.get('/controller/sdwan/v1/policies/getURLCategoryList', param);
