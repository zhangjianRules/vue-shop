<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="4">
          <el-button type="primary"
                     @click="addDialogVisible = true">
            添加角色
          </el-button>
        </el-col>
      </el-row>

      <el-table :data="rolesList"
                border
                stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, i1) in scope.row.children"
                    :key="item1.id"
                    :class="['bdbottom', i1 === 0 ? 'bdtop':'', 'vcenter']">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag :closable="true"
                        @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row :class="[i2 === 0 ? '':'bdtop', 'vcenter']"
                        v-for="(item2, i2) in item1.children"
                        :key=item2.id>
                  <el-col :span="6">
                    <el-tag type="success"
                            :closable="true"
                            @close="removeRightById(scope.row, item2.id)">
                      {{item2.authName + i2}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type='warning'
                            v-for="(item3, i3) in item2.children"
                            :key=item3.id
                            :closable="true"
                            @close="removeRightById(scope.row, item3.id)">{{item3.authName + i3}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称"
                         prop="roleName"></el-table-column>
        <el-table-column label="角色描述"
                         prop="roleDesc"></el-table-column>
        <el-table-column label="操作"
                         width="320px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="showEditRole(scope.row.id)">修改</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="removeRoleById(scope.row.id)">删除</el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark"
                        content="分配权限"
                        placement="top"
                        :enterable="false">
              <el-button type="warning"
                         icon="el-icon-setting"
                         size="mini"
                         @click="showRightDialog(scope.row)">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限"
               :visible.sync="setRightDialogVisible"
               width="50%"
               @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree :data="rightsList"
               :props="treeProps"
               show-checkbox
               node-key="id"
               default-expand-all
               :default-checked-keys="defKeys"
               ref="treeRef"></el-tree>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  created () {
    this.getRolesList()
  },
  data () {
    return {
      // 所有角色列表数据
      rolesList: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限列表
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        // 界面展示名称
        label: 'authName',
        // 父子嵌套字段
        children: 'children'
      },
      // 默认权限树选中节点Id值数组
      defKeys: [],
      // 当前即将分配角色的id
      roleId: ''

    }
  },
  methods: {
    async getRolesList () {
      const response = await this.$http.get('/v1/roles')
      if (response.data.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = response.data.data
    },
    async showEditRole (id) {
      // const response = await this.$http.get('/v1/roles/' + id)
    },
    async removeRoleById (id) {
      // const response = await this.$http.get('/v1/roles/' + id)
    },
    // 根据id删除对应的权限
    async removeRightById (role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }

      const response = await this.$http.delete('/v1/roles/' + role.id + '/rights/' + rightId)

      if (response.data.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.info('删除成功')
      role.children = response.data.data
    },
    // 展示分配权限的对话框
    async showRightDialog (role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const response = await this.$http.get('/v1/rights/tree')
      if (response.data.meta.status !== 200) {
        return this.$message.error('获取权限失败')
      }
      // 把获取到的权限数据保存到data中
      this.rightsList = response.data.data
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归形式，获取角色下所有三级权限的id并保存到数组中
    getLeafKeys (node, arr) {
      // 如果当前节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed () {
      this.rightsList = []
    },
    // 为角色分配权限
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const response = await this.$http.post('/v1/roles/' + this.roleId + '/rights', { rids: idStr })
      if (response.data.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }

  }

}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
