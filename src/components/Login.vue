<template>
  <div class="login">
    <el-form ref="form" :model="form" status-icon :rules="rules" label-width="80px">
      <img src="../assets/avatar.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入axios
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'change' },
          { min: 3, max: 6, message: '长度在3到6个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'change' },
          { min: 6, max: 12, message: '长度在6到12个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 登录
    login() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = await this.axios({
            url: 'login',
            method: 'post',
            data: this.form
          })
          let {
            meta: { status, msg },
            data: { token }
          } = res
          if (status === 200) {
            // 登陆成功
            this.$message({
              message: '登陆成功',
              type: 'success'
            })
            localStorage.setItem('token', token)
            this.$router.push('/home')
          } else {
            // 登录失败
            this.$message.error(msg)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 表单重置
    reset() {
      // 调用fesetfields()方法重置表单
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less">
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
}
.el-form {
  width: 400px;
  margin: 200px auto;
  background: #fff;
  padding: 75px 40px 15px;
  border-radius: 20px;
  position: relative;
  img {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -70px;
    border-radius: 50%;
    border: solid 10px #fff;
  }
  .el-button + .el-button {
    margin-left: 70px;
  }
}
</style>
