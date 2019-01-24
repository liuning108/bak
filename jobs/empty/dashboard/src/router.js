import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import store from './store'
Vue.use(Router)
const router =new Router({
  routes: [{
      path: '/about',
      name: 'about',
      component: () => import( /* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/login', 
      name: 'login',
      component: Login
    },
    {
      path: "/main",
      name: "main",
      component: () => import('./views/Main.vue'),
      meta: {
        requiresAuth: true
      },
      children:[
          {
            path: "dashboard",
            name: "dashboard",
            component: () => import('./views/Dashboard.vue'),
            children:[
              {
                 path:':id',
                 component: () => import('./views/DashCharts.vue'),
              }
            ]
          },
          {
            path: "card/:bid/:cid",
            name: "cardEdit",
            component: () => import('./views/CardEdit.vue')
          },
          {
             path: "data-center",
             name: "data-center",
             component: () => import('./views/DataCenter.vue'),
          }
      ]
    },
    
    {
      path: '/',
      redirect: '/login'
    }
  ]
})
router.beforeEach((to, from, next)=>{
  if (to.matched.some(record => record.meta.requiresAuth)) {
        store.dispatch('user/getCurUser').then(flag=>{
            if(!flag){
               next('/login')
            }else{
              next()
            }
        });
  }else{
    next();
  }
  
})

export default router