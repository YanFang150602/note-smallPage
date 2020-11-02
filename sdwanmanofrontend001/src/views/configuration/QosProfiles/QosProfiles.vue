<template>
  <div class="qosProfiles">
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
              :total="totalCount"
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
    <QosProfilesAdd ref="QosProfilesAddRef"></QosProfilesAdd>
    <!-- 删除的弹框 -->
    <QosProfilesDelete
      ref="QosProfilesDeleteRef"
      :qosProfiles="dele"
    ></QosProfilesDelete>
    <!-- 查看弹框 -->
    <QosProfilesEdit
      ref="QosProfilesEditRef"
      :qosProfilesCheck="ProfilesCheck"
    ></QosProfilesEdit>
  </div>
</template>

<script>
import QosProfilesAdd from './QosProfilesAdd';
import QosProfilesDelete from './QosProfilesDelete';
import QosProfilesEdit from './QosProfilesEdit';
import { qosProfilesForm, qosProfilesCheck } from 'apis/qosProfiles';
import { mapState } from 'vuex';

export default {
  name: 'QosProfiles',
  components: {
    QosProfilesAdd,
    QosProfilesDelete,
    QosProfilesEdit
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
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          componentName: 'table-operationDevice'
        },
        {
          field: 'peakRatePps',
          title: 'Peak Rate(pps)',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'peakRateKbps',
          title: 'StatPeak Rate(Kbps)',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'peakBurstSize',
          title: 'Peak Burst Size(Bytes)',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'forwardingClass',
          title: 'Forwarding Class',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'lossPriority',
          title: 'Loss Priority',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'dscpRwEnable',
          title: 'DSCP rewrite',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'dot1pRwEnable',
          title: 'Dot1p rewrite',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        }
      ],
      dele: {
        deviceName: '',
        orgName: '',
        data: ''
      },
      // 查看的数据
      ProfilesCheck: {},
      //分页
      pageIndex: 1,
      pageSize: 20,
      totalCount: 100
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
      this.$refs.QosProfilesAddRef.showModalAdd();
    },
    // 删除弹框
    showModalDelete() {
      this.$refs.QosProfilesDeleteRef.showModalDelete();
    },
    // 表格方法
    selectALL(selection) {
      console.log('select-aLL', selection);
    },
    selectChange(selection, rowData) {
      console.log('select-change', selection, rowData);
      selection.forEach(item => {
        console.log(item.name);
        this.dele.data = item.name;
        console.log(this.dele);
      });
      this.dele.deviceName = this.deviceName;
      this.dele.orgName = this.organization;
      // this.dele.ids.push(item.deviceName);
      // this.dele.id = item.deviceName;
      // const newArr = Array.from(new Set(this.dele.ids));
      // this.dele.ids = newArr;
      // console.log(this.dele);
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    async customCompFunc(params) {
      console.log(params.rowData.name);
      this.$refs.QosProfilesEditRef.showModalAdd();
      const res = await qosProfilesCheck(
        this.deviceName,
        params.rowData.name,
        this.organization
      );
      console.log(res.result);
      this.ProfilesCheck = res.result;
      console.log(this.ProfilesCheck);
    },
    // 表格
    async tableForm() {
      const res = await qosProfilesForm({
        deviceName: this.deviceName,
        orgName: this.organization,
        offset: 0,
        pageSize: 25
      });
      console.log(res.result.data);
      this.tableData = res.result.data;
      this.totalCount = res.result.total;
    },
    // 搜索
    async search() {
      const res = await qosProfilesCheck(this.keyworks);
      console.log(res);
    },
    // 分页
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.$store.dispatch('Tabledevice', {
        organization: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.$store.dispatch('Tabledevice', {
        organization: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
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
.qosProfiles {
  padding: 5px 20px 30px 15px;
  /deep/.v-table-rightview {
    right: unset;
  }
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
