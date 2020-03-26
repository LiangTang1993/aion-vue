<template>
  <div>
    <el-row style="text-align: center;"> <span style="color: red;">登录账号金币 帐号担保 代充点券 入群联系群主 qq微信同号173708480</span>
      <el-link type="primary" href="https://docs.qq.com/form/edit/DWXZuQnVYUFJZeVNl#/edit" target="_blank">点击出售账号
      </el-link>
      <el-link type="primary" href="https://docs.qq.com/form/edit/DWXZuQnVYUFJZeVNl#/edit" target="_blank">点击出售基纳
      </el-link>
      <el-link type="primary" href="http://wpa.qq.com/msgrd?v=3&uin=173708480&site=qq&menu=yes" target="_blank">点击联系群主
      </el-link>

    </el-row>
    <el-row type="flex" justify="center">
      <el-tabs v-model="genderType" tab-position="left" style="height: 200px;margin-top: 10px;" @tab-click="filter">
        <el-tab-pane label="全部" name="全部" />
        <el-tab-pane label="天族" name="天族" />
        <el-tab-pane label="魔族" name="魔族" />
      </el-tabs>
      <el-tabs v-if="activeName === 'account'" v-model="occType" tab-position="left" style="height: 600px;margin-top: 10px;" @tab-click="filter">
        <el-tab-pane v-for="item in occList" :key="item" :label="item" :name="item" />
      </el-tabs>
      <div style="width: 1200px;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="账号" name="account" />
          <el-tab-pane label="金币" name="gold" />
        </el-tabs>
        <el-table :data="tableData">
          <el-table-column label="标题">
            <template slot-scope="scope">
              <div>
                <el-link type="primary" style="font-size: 16px; font-weight: 800;" @click="dataDetial(scope.row)">
                  {{ scope.row.title }}</el-link>
                <div style="color: rgb(55,55,55);">种族:{{ scope.row.faction }}&nbsp;&nbsp;&nbsp;
                  时间:{{ scope.row.createTime }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="价格" sortable prop="price" width="200px">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.price===0">私聊</span>
                <span v-if="scope.row.price>0">{{ scope.row.price }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
  </div>
</template>

<script>
/*eslint-disable*/
  // import { destinyAl, myaionAl, gcAl, destinyGl, myaionGl, gcGl } from './data/destiny.js'
  export default {
    data() {
      return {
        genderType: '全部',
        occType: '全部',
        alist: [],
        glist: [],
        activeName: 'account',
        tableData: [],
        type: 1, // 1 destiny 2 myaion 3 gc
        occList:['全部','守护星','剑星','弓星','杀星','魔道星','精灵星','护法星','治愈星','枪炮星','机甲星','吟游星','彩绘星'],
        allData:[]
      }
    },
    mounted() {
      if (destinyAl) {
        switch (this.$route.name) {
          case 'exDestiny':
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
                e.title = e.occ + ' ' + e.gender + e.equipment
                e.createTime = e.createTime.substring(0, 10)
                e.price = parseInt(e.price)
              }
              if (e.price > 0) {
                  
                } else {
                  e.price = 0
                }
            });
            this.alist = destinyAl
            this.glist = destinyGl
            this.type = 1
            break
          case 'exMyAion':
            this.alist = myaionAl
            this.glist = myaionGl
            this.type = 2
            break
          case 'exGC':
            this.alist = gcAl
            this.glist = gcGl
            this.type = 3
            break
          default:
            break
        }
        
        this.tableData = this.alist
        this.allData = JSON.parse(JSON.stringify(this.alist)) 
      }
    },
    methods: {
      handleClick(val) {
        if (val.name === 'account') {
          this.tableData = JSON.parse(JSON.stringify(this.alist)) 
          this.allData = JSON.parse(JSON.stringify(this.alist))
        } else {
          this.allData = JSON.parse(JSON.stringify(this.glist))
          this.tableData = JSON.parse(JSON.stringify(this.glist))
        }
      },
      dataDetial(row) {
        const routeUrl = this.$router.resolve({
          path: '/accDetail',
          query: {
            id: row.id,
            type: this.type
          }
        })
        window.open(routeUrl.href, '_blank')
      },
      filter(){
          let temp = this.allData
          if (this.genderType!=='全部') {
            temp = temp.filter(e=>e.faction === this.genderType)
          }
          if (this.occType!=='全部') {
            temp = temp.filter(e=>e.occ === this.occType)
          }
          this.tableData = temp
      }
    }
  }

</script>

<style scoped>

</style>
