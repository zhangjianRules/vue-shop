<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div style="margin-top: 15px;">
        <!-- 用户列表区 -->
        <el-table :data="permissionList"
                  border
                  stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="权限名称"
                           prop="name"></el-table-column>
          <el-table-column label="路径"
                           prop="path"></el-table-column>
          <el-table-column label="等级"
                           prop="level">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level === '1'">一级</el-tag>
              <el-tag v-if="scope.row.level === '2'"
                      type="success">二级</el-tag>
              <el-tag v-if="scope.row.level === '3'"
                      type="warning">三级</el-tag>

            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  created () {
    this.getPermission()
  },
  data () {
    return {
      permissionList: []
    }
  },
  methods: {
    // 获取权限列表
    async getPermission () {
      const response = await this.$http.get('/v1/mock/permission')
      if (response.data.code !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      console.log(response.data.data)
      this.permissionList = response.data.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
