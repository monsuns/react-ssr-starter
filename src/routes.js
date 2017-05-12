import React from "react";

import Application from "./containers/Application";
import NotFound from "./containers/NotFound";
import Index from "./containers/Home";

import Tools from "./containers/Tools";

//breadcrumbName: 导航条及侧边栏显示名; fullPage:全屏显示; sideIcon:侧边栏是否显示; noAuth:无需登录
const routeConfig =
  {path: '/', breadcrumbName:'主页', component: Application, indexRoute: { component: Index }, childRoutes:[
    //{path: 'user', breadcrumbName:'用户', childRoutes: [
    //  {path: 'login', breadcrumbName: '登录', fullPage: true, component: Login},
    //]},
    {path: 'tools', breadcrumbName: "工具箱", component: Tools}, //组件测试

    {path: '*', component: NotFound}
]};

export default routeConfig;
