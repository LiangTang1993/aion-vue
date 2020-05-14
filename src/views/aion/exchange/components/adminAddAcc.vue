<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="增删改查" name="1">
        <el-row>
          <el-input v-model="zdStr" placeholder @change="changeStr" />
          <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="item in list" :key="item" :label="item" />
          </el-checkbox-group>
          <el-input v-model="dataStr" placeholder="" type="textarea" :rows="3" />
          fav_num
          <el-input-number v-model="param.fav_num" placeholder="" />
          服务器
          <el-select v-model="param.server_id" class="goods-item-form-select" placeholder>
            <el-option label="aiondestiny" :value="1" />
            <el-option label="myaion" :value="2" />
            <el-option label="gamecoast" :value="3" />
          </el-select>

          <el-select v-model="faction" class="goods-item-form-select" placeholder>
            <el-option label="天族" :value="1" />
            <el-option label="魔族" :value="2" />
          </el-select>
          <el-button type="premay" @click="proData">生成</el-button>
        </el-row>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import { insertGoods } from '@/api/aion/exchange.js'
export default {
  data() {
    return {
      checkList: [],
      activeNames: '1',
      list: [],
      param: {
        fav_num: 17,
        preNum: 0,
        endNum: 5,
        index: 1,
        server_id: 1
      },
      faction: 1,
      zdStr: `'提交者','提交时间','职业','性别',军衔勋章OBS','武器','首饰','防具','其他杂七杂八','备注','联系方式','价格' `,
      dataStr: ''
    }
  },
  mounted() {
    this.list = this.zdStr.split(',')
    this.checkList = this.zdStr.split(',')
  },
  methods: {
    changeStr() {
      this.list = this.zdStr.split(',')
      this.checkList = this.zdStr.split(',')
    },
    proData() {
      const jsonArr = []
      const temp = []
      // const json = JSON.parse(this.dataStr).data.initialAttributedText.text[0][0][0].c[1]
      const json = JSON.parse(this.dataStr).clientVars.collab_client_vars.initialAttributedText.text[0][4][0].c[1]
      let i = 0
      let obj = {}
      let index = 0
      for (const key in json) {
        if (i < 12) {
          if (i === 0) {
            index = parseInt(key) - 1
          }
          // if (json[key]['3'] !== 0 && json[key]['3'] !== 1 && json[key]['3'] !== 5 && json[key]['3'] !== 6 && json[key]['3'] !== 9 && json[key]['3'] !== 11) {
          if (json[key]['3'] === 4 || json[key]['3'] === 5 || json[key]['3'] === 6) {
            const a = parseInt(key) - index
            if (json[key]['2'] && json[key]['2'][1]) {
              obj[this.list[i]] = json[key]['2'][1]
            } else {
              obj[this.list[i]] = ''
            }

            i = i + a
            index = parseInt(key)
          }
        } else {
          if (json[key]['3'] === 4 || json[key]['3'] === 5 || json[key]['3'] === 6) {
            const obj1 = JSON.parse(JSON.stringify(obj))
            jsonArr.push(obj1)
            obj = {}
            i = 0
            index = parseInt(key)
            if (json[key]['2'] && json[key]['2'][1]) {
              obj[this.list[i]] = json[key]['2'][1]
            } else {
              obj[this.list[i]] = ''
            }
            i++
          }
        }
      }
      for (let i = 0; i < jsonArr.length; i++) {
        const e = jsonArr[i]
        const occArr = ['守护', '剑', '魔道', '精灵', '杀', '弓', '治愈', '护法', '枪炮', '机甲', '吟游', '彩绘']
        let occ = 1
        if (e["'职业'"] && e["'职业'"] === '奶妈') {
          occ = 7
        } else {
          for (let i = 0; i < occArr.length; i++) {
            const f = occArr[i]
            if (e["'职业'"] && e["'职业'"].indexOf(f) > -1) {
              occ = i + 1
              break
            }
          }
        }
        const objs = { fav_num: this.param.fav_num, goods_type: 1, name: e["'职业'"] + ' ' + e["'性别'"] + ' ' + e["'军衔勋章OBS'"], is_sell: true, user_contact: e["'联系方式'"], server_id: this.param.server_id, faction: this.faction, occ: occ, goods_desc: JSON.stringify(e) }
        temp.push(objs)
      }
      temp.forEach(e => {
        insertGoods(e).then(res => {
          if (res.status === 201) {
            console.log(res.data.id)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
