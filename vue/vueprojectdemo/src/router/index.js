import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import StudentList from '@/components/student/StudentList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/student',
      name: 'Student',
      component: StudentList,
      meta: {
        "keep-alive": true
      }
    }
  ]
})
