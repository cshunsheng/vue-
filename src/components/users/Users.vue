<template>
<div class="users">
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 搜素框功能 -->
  <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
  </el-input>
  <el-button type="success" plain @click="dialogFormVisible = true">用户添加</el-button>
  <!-- 表格展示功能 -->
  <!-- table： 表格组件 -->
  <!-- :data="tableData" 给表格的数据 -->
  <!-- el-table-column  的一列-->
  <!-- label 表格一列的标题 -->
  <!-- prop 数据的属性名 -->
  <el-table
    :data="userList"
    style="width: 100%;margin-top: 10px">
    <el-table-column
      prop="username"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱"
      width="180">
    </el-table-column>
    <el-table-column
      prop="mobile"
      label="电话"
      width="180">
    </el-table-column>
    <el-table-column
      prop="mg_state"
      label="状态"
      width="180">
      <template slot-scope="scope">
        <el-switch
          v-model="scope.row.mg_state"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="changeState(scope.row)">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button type="primary" size="small" plain icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
        <el-button type="danger" size="small" plain icon="el-icon-delete" @click="delUser(scope.row.id)"></el-button>
        <el-button type="success" size="small" plain icon="el-icon-check" @click="showRole(scope.row)">分配角色</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页功能 -->
  <el-pagination
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-size="pageSize"
    :total="total"
    :page-sizes="[2, 4, 6, 8]"
    layout="total, sizes, prev, pager, next, jumper"
  >
  </el-pagination>
  <!-- 添加用户信息模态框 -->
  <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" status-icon label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码"  prop="password">
        <el-input v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱"  prop="email">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机"  prop="mobile">
        <el-input v-model="form.mobile" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="add">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 编辑 -->
  <el-dialog title="修改用户" :visible.sync="editDialogVisible">
    <el-form :model="editForm" :rules="rules" ref="editForm" status-icon label-width="80px">
      <el-form-item label="用户名">
        <el-tag type='info'>{{editForm.username}}</el-tag>
      </el-form-item>
      <el-form-item label="邮箱"  prop="email">
        <el-input v-model="editForm.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机"  prop="mobile">
        <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editUser">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 分配角色模态框 -->
  <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="40%">
    <el-form :model="assignForm" ref="roleForm" :rules="rules" status-icon label-width="80px">
      <el-form-item label="用户名" prop="userName">
        <el-tag type="info">{{assignForm.username}}</el-tag>
      </el-form-item>
      <el-form-item label="角色列表" prop="rid">
        <el-select v-model="assignForm.rid" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addRoleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="assignRole">分 配</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
// const BASE_URL = 'http://localhost:8888/api/private/v1/'
export default {
  data() {
    return {
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      userList: [],
      editDialogVisible: false,
      dialogFormVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          {
            min: 3,
            max: 9,
            message: '用户名长度为 5 到 12 个字符',
            trigger: 'change'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '密码长度为 6 到 12 个字符',
            trigger: 'change'
          }
        ],
        email: [
          { type: 'email', message: '邮箱格式不正确', trigger: 'change' }
        ],
        mobile: [
          {
            // pattern: /^1[3,4,5,7,8][0-9]{9}$/,
            pattern: /^1\d{10}/,
            message: '手机格式不正确',
            trigger: 'change'
          }
        ]
      },
      roleList: [],
      addRoleDialogVisible: false,
      assignForm: {
        id: '',
        username: '',
        rid: ''
      },
      // 角色列表
      options: []
    }
  },
  methods: {
    async getRoleList() {
      let res = await this.axios.get('roles')
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.roleList = data
      }
    },
    async getUsersList() {
      let res = await this.axios({
        url: 'users',
        method: 'get',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let {
        meta: { status },
        data: { users, total }
      } = res
      if (status === 200) {
        this.userList = users
        this.total = total
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUsersList()
      // console.log(`当前页: ${val}`)
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.getUsersList()
      // console.log(`每页 ${val} 条`)
    },
    async delUser(id) {
      try {
        await this.$confirm('你确定要删除这个用户吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios({
          url: `users/${id}`,
          method: 'delete'
        })
        if (res.meta.status === 200) {
          if (this.userList.length === 1 && this.currentPage > 1) {
            this.currentPage--
          }
          this.getUsersList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      } catch (e) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    search() {
      this.currentPage = 1
      this.getUsersList()
    },
    async changeState(user) {
      // 发this.axios请求
      let res = await this.axios({
        url: `users/${user.id}/state/${user.mg_state}`,
        method: 'put'
        // headers: { Authorization: localStorage.getItem('token') }
      })
      if (res.meta.status === 200) {
        this.$message.success('修改成功了')
      } else {
        this.$message.error('修改失败')
      }
    },
    add() {
      this.$refs.form.validate(async vaild => {
        if (!vaild) return false
        let res = await this.axios({
          url: 'users',
          method: 'post',
          data: this.form
        })
        console.log(res)
        let {
          meta: { status }
        } = res
        if (status === 201) {
          this.currentPage = Math.ceil((this.total + 1) / this.pageSize)
          this.getUsersList()
          this.dialogFormVisible = false
          this.$refs.form.resetFields()
        }
      })
    },
    showEditDialog(user) {
      this.editDialogVisible = true
      this.editForm.id = user.id
      this.editForm.username = user.username
      this.editForm.email = user.email
      this.editForm.mobile = user.mobile
    },
    editUser() {
      this.$refs.editForm.validate(async vaild => {
        if (!vaild) return false
        let res = await this.axios({
          method: 'put',
          url: `users/${this.editForm.id}`,
          data: this.editForm
        })
        let {
          meta: { status }
        } = res
        if (status === 200) {
          this.getUsersList()
          this.$refs.editForm.resetFields()
          this.editDialogVisible = false
        }
      })
    },
    async showRole(role) {
      this.addRoleDialogVisible = true
      this.assignForm.id = role.id
      this.assignForm.username = role.username
      let res = await this.axios.get(`users/${role.id}`)
      console.log(res)
      let {
        meta: { status },
        data: { rid }
      } = res
      if (status === 200) {
        if (rid === -1) {
          rid = ''
        }
        this.assignForm.rid = rid
      }
      this.getRoleList()
    },
    async assignRole() {
      let { id, rid } = this.assignForm
      let res = await this.axios.put(`users/${id}/role`, {
        rid: rid
      })

      let {
        meta: { status }
      } = res
      if (status === 200) {
        this.addRoleDialogVisible = false
        this.$message({
          type: 'success',
          message: '分配角色成功'
        })
      }
    }
  },
  created() {
    this.getUsersList()
  }
}
</script>

<style lang="less">
.el-input {
  width: 400px;
}
</style>
