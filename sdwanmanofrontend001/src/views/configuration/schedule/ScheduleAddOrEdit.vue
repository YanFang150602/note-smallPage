<template>
  <div>
    <a-form-model
      ref="scheduleForm"
      layout="vertical"
      style="margin: 10px 10px"
      :model="cSchedule"
      :rules="rules"
    >
      <a-form-model-item label="Name" prop="name" required>
        <a-input
          size="small"
          v-model="cSchedule.name"
          :disabled="cSchedule.disabled"
        />
      </a-form-model-item>
      <a-form-model-item label="Description">
        <a-input size="small" v-model="cSchedule.description" />
      </a-form-model-item>
      <a-form-model-item label="Tags">
        <a-input size="small" v-model="cSchedule.tags" />
      </a-form-model-item>
      <a-form-model-item label="Recurrence">
        <a-select
          size="small"
          v-model="cSchedule.recurrence"
          style="width:250px"
          @change="changeRecurrence"
        >
          <a-select-option
            :value="item"
            v-for="(item, index) in optionList"
            :key="index"
          >
            {{ item }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
    <a-row type="flex" justify="end" align="middle">
      <a-col>
        <v-pagination
          :total="totalCount"
          size="small"
          :page-size="pageSize"
          :layout="['prev', 'jumper', 'total', 'next']"
          @page-change="pageChange"
          @page-size-change="pageSizeChange"
        ></v-pagination>
      </a-col>
    </a-row>
    <v-table
      v-if="showNonRecurringTable"
      is-horizontal-resize
      :columns="nonRecurringColumns"
      :table-data="nonRecurringTableData"
      :height="250"
      style="width:100%;"
      isFrozen="true"
      @on-custom-comp="customTableFunc"
    ></v-table>
    <v-table
      v-if="showDailyTable"
      is-horizontal-resize
      :columns="dailyColumns"
      :table-data="dailyTableData"
      :height="250"
      style="width:100%;"
      isFrozen="true"
      @on-custom-comp="customTableFunc"
    ></v-table>
    <v-table
      v-if="showWeeklyTable"
      is-horizontal-resize
      :columns="weeklyColumns"
      :table-data="weeklyTableData"
      :height="250"
      style="width:100%;"
      isFrozen="true"
      @on-custom-comp="customTableFunc"
    ></v-table>
  </div>
</template>
<script>
import Vue from 'vue';
import moment from 'moment';
export default {
  name: 'ScheduleAddOrEdit',
  props: ['schedule'],
  data() {
    return {
      cSchedule: {},
      optionList: ['Non-Recurring', 'Daily', 'Weekly'],
      totalCount: 0,
      pageSize: 10,
      allColumns: [
        {
          field: 'day-of-week',
          title:
            '<span >Day of Week<label style="color:red;margin-left:8px;font-size:14px;">*</label></span>',
          width: 146,
          columnAlign: 'left',
          isResize: true,
          componentName: 'dayofweek-opration'
        },
        {
          field: 'start-date',
          title:
            '<span >Start Date<label style="color:red;margin-left:8px;font-size:14px;">*</label></span>',
          width: 146,
          columnAlign: 'left',
          isResize: true,
          componentName: 'startdate-opration'
        },
        {
          field: 'start-time',
          title:
            '<span >Start Time<label style="color:red;margin-left:8px;font-size:14px;">*</label></span>',
          width: 146,
          columnAlign: 'left',
          isResize: true,
          componentName: 'starttime-opration'
        },
        {
          field: 'end-date',
          title:
            '<span >End Date<label style="color:red;margin-left:8px;font-size:14px;">*</label></span>',
          width: 146,
          columnAlign: 'left',
          isResize: true,
          componentName: 'enddate-opration'
        },
        {
          field: 'end-time',
          title:
            '<span >End Time<label style="color:red;margin-left:8px;font-size:14px;">*</label></span>',
          width: 146,
          columnAlign: 'left',
          isResize: true,
          componentName: 'endtime-opration'
        },
        {
          field: 'operation',
          title: 'Operation',
          width: 46,
          columnAlign: 'left',
          isResize: true,
          componentName: 'custom-opration'
        }
      ],
      nonRecurringTableData: [
        {
          'start-date': '2020-10-19',
          'start-time': '10:08:23',
          'end-date': '2020-10-20',
          'end-time': '10:08:23'
        }
      ],
      dailyTableData: [
        {
          'start-time': '10:08:23',
          'end-time': '10:08:23'
        }
      ],
      weeklyTableData: [
        {
          'day-of-week': 'Monday',
          'start-time': '10:08:23',
          'end-time': '10:08:23'
        }
      ],
      showNonRecurringTable: false,
      showDailyTable: false,
      showWeeklyTable: false,
      rules: {
        name: [
          {
            required: true,
            message: 'Name is required',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  computed: {
    nonRecurringColumns() {
      return this.allColumns.slice(1);
    },
    dailyColumns() {
      let columns = [];
      for (let i = 0; i < this.allColumns.length; i++) {
        if (
          this.allColumns[i].field === 'start-time' ||
          this.allColumns[i].field === 'end-time'
        ) {
          columns.push(this.allColumns[i]);
        } else if (this.allColumns[i].field === 'operation') {
          columns.push(this.allColumns[i]);
        }
      }
      return columns;
    },
    weeklyColumns() {
      let columns = [];
      for (let i = 0; i < this.allColumns.length; i++) {
        if (this.allColumns[i].field === 'day-of-week') {
          columns.push(this.allColumns[i]);
        } else if (
          this.allColumns[i].field === 'start-time' ||
          this.allColumns[i].field === 'end-time'
        ) {
          columns.push(this.allColumns[i]);
        } else if (this.allColumns[i].field === 'operation') {
          columns.push(this.allColumns[i]);
        }
      }
      return columns;
    }
  },
  created() {
    console.log('ScheduleAddOrEdit created....');
  },
  mounted() {
    console.log('ScheduleAddOrEdit mounted...');
    this.cSchedule = { ...this.schedule };
    this.changeRecurrence(this.cSchedule.recurrence);
  },
  updated() {
    this.$emit('passChildContent', this.cSchedule);
  },
  methods: {
    changeRecurrence(option) {
      switch (option) {
        case 'Daily':
          this.showNonRecurringTable = false;
          this.showDailyTable = true;
          this.showWeeklyTable = false;
          break;
        case 'Weekly':
          this.showNonRecurringTable = false;
          this.showDailyTable = false;
          this.showWeeklyTable = true;
          break;
        default:
          this.showNonRecurringTable = true;
          this.showDailyTable = false;
          this.showWeeklyTable = false;
          break;
      }
    },
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      // coding
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      // coding
    },
    customTableFunc(params) {
      console.log('params = ', params);
      switch (params.type) {
        case 'add':
          this.showNonRecurringTable
            ? this.nonRecurringTableData.push({})
            : null;
          this.showDailyTable ? this.dailyTableData.push({}) : null;
          this.showWeeklyTable ? this.weeklyTableData.push({}) : null;
          break;
        case 'dayofweek':
          this.weeklyTableData[params.index]['day-of-week'] = params.dayOfWeek;
          break;
        case 'startdate':
          this.nonRecurringTableData[params.index]['start-date'] = params.date;
          break;
        case 'enddate':
          this.nonRecurringTableData[params.index]['end-date'] = params.date;
          break;
        case 'starttime':
          this.showNonRecurringTable
            ? (this.nonRecurringTableData[params.index]['start-time'] =
                params.time)
            : this.showDailyTable
            ? (this.dailyTableData[params.index]['start-time'] = params.time)
            : (this.weeklyTableData[params.index]['start-time'] = params.time);
          break;
        case 'endtime':
          this.showNonRecurringTable
            ? (this.nonRecurringTableData[params.index]['end-time'] =
                params.time)
            : this.showDailyTable
            ? (this.dailyTableData[params.index]['end-time'] = params.time)
            : (this.weeklyTableData[params.index]['end-time'] = params.time);
          break;
        default:
          break;
      }
      console.log(this.nonRecurringTableData);
      /* console.log(this.dailyTableData);
      console.log(this.weeklyTableData); */
    }
  }
};

let props = {
  rowData: {
    type: Object
  },
  field: {
    type: String
  },
  index: {
    type: Number
  }
};
Vue.component('startdate-opration', {
  template: `<span>
    <a-date-picker size="small" :showToday="false" :allowClear="false" @change="changeDate" :default-value="value"/>
    </span>`,
  props,
  computed: {
    value: {
      get() {
        return this.rowData['start-date']
          ? moment(this.rowData['start-date'], 'YYYY-MM-DD')
          : '';
      },
      set() {}
    }
  },
  methods: {
    changeDate(date, dateString) {
      this.value = date;
      // 参数根据业务场景随意构造
      let params = {
        type: 'startdate',
        index: this.index,
        rowData: this.rowData,
        date: dateString
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('enddate-opration', {
  template: `<span>
    <a-date-picker size="small" :showToday="false" :allowClear="false" @change="changeDate" :default-value="value"/>
    </span>`,
  props,
  computed: {
    value: {
      get() {
        return this.rowData['end-date']
          ? moment(this.rowData['end-date'], 'YYYY-MM-DD')
          : '';
      },
      set() {}
    }
  },
  methods: {
    changeDate(date, dateString) {
      this.value = date;
      // 参数根据业务场景随意构造
      let params = {
        type: 'enddate',
        index: this.index,
        rowData: this.rowData,
        date: dateString
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('starttime-opration', {
  template: `<span>
    <a-time-picker
      format="HH:mm"
      size="small"
      :open="open"
      :allowClear="false"
      :minute-step="15"
      :default-value="value"
      @change="changeTime"
      @openChange="() => {open = true}">
      <a-button slot="addon" slot-scope="panel" size="small" type="primary" @click="()=> {open = false;}">
        OK
      </a-button>
    </a-time-picker>
    </span>`,
  data() {
    return {
      open: false
    };
  },
  props,
  computed: {
    value: {
      get() {
        return this.rowData['start-time']
          ? moment(this.rowData['start-time'], 'HH:mm')
          : '';
      },
      set() {}
    }
  },
  methods: {
    changeTime(time, timeString) {
      this.value = time;
      // 参数根据业务场景随意构造
      let params = {
        type: 'starttime',
        index: this.index,
        rowData: this.rowData,
        time: timeString
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('endtime-opration', {
  template: `<span>
    <a-time-picker
      format="HH:mm"
      size="small"
      :open="open"
      :allowClear="false"
      :minute-step="15"
      :default-value="value"
      @change="changeTime"
      @openChange="() => {open = true}">
      <a-button slot="addon" slot-scope="panel" size="small" type="primary" @click="()=> {open = false;}">
        OK
      </a-button>
    </a-time-picker>
    </span>`,
  data() {
    return {
      open: false
    };
  },
  props,
  computed: {
    value: {
      get() {
        return this.rowData['end-time']
          ? moment(this.rowData['end-time'], 'HH:mm')
          : '';
      },
      set() {}
    }
  },
  methods: {
    changeTime(time, timeString) {
      this.value = time;
      // 参数根据业务场景随意构造
      let params = {
        type: 'endtime',
        index: this.index,
        rowData: this.rowData,
        time: timeString
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('dayofweek-opration', {
  template: `<span>
    <a-select
      size="small"
      :default-value="['Monday']"
      @change="changeDayOfWeek"
      style="min-width: 150px"
    >
      <a-select-option
        :value="item"
        v-for="(item) in optionList"
        :key="item"
      >
        {{ item }}
      </a-select-option>
    </a-select>
    </span>`,
  data() {
    return {
      optionList: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ]
    };
  },
  props,
  methods: {
    changeDayOfWeek(option) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'dayofweek',
        index: this.index,
        rowData: this.rowData,
        dayOfWeek: option
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('custom-opration', {
  template: `<span>
      <a-button size="small" icon="plus" @click="clickHandler"/>
    </span>`,
  props,
  methods: {
    clickHandler() {
      // 参数根据业务场景随意构造
      let params = { type: 'add', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    }
  }
});
</script>
<style lang="scss" scoped>
/deep/.ant-form-item-label > label {
  color: #fff;
}
/deep/.ant-form-vertical .ant-form-item {
  margin-bottom: 8px;
}
</style>
