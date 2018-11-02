<template>
  <div class="app-container">
    <section>
      <!--工具条-->
      <!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px"> -->
      <el-form :inline="true" :model="queryData">
        <!-- 模糊查询 -->
        <el-form-item>
          <el-input
            v-model="queryData.jUserName"
            placeholder="请输入用户姓名"
            clearable
            @keyup.enter.native="getListData"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryData.jValidaStatus" placeholder="请选择" clearable>
            <el-option
              v-for="item in jValidaStatu"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <!--查询按钮-->
        <el-form-item>
          <el-button :loading="listLoading" type="primary" icon="el-icon-search" @click="getListData()">查询</el-button>
        </el-form-item>
        <!-- 新建按钮-->
        <el-form-item>
          <el-button type="primary" @click="handleAddEdit()">新建用户</el-button>
        </el-form-item>
      </el-form>
      <!-- </el-col> -->

      <!--列表-->
      <el-table v-loading="listLoading" :data="queryResult" border highlight-current-row style="width: 100%">
        <el-table-column prop="jUserName" label="姓名" />
        <el-table-column prop="jUserMobile" label="电话" />
        <el-table-column prop="jUserGenderCn" label="性别" >
          <template slot-scope="scope">
            <el-tag :color="scope.row.jUserGenderCn | genderFilter"  size="medium">{{ scope.row.jUserGenderCn }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="jUserAccount" label="账号" />
        <!--<el-table-column :formatter="transcode2" prop="jRolePower" label="角色分配" />-->
        <el-table-column prop="jValidaStatusCn" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.jValidaStatusCn | statusFilter">{{ scope.row.jValidaStatusCn }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="360">
          <template slot-scope="scope">
            <!--<el-button v-if="queryResult[scope.$index].fValidStatus == 0" size="small" @click="fValidStatus(scope.$index)">启用</el-button>-->
            <el-button v-if="scope.row.jValidaStatus == 0" size="small" @click="handleDelete(scope.$index, scope.row)" >启用</el-button>
            <el-button v-else size="small" @click="handleDelete(scope.$index, scope.row)" >禁用</el-button>
            <el-button :loading="scope.row.treeDialogLoading" size="small" @click="handleAddEdit(scope.$index, scope.row)" >编辑</el-button>
            <!--<el-button :loading="scope.row.roleLoading" size="small" @click="roleSet(scope.$index, scope.row)">分配角色</el-button>-->
            <el-button size="small" @click="handleReset(scope.$index, scope.row)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-col :span="24" class="toolbar">
        <el-pagination :current-page="pagination.pageNum" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
      </el-col>

      <!--新增界面-->
      <el-dialog :title="addEditTitle" :visible.sync="addEditFormVisible" :close-on-click-modal="true" :before-close="addEditFormOnClose" width="52%">
        <el-form ref="formData" :inline="true" :label-position="leftForm" :model="formData" :rules="rules" label-width="90px" >
          <el-form-item label="姓名" prop="jUserName">
            <el-input v-model="formData.jUserName" class="fix_width" auto-complete="off" maxlength="100" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="电话" prop="jUserMobile">
            <el-input v-model="formData.jUserMobile" class="fix_width" auto-complete="off" maxlength="20" placeholder="请输入电话号码" />
          </el-form-item>
          <el-form-item label="账号" prop="jUserAccount">
            <el-input v-model="formData.jUserAccount" class="fix_width" auto-complete="off" maxlength="100" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item v-if="currentFormDataIndex == -1" label="密码" prop="fUserPwd">
            <el-input v-model="formData.jUserPwd" class="fix_width" auto-complete="off" placeholder="请输入密码" maxlength="200" />
          </el-form-item>
          <span v-else/>
          <el-form-item label="性别" prop="jUserGender">
            <el-select v-model="formData.jUserGender" class="fix_width" placeholder="请选择" >
              <el-option
                v-for="item in jUserGender"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="fValidaStatus">
            <el-select v-model="formData.jValidaStatus" class="fix_width" placeholder="请选择" >
              <el-option
                v-for="item in jValidaStatu"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="微信" prop="fUserWechat" >
            <el-input v-model="formData.jUserWechat" class="fix_width" auto-complete="off" maxlength="100" placeholder="请输入微信号码" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addEditFormOnClose">取消</el-button>
          <el-button :loading="addEditSubmitLoading" type="primary" @click.native="addEditSubmit">提交</el-button>
        </div>
      </el-dialog>

      <!-- 重置密码 -->
      <el-dialog :visible.sync="resetPwd" :close-on-click-modal="true" :before-close="handleCloseReset" title="重置密码" width="30%">
        <el-form ref="formData" :model="formData" :rules="rules" label-width="80px" style="margin-top:20px;width: 87%">
          <el-form-item label="新密码" prop="jUserPwd">
            <el-input v-model="formData.jUserPwd" placeholder="请输入密码" auto-complete="off"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="handleCloseReset">取消</el-button>
          <el-button :loading="addEditSubmitLoading" type="primary" @click.native="resetPass">提交</el-button>
        </div>
      </el-dialog>
      <!-- 角色分配Dialog
      <el-dialog :visible.sync="dialogFormVisible" :before-close="handleCloseRole" title="角色分配" style="text-align: center;">
        <el-transfer :titles="['角色列表', '当前角色']" v-model="fRoleId" :data="data" style="text-align: left; display: inline-block"/>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="handleCloseRole">取 消</el-button>
          <el-button type="primary" @click.native="resetUserRoles">提 交</el-button>
        </div>
      </el-dialog>-->
    </section>
  </div>
</template>

<script>
  import { getUserPages, setUser,updateUser } from '@/api/JSysUser'
  export default {
    filters: {
      statusFilter(status) {
        const statusMap = {
          '有效': 'success',
          draft: 'info',
          '无效': 'danger'
        }
        return statusMap[status]
      },
      genderFilter(gender){
        const genderMap = {
          '男': '#87CEFF',
          draft: 'info',
          '女': '#FFE1FF'
        }
        return genderMap[gender]
      }
    },
    data() {
      var cheakMobile = (rule, value, callback) => {
        if (value && (!(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/).test(value))) {
          callback(new Error('请输入正确电话号码'))
        } else if (!value) {
          callback(new Error('请输入正确电话号码'))
        } else {
          callback()
        }
      }
      var cheakAccount = (rule, value, callback) => {
        if (value && (!(/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/).test(value))) {
          callback(new Error('必须以字母开头，并且只允许输入5-16位字母、数字、下划线。'))
        } else if (!value) {
          callback(new Error('必须以字母开头，并且只允许输入5-16位字母、数字、下划线。'))
        } else {
          callback()
        }
      }
      var cheakPws = (rule, value, callback) => {
        if (value && (!(/^[a-zA-Z]\w{5,17}$/).test(value))) {
          callback(new Error('以字母开头的6-18位字母数字下划线。'))
        } else if (!value) {
          callback(new Error('以字母开头的6-18位字母数字下划线。'))
        } else {
          callback()
        }
      }
      return {
        data: [],
        jRoleId: [],
        jUserName: '',
        jUserId: Number,
        leftForm: 'right',
        rules: {
          jUserName: [
            { required: true, message: '姓名不能为空' }
          ],
          jUserGender: [
            { required: true, message: '性别不能为空' }
          ],
          jValidaStatus: [
            { required: true, message: '状态不能为空' }
          ],
          jUserAccount: [
            { validator: cheakAccount, required: true, trigger: 'blur' }
          ],
          jUserPwd: [
            { validator: cheakPws, required: true, trigger: 'blur' }
          ],
          jUserMobile: [
            { validator: cheakMobile, required: true, trigger: 'blur' }
          ]
        },
        jUserGender: [{
          value: '',
          label: '请选择'
        }, {
          value: '1',
          label: '男'
        }, {
          value: '0',
          label: '女'
        }],
        jValidaStatu: [{
          value: '',
          label: '请选择'
        }, {
          value: '0',
          label: '禁用'
        }, {
          value: '1',
          label: '启用'
        }],
        // API: {
        //   prefix: `/TNlmSysUserController`,
        //   getTNlmSysUerPage: `/getTNlmSysUserPage`, // get分页列表
        //   insertTNlmSysUser: `/insertTNlmSysUser`, // 新增资源
        //   updateTNlmSysUser: `/updateTNlmSysUser`, // 编辑
        //   deleteTNlmSysUser: `/updateTNlmSysUserStatus`, // 有效性状态改变
        //   getUserRole: `/getUserRole`, // 获取用户当前角色
        //   getAllRoles: `/getAllRoles`, // 获取用户当前角色
        //   updateUserRole: `/updateUserRoles`, // 更新用户角色
        //   cancelRoleStatus: `/cancelRoleStatus` // 暂时关闭用户下所有角色
        // },
        addEditFormLoading: false, //
        listLoading: false, // 查询载入tableData
        addEditSubmitLoading: false, // 按钮点击后
        addEditFormVisible: false, // 新增界面是否显示
        resetPwd: false, // 重置密码界面是否显示
        dialogFormVisible: false, // 角色分配界面是否显示
        currentFormDataIndex: -1, // 新增：-1，编辑：>-1
        // fIsBuyState: false, // 新增，修改Boolean
        formData: {}, // 提交
        pagination: { // 分页
          pageNum: 1,
          pageSizes: [10, 20, 30, 50],
          pageSize: 10,
          total: 1
        },
        queryData: { // 查询
          pageNum: Number,
          pageSize: Number,
          jUserName: '',
          jUserPwd: '',
          jValidaStatu: ''
        },
        queryResult: [
          // { // 查询返回结果
          // resCode: '001',
          // validStat: '启用',
          // resCateg: '系统资源',
          // fResName: '定义系统资源',
          // fResBuy: '否',
          // price: '1.0'
          // }
        ]
      }
    },
    computed: {
      addEditTitle() {
        return this.currentFormDataIndex > -1 ? '编辑' : '新增'
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      // getAllRole () {
      //   const allRoles = []
      //   this.$http.post(this.API.getAllRoles).then((response) => {
      //     let result = response.data.data
      //     for (let i = 0; i < result.length; i++) {
      //       if (result[i].fValidaStatus === 0) {
      //         allRoles.push({key: result[i].fId, label: result[i].fUserName, disabled: true})
      //       } else {
      //         allRoles.push({key: result[i].fId, label: result[i].fUserName, disabled: false})
      //       }
      //     }
      //     console.log(allRoles)
      //   }).catch((response) => {
      //     console.error(response)
      //     this.$message.error('查询失败，请检查网络')
      //   })
      //   return allRoles
      // },
      transcode2(_row2) {
        // switch (_row2.fRolePower) {
        //   case 0:
        //     return '未分配'
        //   default:
        //     return '已分配'
        // }
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
      getListData(data) {
        this.listLoading = true
        this.queryData.pageNum = this.pagination.pageNum
        this.queryData.pageSize = this.pagination.pageSize
        getUserPages(this.queryData).then(response => {
          this.queryResult = response.data.pag.map(item => {
            debugger
            item.jUserGenderCn = String(item.jUserGenderCn)
            item.jValidaStatusCn = String(item.jValidaStatusCn)
            item.treeDialogLoading = false // 编辑loading定义
            item.roleLoading = false // 角色分配loding定义
            return item
          })
          this.pagination.total = parseInt(response.data.total)
          this.listLoading = false
        }).catch((response) => {
          console.error(response)
          this.listLoading = false
          this.$message.error('操作失败')
        })
      },
      //  禁用
      handleDelete(_index, _val) {
        console.log('--------' + _val.jId)
        if (_val.jValidaStatus > 0) {
          this.$confirm('确认禁用吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.updateVipValidStatus(_val.jId, _val.jValidaStatus, _index)
          }).catch(() => {
            // return
          })
        } else {
          this.$confirm('确认启用吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: ''
          }).then(() => {
            this.updateVipValidStatus(_val.jId, _val.jValidaStatus, _index)
          }).catch(() => {
            // return
          })
        }
      },
      //  列表启用/禁用 处理请求结果
      updateVipValidStatus(jId, val, _index) {
        const _val = Number(val) === 1 ? 0 : 1
        const _message = Number(val) === 1 ? '已禁用' : '已启用'
        debugger
        updateUser( { jId: jId, jValidaStatus: _val }).then(response => {
          this.$message.info(_message)
          this.getListData()
        }).catch((response) => {
          console.error(response)
          this.$message.error('操作失败')
        })
      },
      // 显示新增编辑界面
      handleAddEdit($index = 'empty', _val) {
        const _index = $index === 'empty' ? 0 : $index
        if ($index === 'empty') {
          this.currentFormDataIndex = -1
          this.formData = {
            jId: '',
            jUserName: '',
            jUserMobile: '',
            jUserWechat: '',
            jUserGender: '',
            jUserAccount: '',
            jUserPwd: '',
            jValidaStatus: ''
          }
          this.addEditFormVisible = true
          // _data.treeDialogLoading =false
        } else {
          _val.treeDialogLoading = true
          this.currentFormDataIndex = _index
          this.formData = { ..._val }
          this.addEditFormVisible = true
          _val.treeDialogLoading = false
        }
        // _val.fUserPwd = this.fUserPwd
      },
      // 显示reset页面
      handleReset($index = 'empty', _val) {
        const _index = $index === 'empty' ? 0 : $index
        const _data = this.queryResult[_index]
        _data.jUserPwd = this.jUserPwd
        if ($index === 'empty') {
          this.formData = {
            jId: '',
            jUserPwd: '',
            jUserName: ''
          }
        } else {
          this.formData = _data
        }
        this.resetPwd = true
      },
      // 重置密码
      resetPass() {
        this.$refs.formData.validate((valid) => {
          if (!valid) return
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addEditSubmitLoading = true
            // NProgress.start()
            const _data = this.formData
            const param = {
              jId: _data.jId,
              jUserPwd: _data.jUserPwd
            }
            this.$http.post(this.API.updateTNlmSysUser, param).then((response) => {
              const result = response.data.data
              if (result > 0) {
                this.addEditSubmitLoading = false
                this.handleCloseReset()
                this.$message({ message: '操作成功', type: 'success', duration: 1500 })
                this.getListData()
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
        })
      },
      // 角色分配页面
      roleSet(_index, _val) {
        _val.roleLoading = true
        this.jUserId = _val.jId
        this.$http.post(this.API.getUserRole, { jUserId: _val.jId }).then((response) => {
          _val.roleLoading = false
          const result = response.data.data
          for (let i = 0; i < result.length; i++) {
            if (result[i].jValidaStatus === 1) {
              this.$set(this.jRoleId, i, result[i].jRoleId)
            }
          }
          this.dialogFormVisible = true
        }).catch((response) => {
          console.error(response)
          this.$message.error('查询失败，请检查网络')
        })
      },
      // 分配角色权限
      resetUserRoles() {
        let _data
        debugger
        if (this.jRoleId !== null) {
          _data = this.jRoleId
        }
        let closeRoleStatu = 0
        this.$confirm('确认提交吗？', '提示', {}).then(() => {
          this.$http.post(this.API.cancelRoleStatus, { jUserId: this.jUserId }).then((response) => {
            closeRoleStatu = response.data.data
            console.log('closeRoleStatus' + closeRoleStatu)
          }).catch((response) => {
            this.dialogFormVisible = false
            console.error(response)
            this.$message.error('分配失败，请检查网络')
          })
          if (_data.length !== 0 && closeRoleStatu === 0) {
            for (let i = 0; i < _data.length; i++) {
              console.log('此时_data的长度为' + _data.length)
              console.log('此时_data为' + _data)
              this.$http.post(this.API.updateUserRole, { jRoleId: _data[i], jUserId: this.jUserId }).then((response) => {
                // let result = response.data.data
                if (i === _data.length - 1) {
                  this.handleCloseRole()
                  this.$message({ message: '操作成功', type: 'success', duration: 1500 })
                }
              }).catch((response) => {
                console.error(response)
              })
            }
          } else if (closeRoleStatu === 0 && _data.length === 0) {
            this.handleCloseRole()
            this.$message({ message: '操作成功', type: 'success', duration: 1500 })
          } else {
            this.$message({ message: '操作失败', type: 'error', duration: 1500 })
          }
        })
      },
      // 新增
      addEditSubmit() {
        this.$refs.formData.validate((valid) => {
          if (!valid) return
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addEditSubmitLoading = true
            // NProgress.start()
            const _url = this.currentFormDataIndex > -1 ? this.API.updateTNlmSysUser : this.API.insertTNlmSysUser
            const _data = this.formData
            const param = {
              jId: _data.jId,
              jUserName: _data.jUserName,
              jUserMobile: _data.jUserMobile,
              jUserWechat: _data.jUserWechat,
              jUserGender: _data.jUserGender,
              jUserAccount: _data.jUserAccount,
              jUserPwd: _data.jUserPwd,
              jValidaStatus: _data.jValidaStatus
            }
            setUser(param).then((response) => {
              const result = response.data
              if (result > 0) {
                this.addEditSubmitLoading = false
                this.addEditFormOnClose()
                this.$message({ message: '操作成功', type: 'success', duration: 1500 })
                if (this.currentFormDataIndex > -1) {
                  Object.assign(this.queryResult[this.currentFormDataIndex], this.formData)
                } else {
                  this.getListData()
                }
              } else {
                this.addEditSubmitLoading = false
                this.$message.error('操作失败')
              }
            }).catch((response) => {
              this.addEditSubmitLoading = false
              this.$message.error('操作失败')
            })
          })
        })
      },
      // 关闭新增编辑弹窗
      addEditFormOnClose() {
        this.$refs.formData.resetFields()
        this.addEditFormVisible = false
        this.getListData()
      },
      // 关闭重置密码弹窗
      handleCloseReset() {
        this.$refs.formData.resetFields()
        this.resetPwd = false
        this.getListData()
      },
      handleCloseRole() {
        this.jRoleId = []
        this.jUserId = 0
        this.dialogFormVisible = false
        this.getListData()
      },
      init() {
        // this.API = this.formatAPI()
        // this.data = this.getAllRole()
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
  .fix_width {
    width: 202px;
  }
</style>
