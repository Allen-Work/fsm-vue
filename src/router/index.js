import Vue from "vue"
import Router from "vue-router"

import Main from "@/view/Main"
import Login from "@/view/Login"
import UserAdd from "../view/user/UserAdd";
import UserList from "../view/user/UserList";
import Notfount from "@/view/404";
import ShowFiles from "@/view/fsm/showFiles";


Vue.use(Router);

export default new Router({
  routes: [
    {
      name: "Login",
      path: "/login",
      component: Login
    },
    {
      name: "Main",
      path: "/main",
      component: Main,
      children: [
        {name: "UserAdd", path: "/user/add/:id", component: UserAdd},
        {name: "UserList", path: "/user/list/:no", component: UserList, props: true},
        {name: "ShowFiles", path: "/file/list", component: ShowFiles, props: true}
      ]
    },
    {
      path: "/",
      redirect: "/main"
    },
    {
      path: "*",
      component: Notfount
    }
  ]
})
