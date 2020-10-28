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
export const ScheduleQuery = ({ name, offset, limit }) =>
  $http.get(`/ScheduleQuery?name=${name}&offset=${offset}&limit=${limit}`);

// 添加Schedule
export const ScheduleAdd = params => $http.post('/ScheduleAdd', params);

// VPN配置文件创建接口
export const VPNProfileCreate = params =>
  $http.post('/controller/sdwan/v1/vpnprofile/create', params);

// 全量vpn配置文件查询接口
export const VPNProfileQuery = ({ orgName, deviceName, offset, limit }) =>
  $http.get(
    `/controller/sdwan/v1/vpnprofile?orgname=${orgName}&devicename=${deviceName}&offset=${offset}&limit=${limit}`
  );

// 租户移除vpn配置文件接口
export const VPNProfileDelete = params =>
  $http.post('/controller/sdwan/v1/vpnprofile/delete', params);

// 查询路由实例接口
export const RouteInstanceQuery = ({ name, interfaces, networks }) =>
  $http.get(
    `/controller/sdwan/v1/vpnprofile/getRoutingInstance?select=${name};${interfaces};${networks}`
  );

// 查询本地接口接口
export const LocalInterfaceQuery = () =>
  $http.get('/controller/sdwan/v1/vpnprofile/getLocalInterface');

// 查询隧道路由实例接口
export const TunnelRouteInsQuery = () =>
  $http.get('/controller/sdwan/v1/vpnprofile/getTunnelRoutingInstance');

// 查询隧道接口
export const TunnelRouteInsQueryByName = ({ tviName, uviName }) =>
  $http.get(
    `/controller/sdwan/v1/vpnprofile/getTunnelRoutingInstance?select=tvi(${tviName};uvi(${uviName})`
  );
