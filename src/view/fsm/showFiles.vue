<template>
  <div>
    <el-button class="btn-show" @click="preview" type="primary">预览pdf</el-button>
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

    <!--<iframe :src="pdfAddress" width="100%" height="99%"></iframe>-->

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
        arrList: [],
        pdfAddress:""
      }
    },
    mounted() {
      this.show("")
    },
    methods: {
      preview() {
        var arrList = this.arrList;
        if (arrList.length>1){
          this.$alert("只能预览一个文件", {
            confirmButtonText: '确定',
          });
          return;
        }
        var arrListElement = arrList[0];
        if (arrListElement.fileType == 0){
          this.$alert("不能预览文件夹", {
            confirmButtonText: '确定',
          });
          return;
        }
        // 后台返回流的形式
        // var url = 'http://192.168.75.134:8081/show/pdfPreview?fullfilename='+arrListElement.fileName; //要预览文件的访问地址
        // window.open('http://192.168.75.134:8012/onlinePreview?url='+encodeURIComponent(url));

        // var url = 'http://localhost:8081/show/pdfPreview?fullfilename='+arrListElement.fileName; //要预览文件的访问地址
        // window.open('http://localhost:8012/onlinePreview?url='+encodeURIComponent(url));

        var originUrl = 'http://192.168.75.134:8081/show/pdfPreview?fileId='+arrListElement.fileId; //要预览文件的访问地址
        var previewUrl = originUrl + '&fullfilename='+arrListElement.fileName;
        window.open('http://192.168.75.134:8012/onlinePreview?url='+encodeURIComponent(previewUrl));
      },
      //页面渲染
      show(data) {
        this.axios({
          method: "get",
          params: {"fileId": data},
          url: "http://192.168.75.134:8081/show/getFileList"
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
      },
    }
  }
</script>

<style scoped>
</style>
