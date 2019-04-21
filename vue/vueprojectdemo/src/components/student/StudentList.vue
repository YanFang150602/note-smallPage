<template>
  <div>
    <table>
      <thead>
        <th>
          <td>
          {{ $t('L["table.id"]' )}}
          </td>
          <td>
          {{$t('L.table.name')}}
          </td>
          <td>
          {{$t('L.table.age')}}
          </td>
          <td>
          {{$t('L.table.grade')}}
          </td>
          <td>
          {{$t('L.table.address')}}
          </td>
          <td>
          {{$t('L.table.tephone')}}
          </td>
        </th>
      </thead>
      <tbody>
        <tr v-for="student in studentList">
          <td v-html="student.id"></td>
          <td v-html="student.name"></td>
          <td v-html="student.age"></td>
          <td v-html="student.grade"></td>
          <td v-html="student.address"></td>
          <td v-html="student.telphone"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: "StudentList",
    data(){
      return {
        studentList: [
          {
            id: '1903101618',
            name: 'Huang Xiaoming',
            age: 20,
            grade: 'Three Grade',
            address: 'NanJing',
            telphone: '13914774571'
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>