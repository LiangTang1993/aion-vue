<template>
  <div class="login-container">
    <el-tabs v-model="activeName" type="card" class="login-tabs" @tab-click="handleClick">
      <el-tab-pane label="登陆" name="login">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="Username"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>

          <el-button :loading="loading" style="width:100%;margin-bottom:30px;background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);" @click.native.prevent="handleLogin">登陆</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="注册" name="regist">
        <el-form ref="regForm" :model="regForm" :rules="loginRules" class="login-form" label-position="left">
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="regForm.username"
              placeholder="Username"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="regForm.password"
              placeholder="Password"
              name="password"
              tabindex="2"
            />
          </el-form-item>
          <el-form-item prop="email">
            <span class="svg-container">
              <i class="el-icon-message" />
            </span>
            <el-input
              v-model="regForm.email"
              placeholder="邮箱"
              type="email"
              tabindex="2"
            />
          </el-form-item>
          <el-form-item prop="code">
            <span class="svg-ciontainer">
              <i style="padding-left:15px" class="el-icon-key" />
            </span>
            <el-input
              v-model="regForm.code"
              :loading="regloading"
              :disabled="regStatus"
              style="width:100px"
              placeholder="验证码"
              @keyup.enter.native="handleReg"
            />
            <el-button style="width:110px;background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);float:right;margin-top:3px;" @click="getCode">获取验证码</el-button>
          </el-form-item>
          <el-button style="width:100%;margin-bottom:30px;background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);" @click.native.prevent="handleReg">注册</el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import { code, createUser } from '@/api/user'
export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('账号密码错误'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      var reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/ // 正则表达式
      if (value === '') { // 输入不能为空
        callback(new Error('请输入正确邮箱'))
      } else if (!reg.test(value)) { // 正则验证不通过，格式不对
        callback(new Error('请输入正确邮箱'))
      } else {
        callback()
      }
    }
    return {
      regloading: false,
      activeName: 'login',
      regStatus: false,
      loginForm: {
        username: '',
        password: ''
      },
      regForm: {
        username: '',
        password: '',
        email: '',
        code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        code: [{ required: true, trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleClick() {

    },
    handleReg() {
      this.$refs.regForm.validate(valid => {
        if (valid) {
          createUser(this.regForm).then(res => {
            if (res.data.name) {
              this.$message({ type: 'success', message: '注册成功！' })
            } else {
              this.$message.error(res.data)
            }
          })
        }
      })
    },

    getCode() {
      this.regloading = true
      this.$refs.regForm.validateField('email', valid => {
        if (!valid) {
          code({ email: this.regForm.email }).then(res => {
            this.regloading = false
            if (res.data.code === 200) {
              this.$message({ type: 'success', message: res.data.message })
            } else {
              this.$message({ type: 'error', message: '间隔60s发送' })
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .login-tabs{
    width: 90%;
    max-width: 400px;
    position: absolute;
    top: calc(20vh);
    right: 10px;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: white;
  background: url('http://res.aionlegend.net/aionRes/img/login.jpg');
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 10px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
