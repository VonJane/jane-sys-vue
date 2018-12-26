/**
 * Created by 2018/8/11/011
 * Author: Admin
 */
<!--//用于上传多张张图片-->
<template>
  <div>
    <el-row>
      <el-col>
        <el-upload
          class="avatar-uploader"
          action=""
          :http-request="myUpload"
          :before-upload="beforeAvatarUpload"
          :on-success="handleSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          list-type="picture-card"
        >
          <!--<el-button style="width: 100%" type="primary">{{ $t("message.ImportExl") }}</el-button>-->
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <!--<span>{{fileList}}</span><br>-->
        <!--<span>{{temp.imgPath}}</span>-->
        <el-dialog :visible.sync="dialogVisible" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { Loading } from 'element-ui';
import { upload } from '@/api/uploadFile'

export default {
  name: 'uploadMore',
  props: ['fileList'],
  data() {
    return {
//      fileList: [],
      imgPath: '',
      userId:'',
      userName:'',
      dialogVisible: false,
      dialogImageUrl: '',
      copy_fileList: this.fileList
    }
  },
  methods: {
    //上传图片前
    beforeAvatarUpload(file) {
      const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png');
      const isLt2M = file.size / 1024 / 1024 < 2;
      this.userId = sessionStorage.getItem("userId");
      this.userName = sessionStorage.getItem("userName");
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    //移除图片
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.$emit('AllUrls', fileList)
    },
    handleSuccess(res,file){
      console.log(file.url)
    },
    //图片放大预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    //自定义上传
    myUpload(param) {
      debugger
      //加载服务
      let loadingInstance = Loading.service({ text: '努力上传中....' });
        if (param.file) {
          let formData = new FormData()
          formData.append('file',param.file);
          formData.append('userId',this.userId)
          formData.append('userName',this.userName)
          // 上传
          upload(formData).then(response => {
              this.$emit('AllUrls', this.fileList)
              loadingInstance.close();
          }).catch((response) => {
            this.$message.error('上传图片失败！');
          })
        }
    },
  }
}
</script>
