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
              prop="name"
              label="父节点"
              width="120"/>
            <el-table-column
              prop="description"
              label="描述"
              width="150"/>
            <el-table-column
              prop="articleNum"
              label="文章数"/>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="changeTag(scope.row)">编辑</el-button>
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
      </el-col>
      <el-col :span="10">
        <div class="container reset">
          <el-form :model="addTagForm" label-width="80px" >
            <el-form-item label="名称">
              <el-input v-model="addTagForm.name"/>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="addTagForm.description"/>
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
      <el-form :model="updateTagForm" label-width="80px" >
        <el-form-item label="名称">
          <el-input v-model="updateTagForm.name"/>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="updateTagForm.description"/>
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
export default {
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      pageSizes: [1, 5, 10, 15],
      total: 0,
      addTagForm: {
        name: '',
        description: ''
      },
      updateTagForm: {
        id: 0,
        name: '',
        description: ''
      }
    }
  },
  mounted() {
  },
  methods: {

  }
}
</script>
<style scoped>

</style>
