<!--
  yearStart：开始年份
  yearEnd：  结束年份
  maxDate：  最大时间
  minDate：  最小时间
  tipContent：提示内容
  inputTime： 组件事件($emit)，输入时，获取时间值（可以用来控制开始、结束时间场景的最大值、最小值）
-->
<template>
  <!--data_selector start-->
  <div class="dateSelectWrapper" v-bind:class="[errorsBorder]">
    <div class="dateSelectInput">
      <div ref="dateIconRef" class="icon-marvelIcon-21 heightCls" v-on:click="onInputClick"></div>
      <div class="LabelArea" :title="datetime">
        <input  ref="timeInputRef" type="text" v-model="datetime"
                class="inputWrapper heightCls" @blur="onBlur" @focus="onFocus" @input="onInput"></input>
      </div>
    </div>
    <div class="dateDropWrapper" :class="{dpn:!show}">
      <div class="yearMonthWrapper">
        <a style="float:left;padding-left:16px;" class="icon-marvelIcon_2-11" @click="preMonth"></a>
        <div class="yearMonthDiv" @click="openOrCloseYearMonth">
          <input type="text" class="yearMonth" v-model="currentYear" readonly>
          <input type="text" class="yearMonth" v-model="currentMonth" readonly>
          <a :class="[isShowYearMonthList?colspan:expand]"></a>
        </div>
        <a style="float:right;padding-right:16px;" class="icon-marvelIcon_2-09" @click="nextMonth"></a>
        <div ref="yearListRef" :class="[{yearMonthListDisplay:!isShowYearMonthList},'yearMonthListDiv','yearListLeft']">
          <div v-for="year in yearList" class="mousehover" :class="{select:year == currentYear}" @click="onYearClick(year)">
            {{year}}
          </div>
        </div>
        <div :class="[{yearMonthListDisplay:!isShowYearMonthList},'yearMonthListDiv','monthListLeft']">
          <div v-for="month in monthList" class="mousehover" :class="{select:month == currentMonth}" @click="onMonthClick(month)">
            {{month}}
          </div>
        </div>
      </div>
      <div class="weekWrapper">
        <table>
          <thead>
          <tr>
            <th>{{$t('marvelDate_su')}}</th>
            <th>{{$t('marvelDate_mo')}}</th>
            <th>{{$t('marvelDate_tu')}}</th>
            <th>{{$t('marvelDate_we')}}</th>
            <th>{{$t('marvelDate_th')}}</th>
            <th>{{$t('marvelDate_fr')}}</th>
            <th>{{$t('marvelDate_sa')}}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="week in weekList">
            <td v-for="day in week.dayList" :class="{mousehover:day.isUse,disableused:!day.isUse,select:day.label == currentDay && day.isUse}" @click="onDayClick(day)">
              {{day.label}}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="timestampWrapper">
        <div class="timestampInput">
          <div :class="[isShowHourMSList?colspan:expand,'heightCls','timestampIcon']" @click="openOrCloseHourMS"></div>
          <div>
            <input type="text" v-model="timestamp" maxlength="8"></input>
          </div>
          <div ref="hourListRef" :class="[{yearMonthListDisplay:!isShowHourMSList},'hourMSListDiv','hourListLeft']">
            <div v-for="hour in hourList" class="mousehover" :class="{select:hour == initDatetimeFormat(currentHour)}" @click="onHourClick(hour)">
              {{hour}}
            </div>
          </div>
          <div ref="minListRef" :class="[{yearMonthListDisplay:!isShowHourMSList},'hourMSListDiv','minListLeft']">
            <div v-for="min in minList" class="mousehover" :class="{select:min == initDatetimeFormat(currentMin)}" @click="onMinClick(min)">
              {{min}}
            </div>
          </div>
          <div ref="secondListRef" :class="[{yearMonthListDisplay:!isShowHourMSList},'hourMSListDiv','secondListLeft']">
            <div v-for="second in secondList" class="mousehover" :class="{select:second == initDatetimeFormat(currentSecond)}" @click="onSecondClick(second)">
              {{second}}
            </div>
          </div>
        </div>
        <div style="float:right">
          <marvel-button classCustom="autoPageCustomBtn" :label="$t('marvelDate_confirm')"
                         v-on:onClick="submitDatetime"></marvel-button>
        </div>
      </div>
    </div>
    <marvel-tip-custom ref="validationRef" :status="2" :content="validationErrorMsg" :showToolTip="showValidation"></marvel-tip-custom>
    <marvel-tip-custom ref="tipRef" :status="1" :content="tipContent" :showToolTip="showToolTip"></marvel-tip-custom>
  </div>
  <!--data_selector end-->
