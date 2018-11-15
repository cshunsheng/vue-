<template>
  <div class="categories">
    <!-- 添加商品 -->
  <el-button type="success" plain @click="showCateDialog">添加分类</el-button>
  <!-- content -->
  <el-table
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    :data="categoriesData"
    style="width: 100%">
    <el-table-tree-column
      prop="cat_name"
      label="分类名称"
      tree-key='cat_id'
      parent-key="cat_pid"
      level-key="cat_level"
      :indentSize="20"
      >
    </el-table-tree-column>
    <el-table-column prop="cat_deleted" label="是否删除">
      <template slot-scope="scope">
        {{scope.row.cat_deleted?'是':'否'}}
      </template>
    </el-table-column>
    <el-table-column
      prop="cat_level"
      label="排序">
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <!-- <span>{{JSON.stringify(scope)}}</span> -->
        <el-button type="primary" size="small" plain icon="el-icon-edit" ></el-button>
        <el-button type="danger" size="small" plain @click="deleteCategory(scope.row.cat_id)" icon="el-icon-delete"></el-button>
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
  <!-- 添加分类模态框 -->
  <el-dialog title="添加分类" :visible.sync="categoryDialogVisible" width="40%">
    <el-form :model="cateForm" ref="cateForm" :rules="rules" status-icon label-width="80px">
      <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="cateForm.cat_name" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item label="父级名称" prop="cat_pid">
        <el-cascader
          :options="options"
          change-on-select
          :props="props"
          v-model="cateForm.cat_pid"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="categoryDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addCategory">添 加</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoriesData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'change' }
        ]
      },
      categoryDialogVisible: false,
      cateForm: {
        cat_name: '',
        cat_pid: []
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name'
      }
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.currentPage = 1
      this.getCategoryList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getCategoryList()
    },
    async getCategoryList() {
      this.loading = true
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let {
        meta: { status },
        data: { total, result }
      } = res
      // console.log(res)
      if (status === 200) {
        this.categoriesData = result
        this.total = total
        setTimeout(() => {
          this.loading = false
        }, 500)
      }
    },
    async deleteCategory(id) {
      // console.log(id)
      try {
        await this.$confirm('你确定要删除这个角色吗', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`categories/${id}`)
        // console.log(res)
        if (res.meta.status === 200) {
          this.getCategoryList()
          this.$message.error('删除成功了')
        }
      } catch (err) {
        this.$message.error('取消删除')
      }
    },
    async showCateDialog() {
      this.categoryDialogVisible = true
      let res = await this.axios.get('categories?type=2')
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.options = data
      }
    },
    addCategory() {
      this.$refs.cateForm.validate(async valid => {
        if (!valid) return false
        let { cat_name: catName, cat_pid: catPid } = this.cateForm
        let res = await this.axios.post('categories', {
          cat_name: catName,
          cat_pid: catPid[catPid.length - 1] || 0,
          cat_level: catPid.length
        })
        console.log(res)
        let {
          meta: { status }
        } = res
        if (status === 201) {
          this.categoryDialogVisible = false
          this.$refs.cateForm.resetFields()
          this.getCategoryList()
          this.$message.success('操做成功了')
        }
      })
    }
  }
}
</script>

<style>
</style>
