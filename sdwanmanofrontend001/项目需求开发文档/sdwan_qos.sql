/*
Navicat MySQL Data Transfer

Source Server         : localDb
Source Server Version : 50731
Source Host           : localhost:3306
Source Database       : sdwan

Target Server Type    : MYSQL
Target Server Version : 50731
File Encoding         : 65001

Date: 2020-10-26 10:01:42
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `t_cmcc_sdwan_associate_interface_config`
-- ----------------------------
DROP TABLE IF EXISTS `t_cmcc_sdwan_associate_interface_config`;
CREATE TABLE `t_cmcc_sdwan_associate_interface_config` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `tags` varchar(100) DEFAULT NULL,
  `burst_size` int(5) DEFAULT NULL,
  `rate` int(5) DEFAULT NULL,
  `logging_interval` int(5) DEFAULT NULL,
  `scheduler_map` varchar(50) DEFAULT NULL,
  `device_id` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of t_cmcc_sdwan_associate_interface_config
-- ----------------------------

-- ----------------------------
-- Table structure for `t_cmcc_sdwan_device_schedule`
-- ----------------------------
DROP TABLE IF EXISTS `t_cmcc_sdwan_device_schedule`;
CREATE TABLE `t_cmcc_sdwan_device_schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `recurrence` varchar(50) DEFAULT NULL,
  `time` varchar(100) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `tags` varchar(100) DEFAULT NULL,
  `device_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of t_cmcc_sdwan_device_schedule
-- ----------------------------

-- ----------------------------
-- Table structure for `t_cmcc_sdwan_device_zones`
-- ----------------------------
DROP TABLE IF EXISTS `t_cmcc_sdwan_device_zones`;
CREATE TABLE `t_cmcc_sdwan_device_zones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `lef_profile` varchar(100) DEFAULT NULL,
  `networks` varchar(100) DEFAULT NULL,
  `interface_list` varchar(100) DEFAULT NULL,
  `routing_instance` varchar(100) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `tags` varchar(100) DEFAULT NULL,
  `zone_protection_profile` varchar(50) DEFAULT NULL,
  `org` varchar(50) DEFAULT NULL,
  `device_id` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of t_cmcc_sdwan_device_zones
-- ----------------------------

-- ----------------------------
-- Table structure for `t_cmcc_sdwan_qos_policy`
-- ----------------------------
DROP TABLE IF EXISTS `t_cmcc_sdwan_qos_policy`;
CREATE TABLE `t_cmcc_sdwan_qos_policy` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(50) NOT NULL COMMENT '名称',
  `description` varchar(150) DEFAULT NULL COMMENT '描述',
  `tags` varchar(100) DEFAULT NULL,
  `action` varchar(50) DEFAULT NULL COMMENT '峰值速率（pps）',
  `profile` varchar(50) DEFAULT NULL COMMENT '峰值速率（kbps）',
  `services` varchar(50) DEFAULT NULL COMMENT '峰值突发大小(bytes)',
  `source_zone` varchar(50) DEFAULT NULL COMMENT '转发等级',
  `source_region` varchar(50) DEFAULT NULL COMMENT '丢失优先级（low/high）',
  `source_address` varchar(50) DEFAULT NULL,
  `source_address_group` varchar(50) DEFAULT NULL,
  `destination_zone` varchar(50) DEFAULT NULL COMMENT '设备id',
  `destination_region` varchar(50) DEFAULT NULL,
  `destination_address` varchar(50) DEFAULT NULL,
  `destination_address_group` varchar(50) DEFAULT NULL,
  `destination_mac_address_type` varchar(50) DEFAULT NULL,
  `ip_version` varchar(50) DEFAULT NULL,
  `ip_flags` tinyint(1) DEFAULT NULL,
  `dscp` varchar(50) DEFAULT NULL,
  `ttl_type` tinyint(1) DEFAULT NULL,
  `ttl_threshold` int(5) DEFAULT NULL,
  `ether_type` varchar(50) DEFAULT NULL,
  `ether_type_value` varchar(50) DEFAULT NULL,
  `protocol_value` int(5) DEFAULT NULL,
  `device_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of t_cmcc_sdwan_qos_policy
-- ----------------------------

-- ----------------------------
-- Table structure for `t_cmcc_sdwan_qos_profiles`
-- ----------------------------
DROP TABLE IF EXISTS `t_cmcc_sdwan_qos_profiles`;
CREATE TABLE `t_cmcc_sdwan_qos_profiles` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(50) NOT NULL COMMENT '名称',
  `description` varchar(150) DEFAULT NULL COMMENT '描述',
  `peak_rate_pps` int(11) DEFAULT NULL COMMENT '峰值速率（pps）',
  `peak_rate_kbps` int(11) DEFAULT NULL COMMENT '峰值速率（kbps）',
  `peak_burst_size` int(11) DEFAULT NULL COMMENT '峰值突发大小(bytes)',
  `forwarding_class` varchar(50) DEFAULT NULL COMMENT '转发等级',
  `loss_priority` varchar(50) DEFAULT NULL COMMENT '丢失优先级（low/high）',
  `dscp_rewrite` tinyint(1) DEFAULT NULL,
  `dot1p_rewrite` tinyint(1) DEFAULT NULL,
  `device_id` varchar(50) DEFAULT NULL COMMENT '设备id',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of t_cmcc_sdwan_qos_profiles
-- ----------------------------
