<template>
  <v-table
    is-horizontal-resize="true"
    column-width-drag
    style="width:100%"
    :columns="columns"
    :table-data="tableData"
    row-hover-color="#eee"
    row-click-color="#edf7ff"
    isFrozen: true
  ></v-table>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          name: '赵伟',
          tel: '156*****1987',
          hobby: '钢琴、书法、唱歌',
          address: '上海市黄浦区金陵东路569号17楼'
        },
        {
          name: '李伟',
          tel: '182*****1538',
          hobby: '钢琴、书法、唱歌',
          address: '上海市奉贤区南桥镇立新路12号2楼'
        },
        {
          name: '李伟',
          tel: '182*****1538',
          hobby: '钢琴、书法、唱歌',
          address: '上海市奉贤区南桥镇立新路12号2楼'
        }
      ],
      columns: [
        {
          width: 60,
          titleAlign: 'center',
          columnAlign: 'center',
          type: 'selection'
        },
        {
          field: 'name',
          title: '姓名',
          width: 80,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'tel',
          title: '手机号码',
          width: 150,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'hobby',
          title: '爱好',
          width: 150,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true
        },
        {
          field: 'address',
          title: '地址',
          width: 280,
          titleAlign: 'center',
          columnAlign: 'left',
          isResize: true
        }
      ]
    };
  },
  methods: {
    selectALL(selection) {
      console.log('select-aLL', selection);
    },

    selectChange(selection, rowData) {
      console.log('select-change', selection, rowData);
    },

    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    }
  }
};
</script>
