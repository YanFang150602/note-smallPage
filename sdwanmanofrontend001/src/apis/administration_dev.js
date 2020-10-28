import { $http } from '@/utils/axios';
/**
 * @desc 获取组织列表
 * @param {Number} offset
 * @param {Number} limit
 */

export const adminList = () =>
  $http.get('/v0-snapshot/sdwanservice/controller/sdwan/v1/organizations', {
    offset: 0,
    limit: 2000
  });
/**
 * @desc 获取组织全局id
 */
export const adminId = () =>
  $http.get(
    '/v0-snapshot/sdwanservice/controller/sdwan/v1/organizations/organization/id'
  );

/**
 * @desc 路由实例id获取
 */
export const adminRouerId = () =>
  $http.get(
    '/v0-snapshot/sdwanservice/controller/sdwan/v1/organizations/organization/vrf?count=10'
  );

/**
 * @desc 组织列表添加
 * @param {Object}
 */
export const adminAdd = param =>
  $http.post(
    '/v0-snapshot/sdwanservice/controller/sdwan/v1/organizations',
    param
  );

/**
 * @desc 组织列表添加
 * @param {Object}
 */
export const adminRightAdd = param =>
  $http.post('/v0-snapshot/sdwanservice/controller/sdwan/v1/roles', param);

/**
 * @desc 组织角色列表
 */
export const admRightList = () =>
  $http.get('/v0-snapshot/sdwanservice/controller/sdwan/v1/roles/role/id');

/**
 * @desc 组织权限列查询
 * @param {String}
 */
export const adminRight = param =>
  $http.get(
    `/v0-snapshot/sdwanservice/controller/sdwan/v1/roles/modify/${param}`
  );

/**
 * @desc 组织编辑
 * @param {String} name
 * @param {Object} param
 */

export const adminedit = (name, param) =>
  $http.post(
    `/v0-snapshot/sdwanservice/controller/sdwan/v1/organizations/modify/${name}`,
    param
  );

/**
 * @desc 组织删除
 * @param {Object}
 */
export const adminDel = param =>
  $http.post(
    '/v0-snapshot/sdwanservice/controller/sdwan/v1/organizations/organization/delete/',
    param
  );

/**
 * @desc 组织查询
 * @param {String}
 */
export const adminSearch = param =>
  $http.get(
    `/v0-snapshot/sdwanservice/controller/sdwan/v1/organizations/modify/${param}`
  );

/**
 * @desc 组织用户查询
 * @param {Number} offset
 * @param {Number} limit
 */

export const adminUsersLists = param =>
  $http.get(
    `/v0-snapshot/sdwanservice/controller/sdwan/v1/tenant?organization=${param}`,
    {
      offset: 0,
      limit: 200
    }
  );

/**
 * @desc 查询权限对应的个性化页面
 * @param {String}
 */

export const rolePage = param =>
  $http.get(
    `/v0-snapshot/sdwanservice/controller/sdwan/v1/roles/role/page?role=${param}`
  );

/**
 * @desc 组织用户创建
 * @param {Object}
 */

export const adminUserAdd = param =>
  $http.post('/v0-snapshot/sdwanservice/controller/sdwan/v1/tenant', param);

/**
 * @desc 组织用户删除
 * @param {Object}
 */

export const adminUserDel = param =>
  $http.post(
    '/v0-snapshot/sdwanservice/controller/sdwan/v1/tenant/tenant/delete',
    param
  );

/**
 * @desc 组织用户修改
 * @param {Object} param
 * @param {String} name
 */

export const adminUserEdt = (name, param) =>
  $http.post(
    `/v0-snapshot/sdwanservice/controller/sdwan/v1/tenant/modify/${name}`,
    param
  );

//##############################################################################
/**
 * @desc 组织用户修改
 * @param {Object} param
 * @param {String} name
 */

export const adminTempList = ({ offset, limit, orgname }) =>
  $http.get('/v0-snapshot/sdwanservice/controller/sdwan/v1/template', {
    offset,
    limit,
    orgname
  });

/**
 * @desc 组织用户修改
 * @param {String} orgname
 * @param {String} deviceType
 */

export const spokeSeach = ({ orgname, deviceType }) =>
  $http.get(
    '/v0-snapshot/sdwanservice/controller/sdwan/v1/device/device/type',
    {
      orgname,
      deviceType
    }
  );

/**
 * @desc 组织用户修改
 * @param {String} orgname
 * @param {String} deviceType
 */

export const spokeList = ({ offset, limit }) =>
  $http.get('/v0-snapshot/sdwanservice/controller/sdwan/v1/spokegroup', {
    offset,
    limit
  });

/**
 * @desc 控制器获取
 * @param {String} organization
 */

export const controllerWrap = ({ organization }) =>
  $http.get(
    '/v0-snapshot/sdwanservice/controller/sdwan/v1/organizations/organization/ctl',
    {
      organization
    }
  );

/**
 * @desc 模板创建
 * @param {Object} param
 */

export const templateAdd = param =>
  $http.post('/v0-snapshot/sdwanservice/controller/sdwan/v1/template', param);

/**
 * @desc 模板删除
 * @param {Object} param
 */

export const templateDel = param =>
  $http.post(
    '/v0-snapshot/sdwanservice/controller/sdwan/v1/template/template/delete',
    param
  );

/**
 * @desc 模板查询
 * @param {String} param
 */

export const templateSearch = param =>
  $http.get(
    `/v0-snapshot/sdwanservice/controller/sdwan/v1/template/modify/${param}`
  );

/**
 * @desc 模板修改
 * @param {String} param
 */

export const templateEdt = (name, param) =>
  $http.post(
    `/v0-snapshot/sdwanservice/controller/sdwan/v1/template/modify/${name}`,
    param
  );

/**
 * @desc 模板Network Name
 * @param {Object} param
 */

export const networkName = param =>
  $http.post(
    '/v0-snapshot/sdwanservice/controller/sdwan/v1/template/template/network',
    param
  );
