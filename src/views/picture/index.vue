/**
 * Created by 2018/8/11/011
 * Author: Admin
 */
<!--//用于上传多张张图片-->
<template>
  <div class="img">
   <img class="pre-img" :src="src" alt="">
   <vue-core-image-upload :class="['pure-button','pure-button-primary','js-btn-crop']"
                        :crop="false"
                        text="上传图片" 
                        inputOfFile="file" 
                        url="http://localhost:8080/FileUploadController/upload" 
                        extensions="png,gif,jpeg,jpg"
                        @imageuploaded="imageuploaded"   
                        @errorhandle="handleError">
    </vue-core-image-upload>

    <el-upload
  action="http://localhost:8080/FileUploadController/upload"
  list-type="picture-card"
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
