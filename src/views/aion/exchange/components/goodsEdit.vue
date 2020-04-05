<template>
  <div
    v-loading.fullscreen.lock="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-dialog
      title="买卖登记"
      :visible.sync="drawer"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      width="900px"
      :before-close="handleClose"
    >
      <div class="drawer-div">
        <el-form
          ref="ruleForm"
          :model="goods"
          label-width="150px"
          :rules="rules"
        >
          <el-form-item style="width:400px;display:inline-block" label="服务器">
            <el-select v-model="goods.server_id" style="width:250px" placeholder>
              <el-option label="aiondestiny" :value="1" />
              <el-option label="myaion" :value="2" />
              <el-option label="gamecoast" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item style="width:400px;display:inline-block" label="阵营">
            <el-select v-model="goods.faction" style="width:250px" placeholder>
              <el-option label="天族" :value="1" />
              <el-option label="魔族" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item style="width:400px;display:inline-block" label="商品类型">
            <el-select v-model="goods.goods_type" :disabled="type==='edit'" style="width:250px" placeholder>
              <el-option
                v-for="(item,index) in goods_type"
                :key="index"
                :label="item"
                :value="index+1"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="width:400px;display:inline-block" label="标题" prop="name">
            <el-input v-model="goods.name" type="textarea" :rows="2" placeholder />
          </el-form-item>
          <div v-if="goods.goods_type===1">
            <el-form-item style="width:400px;display:inline-block" label="职业">
              <el-select v-model="goods.occ" style="width:250px" placeholder>
                <el-option
                  v-for="(item,index) in occArr"
                  :key="index"
                  :label="item"
                  :value="index+1"
                />
              </el-select>
            </el-form-item>
            <el-form-item style="width:400px;display:inline-block" label="装备信息">
              <el-input
                v-model="goods.equipment"
                type="textarea"
                :rows="2"
                placeholder="包括羽毛 翅膀 所有你的装备，强化情况 魔石等等，最好写上面板信息"
              />
            </el-form-item>
            <el-form-item style="width:400px;display:inline-block" label="pvp信息">
              <el-input
                v-model="goods.pvp"
                type="textarea"
                :rows="2"
                placeholder="所有和pvp相关信息，比如 军衔obs，各种pvp勋章等等"
              />
            </el-form-item>
            <el-form-item style="width:400px;display:inline-block" label="pvp信息">
              <el-input
                v-model="goods.pvp"
                type="textarea"
                :rows="2"
                placeholder="所有和pvp相关信息，比如 军衔obs，各种pvp勋章等等"
              />
            </el-form-item>
          </div>
          <el-form-item style="width:400px;display:inline-block" label="其他">
            <el-input v-model="goods.other" placeholder="其他信息" />
          </el-form-item>
          <el-form-item style="width:400px;display:inline-block" label="联系方式">
            <el-input v-model="goods.user_contact" placeholder="其他信息" />
          </el-form-item>

          <el-form-item v-if="goods.goods_type===1" style="width:400px;display:inline-block" label="图片">
            <el-upload
              ref="img"
              class="upload-demo"
              action=""
              :on-change="handleChange"
              :file-list="fileList"
              :auto-upload="false"
              :limit="5"
              multiple
            >
              <el-button slot="trigger" size="mini" type="primary">选文件</el-button>
              <a href="https://tinypng.com/" target="_blank" style="color:red">点我压缩图片</a>
              <div slot="tip" class="el-upload__tip">图片，最多五张，单个不超过150kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item style="width:400px;display:inline-block" label="价格（0=私聊）">
            <el-input-number v-model="goods.shop_price" style="width:250px" placeholder="其他信息" />
          </el-form-item>
          <el-form-item style="width:100%;display:inline-block">
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="handleClose">取消</el-button>
          </el-form-item>
          <div v-if="goods.goods_type===7">
            <h3 style="color:red">撸代码不易，不着急的朋友支援一下，早上晚上充值 aiondesnity 1点券0.11r myaion 1点券0.12 gamecoast 1点券0.11,
              请把账号密码等信息写在标题，如有疑问联系群主 小小心晴 微信qq同号 173708480 骗子横行大家小心！！！
            </h3>
            <img width="200px" src="http://res.aionlegend.net/aionRes/img/zfb.jpg" alt="">
            <img width="200px" src="http://res.aionlegend.net/aionRes/img/wx.jpg" alt="">
          </div>

        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { insertGoods, updateGoods, InsertGoodsImage } from '@/api/aion/exchange.js'
