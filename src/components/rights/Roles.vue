<template>
<div class="roles">
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/rights' }">权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 添加角色 -->
  <el-button type="success" plain @click="showAddDialog">添加角色</el-button>
  <!-- 表格 -->
  <el-table :data="roleList" width="100%">
    <el-table-column type="expand">
      <template slot-scope="scope">
        <el-row v-if="scope.row.children.length === 0">
          暂无权限
        </el-row>
        <!-- 一级 -->
          <el-row v-for="level1 in scope.row.children" :key="level1.id">
            <el-col :span="4">
              <el-tag closable @close="deleteRight(scope.row, level1.id)">{{level1.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <!-- 二级 -->
              <el-row class="level2" v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="4">
                  <el-tag @close="deleteRight(scope.row, level2.id)" closable type="success" >{{level2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <!-- 三级 -->
                  <el-tag @close="deleteRight(scope.row, level3.id)" class="level3" v-for="level3 in level2.children" :key="level3.id" closable type="danger">
                    {{level3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
      </template>
    </el-table-column>
    <el-table-column type="index"></el-table-column>
    <el-table-column label="角色名称" prop="roleName"></el-table-column>
    <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
    <el-table-column label="操作" >
      <template slot-scope="scope">
        <el-button type="primary" size="small" plain icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
        <el-button type="danger" size="small" plain icon="el-icon-delete" @click="deleteRole(scope.row.id)"></el-button>
        <el-button type="success" size="small" plain icon="el-icon-check" @click="showAssignRight(scope.row)">分配权限</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 添加角色信息模态框 -->
  <el-dialog :title="roleForm.id?'修改角色':'添加角色'" :visible.sync="roleDialogVisible">
    <el-form :model="roleForm" ref="roleForm" :rules="rules" status-icon label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="roleForm.roleName" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="roleForm.roleDesc" autocomplete="off" ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="roleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addRole">添 加</el-button>
    </div>
  </el-dialog>
  <!-- 编辑角色信息模态框 -->
  <!-- <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible">
    <el-form :model="editroleForm" :rules="rules" ref="editroleForm" status-icon label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="editroleForm.roleName" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="editroleForm.roleDesc" autocomplete="off" ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="editRoleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editRole">编 辑</el-button>
    </div>
  </el-dialog> -->
  <!-- 添加用户信息模态框 -->
  <el-dialog title="分配权限" :visible.sync="assignDialogVisible" width="40%">
    <el-tree
      ref="tree"
      node-key="id"
      :data="rightList"
      :props="defaultProps"
      show-checkbox
      default-expand-all>
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button @click="assignDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click='assignRight'>分 配</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      assignDialogVisible: false,
      rightList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      roleForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '用户名不能为空', trigger: 'change' }
        ]
      },
      roleDialogVisible: false
      // editroleForm: {
      //   id: '',
      //   roleName: '',
      //   roleDesc: ''
      // },
      // editRoleDialogVisible: false
    }
  },
  methods: {
    // 渲染角色表格函数
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
    // 分配权限按钮的点击函数，发送axios请求获取数据
    async getRightList() {
      let res = await this.axios.get('rights/tree')
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.rightList = data
      }
    },
    async deleteRight(role, rightId) {
      let res = await this.axios.delete(`roles/${role.id}/rights/${rightId}}`)
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        role.children = data
        this.$message.success('')
      }
    },
    // 渲染分配权限模态框
    showAssignRight(role) {
      // 修改的角色id存起来
      this.roleId = role.id
      this.getRightList()
      this.assignDialogVisible = true
      this.$nextTick(() => {
        let temp = []
        role.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              temp.push(l3.id)
            })
          })
        })
        // 设置默认选中项
        this.$refs.tree.setCheckedKeys(temp)
      })
    },
    // 分配权限
    async assignRight() {
      // 获取全选id
      let checked = this.$refs.tree.getCheckedKeys()
      // 获取所有半选id
      let halfChecked = this.$refs.tree.getHalfCheckedKeys()
      // ...扩展运算符
      let all = [...checked, ...halfChecked]
      // 发送axios请求， 数据库修改数据
      let res = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids: all.join()
      })
      let {
        meta: { status }
      } = res
      if (status === 200) {
        this.assignDialogVisible = false
        this.getRoleList()
      }
    },
    // 添加角色
    addRole() {
      this.$refs.roleForm.validate(async vaild => {
        if (!vaild) return false
        let id = this.roleForm.id
        let method = id ? 'put' : 'post'
        let url = id ? `roles/${id}` : `roles`
        let state = id ? 200 : 201
        let res = await this.axios({
          method,
          url,
          data: this.roleForm
        })
        let {
          meta: { status }
        } = res
        if (status === state) {
          this.$refs.roleForm.resetFields()
          this.roleDialogVisible = false
          this.getRoleList()
          this.$message.success('操做成功了')
        }
      })
    },
    // 删除角色
    async deleteRole(id) {
      try {
        await this.$confirm('你确定要删除这个角色吗', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`roles/${id}`)
        if (res.meta.status === 200) {
          this.getRoleList()
          this.$message.error('删除成功了')
        }
      } catch (err) {
        this.$message.error('取消删除')
      }
    },
    // 展示showAddDialog
    showAddDialog() {
      this.roleForm.id = ''
      this.roleForm.roleName = ''
      this.roleForm.roleDesc = ''
      this.roleDialogVisible = true
    },
    // 展示showEditDialog
    showEditDialog({id, roleName, roleDesc}) {
      this.roleForm.id = id
      this.roleForm.roleName = roleName
      this.roleForm.roleDesc = roleDesc
      this.roleDialogVisible = true
    }
    // 编辑角色
    // editRole() {
    //   this.$refs.editroleForm.validate(async vaild => {
    //     if (!vaild) return false
    //     let res = await this.axios.put(
    //       `roles/${this.editroleForm.id}`,
    //       this.editroleForm
    //     )
    //     let {
    //       meta: { status }
    //     } = res
    //     if (status === 200) {
    //       this.$refs.editroleForm.resetFields()
    //       this.editRoleDialogVisible = false
    //       this.getRoleList()
    //       this.$message.success('编辑成功了')
    //     }
    //   })
    // }
  },

  // 钩子函数中发送axios请求数据，渲染页面
  async created() {
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.level2 {
  margin-bottom: 10px;
}
.level3 {
  margin-bottom: 5px;
  margin-right: 10px;
}
</style>
