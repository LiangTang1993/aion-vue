<template>
  <div>
    <el-row type="flex" justify="center">
      <div class="main-width">
        <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="aiondestiny" name="1" />
          <el-tab-pane label="myaion" name="2" />
          <el-tab-pane label="gamecoast" name="3" />
        </el-tabs> -->
        <el-button type="primary" size="mini" @click="addClick">添加组队信息</el-button>
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <div>
                <el-button v-if="scope.row.myType===3" type="primary" size="mini" style="float:right;" @click="enterDia(scope.row)">入队</el-button>
                <el-button v-if="scope.row.myType===2" type="warning" size="mini" style="float:right" @click="quitGroup(scope.row)">退队</el-button>
                <el-button v-if="scope.row.myType===1" type="danger" size="mini" style="float:right" @click="disbandGroup(scope.row)">散队</el-button>
                <el-row style="margin-right:100px">详情：{{ scope.row.desc }}</el-row>
                <el-row style="margin-right:100px">开始：{{ new Date(scope.row.start_time).toLocaleString() }}</el-row>
                <el-row>
                  <div style="display:inline-block;border:1px solid #cccccc;margin:2px">
                    <el-row>{{ occList[scope.row.occ] }}</el-row>
                    <el-row>{{ scope.row.nickname }}</el-row>
                  </div>
                  <div v-for="item in scope.row.persons" :key="item.id" style="display:inline-block;border:1px solid #cccccc;margin:2px">
                    <el-row>{{ occList[item.occ] }}</el-row>
                    <el-row>{{ item.nickname }}</el-row>
                  </div>
                </el-row>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="标题"
            prop="name"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="device!='mobile'"
            label="描述"
            prop="desc"
            show-overflow-tooltip
          />
          <el-table-column
            label="人员"
            width="70px"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.cur_num }}/{{ scope.row.person_num }}
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="操作"
            width="150px"
          >
            <template slot-scope="scope">
              <div>

                <el-button type="primary" size="mini">入队</el-button>
                <el-popconfirm
                  title="确定退队？"
                  @onConfirm="enterGroup(scope.row)"
                />

              </div>
            </template>
          </el-table-column> -->
        </el-table>
      </div>

    </el-row>
    <el-dialog :visible="visible" :rule="rule" title="组队信息" :width="device=='mobile'?'100%':'400px'" :before-close="beforeClose" :append-to-body="true">
      <el-form ref="groupForm" :model="groupForm" label-width="100px">
        <div v-if="type=='group'">
          <el-form-item
            label="服务器"
          >
            <el-select v-model="groupForm.server" placeholder>
              <el-option label="aiondestiny" :value="1" />
              <el-option label="myaion" :value="2" />
              <el-option label="gamecoast" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="标题" prop="name">
            <el-input v-model="groupForm.name" placeholder="" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="groupForm.desc" placeholder="" />
          </el-form-item>
          <el-form-item label="人数">
            <el-input-number v-model="groupForm.person_num" placeholder="" />
          </el-form-item>
          <el-form-item label="开始时间" prop="start_time">
            <el-date-picker
              v-model="groupForm.start_time"
              type="datetime"
              placeholder="选择日期时间"
            />
          </el-form-item>
          <el-form-item label="队长角色名" prop="nickname">
            <el-input v-model="groupForm.nickname" placeholder="" />
          </el-form-item>
          <!-- <el-form-item label="职业限制">
            <el-input v-model="groupForm.occ_limit" placeholder="" />
          </el-form-item> -->
          <el-form-item label="职业">
            <el-select v-model="groupForm.occ" prop="occ" placeholder="">
              <el-option v-for="(item,index) in occList" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="角色名" prop="nickname">
            <el-input v-model="groupForm.nickname" placeholder="" />
          </el-form-item>
          <el-form-item label="职业">
            <el-select v-model="groupForm.occ" prop="occ" placeholder="">
              <el-option v-for="(item,index) in occList" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="addGroup">提交</el-button>
          <el-button @click="beforeClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getGroup, insertGroup, insertPerson, deletePerson, deleteGroup } from '@/api/aion/group'
