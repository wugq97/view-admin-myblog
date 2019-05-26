<template>
  <div class="file-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="公共文件" name="public">
        <public-file/>
      </el-tab-pane>
      <el-tab-pane label="私人文件" name="private">
        <private-file/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import publicFile from './public'
import privateFile from './private'
import { mapGetters } from 'vuex'
export default {
  components: {
    publicFile, privateFile
  },
  data() {
    return {
      activeName: 'public'
    }
  },
  computed: {
    ...mapGetters(['role'])
  },
  mounted() {
    if (this.role.authority !== 1) {
      this.$message({
        message: '权限不足！',
        type: 'warning'
      })
      this.$router.push({ path: '/' })
    }
  }
}
</script>
<style scoped>
.file-container{
  width: 90%;
  margin: 20px auto 0 auto;
}
</style>
