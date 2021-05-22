<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息"
                type="info"
                center
                show-icon
                :closable="false">
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200"
                :active="activeIndex - 0"
                finish-status="success"
                align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="100px"
               label-position="top">

        <el-tabs :tab-position="'left'"
                 v-model="activeIndex"
                 :before-leave="beforeTabLeave"
                 @tab-click="tabClicked">
          <el-tab-pane label="基本信息"
                       name="0">
            <el-form-item label="商品名称"
                          prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格"
                          prop="goods_price">
              <el-input v-model="addForm.goods_price"
                        type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量"
                          prop="goods_weight"
                          type="number">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量"
                          prop="goods_number"
                          type="number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类："
                          prop="goods_cat">
              <div class="block">
                <!-- options 用来指定数据源 -->
                <!-- props 用来指定配置对象 -->
                <el-cascader v-model="addForm.goods_cat"
                             :options="cateList"
                             :props="cateProps"
                             @change="handleChanged"
                             clearable></el-cascader>
              </div>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数"
                       name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item :label="item.attr_name"
                          v-for="item in manyTableData"
                          :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb"
                             border
                             v-for="(cb, index) in item.attr_vals"
                             :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性"
                       name="2">
            <el-form-item :label="item.attr_name"
                          v-for="item in onlyTableData"
                          :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片"
                       name="3">
            <!-- action 表示图片要上传到后台的api地址 -->
            <el-upload :action="uploadURL"
                       :on-preview="handlePreview"
                       :on-remove="handleRemove"
                       list-type="picture"
                       :headers="headers"
                       :on-success="handleSuccess">
              <el-button size="small"
                         type="primary">点击上传</el-button>
              <div slot="tip"
                   class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容"
                       name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary"
                       class="btnAdd"
                       @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览"
               :visible.sync="previewVisible"
               width="50%">
      <img :src="previewPath"
           alt=""
           class="previewImg">

    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      activeIndex: '0',
      // 添加商品的数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        attrs: []

      },
      addFormRules: {
        goods_name: [
          {
            required: true, message: '请输入商品名称', trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true, message: '请输入商品价格', trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true, message: '请输入商品重量', trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true, message: '请输入商品重量', trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true, message: '请选择商品分类', trigger: 'blur'
          }
        ]
      },
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 上传图片接口
      uploadURL: 'http://timemeetyou.com:8889/api/private/v1/upload',
      // 图片上传组件headers请求头对象
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片url
      previewPath: '',
      // 预览对话框
      previewVisible: false
    }
  },

  created () {
    // 获取所有商品分类数据
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList () {
      const response = await this.$http.get('/v1/categories')
      if (response.data.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.cateList = response.data.data
    },
    // 级联选择器选中项变化会触发的函数
    handleChanged () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
      return true
    },
    async tabClicked () {
      // 访问商品动态参数面板
      if (this.activeIndex === '1') {
        const response = await this.$http.get(`/v1/categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (response.data.meta.status !== 200) {
          return this.$message.error('获取商品动态参数列表失败')
        }
        response.data.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? []
            : item.attr_vals.split(' ')
        })
        this.manyTableData = response.data.data
      } else if (this.activeIndex === '2') {
        // 静态属性面板
        const response = await this.$http.get(`/v1/categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (response.data.meta.status !== 200) {
          return this.$message.error('获取商品静态属性列表失败')
        }
        this.onlyTableData = response.data.data
      }
    },
    // 处理图片预览效果
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 处理移除图片的操作
    handleRemove (file) {
      // 图片临时路径
      const filePath = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(item => item.pic === filePath)
      this.addForm.pics.splice(index, 1)
    },
    // 监听图片上传成功时间
    handleSuccess (response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 添加商品
        // lodash cloneDeep(obj) 深拷贝
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // 商品名称，必须是唯一的
        const response = await this.$http.post('/v1/goods', form)

        if (response.data.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 10px;
}
</style>
