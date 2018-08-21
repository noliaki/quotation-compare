<template>
<div class="wrapper">
  <div class="category" v-for="categoryName in Object.keys(categorized)" :key="categoryName">
    <h2>{{ categoryName }}</h2>
    <div class="items">
      <table>
        <thead>
          <tr>
            <th>項目</th>
            <th class="item-volume">数量</th>
            <th class="item-unit_cost">単価</th>
            <th class="item-total_cost">費用</th>
          </tr>
        </thead>
        <tbody>
          <item v-for="item in categorized[categoryName]" :item="item" :key="item.id" />
        </tbody>
      </table>
    </div>
  </div>
  <div class="total-cost">{{ tweenCostTable }}</div>
</div>
</template>

<script>
import Vue from 'vue'
import item from './Item'
import TweenLite from 'gsap/TweenLite'
import costTable from '../cost-table.json'

export default Vue.extend({
  data () {
    return {
      costTable,
      tweenCostTable: '0'
    }
  },
  components: {
    item
  },
  watch: {
    totalCost (next, prev) {
      const self = this
      const obj = {
        val: prev
      }

      TweenLite.to(obj, 0.3, {
        val: next,
        onUpdate() {
          self.tweenCostTable = Math.floor(obj.val).toLocaleString()
        }
      })
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
    this.tweenCostTable = this.totalCost
  }
})
</script>
