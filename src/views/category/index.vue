<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="14">
        <div class="container">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="名称"
              width="120"/>
            <el-table-column
              :formatter="formatParent"
              prop="pid"
              label="父节点"
              width="120"/>
            <el-table-column
              prop="description"
              label="描述"
              width="180"/>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="change(scope.row)">编辑</el-button>
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
      </el-col>
      <el-col :span="10">
        <div class="container reset">
          <el-form :model="addForm" label-width="80px" >
            <el-form-item label="名称">
              <el-input v-model="addForm.name"/>
            </el-form-item>
            <el-form-item label="父节点">
              <el-select v-model="addForm.pid" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="addForm.description"/>
            </el-form-item>
          </el-form>
          <el-button type="primary" class="button" @click="add">新增</el-button>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="dialogVisible"
      title="编辑标签"
      width="30%">
      <el-form :model="updateForm" label-width="80px" >
        <el-form-item label="名称">
          <el-input v-model="updateForm.name"/>
        </el-form-item>
        <el-form-item label="父节点">
          <el-select :disabled="updateSelect" v-model="updateForm.pid" placeholder="请选择" >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="updateForm.description"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getCategories, getParentCategories, addCategory, deleteCategory, updateCategory } from '@/api/category'
export default {
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      pageSizes: [1, 5, 10, 15],
      total: 0,
      addForm: {
        pid: '',
        name: '',
        description: ''
      },
      updateForm: {
        id: 0,
        pid: 0,
        name: '',
        description: ''
      },
      options: [{ label: '无', value: 0 }],
      parentCategories: [],
      updateSelect: false
    }
  },
  async mounted() {
    await this.queryParentCategories()
    await this.queryList()
  },
  methods: {
    formatParent(row) {
      var name = '无'
      this.parentCategories.forEach(function(element, index, array) {
        if (element.id === row.pid) {
          name = element.name
        }
      }, this)
      return name
    },
    add() {
      addCategory(this.addForm).then(res => {
        this.addForm = { pid: '', name: '', description: '' }
        this.queryList()
        this.queryParentCategories()
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
      })
    },
    update() {
      updateCategory(this.updateForm).then(res => {
        this.dialogVisible = false
        this.queryList()
        this.queryParentCategories()
        this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success'
        })
      })
    },
    change(row) {
      console.log(this.updateForm)
      this.updateSelect = false
      this.dialogVisible = true
      this.updateForm.id = row.id
      this.updateForm.name = row.name
      this.updateForm.description = row.description
      this.updateForm.pid = row.pid
      if (row.pid === 0) {
        this.updateSelect = true
      }
    },
    deleteOne(row) {
      this.$confirm('确定删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var flag = true
        if (row.pid === 0) {
          this.tableData.forEach(function(element) {
            if (element.pid === row.id) {
              this.$message({
                message: '存在子类别，无法删除',
                type: 'error'
              })
              flag = false
              return
            }
          }, this)
        }
        if (flag) {
          deleteCategory(row.id).then(res => {
            if (res.success) {
              this.queryList()
              this.queryParentCategories()
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              })
            } else {
              this.$message({
                showClose: true,
                message: '删除失败！存在该分类文章',
                type: 'error'
              })
            }
          })
        }
      })
    },
    queryParentCategories() {
      getParentCategories().then(res => {
        this.parentCategories = res.data
        this.options = [{ label: '无', value: 0 }]
        this.parentCategories.forEach(function(element, index, array) {
          if (element.pid === 0) {
            const option = {}
            option.label = element.name
            option.value = element.id
            this.options.push(option)
          }
        }, this)
      })
    },
    queryList() {
      getCategories(this.currentPage, this.pageSize).then(res => {
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
.reset{
  margin-top: 50px;
}
.button{
  margin-left:80px;
}
</style>
