<template>
  <div :class="classObj" class="app-wrapper">
    <div style="position: fixed;width: 100%;top:0;z-index:100;">
      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
      <sidebar class="sidebar-container" />
      <el-row style="text-align:center;background:#cccccc;height:25px;vertical-align:middle;">
        <div style="height:25px">
          <span style="line-height:25px;vertical-align:middle;">qq微信同号：173708480 交流群：941524284</span>
          <a
            target="_blank"
            href="//shang.qq.com/wpa/qunwpa?idkey=49c6e9b149ea3cff8f5fa744f83ee3b28bc96d1504f82fda0d75252504d1cc80"
          >
            <img
              border="0"
              style="vertical-align:middle;"
              src="//pub.idqqimg.com/wpa/images/group.png"
              alt="aion俄服永恒之塔俄服"
              title="aion俄服永恒之塔俄服"
            >
          </a>
        </div>
      </el-row>
    </div>
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}" />
      <app-main />
    </div>
  </div>
</template>

<script>
import { Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: false,
        openSidebar: true,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  // height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

/* .hideSidebar .fixed-header {
  width: calc(100% - 54px);
} */

.mobile .fixed-header {
  width: 100%;
}
</style>
