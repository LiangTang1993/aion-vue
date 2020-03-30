<template>
  <div style="width: 100%;">
    <el-row type="flex" justify="center">

      <iframe :src="pdfFile" frameborder="0" class="pdf-iframe" />
    </el-row>
  </div>
</template>

<script>
import { getgood } from '@/api/aion/exchange'
export default {
  data() {
    return {
      pdfFile: '',
      activeName: '下载注册'
    }
  },
  mounted() {
    getgood().then(res => {
      console.log(res)
    })
    this.pdfFile = this.$store.state.app.imgurl + '/raiders/vpn1.pdf'
    // destinyEploy.pdf
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.pdf-iframe{
  height: calc(100vh - 84px);
  width: 1200px;
}
</style>
