import { $http } from '@/utils/axios';
// /**
//  * @desc 获取Configuration
//  */
// 获取轮询组列表
export const CfTableForm = ({ organization, offset, limit }) =>
  $http.get('/controller/sdwan/v1/device/device/status', {
    organization,
    offset,
    limit
  });

// 查询所有Schedule
export const ScheduleQuery = ({ deviceName, orgName, offset, limit }) =>
  $http.get(
    `/controller/sdwan/v1/schedules?deviceName=${deviceName}&orgName=${orgName}&offset=${offset}&pageSize=${limit}`
  );


// 查询单个Schedule
export const ScheduleSingleQuery = ({ deviceName, orgName, name }) =>
  $http.get(
    `/controller/sdwan/v1/schedules/schedule/get?deviceName=${deviceName}&orgName=${orgName}&name=${name}`
  );

// 添加Schedule
export const ScheduleAdd = params =>
  $http.post('/controller/sdwan/v1/schedules', params);

// 修改Schedule
export const ScheduleModify = params =>
  $http.post('/controller/sdwan/v1/schedules/schedule/modify', params);

// 删除Schedule
export const ScheduleDelete = params =>
  $http.post('/controller/sdwan/v1/schedules/schedule/delete', params);

// VPN配置文件创建接口
export const VPNProfileCreate = params =>
  $http.post('/controller/sdwan/v1/vpnprofile/create', params);

// VPN配置文件创建接口
export const VPNProfileModify = params =>
  $http.post('/controller/sdwan/v1/vpnprofile/modify', params);

// 全量vpn配置文件查询接口
export const VPNProfileQuery = ({ orgName, deviceName, offset, limit }) =>
  $http.get(
    `/controller/sdwan/v1/vpnprofile?orgName=${orgName}&deviceName=${deviceName}&offset=${offset}&limit=${limit}`
  );

// 租户移除vpn配置文件接口
export const VPNProfileDelete = params =>
  $http.post('/controller/sdwan/v1/vpnprofile/delete', params);

// 查询路由实例接口
export const RouteInstanceQuery = ({ deviceName }) =>
  $http.get(
    `/controller/sdwan/v1/vpnprofile/getRoutingInstance?routingInstanceParam=name;interfaces;networks&deviceName=${deviceName}`
  );

// 查询本地接口接口
export const LocalInterfaceQuery = ({ deviceName }) =>
  $http.get(
    `/controller/sdwan/v1/vpnprofile/getLocalInterface?deviceName=${deviceName}`
  );

// 查询隧道路由实例接口
export const TunnelRouteInsQuery = ({ orgName, deviceName }) =>
  $http.get(
    `/controller/sdwan/v1/vpnprofile/getTunnelRoutingInstance?deviceName=${deviceName}&orgName=${orgName}`
  );

// 查询隧道接口
export const TunnelRouteInsQueryByName = ({ deviceName }) =>
  $http.get(
    `/controller/sdwan/v1/vpnprofile/getTunnelRoutingInstance?tunnelInterfaceParam=tvi(name;unit(name))&deviceName=${deviceName}`
  );

// 查询Peer FQDN
export const PeerFQDNQuery = ({ orgName, deviceName, offset, limit }) =>
  $http.get(
    `/controller/sdwan/v1/address?userName=${orgName}&deviceName=${deviceName}&offset=${offset}&limit=${limit}`
  );
