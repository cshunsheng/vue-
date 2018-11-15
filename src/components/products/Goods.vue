<template>
  <div class="goods">
    <!-- 添加商品 -->
  <el-button type="success" plain>添加商品</el-button>
  <!-- content -->
  <el-table
    :data="goodsData"
    style="width: 100%">
    <el-table-column
      type="index"
      width="50">
    </el-table-column>
    <el-table-column
      property="goods_name"
      label="商品名称"
      width="120">
    </el-table-column>
    <el-table-column
      property="goods_price"
      label="商品价格"
      width="120">
    </el-table-column>
    <el-table-column
      property="goods_weight"
      label="商品重量">
    </el-table-column>
    <el-table-column
      property="add_time"
      label="创建时间">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button type="primary" size="small" plain icon="el-icon-edit" ></el-button>
        <el-button type="danger" size="small" plain icon="el-icon-delete"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    background
    @current-change="handleCurrentChange"
    :total="total"
    layout="prev, pager, next"
  >
  </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsData: [],
      query: '',
      pagenum: 1,
      pagesize: 5,
      total: 0
    }
  },
  async created() {
    this.getGoodsList()
  },
  methods: {
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getGoodsList()
    },
    async getGoodsList() {
      let res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
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
