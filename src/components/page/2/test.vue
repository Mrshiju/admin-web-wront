<template>
  <div class="container">
    <!-- <el-form
      label-width="120px"
      inline="inline"
      id="uploadForm"
      action="#"
      encytype="multipart/form-data"
    >
      <input type="file" name="file" id="file">
      <input type="file" value="上传" id="upload"> -->
      <!-- <input type="text"  name="userName" v-model="data.userName">
      <input type="text"  name="password" v-model="data.password">
      <input type="text" name="source" v-model="data.source"> -->
      
    <!-- </el-form> -->
    <!-- <div :v-html="datahtml"></div>
    <button @click="submitForm">提交</button> -->

    <ul class='ulWrap'>
      <li v-for="(item,index) of liList" :key="index" :class='index === currentIndex?"active":""' @click="currentIndex = index">{{item}}</li>
    </ul>
  </div>
</template>
<script>
import axios from "axios"
export default {
  name: "admin_dshkhlb",
  data() {
    return {
        data:{
            userName:"admin",
            password:"Admin123456",
            source:"admin",
            
        },
        liList:[1,2,3,4,5,6,7],
        currentIndex:0,
    };
  },
  methods: {
    // handleClick(index){
    //   console.log(index);
    //   this.currentIndex = index;
    // },
    submitForm() {
      var file_obj = document.getElementById("file").files[0];

      var fd = new FormData();
      fd.append("file", file_obj);
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "http://192.168.1.246:8010/admin/uploadPic", true);
      xhr.send(fd);
      xhr.onreadystatechange = function() {
        //后端接受完毕
        if (xhr.readyState == 4) {
          var obj = JSON.parse(xhr.responseText);
          console.log(obj);
        }
      }; 
    // axios.post("http://192.168.1.246:8010/web/login",this.data
    // ).then(res=>{
    //     console.log(res)
    // })

    },
  },
};
</script>
<style scoped>
li{
  height: 30px;
  border-bottom: 1px solid blue;
  font-size: 20px;
}
.active{
  color: red;
  font-size: 16px;
}
</style>

