
<!--//用于上传多张张图片-->
<template>
  <div class="img">

    <el-upload
  action="http://localhost:8080/FileUploadController/upload"
  list-type="picture-card"
  :before-upload="beforeAvatarUpload"
  :on-preview="handlePictureCardPreview"
  :on-remove="handleRemove">
  <i class="el-icon-plus"></i>
</el-upload>
<el-dialog :visible.sync="dialogVisible">
  <img width="100%" :src="dialogImageUrl" alt="">
</el-dialog>

</div>
</template>
<script>
import VueCoreImageUpload from 'vue-core-image-upload'

    export default {
        components: {
            'vue-core-image-upload': VueCoreImageUpload,
        },
        data() {
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                src: './static/img/hospital1.jpg'  //默认的图片路径
            }
        },
        methods: {  
          imageuploaded(res) {     //图片上传成功后调用此方法，res为返回值为服务器存放图片的路径，再将图片路径赋值给src
            console.log("文件上传成功！");
            this.src=res;
    
          },
          handleError(){           //图片上失败后调用此方法
                console.log("文件上传失败！");
            
                this.$notify.error({
                          title: '上传失败',
                          message: '图片上传接口上传失败，可更改为自己的服务器接口'
                    });
          },
          beforeAvatarUpload(file) {
            debugger
            alert()
            const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png');
            const isLt2M = file.size / 1024 / 1024 < 10;

            if (!isJPG) {
              this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
            }
            if (!isLt2M) {
              this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
          },
          handleRemove(file, fileList) {
           console.log(file, fileList);
          },
          handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
          }

        }
    };
</script>
