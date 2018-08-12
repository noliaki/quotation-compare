<template>
<main>
  <div v-for="categoryName in Object.keys(categorized)" :key="categoryName">
    <h2>{{ categoryName }}</h2>
    <div v-for="item in categorized[categoryName]" :key="item.id">
      {{ item.subject }}
      <input type="number" v-model="item.volume">
    </div>
  </div>
  <div>{{ totalCost }}</div>
</main>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      costTable: []
    }
  },
  computed: {
    categorized () {
      return this.costTable.reduce((prev, current, index) => {
        if (typeof prev[current.category] === 'undefined') {
          prev[current.category] = []
        }
        prev[current.category].push(current)

        return prev
      }, {})
    },
    totalCost () {
      return this.costTable.reduce((prev, current) => {
        prev += current.volume * current.man_hour * current.cost

        return prev
      }, 0)
    }
  },
  created () {
    fetch('../cost-table.json')
      .then(res => res.json())
      .then(result => {
        this.costTable = result
      })
  }
})
</script>