</template>
<i18n>
  {
  "en": {
  "marvelDate_confirm": "Confirm",
  "marvelDateEx_year": "Year",
  "marvelDateEx_month": "Month",
  "marvelDateEx_day": "Day",
  "marvelDateEx_hour": "Hour",
  "marvelDateEx_minute": "Minute",
  "marvelDateEx_second": "Second",
  "marvelDateEx_maxDate": "The current datetime is great than ",
  "marvelDateEx_minDate": "The current datetime is less than ",
  "marvelDateEx_timeFormat": "The datetime format is wrong.",
  "marvelDate_su":"Su",
  "marvelDate_mo":"Mo",
  "marvelDate_tu":"Tu",
  "marvelDate_we":"We",
  "marvelDate_th":"Th",
  "marvelDate_fr":"Fr",
  "marvelDate_sa":"Sa",
  "marvelDate_jan": "Jan",
  "marvelDate_feb": "Feb",
  "marvelDate_mar": "Mar",
  "marvelDate_apr": "Apr",
  "marvelDate_may": "May",
  "marvelDate_jun": "Jun",
  "marvelDate_jul": "Jul",
  "marvelDate_aug": "Aug",
  "marvelDate_sep": "Sep",
  "marvelDate_oct": "Oct",
  "marvelDate_nov": "Nov",
  "marvelDate_dec": "Dec"
  },
  "zh": {
  "marvelDate_confirm": "确定",
  "marvelDateEx_year": "年",
  "marvelDateEx_month": "月",
  "marvelDateEx_day": "日",
  "marvelDateEx_hour": "时",
  "marvelDateEx_minute": "分",
  "marvelDateEx_second": "秒",
  "marvelDateEx_maxDate": "当前时间大于最大时间",
  "marvelDateEx_minDate": "当前时间小于最小时间",
  "marvelDateEx_timeFormat": "当前时间的时间格式不正确。",
  "marvelDate_su":"日",
  "marvelDate_mo":"一",
  "marvelDate_tu":"二",
  "marvelDate_we":"三",
  "marvelDate_th":"四",
  "marvelDate_fr":"五",
  "marvelDate_sa":"六",
  "marvelDate_jan": "一月",
  "marvelDate_feb": "二月",
  "marvelDate_mar": "三月",
  "marvelDate_apr": "四月",
  "marvelDate_may": "五月",
  "marvelDate_jun": "六月",
  "marvelDate_jul": "七月",
  "marvelDate_aug": "八月",
  "marvelDate_sep": "九月",
  "marvelDate_oct": "十月",
  "marvelDate_nov": "十一月",
  "marvelDate_dec": "十二月"
  }
  }
