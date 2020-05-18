<template>
  <div>
    <el-row type="flex" justify="center" class="form-nobt">
      <div style="width:1200px;font-size: 20px;">
        <el-form v-if="formData.fav_num > 2" :model="formData" label-width="100px" class="main-width" style="font-size: 20px;">
          <el-form-item v-for="item in dataArr" :key="item.label" :label="item.label">
            <span>{{ item.value }}</span>
          </el-form-item>
        </el-form>
        <el-form v-else :model="formData" label-width="100px" class="main-width" style="font-size: 20px;">
          <el-form-item label="标题" prop="name">
            <span>{{ formData.name }}</span>
          </el-form-item>
          <el-form-item label="服务器">
            <span>{{ servers[formData.server_id] }}</span>
          </el-form-item>
          <el-form-item label="职业" prop="occ">
            <span>{{ occArr[formData.occ] }}</span>
          </el-form-item>
          <el-form-item label="种族" prop="faction">
            <span>{{ formData.faction===1?'天族':'魔族' }}</span>
          </el-form-item>
          <el-form-item label="装备" prop="equipment">
            <span>{{ formData.equipment }}</span>
          </el-form-item>
          <el-form-item label="pvp信息" prop="pvp">
            <span>{{ formData.pvp }}</span>
          </el-form-item>
          <el-form-item label="其他" prop="note">
            <span>{{ formData.other }}</span>
          </el-form-item>
          <el-form-item label="联系方式" prop="contact">
            <span>{{ formData.user_contact }}</span>
          </el-form-item>
          <el-form-item label="价格" prop="contact">
            <span>{{ formData.shop_price==0?'私聊':formData.shop_price }}</span>
          </el-form-item>
          <el-form-item label="浏览次数" prop="click_num">
            <span>{{ formData.click_num }}</span>
          </el-form-item>
        </el-form>
        <el-row v-if="imgArr.length>0">
          <div>图片信息</div>
          <el-image v-for="url in imgArr" :key="url" style="margin:10px" :src="url" />
        </el-row>
      </div>

    </el-row>

  </div>
</template>

<script>
import { getGoodsItem } from '@/api/aion/exchange.js'
export default {
  data() {
    return {
      formData: {

      },
      occArr: ['守护星', '剑星', '魔道星', '精灵星', '杀星', '弓星', '治愈星', '护法星', '枪炮星', '机甲星', '吟游星', '彩绘星'],
      tableData: [],
      alist: [],
      type: '',
      servers: ['', 'destiny', 'myaion', 'gc'],
      imgArr: [],
      dataArr: []
    }
  },
  mounted() {
    this.type = this.$route.query.type
    this.id = this.$route.query.id
    getGoodsItem(this.id).then(res => {
      if (res.data.fav_num > 2) {
        const obj = JSON.parse(res.data.goods_desc)
        this.formData = res.data
        this.dataArr = [{ label: '标题', value: res.data.name }]
        for (const key in obj) {
          const item = {}
          if (key !== "'提交者'" && key !== "'提交时间'") {
            item.label = key.replace("'", '')
            item.value = obj[key]
            this.dataArr.push(item)
          }
        }
        this.dataArr.push({ label: '浏览次数', value: res.data.click_num })
      } else {
        this.formData = res.data
      }
      res.data.images.forEach(e => {
        this.imgArr.push('http://res.aionlegend.net' + e.image)
      })
    })
    // this.imgArr = []
    // if (this.formData.picNum && this.formData.picNum > 0) {
    //   for (let i = 0; i < this.formData.picNum; i++) {
    //     this.imgArr.push('http://res.aionlegend.net/aionRes/seller/' + this.$route.query.id + '/' + i + '.png')
    //   }
    // }
    // console.log(this.imgArr)
  }
}
</script>

<style>
.form-nobt .el-form-item{
  margin-bottom: 0;
}
</style>
