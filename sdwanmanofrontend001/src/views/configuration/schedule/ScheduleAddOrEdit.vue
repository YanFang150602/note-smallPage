<template>
  <div>
    <a-form-model
      ref="scheduleForm"
      layout="vertical"
      style="margin: 10px 10px"
      :model="cSchedule"
      :rules="rules"
    >
      <a-form-model-item label="Name" prop="name">
        <a-input
          size="small"
          v-model="cSchedule.name"
          :disabled="cSchedule.tempDisabled"
        />
      </a-form-model-item>
      <a-form-model-item label="Description">
        <a-input size="small" v-model="cSchedule.description" />
      </a-form-model-item>
      <a-form-model-item label="Tags">
        <a-select
          mode="tags"
          size="small"
          placeholder="--Select--"
          v-model="cSchedule.tags"
        >
          <a-select-option
            v-for="(item, index) in tagsOptions"
            :value="item.value"
            :key="index"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="Recurrence">
        <a-select
          size="small"
          v-model="cSchedule.tempRecurring"
          style="width:250px"
          @change="changeRecurrence"
        >
          <a-select-option
            :value="item.value"
            v-for="(item, index) in optionList"
            :key="index"
          >
            {{ item.label }}
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
      cSchedule: {
        name: '',
        description: '',
        tags: [],
        recurring: [],
        tempRecurring: 'non-recurring',
        tempDisabled: false
      },
      tagsOptions: [
        {
          label: this.$t('SelectNull'),
          value: ''
        }
      ],
      optionList: [
        {
          label: 'Non-Recurring',
          value: 'non-recurring'
        },
        {
          label: 'Daily',
          value: 'daily'
        },
        {
          label: 'Weekly',
          value: 'weekly'
        }
      ],
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
          'start-date': '',
          'start-time': '',
          'end-date': '',
          'end-time': ''
        }
      ],
      dailyTableData: [
        {
          'start-time': '',
          'end-time': ''
        }
      ],
      weeklyTableData: [
        {
          'day-of-week': 'monday',
          'start-time': '',
          'end-time': ''
        }
      ],
      showNonRecurringTable: false,
      showDailyTable: false,
      showWeeklyTable: false,
      editNonRecurring: false,
      editDaily: false,
      editWeekly: false,
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
  mounted() {
    if (this.schedule.name) {
      this.cSchedule = { ...this.schedule };
      if (this.cSchedule.recurring && this.cSchedule.recurring.length) {
        if (this.cSchedule.recurring.length === 1) {
          this.cSchedule.tempRecurring = this.cSchedule.recurring[0].recurrence;
          if (this.cSchedule.tempRecurring === 'non-recurring') {
            let datetimeGroups = this.cSchedule.recurring[0].time.split(',');
            this.nonRecurringTableData = [];
            datetimeGroups.forEach(datetimeGroup => {
              let [startDate, endDate] = datetimeGroup.split('-');
              let nonRecurring = {};
              startDate.forEach(datetime => {
                let [date, time] = datetime.split('@');
                nonRecurring['start-date'] = date;
                nonRecurring['start-time'] = time;
              });
              endDate.forEach(datetime => {
                let [date, time] = datetime.split('@');
                nonRecurring['end-date'] = date;
                nonRecurring['end-time'] = time;
              });
              this.nonRecurringTableData.push(nonRecurring);
            });
            this.totalCount = this.nonRecurringTableData.length;
          } else if (this.cSchedule.tempRecurring === 'daily') {
            let timeGroups = this.cSchedule.recurring[0].time.split(',');
            timeGroups.forEach(timeGroup => {
              let [startTime, endTime] = timeGroup.split('-');
              let daily = {
                'start-time': startTime,
                'end-time': endTime
              };
              this.dailyTableData.push(daily);
            });
            this.totalCount = this.dailyTableData.length;
          }
        } else {
          this.cSchedule.tempRecurring = 'weekly';
          this.cSchedule.recurring.forEach(recurring => {
            let [startTime, endTime] = recurring.time.split('-');
            let weekly = {
              'day-of-week': recurring.recurrence,
              'start-time': startTime,
              'end-time': endTime
            };
            this.weeklyTableData.push(weekly);
          });
          this.totalCount = this.weeklyTableData.length;
        }
      } else {
        this.cSchedule.recurring = [];
        this.cSchedule.tempRecurring = 'non-recurring';
      }
    }
    this.changeRecurrence(this.cSchedule.tempRecurring);
  },
  updated() {
    this.$emit('passChildContent', this.cSchedule);
  },
  methods: {
    changeRecurrence(option) {
      console.log(this.cSchedule.tempRecurring);
      switch (option) {
        case 'daily':
          this.showNonRecurringTable = false;
          this.showDailyTable = true;
          this.showWeeklyTable = false;
          break;
        case 'weekly':
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
      this.editRecurring();
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
      console.log('customTableFunc this.cSchedule.tempRecurring = ', this.cSchedule.tempRecurring);
      switch (params.type) {
        case 'add':
          if (this.showNonRecurringTable) {
            this.nonRecurringTableData.push({});
          } else if (this.showDailyTable) {
            this.dailyTableData.push({});
          } else {
            this.weeklyTableData.push({});
          }
          break;
        case 'dayofweek':
          this.weeklyTableData[params.index]['day-of-week'] = params.dayOfWeek;
          this.editRecurring();
          break;
        case 'startdate':
          this.nonRecurringTableData[params.index]['start-date'] = params.date;
          this.editRecurring();
          break;
        case 'enddate':
          this.nonRecurringTableData[params.index]['end-date'] = params.date;
          this.editRecurring();
          break;
        case 'starttime':
          if (this.showNonRecurringTable) {
            this.nonRecurringTableData[params.index]['start-time'] = params.time;
          } else if (this.showDailyTable) {
            this.dailyTableData[params.index]['start-time'] = params.time;
          } else {
            this.weeklyTableData[params.index]['start-time'] = params.time;
          }
          this.editRecurring();
          break;
        case 'endtime':
          if (this.showNonRecurringTable) {
            this.nonRecurringTableData[params.index]['end-time'] = params.time;
          } else if (this.showDailyTable) {
            this.dailyTableData[params.index]['end-time'] = params.time;
          } else {
            this.weeklyTableData[params.index]['end-time'] = params.time;
          }
          this.editRecurring();
          break;
        default:
          break;
      }
      console.log('this.nonRecurringTableData = ', this.nonRecurringTableData);
    },
    editRecurring() {
      console.log('this.cSchedule.tempRecurring = ', this.cSchedule.tempRecurring);
      this.cSchedule.recurring = [];
      if (this.cSchedule.tempRecurring === 'daily') {
        this.cSchedule.recurring.push({});
        this.cSchedule.recurring[0].recurrence = 'daily';
        let timeGroups = [];
        this.dailyTableData.forEach(daily => {
          let timeGroup = daily['start-time'] + '-' + daily['end-time'];
          timeGroups.push(timeGroup);
        });
        this.cSchedule.recurring[0].time = timeGroups.join();
      } else if (this.cSchedule.tempRecurring === 'non-recurring') {
        this.cSchedule.recurring.push({});
        this.cSchedule.recurring[0].recurrence = 'non-recurring';
        let datetimeGroups = [];
        this.nonRecurringTableData.forEach(nonRecurring => {
          console.log('nonRecurring = ', nonRecurring);
          let datetimeGroup =
            nonRecurring['start-date'] +
            '@' +
            nonRecurring['start-time'] +
            '-' +
            nonRecurring['end-date'] +
            '@' +
            nonRecurring['end-time'];
          datetimeGroups.push(datetimeGroup);
        });
        this.cSchedule.recurring[0].time = datetimeGroups.join();
      } else {
        let weekGroups = [];
        this.weeklyTableData.forEach(weekly => {
          let weekGroup = {
            recurrence: weekly['day-of-week'],
            time: weekly['start-time'] + '-' + weekly['end-time']
          };
          weekGroups.push(weekGroup);
        });
        this.cSchedule.recurring = weekGroups;
      }
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
    <a-date-picker
      size="small"
      format="YYYY/MM/DD"
      :showToday="false"
      :allowClear="false"
      @change="changeDate"
      :default-value="value"
    />
    </span>`,
  props,
  computed: {
    value: {
      get() {
        return this.rowData['start-date']
          ? moment(this.rowData['start-date'], 'YYYY/MM/DD')
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
    <a-date-picker
      size="small"
      format="YYYY/MM/DD"
      :showToday="false"
      :allowClear="false"
      @change="changeDate"
      :default-value="value"
    />
    </span>`,
  props,
  computed: {
    value: {
      get() {
        return this.rowData['end-date']
          ? moment(this.rowData['end-date'], 'YYYY/MM/DD')
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
        v-for="(item, index) in optionList"
        :value="item.value"
        :key="index"
      >
        {{ item.label }}
      </a-select-option>
    </a-select>
    </span>`,
  data() {
    return {
      optionList: [
        {
          label: 'Monday',
          value: 'moday'
        },
        {
          label: 'Tuesday',
          value: 'tuesday'
        },
        {
          label: 'Wednesday',
          value: 'wednesday'
        },
        {
          label: 'Thursday',
          value: 'thursday'
        },
        {
          label: 'Friday',
          value: 'friday'
        },
        {
          label: 'Saturday',
          value: 'saturday'
        },
        {
          label: 'Sunday',
          value: 'sunday'
        }
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
