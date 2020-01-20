<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
  <div>
    <el-button class="btn-show" @click="preview" type="primary">预览</el-button>
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

    <!-- 分页 paging -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10,20,30,40]"
      :page-size="pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      background
      :total="total"
    ></el-pagination>
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
        pdfAddress: "",
        total: 0,
        pageSize: 10,
        currentPage: 1,
        fileId:""
      }
    },
    mounted() {
      this.show()
    },
    methods: {
      preview() {
        var arrList = this.arrList;
        if (arrList.length > 1) {
          this.$alert("只能预览一个文件", {
            confirmButtonText: '确定',
          });
          return;
        }
        var arrListElement = arrList[0];
        if (arrListElement.fileType == 0) {
          this.$alert("不能预览文件夹", {
            confirmButtonText: '确定',
          });
          return;
        }
        // 后台返回流的形式
        // var url = 'http://192.168.75.134:8081/show/pdfPreview?fullfilename='+arrListElement.fileName; //要预览文件的访问地址
        // window.open('http://192.168.75.134:8012/onlinePreview?url='+encodeURIComponent(url));

        var originUrl = 'http://localhost:8081/show/pdfPreview?fileId=' + arrListElement.fileId; //要预览文件的访问地址
        var previewUrl = originUrl + '&fullfilename=' + arrListElement.fileName;
        window.open('http://localhost:8012/onlinePreview?url=' + encodeURIComponent(previewUrl));

        // var originUrl = 'http://192.168.75.134:8081/show/pdfPreview?fileId='+arrListElement.fileId; //要预览文件的访问地址
        // var previewUrl = originUrl + '&fullfilename='+arrListElement.fileName;
        // window.open('http://192.168.75.134:8012/onlinePreview?url='+encodeURIComponent(previewUrl));
      },
      //页面渲染
      show() {
        let params = {
          "currentPage": this.currentPage,
          "pageSize": this.pageSize,
          "fileId": this.fileId
        }
        this.axios({
          method: "get",
          params: params,
          url: "http://localhost:8081/show/getFileList"
          // url: "http://192.168.75.134:8081/show/getFileList"
        }).then(response => {
          var result = response.data.data;
          this.total = result.total;
          // this.totalSize = result.total;
          if (result.list) {
            this.tableData = result.list;
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
      handleSizeChange: function (size) {
        this.pageSize = size;
        console.log(this.pageSize);  //每页下拉显示数据
        this.show();
      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage;
        console.log(this.currentPage);  //点击第几页
        this.show();

      },
      //点击一行任意位置选中checkbox
      clickRow(row) {
        this.$refs.checkTable.toggleRowSelection(row);
      },
      //分享
      toggleSelection() {
        var arrList = this.arrList;
        var fileIds = "";
        for (let i = 0; i < arrList.length; i++) {
          fileIds += arrList[i].fileId + ",";
        }
        this.axios({
          method: "post",
          params: {"fileIds": GeneralUtils.removeTheLastComma(fileIds)},
          // url: "http://192.168.75.134:8081/share/generateLink"
          url: "http://localhost:8081/share/generateLink"
        }).then(response => {
          this.$alert('生成的地址:' + response.data.data, {
            confirmButtonText: '确定',
          });
        }).catch(error => {
          console.log(error);
        })
      },
      //获取选中的row
      handleSelectionChange(val) {
        this.arrList = val
      }
    },
    watch: {
      $route(to, from) {
        var param = this.$route.query.fileId;
        this.fileId = param;
        this.show();
        //将mounted中的数据在这里重新加载一下即可
      },
    }
  }
</script>

<style scoped>
</style>
