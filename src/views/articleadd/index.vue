<template>
  <div>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>发布文章</span>
      </div>
      <div class="text item">
        <!-- 填充form表单域  :rules="addFormRules"表单校验 与prop相配合-->
        <el-form ref="addFormRef" :model="addForm" label-width="120px" :rules="addFormRules">
          <el-form-item label="标题：" prop="title">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>
          <el-form-item label="内容：" prop="content">
            <!-- 使用富文本编辑器 会编译成许多html标签，，但是内部的属性没有data-v的属性， -->
            <quill-editor v-model="addForm.content"></quill-editor>
          </el-form-item>
          <el-form-item label="封面：">
            <!-- 单选按钮的父标签，可以统一设置v-model和change事件 -->
            <el-radio-group v-model="addForm.cover.type">
              <el-radio :label="1">单图</el-radio>
              <el-radio :label="3">三图</el-radio>
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="-1">自动</el-radio>
            </el-radio-group>
            <ul>
            <li class="uploadbox" v-for="item in covernum" :key="item"
    @click="showDialog(item)">
                <span>点击图标选择图片</span>
                <img v-if="addForm.cover.images[item-1]" :src="addForm.cover.images[item-1]" alt />
                <div v-else class="el-icon-picture-outline"></div>
              </li>
            </ul>
          </el-form-item>
          <el-form-item label="频道：" prop="channel_id">
            <!-- <el-select v-model="addForm.channel_id" placeholder="请选择" clearable>
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>-->
            <!-- 给clannel子组件声明一个事件 -->
            <channel @slt="selectHandler"></channel>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addarticle(false)">发布</el-button>
            <el-button @click="addarticle(true)">存入草稿</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
 <el-dialog title="素材图片" :visible.sync="dialogVisible" width="60%"
           @close="clearImage">
      <!--后添加的用于展示素材图片的标签-->
      <!-- <el-tabs>标签切换效果 -->
        <!-- 高亮显示给img添加点击事件.获取当前的元素,给选中的样式添加样式 .清除其他选中效果-->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">
          <ul>
            <li class="image-box" v-for="item in imageList" :key="item.id">
              <img :src="item.url" alt="没有图片" @click="clkImage"/>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <el-button>上传</el-button>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="imageOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import Channel from '@/components/channel'
export default {
  name: 'ArticleAdd',
  computed: {
    // 设计当前图片"选择框"个数
    covernum () {
      if (this.addForm.cover.type > 0) {
        return this.addForm.cover.type
      }
      return 0
    }
  },
  data () {
    return {
      materialUrl: '', // 选中的素材图片的路径名地址信息
      xu: 0,
      // 表单校验
      // 表单校验规则
      imageList: [], // 素材图片列表
      // 获取素材图片的条件参数
      querycdt: {
        collect: false, // 非收藏图片
        page: 1,
        per_page: 12
      },
      activeName: '', // 默认激活小标签
      addFormRules: {
        title: [
          { required: true, message: '标题必填' },
          // 后端要求title长度介于5-30个字符
          {
            min: 5,
            max: 30,
            message: '标题长度介于5-30个字符'
          }
        ],
        content: [{ required: true, message: '内容必填' }],
        channel_id: [{ required: true, message: '频道必选' }]
      },
      channelList: [], // 接收频道列表数据
      dialogVisible: false, // 素材对话框是否启用
      // 添加文章数据对象
      addForm: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: [] // 封面路径的集合
        },
        channel_id: '' // 频道
      }
    }
  },

  // 注册组件
  components: {
    // 简易成员赋值 quillEditor: quillEditor
    // 组件使用两种方式：<quillEditor></quillEditor> 或 <quill-editor></quill-editor>
    quillEditor,
    Channel
  },
  created () {
    this.getImageList() // 获得供选取的素材图片
  },
  methods: {
    // 恢复出厂设置
    clearImage () {
      // 清除border选中高亮效果
      let lis = document.querySelectorAll('.image-box')
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.border = ''
      }
      // 清除选中图片materialUrl地址
      this.materialUrl = ''
    },
    // 素材图片选取好，点击“对话框”确定按钮后，记录素材图片
    imageOK () {
      if (this.materialUrl) {
 		    // 给添加文章的表单域成员cover.image增加素材图片请求地址信息
        this.addForm.cover.images[this.xu] = this.materialUrl
        this.dialogVisible = false // 关闭对话框
      } else {
        this.$message.error('咋地，一个都没有相中！')
      }
    },
    // 素材图片被选中，设置高亮标志
    // 素材图片选取操作
    // 素材图片选取操作
    clkImage (evt) {
      // 清除之前选择图片的状态信息
      this.clearImage()
      evt.target.parentNode.style.border = '3px solid red'
      // 把当前选中图片的src地址信息赋予给meterialUrl成员
      this.materialUrl = evt.target.src
    },
    // 获取素材图片列表
    getImageList () {
      let pro = this.$http.get('/mp/v1_0/user/images', {
        params: this.querycdt
      })
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.imageList = result.data.data.results
          }
        })
        .catch(err => {
          return this.$message.error('获得素材图片列表错误:' + err)
        })
    },
    // 展示对话框逻辑
    // 展示对话框逻辑
    // n：代表第n个选择框被单击到了(值为1/2/3)
    showDialog (n) {
      // 更新xu成员,0/1/2分别代表选择框序号
      this.xu = n - 1
      this.dialogVisible = true // 开启对话框
    },
    // 声明方法,用来接收clannel子组件传递过来的id值
    // 子组件向父组件传值
    selectHandler (id) {
      this.addForm.channel_id = id
    },
    // 添加文章-收集数据存储
    // flag:true  发布一个草稿文章
    // flag:false 发布一个正式文章
    addarticle (flag) {
      // 表单校验
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          // 把被添加的文章信息通过axios传递给服务器端存储
          // axios发起post请求的时候，不仅可以传递post数据还可以传递get请求字符串信息
          // this.$http.post(地址,post数据,get请求字符串信息)
          var pro = this.$http.post('/mp/v1_0/articles', this.addForm, {
            params: { draft: flag }
          })
          pro
            .then(result => {
              this.$message.success('文章发布成功')
              this.$router.push({ name: 'article' })
            })
            .catch(err => {
              return this.$message.error('发布文章失败' + err)
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
/*给富文本编辑器设置内容区域高度*/
/* .ql-editor{   .ql-editor[data-v-xxx]不对了*/
/*deep：深度作用选择器，使得编译后的效果为：.el-form[data-v-xx] .ql-editor{}*/
.el-form /deep/ .ql-editor {
  height: 200px;
}
// 文章封面选择框样式
.uploadbox {
  list-style: none;
  width: 200px;
  height: 200px;
  margin: 10px;
  float: left;
  cursor: pointer;
  border: 1px solid #eee;
  span {
    width: 200px;
    height: 50px;
    line-height: 50px;
    display: block;
    text-align: center;
  }
  div {
    width: 200px;
    height: 150px;
    font-size: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  img {
    width: 200px;
    height: 150px;
  }
}
// 对话框素材图片列表相关css样式
.image-box {
  list-style: none;
  width: 200px;
  height: 140px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  cursor: pointer;
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
