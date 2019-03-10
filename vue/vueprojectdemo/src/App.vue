<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div style="float:left;width:240px;margin-top:240px;">
      <ul>
        <li>
          <!-- 字符串 -->
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <!-- 字符串 -->
          <router-link to="/student">Student1</router-link>
        </li>
        <li>
          <!-- 使用 v-bind 的 JS 表达式 -->
          <router-link v-bind:to="'student'">Student</router-link>
        </li>
      </ul>
    </div>
    <div>
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted:function(){
    console.log(this);
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: block;
  margin: 0 10px;
  text-align: left;
}
a {
  color: #42b983;
}
</style>
