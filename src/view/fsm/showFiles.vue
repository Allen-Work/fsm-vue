<template>
  <div>
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
          <router-link :to="{path: '/file/list', query: {fileId: scope.row.fileId,fileName: scope.row.fileName}}">{{ scope.row.fileName}}
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
        isShow:false,
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
      //页面渲染
      show(data) {
        this.axios({
          method: "get",
          params: {"fileId": data},
          url: "http://localhost:8081/show/getFileList"
        }).then(response => {
          var result = response.data.data;
          if (result != null){
            this.tableData = result;
          }else {
            this.$alert('即将预览文件' + response.data.msg, {
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
        debugger
        var param = this.$route.query.fileId;
        this.show(param);
        //将mounted中的数据在这里重新加载一下即可
      }
    }
  }
</script>

<style scoped>
</style>
