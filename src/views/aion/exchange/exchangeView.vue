<template>
  <div>
    <el-row style="text-align: center;">
      <span style="color: red;">交易小心骗子</span>
      <el-button type="primary" size="mini" @click="openGoodsEdit('add')">点我买卖登记</el-button>
    </el-row>
    <el-row type="flex" justify="center">
      <el-tabs
        v-model="goods_query.faction"
        tab-position="left"
        style="height: 200px;margin-top: 10px;"
        @tab-click="filter"
      >
        <el-tab-pane label="全部" name="0" />
        <el-tab-pane label="天族" name="1" />
        <el-tab-pane label="魔族" name="2" />
      </el-tabs>
      <el-tabs
        v-if="activeName === '1'"
        v-model="goods_query.occ"
        tab-position="left"
        style="height: 600px;margin-top: 10px;"
        @tab-click="filter"
      >
        <el-tab-pane v-for="(item,index) in occList" :key="item" :label="item" :name="index+''" />
      </el-tabs>
      <div class="main-width">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="账号出售" name="1" />
          <el-tab-pane label="账号求购" name="2" />
          <el-tab-pane label="金币出售" name="3" />
          <el-tab-pane label="金币求购" name="4" />
          <!-- <el-tab-pane label="需求服务" name="5" /> -->
          <el-tab-pane label="代练" name="5" />
          <el-tab-pane v-if="userEmail==='173708480@qq.com'" label="点券充值" name="7" />
        </el-tabs>
        <adminAddAcc v-if="userEmail==='173708480@qq.com'" />
        <el-table :data="tableData" @sort-change="sortMethod">
          <el-table-column label="标题" prop="name">
            <template slot-scope="scope">
              <div>
                <el-link
                  type="primary"
                  style="font-size: 16px; font-weight: 800;"
                  @click="dataDetial(scope.row)"
                >{{ scope.row.name }}</el-link>
                <div style="color: rgb(55,55,55);">
                  添加时间:{{ scope.row.add_time }}&nbsp;&nbsp;&nbsp;
                  联系方式:{{ scope.row.user_contact }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="价格" sortable="custom" prop="price" :width="device==='mobile'?'80px':'200px'">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.shop_price===0">私聊</span>
                <span v-if="scope.row.shop_price>0">{{ scope.row.shop_price }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="device!='mobile'" label="操作" class="mobile-column-hide" width="250px">
            <template slot-scope="scope">
              <div>
                <el-button type="primary" size="mini" @click="dataDetial(scope.row)">查看</el-button>
                <el-button v-if="userEmail===scope.row.user_email || userEmail==='173708480@qq.com'" type="warning" size="mini" @click="edit(scope.row)">编辑</el-button>
                <el-button v-if="userEmail===scope.row.user_email || userEmail==='173708480@qq.com'" type="danger" size="mini" @click="deleteGoods(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="total>0?true:false"
          :current-page="goods_query.page"
          :page-size="goods_query.page_size"
          :page-sizes="[10,20,50,100]"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-row>
    <goods-edit ref="goodsEdit" @refresh="init" />
  </div>
</template>

<script>
/*eslint-disable*/
import { data } from "./data/myaion";
import goodsEdit from "./components/goodsEdit";
import adminAddAcc from './components/adminAddAcc'
import { insertGoods, selectGoods,updateGoods } from "@/api/aion/exchange.js";
export default {
  components: { goodsEdit,adminAddAcc },
  data() {
    return {
      total: 0,
      alist: [],
      glist: [],
      activeName: "1",
      tableData: [],
      type: 1, // 1 destiny 2 myaion 3 gc
      occList: [
        "全部",
        "守护星",
        "剑星",
        "魔道星",
        "精灵星",
        "杀星",
        "弓星",
        "治愈星",
        "护法星",
        "枪炮星",
        "机甲星",
        "吟游星",
        "彩绘星"
      ],
      allData: [],
      factionArr: ["", "天族", "魔族"],
      goods_query: {
        server_id: 1, // 服务器id 1 aiondesnity 2 myaion 3 gc
        occ: "0", // 职业
        faction: "0", // 种族 1天族 2魔族
        goods_type: 1, // 商品类型 # 1 出售账号 2 收账号 3 出金币  4 收金币 5 需求服务 6 提供服务
        page_size: 10,
        page: 1,
        order: 0
      }
    };
  },
  mounted() {
    this.$message({message:'看右上角切换服务器！！！看右上角切换服务器！！！',type:'info',duration:2000});
    this.init();
  },
  computed: {
    userEmail(){
      return this.$store.state.user.userData.email
    },
    device() {
      return this.$store.state.app.device
    },
  },
  methods: {
   
    edit(row){
      this.openGoodsEdit('edit',row)
    },
    deleteGoods(row){
      row.is_sell=false
      this.$confirm('确定删除？',  {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         updateGoods({id:row.id,name:row.name,is_sell:false}).then(res => {
        if (res.status === 200) {
          this.$message({ type: 'success', message: '删除成功！' })
          this.drawer = false
          this.init()
        }
      })
      })
     
    },
    handleCurrentChange(val) {
      this.goods_query.page = val;
      this.init();
    },
    sortMethod(a) {
      console.log(a.order);
      
      if (a.order === "ascending") {
        this.goods_query.order = 1;
      } else if (a.order === "descending") {
        this.goods_query.order = 2;
      } else {
        this.goods_query.order = 0;
      }
      this.init()
    },
    handleSizeChange(val) {
      this.goods_query.page_size = val;
      this.goods_query.page = 1;
      this.init();
    },
    init() {
      this.tableData = []
      this.type = this.$store.state.user.server
      this.goods_query.server_id = this.type;
      this.goods_query.goods_type = this.activeName;
      let param = {
        server_id: this.type, // 服务器id 1 aiondesnity 2 myaion 3 gc
        page_size: this.goods_query.page_size,
        page: this.goods_query.page,
        is_sell: true
      };
      if (parseInt(this.goods_query.occ)) {
        param.occ = parseInt(this.goods_query.occ);
      }
      if (parseInt(this.goods_query.faction)) {
        param.faction = parseInt(this.goods_query.faction);
      }
      if (parseInt(this.goods_query.goods_type)) {
        param.goods_type = parseInt(this.goods_query.goods_type);
      }
      if (this.goods_query.order) {
        param.order = this.goods_query.order;
      }
      selectGoods(param).then(res => {
        this.total = res.data.count;
        res.data.results.forEach(e => {
          e.add_time = new Date(e.add_time).toLocaleDateString();
        });
        this.tableData = res.data.results;
      });
    },
    openGoodsEdit(type, data) {
      if (this.$store.state.user.token) {
        this.$refs.goodsEdit.setData(type, data, this.type);
      } else  {
        this.$router.push({path:'/login'})
      }
      
    },

    handleClick(val) {
      this.goods_query.goods_type = parseInt(val.name)
      this.goods_query.page = 1
      this.init()
    },
    dataDetial(row) {
      const routeUrl = this.$router.resolve({
        path: "/accDetail",
        query: {
          id: row.id,
          type: this.type
        }
      });
      window.open(routeUrl.href, "_blank");
    },
    filter() {
      this.goods_query.page = 1
      this.init();
    }
  }
};
</script>

<style scoped>
</style>
