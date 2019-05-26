<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="file.filename"
        label="文件名"
        width="180"/>
      <el-table-column
        prop="username"
        label="上传用户"
        width="120"/>
      <el-table-column
        :formatter="formatSize"
        prop="file.totalSize"
        label="文件大小"
        width="140"/>
      <el-table-column
        prop="file.type"
        label="文件类型"
        width="200"/>
      <el-table-column
        :formatter="formatTime"
        prop="file.createdAt"
        label="上传时间"/>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="download(scope.row)">下载</el-button>
          <el-button type="text" size="small" @click="deleteOne(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      class="right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
  </div>
</template>
<script>
import { getPrivateFiles, deleteFile } from '@/api/file'
import DateUtil from '@/utils/dateUtil'
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      pageSizes: [1, 5, 10, 15],
      total: 0
    }
  },
  mounted() {
    this.queryList()
  },
  methods: {
    formatSize(row) {
      const kbsize = row.file.totalSize / 1024
      if (kbsize < 1024) {
        return kbsize.toFixed(2) + 'KB'
      } else {
        const mbsize = kbsize / 1024
        return mbsize.toFixed(2) + 'MB'
      }
    },
    formatTime(row) {
      return DateUtil.formatDate.format(new Date(row.file.createdAt), 'yyyy-MM-dd hh:mm:ss')
    },
    download(row) {
      window.location.href = window.BASE_API + `download/${row.file.id}`
    },
    deleteOne(row) {
      deleteFile(row.file.id).then(res => {
        this.$message.success('删除成功')
        this.queryList()
      })
    },
    queryList() {
      getPrivateFiles(this.currentPage, this.pageSize).then(res => {
        this.tableData = res.data.items
        this.total = res.data.count
      })
    },
    handleSizeChange(value) {
      this.pageSize = value
      this.queryList()
    },
    handleCurrentChange() {
      this.queryList()
    }
  }
}
</script>
<style scoped>

</style>
