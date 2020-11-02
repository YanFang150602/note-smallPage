<template>
  <div class="spokeGroups">
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
            <a-button type="link" @click="groupDel" :disabled="delet">
              <a-icon type="minus" />
            </a-button>
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
      :table-data="spoke.data"
      :select-all="selectALL"
      :select-change="selectChange"
      :select-group-change="selectGroupChange"
      :height="540"
      style="width:100%;"
      isFrozen="true"
      @on-custom-comp="customCompFunc"
    ></v-table>
    <!-- 新增弹框 -->
    <div>
      <a-modal
        v-model="visible"
        title="Add Spoke Group"
        @ok="handleOk"
        width="1000px"
        :afterClose="close"
        :destroyOnClose="true"
      >
        <template slot="footer">
          <a-button key="submit" type="primary" @click="handleOk"
            >Save</a-button
          >
          <a-button key="back" @click="handleCancel">Cancel</a-button>
        </template>
        <SpokeAdd @add="add" ref="spokeAdd"></SpokeAdd>
      </a-modal>
    </div>

    <!-- 查看弹框 -->
    <div>
      <a-modal
        v-model="visibleExamine"
        title="Check Spoke Group"
        @ok="handleOkEdit"
        width="1000px"
        :destroyOnClose="true"
      >
        <SpokeCheck :formCheck="spokeCheck" @edit="edit"></SpokeCheck>
        <template slot="footer">
          <a-button key="submit" type="primary" @click="handleOkEdit"
            >Save</a-button
          >
          <a-button key="back" @click="handleCancelEdit">Cancel</a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
import SpokeAdd from './SpokeAdd';
import SpokeCheck from './SpokeCheck';
import {
  SPTableForm,
  SPDelete,
  spokeAdd,
  spokeCheck,
  spokeEdit
} from 'apis/spokeGroups';
import { mapState } from 'vuex';

