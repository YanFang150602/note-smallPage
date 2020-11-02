<template>
  <div class="add-con">
    <a-row
      class="add-header"
      type="flex"
      justify="space-between"
      align="middle"
    >
      <a-col :span="2" class="header-input"
        ><input type="checkbox" :checked="allChecked" @change="allSelect"
      /></a-col>
      <a-col :span="19" class="header-title">{{ title }}</a-col>
      <a-col :span="3" class="header-btn"
        ><a-icon @click="addItem" type="plus"/><a-icon
          @click="removeItem"
          type="minus"
      /></a-col>
    </a-row>
    <div class="add-body">
      <div class="add-item">
        <AddModelItem
          v-for="item in data"
          :key="item.id"
          :itemdata="item"
          :selectData="itemData"
          @remove="removeThis"
          @selectchange="selectChange"
          @changedata="changedata"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AddModelItem from './addModleItem';
export default {
  props: {
    listdate: {
      type: Array,
      default: () => {
        return [];
      }
    },
    title: String
  },
  data() {
    return {
      allChecked: false,
      data: [],
      itemData: [],
      subData: []
    };
  },
  created() {
    this.itemData = this.listdate;
  },
  methods: {
    addItem() {
      if (
        (this.itemData.length > 0 && this.data.length === 0) ||
        ([...this.data].pop().value && this.itemData.length > 0)
      ) {
        this.data.push({
          id: 'id' + this.guid(),
          value: '',
          checked: false
        });
      }
    },
    changedata({ id, value }) {
      this.itemData = this.listdate;
      this.subData = [];
      this.data.forEach(item => {
        if (item.id === id) {
          item.value = value;
        }
        if (item.value) {
          this.itemData = this.itemData.filter(i => i !== item.value);
          this.subData.push(item.value);
        }
      });
      console.log(this.itemData);
    },
    removeItem() {
      this.data = this.data.filter(item => item.checked === false);
      this.itemData = this.listdate;
      this.subData = [];
      this.data.forEach(item => {
        if (item.value) {
          this.itemData = this.itemData.filter(i => i !== item.value);
          this.subData.push(item.value);
        }
      });
    },
    removeThis() {
      this.data.pop();
    },
    allSelect() {
      this.allChecked = !this.allChecked;
      if (this.allChecked) {
        this.data.forEach(item => {
          item.checked = true;
        });
      } else {
        this.data.forEach(item => {
          item.checked = false;
        });
      }
    },
    selectChange(id) {
      this.data.forEach(item => {
        if (item.id === id) {
          item.checked = !item.checked;
        }
      });
    },
    S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },
    guid() {
      return (
        this.S4() +
        this.S4() +
        '-' +
        this.S4() +
        '-' +
        this.S4() +
        '-' +
        this.S4() +
        '-' +
        this.S4() +
        this.S4() +
        this.S4()
      );
    }
  },
  components: { AddModelItem },
  watch: {
    listdate(val) {
      this.itemData = val;
    },
    subData() {
      this.$emit('subdata', this.subData);
    }
  }
};
</script>

<style lang="scss" scoped>
.add-con {
  width: 100%;
  min-height: 230px;
  overflow-y: scroll;
  background: #fff;
  .add-header {
    background: #b6c9db;
    height: 22px;
    width: 100% !important;
    .header-input {
      text-align: center;
    }
    .header-title {
      font-size: 12px;
      text-overflow: ellipsis;
      color: #0f2c3e;
      border-left: 1px solid #97acbe;
      padding: 0 2px;
      line-height: 22px;
    }
  }
  .add-body {
    background: #fff;
  }
}
</style>
