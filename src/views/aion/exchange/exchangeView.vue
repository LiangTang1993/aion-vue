<template>
  <div>
    <el-row style="text-align: center;"> <span style="color: red;">登录账号金币入群联系群主</span> </el-row>
    <el-row type="flex" justify="center">
      <div style="width: 1200px;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="账号" name="account" />
          <el-tab-pane label="金币" name="gold" />
        </el-tabs>
        <el-table :data="tableData">
          <el-table-column label="标题" width="800px">
            <template slot-scope="scope">
              <div>
                <el-link type="primary" style="font-size: 16px; font-weight: 800;" @click="dataDetial(scope.row)">{{ scope.row.title }}</el-link>
                <div style="color: rgb(55,55,55);">种族:{{ scope.row.faction }}&nbsp;&nbsp;&nbsp;    时间:{{ scope.row.createTime }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="价格" prop="price" />
        </el-table>
      </div>
    </el-row>
  </div>
</template>

<script>
import { destinyAl, myaionAl, gcAl, destinyGl, myaionGl, gcGl } from './data/destiny.js'
export default {
  data() {
    return {
      alist: [],
      glist: [],
      activeName: 'account',
      tableData: [],
      type: 1
    }
  },
  mounted() {
    console.log(destinyAl)
    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.src = '<./data/destiny.js>'
    document.body.appendChild(s)
    switch (this.$route.name) {
      case 'exDestiny':
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
  },
  methods: {
    handleClick(val) {
      if (val.name === 'account') {
        this.tableData = this.alist
      } else {
        this.tableData = this.glist
      }
    },
    dataDetial(row) {
      const routeUrl = this.$router.resolve({
        path: '/accDetail',
        query: { id: row.id, type: this.type }
      })
      window.open(routeUrl.href, '_blank')
    }
  }
}
</script>

<style scoped>

</style>
