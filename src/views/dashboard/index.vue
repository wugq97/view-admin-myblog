<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name:{{ name }}</div>
    <div class="dashboard-text">roles:{{ role.authority }}</div>
    <el-timeline :reverse="reverse">
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :timestamp="activity.timestamp">
        {{ activity.content }}
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import { Message } from 'element-ui'
import { getLogs } from '@/api/action'
export default {
  name: 'Dashboard',
  data() {
    return {
      reverse: true,
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }]
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'role'
    ])
  },
  mounted() {
    if (this.role.authority === 3) {
      Message({
        message: '权限不足',
        type: 'error',
        duration: 5 * 1000
      })
      store.dispatch('LogOut').then(() => {
        this.$router.replace({ path: '/login' })
      })
    }
  },
  methods: {
    query() {

    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