export default {
  data() {
    return {
      activeName: '1',
      tableData: [],
      tableLoading: false,
      visible: false,
      occList: [
        '全部',
        '守护星',
        '剑星',
        '魔道星',
        '精灵星',
        '杀星',
        '弓星',
        '治愈星',
        '护法星',
        '枪炮星',
        '机甲星',
        '吟游星',
        '彩绘星'
      ],
      groupForm: {
        server: 1,
        name: '',
        desc: '',
        cur_num: 1,
        person_num: 2,
        occ: 1,
        start_time: null,
        nickname: '',
        persons: []
      },
      type: 'group',
      rule: {
        name: [{ required: true, message: '请输入组队名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        start_time: [{ required: true, message: '选择时间', trigger: 'blur' }]
      },
      selectRow: {}
    }
  },
  computed: {
    device() {
      return this.$store.state.app.device
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    addClick() {
      this.type = 'group'
      if (this.$store.state.user.userData.email) {
        this.visible = true
      } else {
        this.$router.push({ path: '/login', query: { type: '1' }})
      }
    },
    beforeClose() {
      this.groupForm = {
        server: 1,
        name: '',
        desc: '',
        cur_num: 1,
        person_num: 2,
        occ: 1,
        start_time: null,
        nickname: '',
        persons: []
      }
      this.visible = false
    },
    handleClick() {

    },
    addGroup() {
      this.$refs.groupForm.validate(valid => {
        if (valid) {
          if (this.type === 'group') {
            this.groupForm.server = this.$store.state.user.server
            this.groupForm.user_email = this.$store.state.user.userData.email
            insertGroup(this.groupForm).then(res => {
              if (res.data && res.data.id) {
                this.$message({ type: 'success', message: '创建成功！' })
                this.getTableData()
                this.beforeClose()
              }
            })
          } else {
            const param = { group: this.selectRow.id, nickname: this.groupForm.nickname, email: this.$store.state.user.userData.email, occ: this.groupForm.occ, type: 1 }
            insertPerson(param).then(res => {
              if (res.data.id) {
                this.selectRow.persons.push(res.data)
                this.$message({ type: 'success', message: '入队成功！' })
                this.getTableData()
                this.beforeClose()
              }
            })
          }
        }
      })
    },
    getTableData() {
      this.tableLoading = true
      getGroup({ server: this.$store.state.user.server }).then(res => {
        this.tableLoading = false
        res.data.results.forEach(e => {
          if (e.user_email === this.$store.state.user.userData.email) {
            e.myType = 1
          } else {
            const filter = e.persons.filter(f => {
              return f.email === this.$store.state.user.userData.email
            })
            if (filter.length > 0) {
              e.myType = 2
            } else {
              e.myType = 3
            }
          }
        })
        this.tableData = res.data.results
      })
    },
    enterGroup() {
      if (this.$store.state.user.userData.email) {
        this.visible = true
      } else {
        this.$router.push({ path: '/login', query: { type: '1' }})
      }
    },
    quitGroup(row) {
      const id = row.persons.filter(e => e.email === this.$store.state.user.userData.email)[0].id
      deletePerson(id).then(res => {
        if (res.status === 204) {
          this.$message({ 'type': 'success', 'message': '退队成功' })
          this.getTableData()
        }
      })
    },
    enterDia(row) {
      if (this.$store.state.user.userData.email) {
        this.selectRow = row
        this.visible = true
        this.type = 'person'
      } else {
        this.$router.push({ path: '/login', query: { type: '1' }})
      }
    },
    disbandGroup(row) {
      this.$confirm('确定删除组队？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGroup(row.id).then(res => {
          if (res.status === 204) {
            this.$message({ 'type': 'success', 'message': '退队成功' })
            this.getTableData()
          }
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
