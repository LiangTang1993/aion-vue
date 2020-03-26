<template>
  <div>
    <el-row type="flex" justify="center" class="form-nobt">
      <div style="width:1200px;font-size: 20px;">
        <el-form :model="formData" label-width="100px" style="width:1200px;font-size: 20px;">
          <el-form-item label="标题" prop="title">
            <span>{{ formData.title }}</span>
          </el-form-item>
          <el-form-item label="服务器">
            <span>{{ servers[type] }}</span>
          </el-form-item>
          <el-form-item label="种族" prop="faction">
            <span>{{ formData.faction }}</span>
          </el-form-item>
          <el-form-item label="角色名" prop="nickname">
            <span>{{ formData.nickname }}</span>
          </el-form-item>
          <el-form-item label="装备" prop="equipment">
            <span>{{ formData.equipment }}</span>
          </el-form-item>
          <el-form-item label="pvp信息" prop="pvp">
            <span>{{ formData.pvp }}</span>
          </el-form-item>
          <el-form-item label="其他" prop="note">
            <span>{{ formData.note }}</span>
          </el-form-item>
          <el-form-item label="联系方式" prop="contact">
            <span>{{ formData.contact }}</span>
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
/*eslint-disable*/
export default {
  data() {
    return {
      formData: {
        
      },
      tableData:[],
      alist:[],
      type:'',
      servers:['','destiny','myaion','gc'],
      imgArr:[]
    }
  },
  mounted() {
    this.type = this.$route.query.type
    if (destinyAl) {
      switch (this.$route.query.type) {
        case '1':
          destinyAl.forEach(e => {
            if (!e.title) {
              if (e.equipment1) {
                e.equipment = e.equipment + ' ' + e.equipment1
              }
              if (e.equipment2) {
                e.equipment = e.equipment + ' ' + e.equipment2
              }
              if (e.equipment3) {
                e.equipment = e.equipment + ' ' + e.equipment3
              }
              if (e.pvp && e.pvp1) {
                e.pvp = e.pvp + '  ' + e.pvp1
              }
              e.title = e.occ + ' ' + e.gender + e.equipment
              e.createTime = e.createTime.substring(0, 10)
            }
          })
          this.alist = destinyAl
          break
        case '2':
          this.alist = myaionAl
          break
        case '3':
          this.alist = gcAl
          break
        default:
          break
      }
      this.tableData = this.alist
      this.formData= this.tableData.filter(e=>e.id===parseInt(this.$route.query.id))[0]
      this.imgArr = []
      if (this.formData.picNum && this.formData.picNum > 0) {
        for (let i = 0; i < this.formData.picNum; i++) {
          this.imgArr.push('http://res.aionlegend.net/aionRes/seller/'+ this.$route.query.id + '/' + i + '.png')
        }
      }
      console.log(this.imgArr);
      
    }
  }
}
</script>

<style>
.form-nobt .el-form-item{
  margin-bottom: 0;
}
</style>
