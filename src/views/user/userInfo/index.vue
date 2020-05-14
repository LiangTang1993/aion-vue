<template>
  <div class="">
    <!-- user_icon = models.CharField(null=True,max_length=100, verbose_name="头像", help_text="头像")
    user_server = models.IntegerField(null=True, verbose_name="服务器", help_text="服务器")
    user_nickname = models.CharField(null=True,max_length=100, verbose_name="角色名", help_text="角色名")
    user_occ = m -->
    <el-row type="flex" justify="center">
      <el-form :model="userData">
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :file-list="fileList"
            :on-change="fileChange"
            :auto-upload="false"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>

    </el-row>
    <el-row type="flex" justify="center">
      <el-form :model="userData">
        <el-form-item label="服务器">
          <el-select v-model="userData.user_server" class="goods-item-form-select" placeholder>
            <el-option label="aiondestiny" :value="1" />
            <el-option label="myaion" :value="2" />
            <el-option label="gamecoast" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色名" prop="user_nickname">
          <el-input v-model="userData.user_nickname" placeholder="" />
        </el-form-item>
        <el-form-item label="职业">
          <el-select v-model="userData.user_occ" placeholder>
            <el-option
              v-for="(item,index) in occArr"
              :key="index"
              :label="item"
              :value="index+1"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
import { upDateUserInfo } from '@/api/user'
export default {
  data() {
    return {
      userData: {
        user_server: 1,
        user_nickname: '',
        user_occ: 1
      },
      imageUrl: '',
      fileList: [],
      occArr: ['守护星', '剑星', '魔道星', '精灵星', '杀星', '弓星', '治愈星', '护法星', '枪炮星', '机甲星', '吟游星', '彩绘星']
    }
  },
  mounted() {
    this.imageUrl = 'http://res.aionlegend.net' + this.$store.state.user.userData.user_icon
    const userData = this.$store.state.user.userData
    this.userData.user_server = userData.user_server
    this.userData.user_nickname = userData.user_nickname
    this.userData.user_occ = userData.user_occ
  },
  methods: {
    fileChange(file) {
      this.fileList = [file]
      this.upLoad()
    },
    // 获取签名
    upLoad() {
      if (this.fileList.length > 0) {
        this.fileList.forEach(file => {
          const folder = '/aionRes/user/' + this.$store.state.user.userData.id + '/'
          const filename = 'avatar' + new Date().getTime() + '.' + file.name.split('.').reverse()[0]
          if ((file.name.split('.').reverse()[0] === 'jpg' || file.name.split('.').reverse()[0] === 'png') && file.size / 1024 < 150) {
            this.uploadFile(folder, file, filename)
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
          console.log(data)
          _this.fileList = []
          _this.imageUrl = data.Location.replace('myres-1259295379.cos.ap-shanghai.myqcloud.com', 'http://res.aionlegend.net')
          _this.updateUserInfo()
        } else {
          _this.$message.error('上传失败')
        }
      })
    },
    updateUserInfo() {
      const img = this.imageUrl.replace('http://res.aionlegend.net', '')
      upDateUserInfo({ user_icon: img }).then(res => {
        this.$message({ type: 'info', message: res.data.msg })
      })
    },
    save() {
      upDateUserInfo(this.userData).then(res => {
        this.$message({ type: 'info', message: res.data.msg })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