</i18n>
<script>
  import MarvelDateUtils from "../../component/date";
  import MarvelButton from "../button/MarvelButton";
  import MarvelTipCustom from '../tooltip/MarvelTipCustom'

  export default {
    name: 'MarvelDateCustom',
    props: {
      "yearStart": {
        type: String,
        default: "1970"
      },
      "yearEnd": {
        type: String,
        default: "2099"
      },
      "maxDate": {
        type: String,
        default: ""
      },
      "minDate": {
        type: String,
        default: ""
      },
      tipContent: {
        type:String,
        default: ''
      }
    },
    components:{
      MarvelButton,
      MarvelTipCustom
    },
    data: function () {
      return {
        show: false,
        datetime: '',
        currentYear: '',
        currentMonth: '',
        currentDay: '',
        currentHour: '',
        currentMin: '',
        currentSecond: '',
        isShowYearMonthList: false,
        isShowHourMSList: false,
        yearList:[],
        monthList: [
          this.$t('marvelDate_jan'),
          this.$t('marvelDate_feb'),
          this.$t('marvelDate_mar'),
          this.$t('marvelDate_apr'),
          this.$t('marvelDate_may'),
          this.$t('marvelDate_jun'),
          this.$t('marvelDate_jul'),
          this.$t('marvelDate_aug'),
          this.$t('marvelDate_sep'),
          this.$t('marvelDate_oct'),
          this.$t('marvelDate_nov'),
          this.$t('marvelDate_dec')
        ],
        weekList:[],
        hourList:[],
        minList:[],
        secondList:[],
        mouseHover: 'mousehover',
        select: 'select',
        colspan: 'icon-marvelIcon_2-10',
        expand: 'icon-marvelIcon_2-12',
        validationErrorMsg: '', //校验信息提示内容
        errorsBorder: '',
        showValidation: false, //是否显示校验信息
        showToolTip: false,
        inputFlag: false //是否手动输入时间
      }
    },
    computed: {
      timestamp:{
        get:function(){
          return this.currentHour+":"+this.currentMin+":"+this.currentSecond;
        },
        set:function(newVal){
          if(newVal && /\d{0,2}:\d{0,2}:\d{0,2}/.test(newVal)){
            let hourMS = newVal.split(":");
            this.currentHour = hourMS[0] && (hourMS[0]> 23 || hourMS[0].length > 2) ? "00" : hourMS[0];
            this.currentMin = hourMS[1] && (hourMS[1]> 59 || hourMS[1].length > 2) ? "00" : hourMS[1];
            this.currentSecond = hourMS[2] && (hourMS[2]> 59 || hourMS[2].length > 2) ? "00" : hourMS[2];
          }
          else{
            this.initEx();
          }
          
          this.uptScrollPosition("hourListRef",this.hourList,this.initDatetimeFormat(this.currentHour));
          this.uptScrollPosition("minListRef",this.minList,this.initDatetimeFormat(this.currentMin));
          this.uptScrollPosition("secondListRef",this.secondList,this.initDatetimeFormat(this.currentSecond));
        }
      }
    },
    created: function(){

    },
    mounted: function () {
      this.$nextTick(function(){
        this.$refs.validationRef.setPosition(32,38);
        this.$refs.tipRef.setPosition(32,38);
        let _self = this;
        $(this.$root.$el).on("click",function(e){
          var e = e || window.event; //浏览器兼容性
          var target = $(e.target) || $(e.srcElement);
          if (!target.closest(".dateDropWrapper").length && !target.closest(".dateSelectInput").length) {
              _self.isShowYearMonthList = false;
              _self.show = false;
          }
          else if(!target.closest(".dateDropWrapper").length && _self.$refs.dateIconRef != target[0]){
            _self.isShowYearMonthList = false;
            _self.show = false;
          }
        });
      });
      this.initEx();
    },
    methods: {
      initEx: function(){
        let curDate = new Date();
        this.currentYear = curDate.getFullYear();
        let currentMonth = curDate.getMonth()+1;
        this.currentMonth = this.monthList[currentMonth - 1];

        this.currentHour = this.initDatetimeFormat(curDate.getHours());
        this.currentMin = this.initDatetimeFormat(curDate.getMinutes());
        this.currentSecond = this.initDatetimeFormat(curDate.getSeconds());
        this.recordTimestamp = this.currentHour+this.timeSplit+this.currentMin+this.timeSplit+this.currentSecond;
        this.getWeeks(this.currentYear, currentMonth);// 当前月的第一日周几
        this.currentDay = this.initDatetimeFormat(curDate.getDate());

        //1.init yearLst
        this.yearLst = [];
        for (var i = this.yearStart; i <= this.yearEnd; i++) {
          this.yearList.push(i.toString());
        }
        if(this.currentYear >= this.yearEnd){
          for (var i = this.yearEnd+1; i < this.currentYear+50; i++) {
            this.yearList.push(i.toString());
          }
        }
        this.hourList = [];
        for(let i = 0; i < 24; i++){
          this.hourList.push(this.initDatetimeFormat(i).toString());
        }

        this.minList = [];
        for(let i = 0; i < 60; i++){
          this.minList.push(this.initDatetimeFormat(i).toString());
        }

        this.secondList = [];
        for(let i = 0; i < 60; i++){
          this.secondList.push(this.initDatetimeFormat(i).toString());
        }
      },
      preMonth: function(){
        let currentMonth = this.monthList.indexOf(this.currentMonth)+1;
        if(currentMonth == 1){
          this.currentYear = this.currentYear - 1;
          this.currentMonth = this.monthList[11];
          currentMonth = 11;
        }
        else{
          currentMonth = currentMonth-2;
          this.currentMonth = this.monthList[currentMonth];
        }
        this.getWeeks(this.currentYear,currentMonth+1);
      },
      nextMonth: function(){
        let currentMonth = this.monthList.indexOf(this.currentMonth)+1;
        if(currentMonth == 12){
          this.currentYear = this.currentYear + 1;
          this.currentMonth = this.monthList[0];
          currentMonth = 0;
        }
        else{
          this.currentMonth = this.monthList[currentMonth];
        }

        this.getWeeks(this.currentYear,currentMonth+1);
      },
      onYearClick: function(year){
        this.currentYear = year;
        this.getWeeks(this.currentYear,this.monthList.indexOf(this.currentMonth)+1);
      },
      onMonthClick: function(month){
        this.currentMonth = month;
        this.getWeeks(this.currentYear,this.monthList.indexOf(this.currentMonth)+1);
        this.isShowYearMonthList = false;
      },
      onDayClick: function(day){
        if(day.isUse){
          this.currentDay = day.label;
        }
        else{
          this.currentYear = day.year;
          this.currentMonth = this.monthList[day.month-1];
          this.currentDay = day.label;
          this.getWeeks(this.currentYear,day.month);
        }
      },
      onHourClick:function(hour){
        this.currentHour = hour;
      },
      onMinClick:function(min){
        this.currentMin = min;
      },
      onSecondClick:function(second){
        this.currentSecond = second;
        this.isShowHourMSList = false;
      },
      /**
       *  year：年
       *  month：月
       */
      getWeeks: function(year,month){
        this.weekList = [];
        let monthFirstDay = new Date(year,month-1,1);
        let day = monthFirstDay.getDay();                       // 获取年月的第一天周几
        let days = new Date(year,month,0).getDate();            // 获取月份的天数

        let first=0;
        day==0 ? first=0 : first=7-day;                         // 要减去开头的这几天
        days = days-first;
        let weeks = first? 1 + Math.ceil(days/7) : Math.ceil(days/7);
        this.getDayList(year,month,weeks);

      },
      getDayList: function(year,month,weeks){
        // 计算月份第一周 begin
        let firstWeek = [];
        let day = new Date(year,month-1,1).getDay();
        for(let i = day, j = 1; i < 7; i++){
          firstWeek[i] = firstWeek[i-1]+1;
          firstWeek[i] = {
            year: this.currentYear,
            month: month,
            label: j++,
            isUse: true
          }
        }

        if(day != 0){
          let lastMonthDays = new Date(year,month-1,0).getDate();   // 获取上个月的天数
          for(let i = day-1; i >= 0; i--){
            firstWeek[i] = {
              year: month-1?this.currentYear:this.currentYear-1,
              month: month-1?month-1:12,
              label: lastMonthDays--,
              isUse: false
            }
          }
        }
        else{
          let lastMonthDays = new Date(year,month-1,0).getDate();
          let ffWeek = [];
          for(let i = 0,j=6; i<7; i++){
            ffWeek[i] = {
              year: month-1?this.currentYear:this.currentYear-1,
              month: month-1?month-1:12,
              label: lastMonthDays-j,
              isUse: false
            }
            j--;
          }

          ffWeek.length ? this.weekList.push({dayList:ffWeek}) : null;
        }
        this.weekList.push({dayList:firstWeek});//第一周
        // 计算月份第一周 end

        // 计算月份最后一周 begin
        let lastWeek = [];
        let sixWeekFistDay = 1;
        day = new Date(year,month,0).getDay();
        let days = new Date(year,month,0).getDate();
        lastWeek[day] = {
          year: this.currentYear,
          month: month,
          label: days,
          isUse: true
        };

        for(let i = day-1; i >= 0;i--){
          lastWeek[i] = {
            year: this.currentYear,
            month: month,
            label:lastWeek[i+1].label-1,
            isUse: true
          }
        }
        let llWeek = [];
        if(day != 6){
          for(let i=day+1, j = 1; i < 7; i++){
            lastWeek[i] = {
              year: month+1 == 13?this.currentYear + 1:this.currentYear,
              month: month+1 == 13?1:month+1,
              label: j++,
              isUse: false
            };
            sixWeekFistDay = j;
          }
        }
        else{
          for(let i = 0; i<7; i++){
            llWeek[i] = {
              year: month+1 == 13?this.currentYear + 1:this.currentYear,
              month: month+1 == 13?1:month+1,
              label: i+1,
              isUse: false
            }
          }
          sixWeekFistDay = 7;
        }
        // 计算月份最后一周 end

        let watingNum = weeks;
        if(firstWeek.length ){
          watingNum--;
        }
        if(lastWeek.length){
          watingNum--;
        }
        let nextWeekDay = firstWeek[6].label;
        for(let i =0;i<watingNum;i++){
          let waitingWeek = [];
          for(let j=0;j<7;j++){
            waitingWeek[j] = {
              year: this.currentYear,
              label: ++nextWeekDay,
              isUse: true
            };
          }
          this.weekList.push({dayList:waitingWeek});
        }

        this.weekList.push({dayList:lastWeek});// 最后一周
        llWeek.length ? this.weekList.push({dayList:llWeek}) : null;

        if(this.weekList.length == 5){
          let sixWeek = [];
          for(let i = 0; i<7; i++){
            sixWeek[i] = {
              year: month+1 == 13?this.currentYear + 1:this.currentYear,
              month: month+1 == 13?1:month+1,
              label: sixWeekFistDay++,
              isUse: false
            }
          }
          sixWeek.length ? this.weekList.push({dayList:sixWeek}) : null;
        }
      },
      submitDatetime: function(){
        this.currentHour = this.initDatetimeFormat(this.currentHour);
        this.currentMin = this.initDatetimeFormat(this.currentMin);
        this.currentSecond = this.initDatetimeFormat(this.currentSecond);
        
        this.datetime = this.currentYear+"/"+this.initDatetimeFormat(this.monthList.indexOf(this.currentMonth)+1)+"/"+this.initDatetimeFormat(this.currentDay)+" "+this.currentHour+":"+this.currentMin+":"+this.currentSecond;
        this.show = false;
        this.$emit("inputTime",this.datetime);
        let _self = this;
        // 时间框里确定时间后，聚焦在时间框上。避免失焦情况下，校验信息提示依然显示
        setTimeout(function (event) {
          _self.$refs.timeInputRef.focus();
        }, 300);
      },
      onInput: function(){
        //表示手动输入时间
        this.inputFlag = true;
        // 判断时间（正则：时间格式，isNaN：有效时间）
        if(!/^\d{4}[\/|-]\d{1,2}[\/|-]\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/.test(this.datetime) || isNaN(this.getTime(this.datetime))){
          this.$emit("inputTime","");//时间不正确，值为空
          return;
        }
        this.$emit("inputTime",this.datetime);
      },
      openOrCloseHourMS:function(){
        this.isShowHourMSList = !this.isShowHourMSList;
        this.isShowYearMonthList = false;
        this.$nextTick(function(){
          this.uptScrollPosition("hourListRef",this.hourList,this.currentHour);
          this.uptScrollPosition("minListRef",this.minList,this.currentMin);
          this.uptScrollPosition("secondListRef",this.secondList,this.currentSecond);
        });
      },
      openOrCloseYearMonth:function(){
        this.isShowHourMSList = false;
        this.isShowYearMonthList = !this.isShowYearMonthList;
        this.$nextTick(function(){
          this.uptScrollPosition("yearListRef",this.yearList,this.currentYear);
        });
      },
      uptScrollPosition:function(ref,list,item){
        let index = list.indexOf(item.toString());
        index = index > 12 ? index-6: index > 6 ? index-3 : 0;
        // 更新滚动条位置
        this.$refs[ref].scrollTop = index*32;
      },
      initDatetimeFormat:function(str){
        return str.toString().length < 2 && str < 10 ? "0"+str.toString() : str.toString();
      },
      onInputClick: function () {
        this.inputFlag = false;
        this.show = !this.show;
        this.isShowYearMonthList = false;
        this.isShowHourMSList = false;
      },
      _changeDateTime: function(){
        this.$emit("changeDateTime",this.datetime)
      },
      getDateTime: function () {
        if(!/^\d{4}[\/|-]\d{1,2}[\/|-]\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/.test(this.datetime) || isNaN(this.getTime(this.datetime))){
          return "";//时间不正确，值为空
        }
        return this.datetime;
      },
      clearDateTime: function(){
        this.initEx();
        this.datetime = "";
        this.$emit("inputTime","");//若有最大值或最小值，则清空
      },
      onBlur: function () {
        //失焦时，inputFlag为false
        this.inputFlag = false;
        this.showToolTip = false;
        this.showValidation = false;
        //存在校验信息时，只将边框标红
        if(this.validationErrorMsg){
          this.errorsBorder = 'errorsBorder';
        }
        //否则恢复正常样式
        else{
          this.errorsBorder = '';
        }
        this.$emit("onBlur", this.inputMsg);
      },
      onFocus: function () {
        //聚焦时，inputFlag为true
        this.inputFlag = true;
        //存在校验信息时，则显示校验
        if(this.validationErrorMsg){
          this.showValidation = true;
          this.errorsBorder = 'errorsBorder';
        }
        //否则不显示校验
        else{
          this.showValidation = false;
          // 无校验信息且有提示信息时，则显示提示信息
          this.showToolTip = this.tipContent?true:false;
          this.errorsBorder = '';
        }
        this.$emit("onFocus", this.inputMsg);
      },
      showDateTimeErrorTip:function(){
        this.showValidation = false;
        if(this.validationErrorMsg){
          // 手动输入的情况下，存在校验信息，则显示，否则根据this.show（时间框）来判断是否显示
          this.showValidation = this.inputFlag?true:this.show?true:false;
          console.log(this.inputFlag,this.show,this.showValidation);
          this.errorsBorder = 'errorsBorder';
        }
      },
      // 聚焦，提供给父组件使用
      setFocus(){
        this.$refs.timeInputRef.focus();
      },
      getTime(time){
        return time?new Date(time).getTime():0;
      },
      // 校验时间，提供给父组件使用，包括对时间格式、时间是否有效、是否小于最大值、是否大于最小值
      validateTime(){
        if(/^\d{4}[\/|-]\d{1,2}[\/|-]\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/.test(this.datetime) && !isNaN(this.getTime(this.datetime))){
          var curDate = this.getTime(this.datetime);
          var maxDate = this.getTime(this.maxDate);
          var minDate = this.getTime(this.minDate);
          if(maxDate && curDate > maxDate){
            return false;
          }
          if(minDate && curDate < minDate){
            return false;
          }
          return true;
        }
        return false;
      } 
    },
    watch:{
      datetime: {
        handler:function(val,oldVal){
          let curDate = this.getTime(val);
          let minDate = this.getTime(this.minDate);
          let maxDate = this.getTime(this.maxDate);
          if(!val){
            this.validationErrorMsg = "";
            this.errorsBorder = '';
          }
          // 监控时间不正确，则显示格式有误校验信息
          else if(!/^\d{4}[\/|-]\d{1,2}[\/|-]\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/.test(val) || isNaN(curDate)){
            console.log("datetime format",!/^\d{4}[\/|-]\d{1,2}[\/|-]\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/.test(val));
            this.validationErrorMsg = this.$t('marvelDateEx_timeFormat');
          }
          // 监控时间大于最大时间，则显示大于最大时间校验信息
          else if(maxDate && curDate > maxDate){
            console.log("datetime maxDate",val,this.maxDate);
            this.validationErrorMsg = this.$t('marvelDateEx_maxDate')+this.maxDate;
          }
          // 监控时间小于最小时间，则显示小于最小时间校验信息
          else if(minDate && curDate < minDate){
            console.log("datetime minDate",val,this.minDate);
            this.validationErrorMsg = this.$t('marvelDateEx_minDate')+this.minDate;
          }
          else{
            this.validationErrorMsg = "";
            this.errorsBorder = '';
          }
          this.showDateTimeErrorTip();
        }
      },
      maxDate: {
        handler:function(val,oldVal){
          let maxDate = this.getTime(val);
          let datetime = this.getTime(this.datetime);
          console.log("val=",val);
          console.log(datetime && maxDate && maxDate < datetime);
          if(datetime && maxDate && maxDate < datetime){
            this.validationErrorMsg = this.$t('marvelDateEx_maxDate')+val;
          }
          else{
            this.validationErrorMsg = "";
            this.errorsBorder = '';
          }
          
          this.showDateTimeErrorTip();
        }
      },
      minDate: {
        handler:function(val,oldVal){
          let minDate = this.getTime(val);
          let datetime = this.getTime(this.datetime);
          console.log("minDate=",minDate);
          if(datetime && minDate && minDate > datetime){
            this.validationErrorMsg = this.$t('marvelDateEx_minDate')+val;
          }
          else{
            this.validationErrorMsg = "";
            this.errorsBorder = '';
          }
          
          this.showDateTimeErrorTip();
        }
      }
      
    }
  }
