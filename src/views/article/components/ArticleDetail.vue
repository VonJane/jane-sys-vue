<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :class-name="'sub-navbar '+postForm.status">
        <!--<CommentDropdown v-model="postForm.comment_disabled" />-->
        <!-- <PlatformDropdown v-model="postForm.platforms" /> -->
        <SourceUrlDropdown v-model="postForm.article_source_uri" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">草稿</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                标题
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="45px" label="作者:" class="postInfo-container-item">
                    <el-select v-model="postForm.createBy" :remote-method="getRemoteUserList" filterable remote placeholder="搜索用户">
                      <el-option v-for="(item,index) in userListOptions" :key="item+index" :label="item.jUserName" :value="item.jId"/>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <!-- <el-form-item label-width="80px" label="发布时间:" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.display_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"/>
                  </el-form-item> -->
                  <el-form-item label-width="80px" label="博客标签:" class="postInfo-container-item">
                    <el-select v-model="postForm.article_category_id" :remote-method="getRemoteArticleCategoryList" filterable remote placeholder="搜索标签">
                      <el-option v-for="(item,index) in articleCategoryListOptions" :key="item+index" :label="item.categoryName" :value="item.id"/>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label-width="60px" label="重要性:" class="postInfo-container-item">
                    <el-rate
                      v-model="postForm.importance"
                      :max="3"
                      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      :low-threshold="1"
                      :high-threshold="3"
                      style="margin-top:8px;"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="45px" label="摘要:">
          <el-input :rows="1" v-model="postForm.content_short" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}字</span>
        </el-form-item>

        <div class="editor-container">
          <Tinymce ref="editor" :height="400" v-model="postForm.content" />
        </div>

        <div style="margin-bottom: 20px;">
          <Upload v-model="postForm.image_uri" />
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
import qs from 'qs'
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import { updateArticle,fetchArticle,createArticle } from '@/api/article'
import { userSearch,articleCategorySearch } from '@/api/remoteSearch'
import Warning from './Warning'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  content_short: '', // 文章摘要
  article_source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  platforms: ['a-platform'],
  hasComment: 0,
  importance: 0
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Upload, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validateURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      articleCategoryListOptions:[],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        article_source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  },
  methods: {
    fetchData(id) {
      fetchArticle(id).then(response => {
        debugger
        this.postForm = response.data
        // Just for test
        this.postForm.display_time = `${this.postForm.createDate}`
        this.postForm.content = `${this.postForm.articleContent}`
        this.postForm.createBy = `${this.postForm.author}`
        this.postForm.article_category_id = `${this.postForm.articleCategoryId}`
        this.postForm.title = `${this.postForm.articleTitle}`
        this.postForm.content_short = `${this.postForm.articleContentShort}`
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      // this.postForm.display_time = parseInt(this.display_time / 1000)
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          let _data = this.postForm
          let param ;
          if (this.isEdit) {
            param = qs.stringify({
              id:_data.id,
              articleTitle : _data.title,
              articleContentShort:_data.content_short,
              articleContent:_data.content,
              articleSourceUri:_data.article_source_uri,
              hascomment:_data.comment_disabled,
              importance:_data.importance,
              updateDate:_data.display_time
            })
            updateArticle(param).then(response => {
              this.$notify({
                title: '成功',
                message: '发布文章成功',
                type: 'success',
                duration: 2000
              })
              this.postForm.status = 'published'
              this.loading = false
              this.$router.push({
                name: 'ArticleList'
              })
            }).catch((response) => {

              console.error('ERROR:  '+response)
              this.loading = false
              this.$message.error('操作失败')
            })
          } else {
            param = qs.stringify({
              articleTitle : _data.title,
              articleContentShort:_data.content_short,
              articleContent:_data.content,
              articleSourceUri:_data.article_source_uri,
              hascomment:_data.comment_disabled,
              importance:_data.importance,
              createBy:_data.createBy,
              articleCategoryId:_data.article_category_id,
              createDate:_data.display_time
            })
            debugger
            createArticle(param).then(response => {
              this.$notify({
                title: '成功',
                message: '发布文章成功',
                type: 'success',
                duration: 2000
              })
              this.postForm.status = 'published'
              this.loading = false
              this.$router.push({
                name: 'ArticleList'
              })
            }).catch((response) => {
              console.error(response)
              this.loading = false
              this.$message.error('操作失败')
            })
          }



        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      userSearch(query).then(response => {
        debugger
        if (!response.success) return
        this.userListOptions = response.data
        // this.userListOptions = response.data.map(v => v.name)
      })
    },
    getRemoteArticleCategoryList(query){
      articleCategorySearch(query).then(response => {
        debugger
        if (!response.success) return
        this.articleCategoryListOptions = response.data
        // this.userListOptions = response.data.map(v => v.name)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
