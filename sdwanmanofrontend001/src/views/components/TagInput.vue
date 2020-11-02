<template>
  <a-row class="rowCon" type="flex" justify="start" align="middle">
    <a-col>
      <a-tag
        class="tag"
        v-for="tag in tags"
        :key="tag"
        closable
        @close="() => handleClose(tag)"
        >{{ tag }}</a-tag
      >
    </a-col>
    <a-col>
      <input
        type="text"
        :value="inputValue"
        @change="handleInputChange"
        @blur="handleInputConfirm"
        @keyup.enter="handleInputConfirm"
      />
    </a-col>
  </a-row>
</template>

<script>
export default {
  props: {
    tags: Array
  },
  data() {
    return {
      inputValue: ''
    };
  },
  methods: {
    handleClose(removedTag) {
      const tags = this.tags.filter(tag => tag !== removedTag);
      this.$emit('addtag', tags);
    },

    handleInputChange(e) {
      this.inputValue = e.target.value;
    },

    handleInputConfirm() {
      const inputValue = this.inputValue;
      let tags = this.tags;
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue];
      }
      this.inputValue = '';
      this.$emit('addtag', tags);
    }
  }
};
</script>

<style lang="scss" scoped>
.rowCon {
  background-color: #fff;
  border-radius: 5px;
  padding: 1px 8px;
  .tag {
    font-size: 12px;
    background: #fff;
  }
  input {
    border: 0;
  }
}
</style>
