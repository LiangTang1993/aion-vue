<template>
  <div class="dashboard-container">
    <el-row v-for="item in serversList" class="server-row" type="flex" justify="center" >
      <el-col style='width:1200px'>
        <el-row>
          <el-col :span="12">
            <img :src="item.logo" alt="" height='200px'>
          </el-col>
          <el-col :span="12">
            <el-form :model="item" class='form-nobt' label-width="120px">
              <el-form-item label="服务器名称:">{{item.name}}</el-form-item>
              <el-form-item label="版本">{{item.version}}</el-form-item>
              <el-form-item v-if='item.web' label="官网"><a :href="item.web" target="_blank" style="color:blue">点击进入</a></el-form-item>
              <el-form-item label="介绍"><div style='line-height:20px;padding-top:10px'>{{item.detail}}</div></el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      serversList:[]
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    this.serversList = [{
      logo: this.$store.state.app.imgurl + '/img/aionlegend.png',
      detail: '游戏项目组预告游戏结束，于3月10日凌晨关服。 10年的服务器，结束得如此突然。我想过各种方式的离开，却没预料到如此突然。 相聚总是短暂，甚至于还没好好说再见。不知道还有没有机会在其他地方相聚。江湖路远，各自安好。 希望最后的时间里，大家能好好度过。愿永恒之塔的光辉与你同在。',
      version:4.6,
      web: null,
      name: 'aionlegend',
      qqGroup: '941524284'
    },{
      logo: this.$store.state.app.imgurl + '/img/aiondestiny3.5.png',
      detail: `2019年十月开服，bug多，晚上在线3000+ 最高4000+`,
      version:3.6,
      name: 'Destiny3.5',
      web: 'https://aiondestiny.im/',
      qqGroup: '941524284'
    },{
      logo: this.$store.state.app.imgurl + '/img/myaion4.6.png',
      detail: `3.20开服，一千左右`,
      version:4.6,
      name:'MyAion',
      web: 'http://myaion.net/files',
      qqGroup: '941524284'
    },{
      logo: this.$store.state.app.imgurl + '/img/GC.png',
      detail: `4.15开服敬请期待`,
      version:4.6,
      name:'gamecoast',
      web: 'https://forum.gamecoast.net/topic/16171-%D0%B8%D1%81%D1%86%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B4%D1%83%D1%88%D0%B8/',
      qqGroup: '941524284'
    }]
  },
  methods: {
    
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.server-row{
  height:200px;
  margin-top: 20px
}
</style>

<style lang="scss">
  .form-nobt{
    .el-form-item{
      margin-bottom: 0;
    }
  }
</style>
