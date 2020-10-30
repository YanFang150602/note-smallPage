<template>
  <div class="schedules">
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
          size="small"
          ref="searchInput"
          v-model="keywords"
          placeholder="Search"
          @keyup="search"
        >
          <a-icon slot="prefix" type="search" />
          <a-icon
            @click="keywords = ''"
            v-show="keywords != ''"
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
            <a-icon @click="showAddWinModal" type="plus" />
          </a-col>
          <a-col
            :style="{
              fontSize: '18px',
              cursor: 'pointer',
              marginRight: '20px'
            }"
          >
            <a-icon @click="showDelWinModal" type="minus" />
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
      :table-data="tableDataList"
      :select-all="selectALL"
      :select-change="selectChange"
      :select-group-change="selectGroupChange"
      :height="550"
      style="width:100%;"
      isFrozen="true"
      @on-custom-comp="customTableFunc"
    ></v-table>
    <!-- 组群弹框 -->
    <div>
      <a-modal
        v-model="delWinVisible"
        title="Confirm Decommission"
        @ok="delOK"
        width="430px"
      >
        <template slot="footer">
          <a-button
            key="submit"
            type="primary"
            :loading="delLoading"
            @click="delOK"
          >
            OK
          </a-button>
          <a-button key="back" @click="delCancel">Cancel</a-button>
        </template>
        <span style="color:#fff;margin:12px 0;">
          Are you sure you want to delete the selected record(s)?
        </span>
      </a-modal>
      <a-modal
        v-model="addOrEditWinVisible"
        :title="title"
        :destroyOnClose="true"
        width="940px"
      >
        <ScheduleAddOrEdit
          ref="scheduleAddOrEditRef"
          :schedule="curEditSchedule"
          @passChildContent="passChildContent"
        ></ScheduleAddOrEdit>
        <template slot="footer">
          <a-button
            key="submit"
            type="primary"
            :loading="addOrEditLoading"
            @click="addOrEditOK"
          >
            OK
          </a-button>
          <a-button key="back" @click="addOrEditCancel">Cancel</a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import ScheduleAddOrEdit from './ScheduleAddOrEdit';
import {
  ScheduleQuery,
  ScheduleAdd,
  ScheduleModify,
  ScheduleDelete
} from 'apis/Configuration';
export default {
  name: 'Schedule',
  components: {
    ScheduleAddOrEdit
  },
  data() {
    return {
      keywords: '',
      columns: [
        {
          field: 'custom',
          width: 36,
          columnAlign: 'center',
          titleAlign: 'center',
          type: 'selection'
        },
        {
          field: 'name',
          title: 'Name',
          width: 146,
          columnAlign: 'left',
          isResize: true,
          componentName: 'schedule-opration'
        },
        {
          field: 'description',
          title: 'Description',
          width: 246,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'tag',
          title: 'Tag',
          width: 246,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'recurrence',
          title: 'Recurrence',
          width: 246,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'time',
          title: 'Time',
          width: 246,
          columnAlign: 'left',
          isResize: true
        }
      ],
      tableDataList: [],
      totalCount: 0,
      pageIndex: 1,
      pageSize: 20,
      delWinVisible: false,
      delLoading: false,
      addOrEditWinVisible: false,
      addOrEditLoading: false,
      curEditSchedule: {},
      curAddSchedule: {},
      title: ''
    };
  },
  computed: {
    ...mapState(['organization', 'deviceName'])
  },
  created() {
    this.querySchedules();
  },
  methods: {
    // 表格操作Table start
    search() {
      this.querySchedules();
    },
    customTableFunc(params) {
      this.operType = 'edit';
      this.curEditSchedule = params.rowData;
      this.curEditSchedule.tempDisabled = true;
      this.title = 'Edit Schedule';
      this.addOrEditWinVisible = true;
    },
    selectALL(selection) {
      this.delScheduleList = {
        data: []
      };
      for (let row of selection) {
        this.delScheduleList.data.push(row.name);
      }
    },
    selectChange(selection) {
      this.delScheduleList = {
        data: []
      };
      for (let row of selection) {
        this.delScheduleList.data.push(row.name);
      }
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    async querySchedules() {
      const res = await ScheduleQuery({
        orgName: this.organization,
        deviceName: this.deviceName,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
      if (res.message === 'Success') {
        this.tableDataList = res.result ? res.result : null;
        this.totalCount = res.totalCount;
      } else {
        this.tableDataList = [{}];
        this.totalCount = 0;
      }
    },
    // 表格操作Table end
    // 分页操作Page start
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.querySchedules();
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.querySchedules();
    },
    // 分页操作Page end
    // Schedule Add start
    showAddWinModal() {
      this.operType = 'add';
      this.curEditSchedule = {};
      this.title = 'Add Schedule';
      this.addOrEditWinVisible = true;
    },
    async addOrEditOK() {
      let isOK = this.satisfyValidation();
      if (isOK) {
        this.addOrEditLoading = true;
        let params = {
          orgaName: this.organization,
          deviceName: this.deviceName
        };
        let res = {};
        
        for (let key in this.curAddSchedule) {
          if (key.indexOf('temp') == 0) {
            delete this.curAddSchedule[key];
          }
        }
        params.data = this.curAddSchedule;
        if (this.operType === 'add') {
          res = await ScheduleAdd(params);
        } else {
          res = await ScheduleModify(params);
        }
        this.addOrEditLoading = false;
        if (res.message === 'Success') {
          this.addOrEditWinVisible = false;
          this.querySchedules();
        }
      }
    },
    addOrEditCancel() {
      this.addOrEditWinVisible = false;
    },
    passChildContent(schedule) {
      this.curAddSchedule = schedule;
    },
    satisfyValidation() {
      let isOK = true;
      this.$refs.scheduleAddOrEditRef.$refs.scheduleForm.validate(valid => {
        if (!valid) {
          isOK = false;
          return false;
        }
      });
      return isOK;
    },
    // Schedule Add end
    // Schedule Delete start
    showDelWinModal() {
      this.delWinVisible = true;
    },
    async delOK() {
      // coding
      const res = await ScheduleDelete({
        orgName: this.organization,
        deviceName: this.deviceName,
        data: this.delScheduleList.data
      });
      if (res.message === 'Success') {
        this.showDelWinModal = false;
        this.pageIndex = 1;
        this.querySchedules();
      }
    },
    delCancel() {
      this.delWinVisible = false;
    }
    // Schedule Delete end
  }
};
Vue.component('schedule-opration', {
  template: `<span>
    <a href="" @click.stop.prevent="update(rowData,index)">{{ rowData.name }}</a>
    </span>`,
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
.schedules {
  height: 100%;
  overflow: hidden;
  min-height: 503px;
  .list-action {
    line-height: 18px;
    color: #0f2c3e;
    font-size: 12px;
    margin-bottom: 10px;
    .table-header {
      margin-bottom: 10px;
      height: 22px;
    }
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
