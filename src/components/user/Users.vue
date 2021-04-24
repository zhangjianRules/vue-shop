<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <div style="margin-top: 15px;">
        <el-row :gutter="15">
          <el-col :span="9">
            <el-input placeholder="请输入内容"
                      v-model="queryInfo.query"
                      clearable
                      @clear="getUserList">
              <el-button slot="append"
                         icon="el-icon-search"
                         @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary"
                       @click="addDialogVisible = true">
              添加用户
            </el-button>
          </el-col>
        </el-row>

        <!-- 用户列表区 -->
        <el-table :data="userList"
                  border
                  stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="姓名"
                           prop="username"></el-table-column>
          <el-table-column label="角色"
                           prop="role_name"></el-table-column>
          <el-table-column label="电话"
                           prop="mobile"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state"
                         @change="userStateChanged(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="180px">
            <template>
              <!-- 修改按钮 -->
              <el-button type="primary"
                         icon="el-icon-edit"
                         size="mini"
                         @click="showEditDialog"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger"
                         icon="el-icon-delete"
                         size="mini"></el-button>
              <!-- 分配角色按钮 -->
              <el-tooltip effect="dark"
                          content="分配角色"
                          placement="top"
                          :enterable="false">
                <el-button type="warning"
                           icon="el-icon-setting"
                           size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="queryInfo.pageNum"
                         :page-sizes="[1, 2, 5, 10]"
                         :page-size="queryInfo.pageSize"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="total">
          </el-pagination>
        </div>
      </div>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户"
               :visible.sync="addDialogVisible"
               width="50%"
               @close="addDialogClose">
      <!-- 内容主体区 -->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="70px">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户"
               :visible.sync="editDialogVisible"
               width="50%">
      <span>这是一段信息</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 自定义校验规则 邮箱校验
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱正则表达式
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 自定义校验规则 手机号校验
    var checkMobile = (rule, value, callback) => {
      var regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pageNum: 1,
        pageSize: 2
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }, { min: 3, max: 10, message: '用户名的长度在3到10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 15, message: '用户名的长度在6到15个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' }, { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false

    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const response = await this.$http.get('/v1/mock/users', { params: this.queryInfo })
      if (response.data.code !== 200) { return this.$message.error('获取用户列表失败！') }
      this.userList = response.data.data.users
      this.total = response.data.data.total
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    // 监听 页码值改变的事件
    handleCurrentChange (newPage) {
      console.log(newPage)
      this.queryInfo.pageNum = newPage
      this.getUserList()
    },
    // 监控switch 开关状态的改变
    async userStateChanged (userinfo) {
      console.log(userinfo)
      // 发送保存请求
      const response = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      console.log(response.data)
      if (response.data.code !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新状态成功')
    },
    // 监听添加用户对话框的关闭事件
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加新用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        // 校验失败
        if (!valid) return
        // 可以发起添加用户的请求
        const response = await this.$http.post('/users', this.addForm)
        if (response.data.code !== 200) {
          return this.$message.error('用户添加失败')
        }
        this.$message.success('用户添加成功')
        // 用户添加成功，隐藏添加用户的对话框
        this.addDialogClose = false
        // 重新获取用户列表
        this.getUserList()
      })
    },
    // 展示用户编辑的对话框
    showEditDialog () {
      this.editDialogVisible = true
    }
  }

}
</script>

<style lang="less" scoped>
</style>