import COS from 'cos-js-sdk-v5'
export default {
  data() {
    return {
      drawer: false,
      goods_type: ['出售账号', '收账号', '出金币', '收金币', '需求服务', '提供服务', '点券充值'],
      occArr: ['守护星', '剑星', '魔道星', '精灵星', '杀星', '弓星', '治愈星', '护法星', '枪炮星', '机甲星', '吟游星', '彩绘星'],
      goods: {
        server_id: 1, // 服务器id 1 aiondesnity 2 myaion 3 gc
        occ: 1, // 职业
        faction: 1, // 种族 1天族 2魔族
        goods_type: 1, // 商品类型 # 1 出售账号 2 收账号 3 出金币  4 收金币 5 需求服务 6 提供服务
        name: '', // title 标题
        shop_price: 0, // 价格
        goods_desc: '11', // 描述
        pvp: '空',
        equipment: '空',
        other: '空',
        user_contact: '空',
        is_sell: true,
        user_email: '空',
        images: []
      },
      rules: {
        name: [{ required: true, message: '请输入标题', trigger: 'blur' }]
      },
      type: 'add',
      fileList: [],
      loading: false,
      numFlag: 5
    }
  },
  watch: {
    numFlag(nval, oval) {
      if (nval === 0) {
        this.loading = false
        this.handleClose()
      }
    }
  },
  methods: {
    handleChange(val, val1) {
      this.fileList = val1
      console.log(val1)
    },
    setData(type, data, server) {
      this.type = type
      this.goods.server_id = server
      if (type === 'add') {
        this.drawer = true
        this.fileList = []
      } else if (type === 'edit') {
        this.drawer = true
        this.goods = { server_id: data.server_id, // 服务器id 1 aiondesnity 2 myaion 3 gc
          occ: data.occ, // 职业
          faction: data.faction, // 种族 1天族 2魔族
          goods_type: data.goods_type, // 商品类型 # 1 出售账号 2 收账号 3 出金币  4 收金币 5 需求服务 6 提供服务 7 点券充值
          name: data.name, // title 标题
          shop_price: data.shop_price, // 价格
          goods_desc: data.goods_desc, // 描述
          pvp: data.pvp,
          equipment: data.equipment,
          other: data.other,
          user_contact: data.user_contact,
          is_sell: data.is_sell,
          user_email: data.user_email,
          images: data.images,
          id: data.id }
      }
    },
    onSubmit() {
      if (this.$store.state.user.userData.username && this.$store.state.user.userData.email) {
        this.goods.user_email = this.$store.state.user.userData.email
      } else {
        return
      }
      if (this.goods.goods_type === 1) {
        this.goods.files = this.fileList
      } else {
        this.goods.files = []
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.type === 'add') {
            insertGoods(this.goods).then(res => {
              if (res.status === 201) {
                this.$message({ type: 'success', message: '创建成功！' })
                this.goods.id = res.data.id
                this.upLoad()
                this.$emit('refresh')
              }
            })
          } else {
            updateGoods(this.goods).then(res => {
              if (res.status === 200) {
                this.$message({ type: 'success', message: '更新成功！' })
                this.upLoad()
                this.$emit('refresh')
              }
            })
          }
        }
      })
    },
    handleClose() {
      this.$refs.ruleForm.resetFields()
      if (this.goods.goods_type === 1 || this.goods.goods_type === 2) {
        this.$refs.img.clearFiles()
      }
      this.drawer = false
    },

    // 获取签名
    upLoad() {
      if (this.fileList.length > 0) {
        this.numFlag = this.fileList.length
        this.fileList.forEach(file => {
          const folder = '/aionRes/seller/' + this.goods.id + '/'
          const filename = new Date().getTime() + '.' + file.name.split('.').reverse()[0]
          if ((file.name.split('.').reverse()[0] === 'jpg' || file.name.split('.').reverse()[0] === 'png') && file.size / 1024 < 150) {
            this.uploadFile(folder, file, filename)
          } else {
            this.numFlag--
          }
        })
      } else {
        this.loading = false
        this.handleClose()
      }
    },

    // 上传腾讯云
    uploadFile(folder, file, filename) {
      var bucket = 'myres-1259295379'
      var region = 'ap-shanghai'

      var cos = new COS({
        // 必选参数
        SecretId: 'AKIDA8rKMAH6C2dy3vuu1vb4ITw98rgGKjcN',
        SecretKey: 'e5GCtLYWKtGOGtJTOEqFUXMzQhkX6QVN'
      })
      // const loading = this.$loading({
      //   lock: true,
      //   text: '资源正在上传,请耐心等待...',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // })
      const _this = this
      cos.putObject({
        Bucket: bucket,
        Region: region,
        Key: folder + filename,
        Body: file.raw
      // eslint-disable-next-line handle-callback-err
      }, function(err, data) {
        console.log(data)
        if (data.statusCode === 200) {
        // 上传成功得到的资源地址
          // loading.close()
          InsertGoodsImage({ goods: _this.goods.id, image: folder + filename }).then(res => {
            _this.numFlag--
          })
        } else {
          _this.numFlag--
        }
      })
    },

    // DataURL转Blob
    dataURLtoBlob(fileObj) {
      console.log(fileObj.size)
      return new Blob([fileObj], { type: fileObj.type })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss" >
:focus {
  outline: none;
}
.drawer-div {
  height: calc(100vh - 80px);
  overflow-y: auto;
}
</style>
