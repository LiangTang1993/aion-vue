<template>
  <div style="width: 100%;">
    <el-row type="flex" justify="center">
      <el-tabs v-model="activeName" tab-position="top" @tab-click="changePdf">
        <el-tab-pane label="下载注册" name="下载注册" />
        <el-tab-pane label="天族升级" name="天族升级" />
        <el-tab-pane label="魔族升级" name="魔族升级" />
      </el-tabs>
    </el-row>
    <el-row type="flex" justify="center">
      <iframe :src="pdfFile" frameborder="0" class="pdf-iframe" />
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pdfFile: '',
      activeName: '下载注册'
    }
  },
  mounted() {
    this.pdfFile = this.$store.state.app.imgurl + '/raiders/gcregist.pdf'
    // destinyEploy.pdf
  },
  methods: {
    changePdf(val) {
      switch (val.label) {
        case '下载注册':
          this.pdfFile = this.$store.state.app.imgurl + '/raiders/gcregist.pdf'
          break
        case '天族升级':
          this.pdfFile = this.$store.state.app.imgurl + '/raiders/gcElyos.pdf'
          break
        case '魔族升级':
          this.pdfFile = this.$store.state.app.imgurl + '/raiders/gcAsmodians.pdf'
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pdf-iframe{
  height: calc(100vh - 84px);
  width: 1200px;
}
</style>
