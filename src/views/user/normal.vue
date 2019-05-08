<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="昵称"/>
      <el-table-column
        prop="account"
        label="用户名"/>
      <el-table-column
        prop="email"
        label="邮箱"/>
      <el-table-column
        prop="articleNum"
        label="文章数"/>
      <el-table-column
        :formatter="formatTime"
        prop="createdAt"
        label="注册时间"
        width="180"/>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showDialog(scope.row)">修改权限</el-button>
          <el-button type="text" size="small" @click="deleteOne(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      class="right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
    <el-dialog :visible.sync="dialogTableVisible" title="修改状态" width="30%">
      <el-select v-model="status">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button type="primary" @click="changeAuthority">确定</el-button>
    </el-dialog>
  </div>
</template>
<script>
import { getUsers, deleteUser, updateAuth } from '@/api/user'
import dateUtil from '@/utils/dateUtil'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      pageSizes: [1, 5, 10, 15],
      total: 0,
      authority: 3,
      dialogTableVisible: false,
      currentId: 0,
      status: 3,
      options: [{ label: '管理员', value: 1 }, { label: '作者', value: 2 }, { label: '普通用户', value: 3 }]
    }
  },
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  mounted() {
    this.query()
  },
  methods: {
    formatTime(row) {
      return dateUtil.formatDate.format(new Date(row.createdAt), 'yyyy-MM-dd hh:mm:ss')
    },
    showDialog(row) {
      this.dialogTableVisible = true
      this.currentId = row.id
    },
    changeAuthority() {
      updateAuth(this.currentId, this.status).then(res => {
        this.dialogTableVisible = false
        this.query()
      })
    },
    deleteOne(row) {
      if (row.id === this.role.id) {
        this.$alert('无法删除当前登录用户', '提示', {
          confirmButtonText: '确定'
        })
        return
      } else {
        deleteUser(row.id).then(res => {
          console.log(res)
        }).catch(err => {
          console.log('error' + err)
        })
      }
    },
    handleSizeChange() {
      this.query()
    },
    handleCurrentChange() {
      this.query()
    },
    query() {
      const { authority, currentPage, pageSize } = this
      getUsers(authority, currentPage, pageSize).then(res => {
        this.tableData = res.data.items
        this.total = res.data.count
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
<style scoped>

</style>
