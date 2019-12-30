<template>
    <div>
      <h1 class="login-title">欢迎登录</h1>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="login-box">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login('form')">登录</el-button>
        </el-form-item>

      </el-form>
    </div>
</template>

<script>
    export default {
        name: "login.vue",
      data(){
          return{
            form:{
              username:"",
              password:""
            } ,
            rules:{
              username:[
                {required:true,message:"请输入用户名",trigger:"blur"}
              ],
              password:[
                {required:true,message:"请输入密码",trigger:"blur"}
              ]
            }
          }
      },
      methods:{
          login:function (formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.$router.push("/main");
              } else {
                this.$message.error('请输入用户名密码');
                return false;
              }
            });
          }
      }
    }
</script>

<style scoped>
  .login-title{
    text-align: center;
  }
  .login-box{
    text-align: left;
    width: 400px;
    border:1px solid #DCDFE6;
    margin: 0 auto;
    padding: 40px 50px 20px 20px;
    border-radius: 5px;
    box-shadow: 0 0 20px;
  }
</style>
