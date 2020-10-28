<template>
  <a-col class="list-item">
    <div class="item" @click="showItem">
      <div class="port-value">{{ index + 1 }}</div>
      <div class="port-icon">
        <img width="100%" :src="curItem.src" alt="" />
      </div>
      <div class="port-title">
        {{ portTit }}
      </div>
      <ul
        v-show="flag"
        @mouseleave="hiddenItem"
        @click="selectPort"
        class="itme-select"
      >
        <li :data-id="item.id" v-for="(item, index) in lists" :key="index">
          <img :src="item.src" alt="" />
          {{ item.title }}
        </li>
      </ul>
    </div>
  </a-col>
</template>

<script>
export default {
  props: {
    index: Number
  },
  data() {
    return {
      // 端口列表展示开关
      flag: false,
      //端口列表下拉内容
      lists: [
        {
          id: '0',
          src: require('@/assets/images/template/wf1.jpg'),
          title: 'wan'
        },
        {
          id: '1',
          src: require('@/assets/images/template/wf6.jpg'),
          title: 'LAN'
        },
        {
          id: '2',
          src: require('@/assets/images/template/wf2.jpg'),
          title: 'PPPoE'
        },
        {
          id: '3',
          src: require('@/assets/images/template/wf3.jpg'),
          title: 'wan and LAN'
        }
      ],
      curItem: {
        id: '4',
        src: require('@/assets/images/template/wf4.jpg'),
        title: 'Unassigned Port'
      }
    };
  },
  methods: {
    // 点击显示端口列表
    showItem() {
      this.flag = true;
    },
    // 移除列表隐藏
    hiddenItem() {
      this.flag = false;
    },
    // 点击选择端口
    selectPort(e) {
      e.stopPropagation();
      this.flag = false;
      this.lists.forEach((item, index) => {
        if (item.id === e.target.dataset.id) {
          this.lists.splice(index, 1);
          if (this.curItem.id === '4') {
            this.lists.push(this.curItem);
          } else {
            this.lists.unshift(this.curItem);
          }
          this.curItem = item;
        } else {
          this.curItem;
        }
      });
      this.$emit('addport', { id: this.curItem.id, index: this.index });
    }
  },
  computed: {
    portTit: function() {
      if (this.curItem.id === '4') {
        return ' ';
      } else if (this.curItem.id === '3') {
        return 'W+L';
      } else {
        return this.curItem.title;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  position: relative;
  .port-value {
    font-size: 12px;
    text-align: center;
    line-height: 18px;
    color: #000;
  }
  .port-icon {
    padding: 0 2px;
  }
  .port-title {
    font-size: 10px;
    color: #000;
    line-height: 18px;
  }
  .itme-select {
    position: absolute;
    top: -34px;
    left: 10px;
    background-color: #e9eef4;
    padding: 5px;
    border-radius: 3px 3px 3px 3px;
    border: 1px solid #bbbbbb;
    box-shadow: 0px 0px 2px 0px rgba(87, 90, 90, 0.75);
    z-index: 6666;
    width: 160px;
    height: 96px;
    li {
      padding: 0 5px;
      font-size: 10px;
      text-align: left;
      vertical-align: middle;
      border-top: 1px dotted #ccc;
      line-height: 20px;
      height: 20px;
      cursor: pointer;
      &:nth-child(1) {
        border: 0;
      }
      img {
        display: inline-block;
        width: 15px;
        margin-right: 5px;
      }
    }
  }
}
</style>
