<template>
  <div class="devices">
    <!-- 搜索框 -->
    <a-row
      class="table-header"
      type="flex"
      justify="space-between"
      align="middle"
    >
      <!--搜索栏-->
      <a-col :style="{ width: 'calc(100%-475px)' }">
        <a-input
          class="search-bar"
          ref="searchInput"
          v-model="keyworks"
          placeholder="Search"
          @keyup.enter="search"
        >
          <a-icon slot="prefix" type="search" />
          <a-icon
            @click="keyworks = ''"
            v-show="keyworks != ''"
            slot="suffix"
            type="close"
          />
        </a-input>
      </a-col>
      <!--表格功能按钮-->
      <a-col>
        <a-row
          :style="{ width: '425px' }"
          type="flex"
          justify="end"
          align="middle"
        >
          <!-- <a-col
            :style="{
              fontSize: '18px',
              cursor: 'pointer',
              marginRight: '20px'
            }"
          >
            <a-icon type="plus" />
          </a-col>
          <a-col
            :style="{
              fontSize: '18px',
              cursor: 'pointer',
              marginRight: '20px'
            }"
          >
            <a-icon type="minus" />
          </a-col>-->
          <a-col>
            <v-pagination
              :total="deviceFrom.length"
              size="small"
              :page-size="pageSize"
              :layout="['prev', 'jumper', 'total', 'next', 'sizer']"
              @page-change="pageChange"
              @page-size-change="pageSizeChange"
            ></v-pagination>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <!-- 列表 -->
    <!-- 表单主体内容 -->
    <v-table
      column-width-drag
      is-horizontal-resize
      :columns="columns"
      :table-data="deviceFrom"
      :select-all="selectALL"
      :select-change="selectChange"
      :select-group-change="selectGroupChange"
      :height="350"
      isFrozen="true"
      @on-custom-comp="customCompFunc"
    ></v-table>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
// import { CfTableForm } from 'apis/Configuration';

export default {
  data() {
    return {
      //分页
      pageIndex: 1,
      pageSize: 20,
      totalCount: 100,
      keyworks: '',
      // 表格
      tableData: [],
      columns: [
        {
          width: 36,
          titleAlign: 'center',
          columnAlign: 'center',
          type: 'selection'
        },
        {
          field: 'name',
          title: 'Name',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          componentName: 'table-operation'
        },
        {
          field: 'ipAddress',
          title: 'Mgmt.Address',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'type',
          title: 'Type',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'createdAt',
          title: 'Time Created',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'startTime',
          title: 'Service Start Time',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'softwareVersion',
          title: 'Software Version',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'branchId',
          title: 'Site ID',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ownerOrg',
          title: 'Organizations',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'syncStatus',
          title: 'Config Synchronized',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'pingStatus',
          title: 'Reachability',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'servicesStatus',
          title: 'Service',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        }
      ]
    };
  },
  created() {
    this.$store.dispatch('getNameList');
    console.log(this.deviceFrom);
  },
  methods: {
    // 分页
    queryDevice() {
      this.$store.dispatch('getNameList', {
        organization: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    },
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.$store.dispatch('getNameList', {
        organization: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.$store.dispatch('getNameList', {
        organization: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    },
    // 表格方法
    selectALL(selection) {
      console.log('select-aLL', selection);
    },
    selectChange(selection, rowData) {
      console.log('select-change', selection, rowData);
      selection.forEach(item => {
        console.log(item.deviceName);
        this.dele.push(item.deviceName);
      });
      const newArr = Array.from(new Set(this.dele));
      this.dele = newArr;
      console.log(this.dele);
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    customCompFunc(params) {
      if (params.type === 'jump') {
        //记录deviceName
        this.saveDeviceName({ deviceName: params.rowData.name });
        this.$router.push({
          name: 'DeviceConfig',
          params: { name: params.rowData.name }
        });
      }
    },
    ...mapMutations(['saveDeviceName'])
  },
  computed: {
    ...mapState(['deviceFrom', 'organization'])
  }
};
import Vue from 'vue';
Vue.component('table-operation', {
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  template: `<span>
        <a href="" @click.stop.prevent="update(rowData,index)">{{rowData.name}}</a>&nbsp;
        </span>`,
  methods: {
    update() {
      // 参数根据业务场景随意构造
      let params = { type: 'jump', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    }
  }
});
</script>

<style lang="scss" scoped>
.devices {
  /deep/.search-bar {
    .ant-input {
      width: 400%;
      color: #6a6f75;
      border: 1px solid #b0c7d5;
      height: 20px;
      border-radius: 4px;
      font-size: 12px;
      line-height: 18px;
      &:focus {
        box-shadow: none;
        border-color: #b0c7d5;
      }
    }
  }
}

/deep/.ant-modal-content {
  max-height: 325px;
  .ant-modal-header {
    background-color: #e9f4fc;
    .ant-modal-title {
      line-height: 8px;
    }
  }
  .ant-modal-body {
    padding: 3px;
    background-color: #36536b;
  }
  .ant-modal-footer {
    background-color: #e9f4fc;
  }
}
</style>
