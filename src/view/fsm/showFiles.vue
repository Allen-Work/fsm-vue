<template>
  <div>
    <el-button class="btn-show" @click="checkSuccess" type="primary">预览pdf</el-button>
    <el-button class="btn-show" @click="toggleSelection" type="primary">分享</el-button>
    <el-table
      :data="tableData"
      @row-click="clickRow"
      ref="checkTable"
      @selection-change="handleSelectionChange"
      stripe
      style="width: 100%">
      <el-table-column
        type="selection">
      </el-table-column>

      <el-table-column
        prop="fileId"
        label="文件Id"
        width="180" v-if='isShow'>
      </el-table-column>

      <el-table-column
        prop="fileName"
        label="文件名称"
        width="180">
        <template slot-scope="scope">
          <router-link :to="{path: '/file/list', query: {fileId: scope.row.fileId,fileName: scope.row.fileName}}">{{
            scope.row.fileName}}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="directory"
        label="文件目录"
        width="180">
      </el-table-column>
      <el-table-column
        prop="size"
        label="文件大小">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="修改时间">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注">
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import GeneralUtils from "../../utils/GeneralUtils";

  export default {
    name: "showFiles",
    data() {
      return {
        isShow: false,
        tableData: [{
          checked: "",
          fileName: "",
          directory: "",
          size: "",
          createTime: "",
          updateTime: "",
          remark: ""
        }],
        arrList: []
      }
    },
    mounted() {
      this.show("")
    },
    methods: {
      checkSuccess() {
        // 后台返回流的形式，也是我本人项目的使用
        let url = "http://localhost:8081/show/pdfPreview"
        // let url = 'https://dluat.hscf.com/api/esm/v1/contractTemplates/load/c08def54aa40412b8b511406fc0271d2/0?access_token=ea19dc0de8801b389ed5099a2297161d&name=cehsi.pdf'
        // 当然上面的是可以的，但是此access_token 是有时效性的，只是放在这边当作个例子，至于最后我为什么加了个测试.pdf 是可以在浏览器标签叶上显示
        window.open('/static/pdf/web/viewer.html?file=' + encodeURIComponent(url))
      },
      //页面渲染
      show(data) {
        this.axios({
          method: "get",
          params: {"fileId": data},
          url: "http://localhost:8081/show/getFileList"
        }).then(response => {
          var result = response.data.data;
          if (result != null) {
            this.tableData = result;
          } else {
            this.$alert(response.data.msg, {
              confirmButtonText: '确定',
            });
          }
          console.log(response);
        }).catch(error => {
          console.log(error);
        })
      },
      //点击一行任意位置选中checkbox
      clickRow(row) {
        this.$refs.checkTable.toggleRowSelection(row);
      },
      //分享
      toggleSelection() {
        var arrList = this.arrList;
        var directorys = "";
        for (let i = 0; i < arrList.length; i++) {
          directorys += arrList[i].directory + ",";
        }
        console.log("directorys", directorys)
        this.axios({
          method: "post",
          params: {"path": GeneralUtils.removeTheLastComma(directorys)},
          url: "http://localhost:8081/share/generateLink"
        }).then(response => {
          this.$alert('生成的地址' + response.data.data, {
            confirmButtonText: '确定',
          });
        }).catch(error => {
          console.log(error);
        })
      },
      //获取选中的row
      handleSelectionChange(val) {
        console.log("val", val)
        this.arrList = val
      }
    },
    watch: {
      $route(to, from) {
        var param = this.$route.query.fileId;
        this.show(param);
        //将mounted中的数据在这里重新加载一下即可
      }
    }
  }
</script>

<style scoped>
</style>
