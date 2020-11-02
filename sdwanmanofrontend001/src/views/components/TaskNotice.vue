<template>
  <div v-show="visible" class="task-notifications-list">
    <header>
      <a-row type="flex" justify="space-between" align="middle">
        <a-col class="title">
          User Initiated Tasks - {{ taskRes.taskStatus }} (<span class="count"
            >0</span
          >)
        </a-col>
        <a-col>
          <a-row type="flex" justify="end">
            <a-col @click="close" class="btn size-btn"
              ><a-icon type="shrink"
            /></a-col>
            <a-col @click="close" class="btn close-btn"
              ><a-icon type="close"
            /></a-col>
          </a-row>
        </a-col>
      </a-row>
    </header>
    <article class="task-notifcation-items">
      <ul>
        <li>
          <a-row
            style="width=100%"
            type="flex"
            justify="space-between"
            align="middle"
          >
            <a-col
              >{{ taskinfo.taskId }}:{{ taskRes.taskName }}:{{
                taskRes.objectName
              }}</a-col
            >
            <a-col v-show="!(taskRes.completion === 100)" class="progress"
              ><div
                :style="{ width: taskRes.completion + '%' }"
                class="loading"
              >
                {{ taskRes.completion }}%
              </div></a-col
            >
            <a-col @click="close">
              <a-icon
                v-show="
                  taskRes.completion === 100 && taskRes.taskStatus === 'FAILED'
                "
                type="exclamation-circle"/><a-icon
                v-show="
                  taskRes.completion === 100 &&
                    taskRes.taskStatus === 'COMPLETED'
                "
                type="check-circle"/>
              <a-icon v-show="taskRes.completion === 100" type="delete"
            /></a-col>
          </a-row>
        </li>
      </ul>
    </article>
  </div>
</template>

<script>
import { taskNotice } from 'apis/administration';
export default {
  props: {
    taskinfo: Object
  },
  data() {
    return {
      visible: false,
      time: null,
      taskRes: {},
      errorMsg: ''
    };
  },
  methods: {
    async taskNot() {
      const taskNotRes = await taskNotice({ taskId: this.taskinfo.taskId });
      this.taskRes = taskNotRes.result || {};
      if (this.taskRes.completion !== 100 && this.visible) {
        this.timer = setTimeout(() => {
          this.taskNot();
        }, 2000);
      } else {
        clearTimeout(this.timer);
        if (this.taskRes.taskStatus === 'FAILED') {
          this.taskRes.errorMessages.messages.forEach(item => {
            this.errorMsg = ' ' + item.message;
          });
          this.$message.error(this.errorMsg);
        } else if (this.taskRes.completion == 100) {
          if (this.taskinfo.type === 'del') {
            this.$message.success('删除成功！');
          } else if (this.taskinfo.type === 'add') {
            this.$message.success('创建成功！');
          } else {
            this.$message.success('更新成功！');
          }
        } else {
          this.$message.success('已取消操作,任务进度为未完成状态！');
        }
        this.$emit('task-complete', this.taskinfo.type);
      }
    },
    close() {
      this.visible = false;
      this.taskRes.completion = 0;
    }
  },
  watch: {
    taskinfo(nweValue) {
      if (nweValue) {
        this.visible = true;
        this.taskNot();
      }
    },
    deep: true
  }
};
</script>

<style lang="scss" scoped>
.task-notifications-list {
  position: fixed;
  bottom: 20px;
  right: 10px;
  width: 420px;
  background: #c0dff4;
  border: solid 1px #8cabc7;
  z-index: 9999;
  header {
    background: #8cabc7;
    padding: 10px;
    .title {
      font-weight: 600;
      font-size: 14px;
      color: #000;
    }
    .btn {
      font-size: 16px;
      color: #000;
      font-size: 16px;
    }
    .size-btn {
      font-size: 15px;
      margin-right: 7px;
    }
  }
  ul {
    padding: 0;
    margin: 0;
    padding: 5px;
    li {
      border: solid 1px #8cabc7;
      padding: 0 5px;
      &:hover {
        box-shadow: inset 0 0 5px #0d496b;
      }
      .progress {
        width: 110px;
        .loading {
          text-align: center;
          font-size: 14px;
          color: #fff;
          background: #40a4e7;
          border-radius: 3px;
          line-height: 22px;
          height: 22px;
        }
      }
      /deep/.ant-col {
        line-height: 32px;
        font-size: 13px;
        color: #000;
        font-weight: 600;
        .anticon {
          font-size: 14px;
          color: #f96969;
          font-size: 14px;
          line-height: 1;
        }
        .anticon-check-circle {
          color: #41c09f;
        }
        .anticon-delete {
          color: #626c82;
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
