<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name:{{ name }}</div>
    <!--<div class="dashboard-text">roles:{{ role.authority }}</div>-->
    <div class="radio">
      排序：
      <el-radio-group v-model="reverse">
        <el-radio :label="false">倒序</el-radio>
        <el-radio :label="true">正序</el-radio>
      </el-radio-group>
    </div>
    <div class="timeline">
      <el-timeline :reverse="reverse">
        <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="formatTime(activity.createdAt)" placement="top">
          <el-card>
            <h4>{{ activity.action + '   ' + activity.object }}</h4>
            <p>by {{ activity.user }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import { Message } from 'element-ui'
import { getLogs } from '@/api/action'
import DateUtil from '@/utils/dateUtil'
export default {
  name: 'Dashboard',
  data() {
    return {
      reverse: false,
      activities: []
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
    this.query()
  },
  methods: {
    formatTime(time) {
      // return new Date(time).getTime() + ''
      return DateUtil.formatDate.format(new Date(time), 'yyyy-MM-dd hh:mm:ss')
    },
    query() {
      getLogs().then(res => {
        this.activities = res.data
      })
    }
  }
}
</script>
<style scoped>
.timeline{
  margin-top: 15px;
  margin-left: -35px;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 20px;
  }
  &-text {
    font-size: 20px;
    line-height: 46px;
    margin-bottom: 15px;
  }
}
</style>
