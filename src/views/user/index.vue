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
export default {
  data() {
    return {
      activeName: 'admin'
    }
  },
  watch: {
    $route: function(route) {
      const path = this.$route
      this.activeName = path.name
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
