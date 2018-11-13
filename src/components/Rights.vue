<template>
<div class="right">
    <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/rights' }">权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 添加角色 -->
  <el-button type="success" plain>添加权限</el-button>
  <!-- 表格 -->
  <el-table :data="rightList" width="100%">
    <el-table-column type="index"></el-table-column>
    <el-table-column label="权限名称" prop="authName"></el-table-column>
    <el-table-column label="路径" prop="path"></el-table-column>
    <el-table-column label="层级" prop="level">
      <template slot-scope="scope">
        <span v-if="scope.row.level === '0'">一级</span>
        <span v-else-if="scope.row.level === '1'">二级</span>
        <span v-else>三级</span>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
export default {
  data() {
    return {
      rightList: []
    }
  },
  async created() {
    let res = await this.axios.get('rights/list')
    let {
      meta: { status },
      data
    } = res
    if (status === 200) this.rightList = data
  }
}
</script>

<style>
</style>
