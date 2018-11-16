<template>
  <div class="goods">
    <!-- 添加商品 -->
  <el-button type="success" plain @click="$router.push('/goods-add')">添加商品</el-button>
  <!-- content -->
  <el-table
    :data="goodsData"
    style="width: 100%">
    <el-table-column type="index" :index="indexMethod" ></el-table-column>
    <el-table-column prop="goods_name" label="商品名称"></el-table-column>
    <el-table-column prop="goods_price" label="商品价格"></el-table-column>
    <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
    <el-table-column label="创建时间">
      <template slot-scope="scope">
        {{scope.row.add_time | dateFilter}}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button type="primary" size="small" plain icon="el-icon-edit" ></el-button>
        <el-button type="danger" size="small" plain icon="el-icon-delete"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[10, 20, 30, 40]"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsData: [],
      query: '',
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  async created() {
    this.getGoodsList()
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.currentPage = 1
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getGoodsList()
    },
    indexMethod(index) {
      return index + 10 * (this.currentPage - 1) + 1
    },
    async getGoodsList() {
      let res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      // console.log(res)
      let {
        meta: { status },
        data: { goods, total }
      } = res
      if (status === 200) {
        this.goodsData = goods
        this.total = total
      }
    }
  }
}
</script>

<style>
</style>
