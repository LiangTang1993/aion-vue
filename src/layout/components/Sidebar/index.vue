<template>
  <div>
    <el-row type="flex" justify="space-between" style="height:55px">
      <el-col :span="4"><img :src="titleImg" class="title-img"></el-col>
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :unique-opened="false"
          :active-text-color="variables.menuActiveText"
          :collapse-transition="false"
          mode="horizontal"
        >
          <sidebar-item v-for="route in routes" :key="route.path" style="float:left" :item="route" :base-path="route.path" />
        </el-menu>
      </el-scrollbar>

      <el-col :span="4">

        <div class="right-menu">
          <el-link v-if="!userData.username" style="font-size:20px;color:#d07c35;margin:15px 10px 0 0" :underline="false" @click="login">登陆</el-link>
          <el-dropdown v-if="userData.username" class="avatar-container" trigger="hover">
            <div class="avatar-wrapper">
              <img :src="userImg" class="user-avatar">
              <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown">
              <router-link to="/">
                <el-dropdown-item>
                  个人信息
                </el-dropdown-item>
                <el-dropdown-item v-if="userData.username" divided @click.native="logout">
                  <span style="display:block;">退出</span>
                </el-dropdown-item>
              </router-link>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
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
      titleImg: ''
    }
  },
  mounted() {
    this.userImg = this.$store.state.app.imgurl + '/img/user_default.png'
    this.titleImg = this.$store.state.app.imgurl + '/img/aion_title.png'
  },
  computed: {
    ...mapGetters([
      'sidebar'
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
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    login() {
      this.$router.push({ path: 'login' })
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
      margin-right: 30px;

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
  }
</style>
