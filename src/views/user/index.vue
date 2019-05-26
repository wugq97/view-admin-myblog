<template>
  <div class="container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="管理员" name="admin"/>
      <el-tab-pane label="作者" name="editor"/>
      <el-tab-pane label="普通用户" name="normal"/>
    </el-tabs>
    <div>
      <router-view/>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activeName: 'admin'
    }
  },
  computed: {
    ...mapGetters(['role'])
  },
  watch: {
    $route: function(route) {
      const path = this.$route
      this.activeName = path.name
    }
  },
  mounted() {
    if (this.role.authority !== 1) {
      this.$message({
        message: '权限不足！',
        type: 'warning'
      })
      this.$router.push({ path: '/' })
    }
  },
  methods: {
    handleClick(tab, event) {
      const activeName = this.activeName
      this.$router.push({ path: `/user/tabs/${activeName}` })
    }
  }
}
</script>
<style scoped>

</style>