</script>

<style scoped>
  .autoPageCustomBtn {
    float: left;
    text-align: center;
  }

  .dpn {
    display: none;
  }
  .heightCls{
    height: 30px;
    line-height: 30px;
  }
  .dateSelectWrapper {
    height: 32px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 2px;
    position: relative;
    line-height: 32px;
    color: #3399ff;
    font-size: 16px;
    text-align: right;
    padding: 0 16px;
    box-sizing: border-box;
    background-color: white;
  }
  .errorsBorder {
    border: 1px solid #ff4c4c !important;
  }
  .dateSelectWrapper:hover {
    border: 1px solid #3399ff;
  }
  .dateSelectWrapper .dateSelectInput {
    height: 32px;
    width: 100%;
    line-height: 32px;
    color: #3399ff;
    font-size: 16px;
  }
  .dateSelectWrapper .dateSelectInput .icon-marvelIcon-21:hover{
    cursor: pointer;
  }
  .dateSelectWrapper .inputWrapper{
    width: 100%;
    border: 0px;
    font-size: 16px;
    outline: none;
  }
  .dateSelectWrapper .LabelArea {
    height: 100%;
    width: calc(100% - 56px);
    position: absolute;
    top: 0;
    left: 16px;
    color: #333;
    text-align: left;
    font-size: 16px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .dateSelectWrapper .dateDropWrapper {
    position: absolute;
    width: 100%;
    top: 32px;
    left: 0px;
    z-index: 1;
    border: 1px solid #ccc;
    background: white;
  }
  .dateSelectWrapper .dateDropWrapper .yearMonthWrapper{
    height: 32px;
    width: 100%;
    display: inline-flex;
    flex-flow: nowrap;
  }
  .yearMonthWrapper a{
    text-align: center;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    color: #ccc;
  }
  .dateSelectWrapper .dateDropWrapper .yearMonthDiv{
    display: inline-flex;
    flex-flow: nowrap;
    margin: auto;
  }
  .dateSelectWrapper .dateDropWrapper .yearMonthDiv .yearMonth{
    height: 30px;
    line-height: 30px;
    border: none;
    outline: none;
    color: #666;
    font-weight: 400;
    width:50px;
  }
  .dateSelectWrapper .dateDropWrapper .select {
    background-color: #1b8adb;
    color: #ffffff;
  }
  .mousehover:hover{
    background-color: #e6e6e6;
    cursor: pointer;
  }
  .disableused{
    color: #ccc !important;
  }
  .disableused:hover{
    background-color: #e6e6e6;
    cursor: pointer;
  }
  .yearMonthDiv ul li{
    list-style:none;
  }

  .yearMonthListDisplay{
    display: none;
  }
  .yearMonthListDiv{
    position: absolute;
    top: 32px;
    height: 384px;
    width: 64px;
    border: 1px solid #ccc;
    background-color: white;
    overflow: scroll;
    text-align: center;
    color: #666;
    z-index: 1001;
  }
  .yearListLeft{
    left: 36%;
  }
  .monthListLeft{
    left: calc(36% + 64px);
  }
  .dateSelectWrapper .dateDropWrapper .weekWrapper{
    text-align: -webkit-center;
  }
  .dateDropWrapper table{
    border-collapse: collapse;
    width: 100%;
  }
  .dateDropWrapper table th{
    background-color: #e6e6e6;
    color: #212121;
    line-height: 1.9375rem;
    height: 1.9375rem;
    font-size: .875rem;
    font-weight: 400;
    text-align: center;
  }
  .dateDropWrapper table td{
    color: #666;
    line-height: 1.9375rem;
    height: 1.9375rem;
    font-size: .875rem;
    text-align: center;
  }

  .dateSelectWrapper .dateDropWrapper .timestampWrapper{
    display: inline-block;
    padding: 8px 8px 0 8px;
    width: 94%;
  }
  .timestampInput{
    width: 100px;
    float: left;
    height: 30px;
    line-height: 30px;
    border: 1px solid #ccc;
  }
  .timestampInput input{
    border: none;
    height: 28px;
    line-height: 30px;
    outline: none;
    float: left;
    width: 61%;
  }
  .timestampInput .timestampIcon{
    float: right;
    width: 16px;
    padding-right: 16px;
    color: #ccc;
    padding: 0px 8px;
    color: #ccc;
    border-left: 1px solid #ccc;
  }
  .hourMSListDiv{
    position: absolute;
    bottom: 42px;
    height: 384px;
    width: 40px;
    border: 1px solid #ccc;
    background-color: white;
    text-align: center;
    color: #666;
    z-index: 1001;
    overflow: scroll;
  }
  .hourListLeft{
    left: 10%;
  }
  .minListLeft{
    left: calc(10% + 40px);
  }
  .secondListLeft{
    left: calc(10% + 80px);
  }
  /*endregion*/
</style>
