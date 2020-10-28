<template>
  <a-row
    class="transfer-data-wrap"
    type="flex"
    justify="space-between"
    align="middle"
  >
    <a-col class="transfer-data transfer-data-left">
      <a-row
        class="transfer-header-left"
        type="flex"
        justify="space-between"
        align="middle"
      >
        <a-col>Available</a-col>
        <a-col @click="allChange" style="color: #3498db; cursor:pointer"
          >Add All</a-col
        >
      </a-row>
      <a-input-search
        class="search-input"
        placeholder="Search"
        v-model="searchWordL"
      />
      <ul class="transfer-data-list">
        <li
          @click="Change(index)"
          v-for="(item, index) in transfData"
          :key="index"
          v-show="item.type === 0 && hasSearchWord(item, 0)"
        >
          {{ item.title }}
          <a-icon class="icon" type="right" />
        </li>
      </ul>
    </a-col>
    <a-col class="transfer-data transfer-data-right">
      <div class="transfer-header-right">Selected</div>
      <a-input-search
        class="search-input"
        placeholder="Search"
        v-model="searchWordR"
      />
      <ul class="transfer-data-list">
        <li
          v-for="(item, index) in transfData"
          v-show="item.type === 1 && hasSearchWord(item, 1)"
          :key="index"
        >
          {{ item.title }}
          <a-icon @click="Change(index)" class="icon" type="close" />
        </li>
      </ul>
    </a-col>
  </a-row>
</template>

<script>
export default {
  props: {
    transfData: {
      type: Array
    }
  },
  data() {
    return {
      searchWordL: '',
      searchWordR: ''
    };
  },
  methods: {
    Change(index) {
      this.transfData[index].type = this.transfData[index].type === 0 ? 1 : 0;
    },
    allChange() {
      if (this.searchWordL) {
        this.transfData
          .filter(item => item.title.includes(this.searchWordL))
          .forEach(item => {
            item.type = 1;
          });
      } else {
        this.transfData.forEach(item => {
          item.type = 1;
        });
      }
    },
    hasSearchWord(item, type) {
      if (this.searchWordL && type === 0) {
        return item.title.includes(this.searchWordL);
      }
      if (this.searchWordR && type === 1) {
        return item.title.includes(this.searchWordR);
      }
      return true;
    }
  },
  computed: {
    right() {
      const rightList = [];
      this.transfData.filter(e => {
        if (e.type === 1) {
          rightList.push(e.title);
        }
      });
      return rightList;
    }
  },
  watch: {
    right() {
      this.$emit('add-right', this.right);
    }
  }
};
</script>

<style lang="scss" scoped>
.transfer-data-wrap {
  .transfer-data {
    width: 413px;
    height: 257px;
    background: #eff2f3;
    .transfer-header-left {
      height: 28px;
      padding: 0 8px;
      font-size: 12px;
      border-bottom: 1px solid #cdcfd2;
    }
    .transfer-header-right {
      height: 28px;
      padding: 0 8px;
      line-height: 28px;
      font-size: 12px;
      border-bottom: 1px solid #cdcfd2;
    }
    .search-input {
      width: 396px;
      height: 22px;
      margin: 5px auto;
      display: block;
      border-color: #ccc;
      /deep/.ant-input {
        height: 22px;
        line-height: 20px;
        font-size: 12px;
        color: #0f2c3e;
        &:focus,
        &:hover {
          border-color: #ccc;
        }
      }
    }
    .transfer-data-list {
      height: 170px;
      padding: 0;
      margin: 0;
      position: relative;
      li {
        list-style: none;
        border-top: 1px solid #fff;
        padding: 0 8px;
        line-height: 20px;
        font-size: 12px;
        background: #d9dfe1;
        cursor: pointer;
        position: relative;
        .icon {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 10px;
        background: #879aa0;
        left: 0;
        bottom: -10px;
        border-radius: 4px;
      }
    }
  }
}
</style>