export default {
  components: {
    SpokeAdd,
    SpokeCheck
  },
  data() {
    return {
      delet: true,
      //分页
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      // 搜索框
      keyworks: '',
      // 新增弹框
      visible: false,
      // 查看弹框
      visibleExamine: false,
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
          width: 180,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          componentName: 'table-operationSpoke'
        },
        {
          field: 'org',
          title: 'Organization',
          width: 180,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'modifyDate',
          title: 'Routing Instance',
          width: 180,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'status',
          title: 'Status',
          width: 180,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'createDate',
          title: 'Create Date',
          width: 180,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'modifyDate',
          title: 'Last Modified Date',
          width: 180,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'lastUpdatedBy',
          title: 'Last Modified By',
          width: 180,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        }
      ],
      // 删除数据
      dele: {
        ids: []
      },
      // 接收子组件的表单数据
      spokeAdd: {
        name: '',
        org: '',
        vrfs: [
          {
            name: '',
            groupType: '',
            hubs: [
              {
                name: '',
                priority: ''
              }
            ]
          }
        ]
      },
      // spoke组查询的数据
      spokeCheck: {
        name: '',
        org: '',
        vrfs: [
          {
            name: '',
            groupType: '',
            hubs: [
              {
                name: '',
                priority: ''
              }
            ]
          }
        ]
      },
      // 点击当行的内容
      spokeParams: {},
      formInline: {
        name: '',
        org: '',
        vrfs: [
          {
            name: '',
            groupType: '',
            hubs: [
              {
                name: '',
                priority: ''
              }
            ]
          }
        ]
      }
    };
  },
  created() {
    // 列表
    this.tableForm();
    // spoke组查询
    // this.customCompFunc();
    // this.$store.dispatch('SPTableForm', {
    //   orgname: this.organization,
    //   offset: 0,
    //   limit: this.pageSize
    // });
    if (this.organization == '') {
      this.tableForm();
    }
    // this.queryDeviceGrops();
  },
  computed: {
    ...mapState(['spoke', 'organization'])
  },
  methods: {
    // 分页
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.tableForm();
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.tableForm();
    },
    // 新增弹框
    showModal() {
      this.visible = true;
    },
    async handleOk() {
      const res = await spokeAdd(this.spokeAdd);
      console.log(res);

      this.tableForm();
      this.$refs.spokeAdd.$refs.ruleForm.validate(valid => {
        if (valid) {
          // this.$message.success('创建轮询组成功!');
          // this.visible = false;
          // this.spokeAdd = {};
          if (res.message === 'Success') {
            this.$message.success('创建轮询组成功!');
            this.spokeAdd = {};
            this.visible = false;
            this.$refs.spokeAdd.showX();
            this.$refs.spokeAdd.$refs.ruleForm.resetFields();
          } else {
            this.$message.error(res.message);
            this.visible = true;
          }
        } else {
          // this.$message.error(res.message);
          console.log('error submit!!');
          return false;
        }
      });

      // this.$refs.spokeAdd.spokeAdd.name = '';
      // this.$refs.spokeAdd.$refs.ruleForm.resetFields();
      // this.spokeAdd.vrfs = [];
    },
    handleCancel() {
      this.$refs.spokeAdd.$refs.ruleForm.resetFields();
      this.visible = false;
      this.$refs.spokeAdd.showX();
    },
    // 查看编辑
    async handleOkEdit() {
      this.visibleExamine = false;
      const res = await spokeEdit(this.spokeParams.rowData.name, {
        ...this.spokeEdit
      });
      console.log(res);
      if (res.message === 'Success') {
        this.$message.success('编辑成功');
      } else {
        this.$message.error(res.message);
      }
    },
    handleCancelEdit() {
      this.visibleExamine = false;
    },
    // 表格方法
    selectALL(selection) {
      console.log('select-aLL1111111111111', selection);
      selection.forEach(item => {
        console.log(item.deviceName);
        this.dele.ids.push(item.deviceName);
      });
      const newArr = Array.from(new Set(this.dele.ids));
      this.dele.ids = newArr;
      console.log(this.dele);
    },

    selectChange(selection, rowData) {
      console.log('select-change22222222222', selection, rowData);
      selection.forEach(item => {
        console.log(item.name);
        this.dele.ids.push(item.name);
      });
      const newArr = Array.from(new Set(this.dele.ids));
      this.dele.ids = newArr;
      console.log(this.dele);
      if (this.dele.ids.length <= 0) {
        this.delet = true;
      } else {
        this.delet = false;
      }
    },

    selectGroupChange(selection) {
      console.log('select-group-change3333333333', selection);
      if (selection.length > 1) {
        selection.shift();
      }
    },
    async customCompFunc(params) {
      console.log(params);
      this.spokeParams = params;
      if (params.type === 'delete') {
        this.$delete(this.tableData, params.index);
      } else if (params.type === 'edit') {
        this.visibleExamine = true;
      }
      // spoke组查询
      const res = await spokeCheck(params.rowData.name);
      console.log(res.result);
      this.spokeCheck = res.result;
      console.log(this.spokeCheck);
    },
    // 表格获取数据
    async tableForm() {
      const offset = (this.pageIndex - 1) * this.pageSize;
      const limit = this.pageSize;
      const orgname = '';
      const res = await SPTableForm(orgname, offset, limit);
      console.log(res.result.totalCount);
      this.spoke.data = res.result.data;
      this.totalCount = res.result.totalCount;
      this.tableData = res.result.data;
    },
    // 选取了组织
    queryDeviceGrops() {
      this.$store.dispatch('spoke', {
        orgname: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    },

    // 表格数据删除
    async groupDel() {
      const res = await SPDelete(this.dele);
      console.log(res);
      this.tableForm();
      if (res.message === 'Success') {
        this.$message.success('删除成功');
        this.dele.ids = [];
      } else {
        this.$message.error(res.message);
      }
    },
    // 接收子组件的表单数据
    add(ad) {
      this.spokeAdd = { ...ad };
    },
    // 接收编辑子页面的数据
    edit(ed) {
      this.spokeEdit = { ...ed };
    },
    close() {
      this.spokeAdd = {};
      console.log(this.spokeAdd);
    }
  }
};
import Vue from 'vue';
Vue.component('table-operationSpoke', {
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
.spokeGroups {
  padding: 5px 20px 30px 15px;
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
//新增弹框
/deep/.ant-modal-content {
  height: 100%;
  .ant-modal-header {
    background-color: #e9f4fc;
    .ant-modal-title {
      line-height: 8px;
    }
  }
  .ant-modal-body {
    padding: 0;
    height: 100%;
    background-color: #36536b;
  }
  .ant-modal-footer {
    background-color: #e9f4fc;
  }
}

// 查看弹框
/deep/.ant-modal-content {
  height: 100%;
}
</style>
