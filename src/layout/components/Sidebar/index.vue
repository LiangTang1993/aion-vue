<template>
  <div>
    <el-row type="flex" justify="space-between" style="height:55px">
      <el-col v-if="device!='mobile'" :span="3" style="min-width:200px"><img :src="titleImg" class="title-img"></el-col>
      <el-col :span="device==='mobile'?24:18" style="max-width:1200px">

        <el-scrollbar wrap-class="scrollbar-wrapper" style="float:left">
          <el-menu
            :default-active="activeMenu"
            :collapse="isCollapse"
            :background-color="variables.menuBg"
            :text-color="variables.menuText"
            :unique-opened="true"
            :active-text-color="variables.menuActiveText"
            :collapse-transition="false"
            :menu-trigger="device==='mobile'?'click':'hover'"
            mode="horizontal"
          >
            <sidebar-item v-for="route in routes" :key="route.path" style="float:left" :item="route" :base-path="route.path" />
          </el-menu>
        </el-scrollbar>
        <div class="right-menu">
          <!-- <el-button v-if="!userData.username" type="text" class="login-btn" @click="login">登陆</el-button>
          <el-button v-if="!userData.username" type="text" class="login-btn" @click="login">注册</el-button> -->
          <!-- <el-link v-if="!userData.username" style="font-size:20px;color:#d07c35;margin:15px 10px 0 0" :underline="false" @click="login">登陆</el-link> -->
          <el-dropdown class="avatar-container" trigger="hover">
            <div class="avatar-wrapper">
              <img :src="avatar" class="user-avatar">
              <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown">
              <router-link v-if="userData.username" to="/userinfo">
                <el-dropdown-item>
                  个人信息
                </el-dropdown-item>
              </router-link>

              <el-dropdown-item v-if="userData.username" divided @click.native="logout">
                <span style="display:block;">退出</span>
              </el-dropdown-item>
              <el-dropdown-item v-if="!userData.username" divided @click.native="login('1')">
                <span style="display:block;">登陆</span>
              </el-dropdown-item>
              <el-dropdown-item v-if="!userData.username" divided @click.native="login('2')">
                <span style="display:block;">注册</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <el-dropdown style="float:right;display:inline-block;margin: 20px 10px 0 0;" @command="handleCommand">
          <span class="el-dropdown-link" style="color:#cccccc">
            {{ serverName }}<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">aiondestiny</el-dropdown-item>
            <el-dropdown-item command="2">myaion</el-dropdown-item>
            <el-dropdown-item command="3">gamecoast</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </el-col>
      <el-col v-if="device!='mobile'" :span="3" />
    </el-row>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem },
  data() {
    return {
      userImg: '',
      titleImg: '',
      serverName: '选服'
    }
  },
  mounted() {
    this.userImg = this.$store.state.app.imgurl + '/img/user_default.png'
    this.titleImg = this.$store.state.app.imgurl + '/img/aion_title.png'
    this.setTitle(this.$store.state.user.server + '')
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    userData() {
      return this.$store.state.user.userData
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    device() {
      return this.$store.state.app.device
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    login(type) {
      this.$router.push({ path: '/login', query: { type: type }})
    },
    setTitle(command) {
      switch (command) {
        case '1':
          this.serverName = 'Destiny'
          break
        case '2':
          this.serverName = 'MyAion'
          break
        case '3':
          this.serverName = 'GC'
          break
        default:
          this.serverName = 'Destiny'
          break
      }
    },
    handleCommand(command) {
      switch (command) {
        case '1':
          this.serverName = 'Destiny'
          break
        case '2':
          this.serverName = 'MyAion'
          break
        case '3':
          this.serverName = 'GC'
          break
        default:
          this.serverName = 'Destiny'
          break
      }
      this.$store.dispatch('user/setServer', parseInt(command))
      this.$router.replace({
        path: '/refresh',
        query: {
          t: Date.now()
        }
      })
    }
  }
}
</script>
<style lang="scss">
.title-img{
  margin-left: 100px;
    cursor: pointer;
      width: 120px;
      height: 60px;
    }
  .right-menu {

    float: right;
    height: 100%;
    // line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 5px;

      .avatar-wrapper {
        margin-top: 10px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
    .login-btn{
      font-size: 16px;
      margin-top:6px;
      color: #cccccc;
      &:hover{
        color: #cccccc;
      }
    }
  }
</style>
