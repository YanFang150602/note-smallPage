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
          <a-col
            :style="{
              fontSize: '18px',
              cursor: 'pointer',
              marginRight: '20px'
            }"
          >
            <a-icon @click="showModal" type="plus" />
          </a-col>
          <a-col
            :style="{
              fontSize: '18px',
              cursor: 'pointer',
              marginRight: '20px'
            }"
          >
            <a-icon @click="showModalDelete" type="minus" />
          </a-col>
          <a-col>
            <v-pagination
              :total="100"
              size="small"
              :layout="['prev', 'jumper', 'total', 'next', 'sizer']"
            ></v-pagination>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <!-- 列表 -->
    <!-- 表单主体内容 -->
    <v-table
      is-horizontal-resize
      column-width-drag
      :columns="columns"
      :table-data="tableData"
      :select-all="selectALL"
      :select-change="selectChange"
      :select-group-change="selectGroupChange"
      :height="540"
      style="width:100%;"
      isFrozen="true"
      @on-custom-comp="customCompFunc"
    ></v-table>
    <!-- 新增弹框 -->
    <NetworkAdd ref="NetworkAddRef"></NetworkAdd>
    <!-- 删除的弹框 -->
    <NetworkDelete
      ref="NetworkDeleteRef"
      :AssociateNetwork="dele"
    ></NetworkDelete>
    <!-- 查看弹框 -->
    <NetworkEdit
      ref="NetworkEditRef"
      :AssocNetworkCheck="netWorkCheck"
    ></NetworkEdit>
  </div>
</template>

<script>
import NetworkAdd from './NetworkAdd';
import NetworkDelete from './NetworkDelete';
import NetworkEdit from './NetworkEdit';
import { AssInterfaceForm, AssInterfaceCheck } from 'apis/AssInterface';
import { mapState } from 'vuex';

export default {
  components: {
    NetworkAdd,
    NetworkDelete,
    NetworkEdit
  },
  data() {
    return {
      // 搜索框
      keyworks: '',
      // 表格
      tableData: [],
      columns: [
        {
          width: 36,
          columnAlign: 'center',
          titleAlign: 'center',
          type: 'selection'
        },
        {
          field: 'name',
          title: 'Name',
          width: 180,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          componentName: 'table-operationDevice'
        },
        {
          field: 'description',
          title: 'Description',
          width: 180,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'tags',
          title: 'Tag',
          width: 180,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'burstSize',
          title: 'Burst Size(Bytes)',
          width: 180,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'rate',
          title: 'Rate(kbps)',
          width: 180,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'loggingInterval',
          title: 'Logging Interval(Secs)',
          width: 180,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'schedulerMap',
          title: 'Scheduler Map',
          width: 180,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'mode',
          title: '',
          width: 180,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        }
      ],
      // 查看数据
      netWorkCheck: {},
      // 删除的数据
      dele: {
        deviceName: '',
        orgName: '',
        data: {
          name: '',
          mode: ''
        }
      }
    };
  },
  created() {
    this.tableForm();
  },
  computed: {
    ...mapState(['organization', 'deviceName'])
  },
  methods: {
    // 新增弹框
    showModal() {
      this.$refs.NetworkAddRef.showModalAdd();
    },
    // 删除弹框
    showModalDelete() {
      this.$refs.NetworkDeleteRef.showModalDelete();
    },
    // 表格方法
    selectALL(selection) {
      console.log('select-aLL', selection);
    },
    selectChange(selection, rowData) {
      console.log('select-change', selection, rowData);
      console.log(selection, 1312313131312312);
      console.log(rowData, 345678909876543);
      this.dele.data.mode = rowData.mode;
      selection.forEach(item => {
        console.log(item.name);
        this.dele.data.name = item.name;
        console.log(this.dele);
      });
      this.dele.deviceName = this.deviceName;
      this.dele.orgName = this.organization;
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    async customCompFunc(params) {
      console.log(params, 78766676768);
      console.log(params.rowData.mode);
      this.dele.data.mode = params.rowData.mode;
      this.$refs.NetworkEditRef.showModal();

      const res = await AssInterfaceCheck(
        this.deviceName,
        this.organization,
        params.rowData.name,
        params.rowData.mode
      );
      console.log(res.result);
      this.netWorkCheck = res.result;
      this.netWorkCheck.tags = this.netWorkCheck.tags || [];
      console.log(this.netWorkCheck.tags);
      // console.log(res.result);
      // this.ProfilesCheck = res.result;
      // console.log(this.ProfilesCheck);
      // if (params.type === 'delete') {
      //   this.$delete(this.tableData, params.index);
      // } else if (params.type === 'edit') {
      //   this.visibleCheck = true;
      //   this.lastCheckDevice = this.curCheckDevice;
      //   this.curCheckDevice = params.rowData.deviceName;
      // }
    },
    // 表格
    async tableForm() {
      const res = await AssInterfaceForm({
        deviceName: this.deviceName,
        orgName: this.organization,
        offset: 0,
        pageSize: 25
      });
      // console.log(res.result.data);
      this.tableData = res.result.data;
    }
  }
};
import Vue from 'vue';
Vue.component('table-operationDevice', {
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
      let params = { type: 'edit', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    }
  }
});
</script>

<style lang="scss" scoped>
.devices {
  /deep/.v-table-rightview {
    right: unset;
  }
  padding: 5px 20px 30px 15px;
  /deep/.search-bar {
    .ant-input {
      width: 700px;
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
</style>
