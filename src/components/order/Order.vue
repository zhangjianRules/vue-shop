<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    clearable
                    @clear="getOrderList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList"
                border
                stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号"
                         prop="order_number"></el-table-column>
        <el-table-column label="订单价格"
                         prop="order_price"
                         width="95px"></el-table-column>
        <el-table-column label="是否付款"
                         prop="pay_status"
                         width="80px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '0'"
                    type="danger">未付款</el-tag>
            <el-tag v-if="scope.row.pay_status === '1'"
                    type="success">已付款</el-tag>

          </template>
        </el-table-column>

        <el-table-column label="是否发货"
                         prop="is_send"
                         width="80px"></el-table-column>
        <el-table-column label="下单时间"
                         prop="create_time"
                         width="165px">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}

          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="130px">
          <template>
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="showBox"></el-button>

            <el-button type="success"
                       icon="el-icon-location-outline"
                       size="mini"
                       @click="showProgressBox">
            </el-button>

          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[5, 10, 15]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>

    </el-card>
    <!-- 添加地址对话框 -->
    <el-dialog title="修改地址"
               :visible.sync="addressDialogVisible"
               width="50%"
               @close="addressDialogClosed">
      <!-- 添加地址的表单 -->
      <el-form :model="addressForm"
               :rules="addressFormRules"
               :props="cascaderProps"
               ref="addressFormRef">

        <el-form-item label="省市区/县："
                      prop="address1">
          <el-cascader :options="cityData"
                       v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址："
                      prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度"
               :visible.sync="progressVisible"
               width="50%">
      <!-- 时间线 -->
      <el-timeline :reverse="reverse">
        <el-timeline-item v-for="(activity, index) in progressInfo"
                          :key="index"
                          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data () {
    return {
      // 查询条件
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      orderList: [],
      addressDialogVisible: false,
      addressForm: {
        address1: [],
        address2: []
      },
      addressFormRules: {
        address1: [
          {
            required: true, message: '请选择省市区县', trigger: 'blur'
          }
        ],
        address2: [
          {
            required: true, message: '请填写详细地址', trigger: 'blur'
          }
        ]
      },
      cityData: cityData,
      cascaderProps: { expandTrigger: 'hover' },
      progressVisible: false,
      progressInfo: []

    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const response = await this.$http.get('/v1/orders', { params: this.queryInfo })
      if (response.data.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.orderList = response.data.data.goods
      this.total = response.data.data.total
    },
    // 监听pagesize 改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听pagenum改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 展示修改地址的对话框
    showBox () {
      this.addressDialogVisible = true
    },
    addressDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressBox () {
      const response = await this.$http.get('/v1/kuaidi/804909574412544580')
      if (response.data.meta.status !== 200) {
        return this.$message.error('获取订单物流信息失败')
      }
      this.progressVisible = true
      this.progressInfo = response.data.data
    }

  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
