<template>
  <div class="container">
    <el-form ref="form" :model="article" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="article.title" placeholder="请输入标题"/>
      </el-form-item>
      <el-form-item label="简介">
        <el-input
          :rows="2"
          v-model="article.subtitle"
          type="textarea"
          placeholder="请输入简介"/>
      </el-form-item>
      <el-form-item label="内容">
        <div>
          <div ref="editor" style="text-align:left"/>
        </div>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="article.categoryIdParent" placeholder="父级">
          <el-option
            v-for="item in parentOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <el-select v-model="article.categoryIdChild" placeholder="子级">
          <el-option
            v-for="item in childOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-checkbox-group
          v-model="article.tagIds"
          :min="0"
          :max="10">
          <el-checkbox v-for="tag in tags" :label="'' + tag.id" :key="tag.id">{{ tag.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="uploadUrl"
          class="avatar-uploader">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <img v-else-if="article.img" :src="serverPath + article.img" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
      <el-form-item label="推荐">
        <el-switch
          v-model="article.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="0"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即提交</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import E from 'wangeditor'
import { getArticle, addArticle, updateArticle } from '@/api/article'
import { getCategories } from '@/api/category'
import { getTags } from '@/api/tag'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      article: {
        id: 0,
        title: '',
        subtitle: '',
        content: '',
        categoryIdParent: 0,
        categoryIdChild: 0,
        tagIds: [''],
        img: '',
        status: 0,
        userId: 0
      },
      imageUrl: '',
      editor: {},
      tags: [],
      categories: [],
      parentOptions: [{ label: '无', value: 0 }],
      childOptions: [{ label: '无', value: 0 }],
      uploadUrl: 'http://localhost:8080/upload/articleImg',
      serverPath: ''
    }
  },
  computed: {
    ...mapGetters(['role'])
  },
  watch: {
    'article.categoryIdParent'(categoryIdParent) {
      var flag = false
      this.childOptions = [{ label: '无', value: 0 }]
      if (categoryIdParent !== 0) {
        this.categories.forEach(function(element, index, array) {
          if (element.pid === categoryIdParent) {
            const option = {}
            option.label = element.name
            option.value = element.id
            this.childOptions.push(option)
            if (element.id === this.article.categoryIdChild) {
              flag = true
            }
          }
        }, this)
      }
      if (!flag) {
        this.article.categoryIdChild = 0
      }
    }
  },
  mounted() {
    this.article.userId = this.role.id
    this.initEditor()
    this.initTag()
    this.initCategory()
    this.serverPath = window.BASE_API
    if (this.$route.query.type === 'update') {
      this.$route.meta.title = '更新文章'
      this.article.id = this.$route.query.id
      this.getOne()
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$route.meta.title = '添加文章'
    next()
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      if (res.code === 0) {
        this.article.img = res.data
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    check() {
      const article = this.article
      if (article.title === '') {
        return false
      } else if (article.subtitle === '') {
        return false
      } else if (article.content === '') {
        return false
      }
      return true
    },
    onSubmit() {
      if (this.check()) {
        if (this.article.id === 0) {
          addArticle(this.article).then(res => {
            this.$message.success('提交成功')
            this.$router.push({ path: '/article/list' })
          })
        } else {
          updateArticle(this.article).then(res => {
            this.$message.success('更新成功')
          })
        }
      } else {
        this.$message.error('请填写完整')
      }
    },
    reset() {
      this.article = {
        id: 0,
        title: '',
        subtitle: '',
        content: '',
        categoryIdParent: 0,
        categoryIdChild: 0,
        tagIds: [''],
        img: '',
        status: 0,
        userId: this.role.id
      }
      this.editor.txt.html('')
    },
    getOne() {
      getArticle(this.article.id).then(res => {
        this.article = res.data
        this.article.tagIds = this.article.tagIds.split(',')
        this.editor.txt.html(this.article.content)
      })
    },
    initEditor() {
      var editor = new E(this.$refs.editor)
      editor.customConfig.onchange = (html) => {
        this.article.content = html
      }
      // 隐藏“网络图片”tab
      editor.customConfig.showLinkImg = false
      editor.customConfig.uploadImgShowBase64 = true
      editor.create()
      this.editor = editor
    },
    initTag() {
      getTags(1, 0).then(res => {
        this.tags = res.data.items
      })
    },
    initCategory() {
      getCategories(1, 0).then(res => {
        const categories = res.data.items
        this.categories = categories
        this.parentOptions = [{ label: '无', value: 0 }]
        categories.forEach(function(element, index, array) {
          if (element.pid === 0) {
            const option = {}
            option.label = element.name
            option.value = element.id
            this.parentOptions.push(option)
          }
        }, this)
      })
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
