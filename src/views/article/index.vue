<template>
  <div>
    <div class="container color">
      <el-select v-model="parentCategory" placeholder="父级">
        <el-option
          v-for="item in parentOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="childCategory" placeholder="子级">
        <el-option
          v-for="item in childOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button @click="queryList">搜索</el-button>
    </div>
    <div class="container">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="title"
          label="名称"
          width="120"/>
        <el-table-column
          :formatter="formatCategory"
          prop="category"
          label="类别"
          width="120"/>
        <el-table-column
          prop="tags"
          label="标签"
          width="180"/>
        <el-table-column
          prop="views"
          label="浏览次数"
          width="100"/>
        <el-table-column
          prop="likes"
          label="点赞次数"
          width="100"/>
        <el-table-column
          prop="username"
          label="作者"
          width="120"/>
        <el-table-column
          :formatter="formatTime"
          prop="createdAt"
          label="创建时间"
          width="180"/>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
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
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getArticles, deleteArticle } from '@/api/article'
import dateUtil from '@/utils/dateUtil'
export default {
  data() {
    return {
      parentOptions: [{ label: '无', value: -1 }],
      childOptions: [{ label: '无', value: 0 }],
      parentCategory: '',
      childCategory: '',
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      pageSizes: [1, 5, 10, 15],
      total: 0,
      categories: []
    }
  },
  computed: {
    ...mapGetters(['role'])
  },
  watch: {
    categories(categories) {
      this.parentOptions = [{ label: '无', value: -1 }]
      this.childOptions = [{ label: '无', value: -1 }]
      categories.forEach(function(element, index, array) {
        const option = {}
        option.label = element.name
        option.value = element.id
        if (element.pid === 0) {
          this.parentOptions.push(option)
        } else {
          this.childOptions.push(option)
        }
      }, this)
    },
    parentCategory(parentCategory) {
      this.childCategory = ''
      this.childOptions = [{ label: '无', value: -1 }]
      if (parentCategory === '' || parentCategory === -1) {
        this.categories.forEach(function(element, index, array) {
          if (element.pid !== 0) {
            const option = {}
            option.label = element.name
            option.value = element.id
            this.childOptions.push(option)
          }
        }, this)
      } else {
        this.categories.forEach(function(element, index, array) {
          if (element.pid === parentCategory) {
            const option = {}
            option.label = element.name
            option.value = element.id
            this.childOptions.push(option)
          }
        }, this)
      }
    }
  },
  mounted() {
    this.queryList()

  },
  methods: {
    formatCategory(row) {
      return row.categoryParentName + ' ' + row.categoryChildName
    },
    formatTime(row) {
      return dateUtil.formatDate.format(new Date(row.createdAt), 'yyyy-MM-dd hh:mm:ss')
    },
    edit(row) {
      this.$router.push({ path: '/article/edit', query: { type: 'update', id: row.id }})
    },
    deleteOne(row) {
      this.$confirm('确定删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(row.id).then(res => {
          this.queryList()
          this.queryParentCategories()
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
        })
      })
    },
    queryList() {
      var { role, parentCategory, childCategory, currentPage, pageSize } = this
      if (parentCategory === -1) {
        parentCategory = 0
      }
      if (childCategory === -1) {
        childCategory = 0
      }
      var uid = 0
      if (role.authority !== 1) {
        uid = role.id
      }
      getArticles(uid, parentCategory, childCategory, currentPage, pageSize).then(res => {
        this.tableData = res.data.pageInfo.items
        this.categories = res.data.categories
      })
    },
    handleSizeChange() {
      this.queryList()
    },
    handleCurrentChange() {
      this.queryList()
    }
  }
}
</script>
<style scoped>
.color{
  background-color: #bfcbd9;
  border-radius: 5px;
}
</style>
