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
    <AddressAdd ref="AddressAddRef"></AddressAdd>
    <!-- 删除的弹框 -->
    <AddressDelete ref="AddressDeleteRef" :addressDele="idDele"></AddressDelete>
    <!-- 查看弹框 -->
    <AddressEdit
      ref="AddressEditRef"
      :addressEdit="addressCheck"
      :addressDele="idDele"
    ></AddressEdit>
  </div>
</template>
<script>
import AddressAdd from './AddressAdd';
import AddressDelete from './AddressDelete';
import AddressEdit from './AddressEdit';
import { addressForm } from 'apis/address';
import { mapState } from 'vuex';

export default {
  name: 'QosProfiles',
  components: {
    AddressAdd,
    AddressDelete,
    AddressEdit
  },
  data() {
    return {
      // 搜索框
      keyworks: '',
      // 新增弹框
      visible: false,
      // 删除弹框
      visibleDelete: false,
      // 查看弹框
      visibleCheck: false,
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
          field: 'deviceName',
          title: 'Name',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          componentName: 'table-operationDevice'
        },
        {
          field: 'type',
          title: 'Type',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'value',
          title: 'Value',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        }
      ],
      addressCheck: {},
      // 删除传递参数
      idDele: '',
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
      this.$refs.AddressAddRef.showModalAdd();
    },
    // 删除弹框
    showModalDelete() {
      this.$refs.AddressDeleteRef.showModalDelete();
    },
    // 表格方法
    selectALL(selection) {
      console.log('select-aLL', selection);
    },
    selectChange(selection, rowData) {
      console.log('select-change', selection, rowData);
      console.log(rowData.name);
      this.idDele = rowData.name;
      console.log(this.idDele);
      // selection.forEach(item => {
      //   console.log(item.deviceName);
      //   this.dele.ids.push(item.deviceName);
      //   // this.dele.id = item.deviceName;
      // });
      // const newArr = Array.from(new Set(this.dele.ids));
      // this.dele.ids = newArr;
      // console.log(this.dele);
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    async customCompFunc(params) {
      console.log(params);
      this.addressCheck = params.rowData;
      this.addressCheck.tags = this.addressCheck.tags || [];
      if (this.addressCheck.description === 'null') {
        this.addressCheck.description = '';
      }
      console.log(this.addressCheck);
      this.$refs.AddressEditRef.showModalEdit();
    },
    async tableForm() {
      const res = await addressForm({
        deviceName: this.deviceName,
        userName: this.organization,
        offset: 0,
        limit: 25,
        name: ''
      });
      console.log(res.result);
      res.result.forEach(item => {
        console.log(item);
      });
      this.tableData = res.result;
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
// import { import } from '@babel/types';
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
