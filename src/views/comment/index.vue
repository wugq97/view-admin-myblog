<template>
  <div class="comment-container">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="作者"
        width="180"/>
      <el-table-column
        prop="replyName"
        label="回复"
        width="180"/>
      <el-table-column
        prop="content"
        label="评论内容"
        width="180"/>
      <el-table-column
        prop="article"
        label="文章"
        width="180"/>
      <el-table-column
        :formatter="formatTime"
        prop="createdAAt"
        label="时间"/>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deleteOne(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="currentPage"
      :page-sizes="pageSizes"
      :page-size.sync ="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      class="right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
  </div>
</template>
<script>
import { getComments, deleteComment } from '@/api/comment'
import DateUtil from '@/utils/dateUtil'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      pageSizes: [5, 10, 15, 20],
      total: 0
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
    this.query()
  },
  methods: {
    formatTime(row) {
      return DateUtil.formatDate.format(new Date(row.createdAt), 'yyyy-MM-dd hh:mm:ss')
    },
    query() {
      console.log(this.currentPage)
      getComments(this.currentPage, this.pageSize).then(res => {
        this.tableData = res.data.items
        this.total = res.data.count
      })
    },
    deleteOne(row) {
      this.$confirm('确定删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteComment(row.id).then(res => {
          this.query()
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
        })
      })
    },
    handleSizeChange(value) {
      this.pageSize = value
      this.query()
    },
    handleCurrentChange() {
      this.query()
    }
  }
}
</script>
<style scoped>
.comment-container{
  padding:20px 20px;
}
</style>
