<template>
  <el-container class="home">
    <el-header>
      <div class="logo"></div>
      <div class="logout">
        欢迎光临
        <a href="javascript:;" @click="logout">退出</a>
      </div>
      <h1 class="title">电商后台管理系统</h1>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- el-menu： 菜单组件 -->
        <!-- default-active 默认选中的菜单 -->
        <!-- el-submenu 子菜单 一级分类-->
        <!-- el-menu-item 二级菜单 -->
        <!-- template 子菜单的文本 -->
        <!-- unique-opened 最多打开一个列表 -->
        <!-- router: 开启路由模式 地址是index值 -->
        <el-menu
          :default-active="$route.path.slice(1)"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router>
          <el-submenu :index="level1.path" v-for="level1 in menuList" :key="level1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{level1.authName}}</span>
            </template>
            <el-menu-item :index="level2.path" v-for="level2 in level1.children" :key="level2.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ level2.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: ''
    }
  },
  methods: {
    // 退出
    async logout() {
      try {
        await this.$confirm('您确定退出吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        localStorage.removeItem('token')
        this.$router.push('./Login.vue')
      } catch (e) {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      }
    }
  },
  async created() {
    let res = await this.axios.get('menus')
    let {
      meta: { status },
      data
    } = res
    if (status === 200) {
      this.menuList = data
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-header {
    background-color: #b3c1cd;
    .logo {
      width: 180px;
      height: 60px;
      float: left;
      background-image: url('../assets/logo.png');
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center center;
    }
    .logout {
      width: 180px;
      height: 60px;
      float: right;
      line-height: 60px;
      text-align: right;
      font-weight: bold;
      a {
        color: darkorange;
      }
    }
    .title {
      overflow: hidden;
      height: 60px;
      text-align: center;
      line-height: 60px;
      font-size: 28px;
      color: #fff;
    }
  }
  // .el-container {
  //   height: 100%;
  .el-aside {
    background-color: #545c64;
    // height: 100%;
    .el-submenu {
      width: 200px;
    }
  }
  .el-main {
    background-color: #eaeef1;
  }
  // }
}
</style>
