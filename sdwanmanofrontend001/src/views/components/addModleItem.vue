<template>
  <a-row class="add-item" type="flex" justify="space-between" align="middle">
    <a-col class="body-input" :span="2"
      ><input @change="selectChange" :checked="itemdata.checked" type="checkbox"
    /></a-col>
    <a-col @click="show" class="body-txt" :span="22">
      <a-select
        v-show="visible"
        size="small"
        show-search
        placeholder="Select a person"
        option-filter-prop="children"
        :filter-option="filterOption"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
      >
        <a-select-option
          v-for="(item, index) in selectData"
          :key="index"
          :value="item"
        >
          {{ item }}
        </a-select-option>
      </a-select>
      <span v-show="!visible">{{ itemdata.value }}</span>
    </a-col>
  </a-row>
</template>

<script>
export default {
  props: {
    itemdata: Object,
    selectData: Array
  },
  data() {
    return {
      visible: true
    };
  },
  methods: {
    show(e) {
      e.stopPropagation();
      this.visible = true;
    },
    handleChange(value) {
      if (value) this.$emit('changedata', { id: this.itemdata.id, value });
    },

    handleBlur() {
      if (this.itemdata.value) {
        this.visible = false;
      } else {
        this.$emit('remove');
      }
    },
    handleFocus() {
      console.log('focus');
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    selectChange() {
      this.$emit('selectchange', this.itemdata.id);
    }
  }
};
</script>

<style lang="scss" scoped>
.add-item {
  height: 22px;
  line-height: 22px;
  .body-input {
    text-align: center;
  }
  .body-txt {
    border-left: 1px solid #97acbe;
    padding: 0 2px;
    line-height: 22px;
  }
}
.add-item:nth-child(2n + 1) {
  background: #e9eef4;
}
</style>
