<template>
  <div class="app-container">
    <section>
      <!--工具条-->
      <!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px"> -->
      <el-form :inline="true" :model="queryData">
        <!-- 查询内容 -->
        <el-form-item label="代码类型">
          <el-input v-model="queryData.dicType" type=""/>
        </el-form-item>
        <el-form-item label="代码名称">
          <el-input v-model="queryData.dicTypeName" type=""/>
        </el-form-item>
        <!--查询按钮-->
        <el-form-item>
          <el-button :loading="searchLoading" type="primary" icon="el-icon-search" @click="getListData()">查询</el-button>
        </el-form-item>
        <!-- 新建按钮-->
        <el-form-item>
          <el-button type="primary" @click="handleAddEdit()">新建码值</el-button>
        </el-form-item>
      </el-form>
      <!-- </el-col> -->

      <!--列表代码表和码值表-->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-card class="box-card">
            <div slot="header">
              <span class="fdictext">代码表</span>
            </div>
            <div class="text item">
              <el-table v-loading="listLoading" :data="queryResult" border highlight-current-row style="width: 100%">
                <el-table-column prop="dicType" label="代码类型" width="150"/>
                <el-table-column prop="dicTypeName" label="代码名称" min-width="100"/>
                <el-table-column prop="dicTypeCount" label="代码数量" min-width="60"/>
                <el-table-column label="操作" fixed="right" width="80">
                  <template slot-scope="scope">
                    <el-button :loading="scope.row.getKeyLoading" size="small" @click="getKeyListData(scope.row)">管理</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!--分页-->
              <el-col :span="24" class="toolbar">
                <el-pagination :current-page="pagination.pageNum" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
              </el-col>
            </div>
          </el-card>
        </el-col>
        <el-col :span="14">
          <el-card class="box-card">
            <div slot="header">
              <span class="fdictext">{{ fDicKeyTitle }}</span>
            </div>
            <div class="text item">
              <el-table v-loading="listKeyLoading" :data="queryKeyResult" border highlight-current-row style="width: 100%">
                <el-table-column prop="fDicKey" label="代码值" width="80"/>
                <el-table-column prop="fDicValue" label="代码名" min-width="80"/>
                <el-table-column prop="fDicIndex" label="排序" min-width="50"/>
                <el-table-column prop="fDicRemark" label="备注" min-width="100"/>
                <el-table-column label="操作" fixed="right" width="230">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.fValidaStatus===0" size="small" @click="setfValidaStatus(scope.row,'1')">启用</el-button>
                    <el-button v-if="scope.row.fValidaStatus===1" size="small" @click="setfValidaStatus(scope.row,'0')">禁用</el-button>
                    <el-button size="small" @click="KeyAddEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button size="small" @click="delDic(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!--分页-->
              <el-col :span="24" class="toolbar">
                <el-pagination :current-page="pagination.pageKeyNum" :page-sizes="pagination.pageKeySizes" :page-size="pagination.pageKeySize" :total="pagination.Keytotal" layout="total, sizes, prev, pager, next, jumper" @size-change="KyeleSizeChange" @current-change="KyeleCurrentChange"/>
              </el-col>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!--新增码表界面-->
      <el-dialog :title="addEditTitle" :visible.sync="addEditFormVisible" :close-on-click-modal="true" :before-close="addEditFormOnClose" width="25%">
        <el-form ref="formData" :label-position="labelPosition" :model="formData" :rules="rules" label-width="100px" style="margin-top: -10px;width: 88%;">
          <el-form-item label="代码类型" prop="fDicType">
            <el-input v-model="formData.dicType" placeholder="请输入代码类型" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="代码名称" prop="fDicTypeName">
            <el-input v-model="formData.dicTypeName" placeholder="请输入代码名称" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="代码值" prop="fDicKey">
            <el-input v-model="formData.dicKey" placeholder="请输入代码值" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="代码名" prop="fDicValue">
            <el-input v-model="formData.dicValue" placeholder="请输入代码名" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="排序" prop="fDicIndex">
            <el-input v-model="formData.dicIndex" placeholder="请输入排序值" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="备注" prop="fDicRemark">
            <el-input v-model="formData.dicRemark" placeholder="请输入备注" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="有效性状态" prop="fValidaStatus">
            <el-select v-model="formData.validaStatus" placeholder="请选择">
              <el-option
                v-for="item in filterData.validStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        <!--</el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addEditFormOnClose">取消</el-button>
          <el-button :loading="addEditSubmitLoading" type="primary" @click.native="addEditSubmit">提交</el-button>
        </div>
      </el-dialog>

      <!--新增Key界面-->
      <el-dialog :title="addKeyEditTitle" :visible.sync="addKeyEditFormVisible" :close-on-click-modal="true" :before-close="addKeyEditFormOnClose" width="25%">
        <el-form ref="formKeyData" :label-position="labelPosition" :model="formKeyData" :rules="rules" label-width="100px" style="margin-top:20px;width: 88%;">
          <el-form-item label="代码值" prop="dicKey">
            <el-input v-model="formKeyData.dicKey" placeholder="请输入代码值" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="代码名" prop="dicValue">
            <el-input v-model="formKeyData.dicValue" placeholder="请输入代码名" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="排序" prop="dicIndex">
            <el-input v-model.number="formKeyData.dicIndex" placeholder="请输入排序值" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="备注" prop="dicRemark">
            <el-input v-model="formKeyData.dicRemark" placeholder="请输入备注" auto-complete="off"/>
          </el-form-item>
        <!--</el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addKeyEditFormOnClose">取消</el-button>
          <el-button :loading="addKeyEditSubmitLoading" type="primary" @click.native="addKeyEditSubmit">提交</el-button>
        </div>
      </el-dialog>
    </section>
  </div>
</template>

<script>
import { queryList } from '@/api/dataDic'
export default {
  name: 'SystemManageDicInfo',
  data() {
    // 排序检查
    var checkDicIndex = (rule, value, callback) => {
      if ((!(/^[0-9]*$/).test(value))) {
        callback(new Error('请输入正确的排序'))
      } else {
        callback()
      }
    }
    return {
      addEditFormLoading: false, //
      listLoading: false, // 载入tableData
      listKeyLoading: false, // 载入tableData
      addEditSubmitLoading: false, // 按钮点击后
      addKeyEditSubmitLoading: false, // 按钮点击后
      addEditFormVisible: false, // 新增界面是否显示
      addKeyEditFormVisible: false, // 新增界面是否显示
      currentFormDataIndex: -1, // 新增：-1，编辑：>-1
      dicKeyname: '', // 码值
      dicKeyRow: {}, // 码值行
      searchLoading: false, // 查询按钮点击后
      labelPosition: 'left', // dialog中label汉字方向
      fIsBuyState: false, // 新增，修改Boolean
      formData: {}, // 提交
      formKeyData: {}, // 提交
      rules: { // 表单验证
        dicType: [
          { required: true, message: '请输入代码类型', trigger: 'change' }
        ],
        dicTypeName: [
          { required: true, message: '请输入代码名称', trigger: 'change' }
        ],
        dicKey: [
          { required: true, message: '请输入代码值', trigger: 'change' }
        ],
        dicValue: [
          { required: true, message: '请输入代码名', trigger: 'change' }
        ],
        dicIndex: [
          { validator: checkDicIndex, required: true, trigger: 'blur' }
        ]
      },
      filterData: { // 查询过滤
        validStatus: [
          { value: '1', label: '启用' },
          { value: '0', label: '禁用' }
        ]
      },
      pagination: { // 分页
        pageNum: 1,
        pageSizes: [10, 20, 30, 50],
        pageSize: 10,
        total: 1,
        pageKeyNum: 1,
        pageKeySizes: [10, 20, 30, 50],
        pageKeySize: 10,
        Keytotal: 1
      },
      queryData: { // 查询
        pageNum: Number,
        pageSize: Number,
        dicType: '', // 类型名
        dicTypeName: '' // 码值
      },
      queryKeyData: { // 查询
        pageNum: Number,
        pageSize: Number,
        dicType: '', // 码值
        id: '' // id
      },
      updateStatusData: { // 更新状态
        dicType: '', // 码值
        validStatus: 0
      },
      queryResult: [
      ],
      queryKeyResult: [
      ],
      categoryTreeData: [], // 资源分类 数据
      categoryTreeDefaultProps: { // 树默认
        children: 'children',
        label: 'label'
      },
      categoryTreeChecked: {
        id: '',
        label: ''
      }
    }
  },
  computed: {
    addEditTitle() {
      return this.currentFormDataIndex > -1 ? '编辑码值' : '新增码值'
    },
    addKeyEditTitle() {
      return '编辑代码值'
    },
    fDicKeyTitle() {
      return this.fDicKeyname + ' 码表数据'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    },
    formatAPI(_obj = {}) {
      for (const k of Object.keys(this.API)) {
        _obj[k] = `${this.API.prefix + this.API[k]}`
      }
      return _obj
    },
    // pageSize
    handleSizeChange(num) {
      this.pagination.pageSize = this.queryData.pageSize = num
      this.getListData()
    },
    // 当前page
    handleCurrentChange(num) {
      this.pagination.pageNum = this.queryData.pageNum = num
      this.getListData()
    },
    // 查询
    getListData() {
      this.listLoading = true
      this.searchLoading = true
      this.queryData.pageNum = this.pagination.pageNum
      this.queryData.pageSize = this.pagination.pageSize
      queryList(this.queryData).then(response => {
        debugger
        console.log(response)
        this.queryResult = response.data.pag.map(item => {
          item.getKeyLoading = false
          return item
        })
        this.pagination.total = parseInt(response.data.total)
        this.listLoading = false
        this.searchLoading = false
      }).catch((response) => {
        console.error(response)
        this.listLoading = false
        this.searchLoading = false
        this.$message.error('操作失败')
      })
    },
    // 查询
    getKeyListData(_row) {
      this.listKeyLoading = true
      _row.getKeyLoading = true
      this.queryKeyData.pageNum = this.pagination.pageKeyNum
      this.queryKeyData.pageSize = this.pagination.pageKeySize
      this.queryKeyData.fDicType = _row.fDicType
      this.fDicKeyname = _row.fDicType
      this.fDicKeyRow = _row
      this.$http.post(this.API.getKeyDicPage, this.queryKeyData).then(response => {
        this.queryKeyResult = response.data.data.pag
        this.pagination.Keytotal = parseInt(response.data.data.total)
        this.listKeyLoading = false
        _row.getKeyLoading = false
      }).catch((response) => {
        this.listKeyLoading = false
        _row.getKeyLoading = false
        this.$message.error('操作失败')
      })
    },
    // 当前page
    KyeleCurrentChange(num) {
      this.pagination.pageKeyNum = this.queryData.pageKeyNum = num
      this.getKeyListData(this.fDicKeyRow)
    },
    // pageSize
    KyeleSizeChange(num) {
      this.pagination.pageKeySize = this.queryData.pageKeySize = num
      this.getKeyListData(this.fDicKeyRow)
    },
    // 显示新增代码界面
    handleAddEdit() {
      this.currentFormDataIndex = -1
      this.formData = {
        fId: '',
        fDicType: '',
        fDicTypeName: '',
        fDicKey: '',
        fDicValue: '',
        fDicRemark: '',
        fDicIndex: '',
        fValidaStatus: '1'
      }
      this.addEditFormVisible = true
      this.$refs.formData.resetFields()
    },
    // 显示新增码值编辑界面
    KeyAddEdit($index = 'empty') {
      const _index = $index === 'empty' ? 0 : $index
      const _data = this.queryKeyResult[_index]
      this.currentFormDataIndex = _index
      this.formKeyData = _data
      this.addKeyEditFormVisible = true
    },
    // 新增代码提交
    addEditSubmit() {
      this.$refs.formData.validate((valid) => {
        if (!valid) return
        this.addEditSubmitLoading = true
        // NProgress.start()
        const _url = this.currentFormDataIndex > -1 ? this.API.updateTVipDicPage : this.API.insertTVipDicPage
        const _data = this.formData
        const para = {
          fId: _data.fId,
          fDicType: _data.fDicType,
          fDicTypeName: _data.fDicTypeName,
          fDicKey: _data.fDicKey,
          fDicValue: _data.fDicValue,
          fDicIndex: _data.fDicIndex,
          fDicRemark: _data.fDicRemark,
          fValidaStatus: _data.fValidaStatus
        }
        this.$http.post(_url, para).then((response) => {
          const result = response.data.data
          if (result > 0) {
            this.$refs['formData'].clearValidate()
            this.addEditSubmitLoading = false
            this.addEditFormOnClose()
            this.$message({ message: '操作成功', type: 'success', duration: 1500 })
            if (this.currentFormDataIndex > -1) {
              Object.assign(this.queryResult[this.currentFormDataIndex], this.formData)
            } else {
              this.getListData()
              this.getKeyListData(_data)
            }
          } else {
            this.addEditSubmitLoading = false
            this.$message.error('操作失败')
          }
        }).catch((response) => {
          this.addEditSubmitLoading = false
          console.error(response)
          this.$message.error('操作失败')
        })
      })
    },
    // 新增码值提交
    addKeyEditSubmit() {
      this.$refs.formKeyData.validate((valid) => {
        if (!valid) return
        this.addKeyEditSubmitLoading = true
        // NProgress.start()
        const _url = this.API.updateKeyDicPage
        const _data = this.formKeyData
        const para = {
          fId: _data.fId,
          fDicKey: _data.fDicKey,
          fDicValue: _data.fDicValue,
          fDicRemark: _data.fDicRemark,
          fDicIndex: _data.fDicIndex
        }
        this.$http.post(_url, para).then((response) => {
          const result = response.data.data
          if (result > 0) {
            this.addKeyEditSubmitLoading = false
            this.addKeyEditFormOnClose()
            this.$message({ message: '操作成功', type: 'success', duration: 1500 })
            this.getKeyListData(_data)
          } else {
            this.addKeyEditSubmitLoading = false
            this.$message.error('操作失败')
          }
        }).catch((response) => {
          this.addKeyEditSubmitLoading = false
          console.error(response)
          this.$message.error('操作失败')
        })
      })
    },
    // 刪除码值
    delDic(data) {
      this.$confirm('确认刪除吗？', '提示', {}).then(() => {
        // NProgress.start()
        const _url = this.API.deleteTVipDicPage
        this.$http.post(_url, { fId: data.fId }).then((response) => {
          const result = response.data.data
          if (result > 0) {
            this.$message({ message: '操作成功', type: 'success', duration: 1500 })
            this.getListData()
            this.getKeyListData(data)
          } else {
            this.$message.error('操作失败')
          }
        }).catch((response) => {
          this.$message.error('操作失败')
        })
      })
    },
    // 禁用启用设置
    setfValidaStatus(data, btnStatus) {
      this.updateStatusData.fId = data.fId
      this.updateStatusData.fValidaStatus = btnStatus
      // NProgress.start()
      const _url = this.API.updateDicStatusPage
      const mess = this.updateStatusData.fValidaStatus === 0 ? '确认禁用吗？' : '确认启用吗？'
      this.$confirm(mess, '提示', {}).then(() => {
        this.$http.post(_url, this.updateStatusData).then((response) => {
          const result = response.data.data
          if (result > 0) {
            this.$message({ message: '操作成功', type: 'success', duration: 1500 })
            this.getKeyListData(data)
          } else {
            this.$message.error('操作失败')
          }
        }).catch((response) => {
          this.$message.error('操作失败')
        })
      })
    },
    // 关闭新增编辑弹窗
    addEditFormOnClose() {
      this.addEditFormVisible = false
    },
    // 关闭新增编辑弹窗
    addKeyEditFormOnClose() {
      this.addKeyEditFormVisible = false
    },
    init() {
      this.API = this.formatAPI()
      this.getListData()
    }
  }
}

</script>

<style scoped lang="scss">
  .align-center {
    text-align: center;
  }
  .align-right {
    text-align: right;
  }
  textarea {
    font-family: Arial;
  }
  .fdictext {
    font-size: 16px;
    text-align: center;
  }
</style>
