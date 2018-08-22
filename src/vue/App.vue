<template>
<div class="wrapper">
  <Category
    v-for="key in Object.keys(categorized)"
    :categoryName="key"
    :items="categorized[key]"
    :onChangeVolume="onChangeVolume"
    :key="key"
  />
  <div class="total-cost">{{ tweenCostTable.toLocaleString() }}</div>
</div>
</template>

<script>
import Vue from 'vue'
import Category from './component/Category'
import TweenLite from 'gsap/TweenLite'
import costTable from '../cost-table.json'

export default Vue.extend({
  data () {
    return {
      costTable,
      tweenCostTable: 0
    }
  },
  components: {
    Category
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
          self.tweenCostTable = Math.floor(obj.val)
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
        prev += current.volume * current.cost

        return prev
      }, 0)
    }
  },
  methods: {
    onChangeVolume(id, volume) {
      const index = this.costTable.findIndex(item => item.id === id)
      const cloneItem = Object.assign({}, this.costTable[index], {volume})

      this.costTable.splice(index, 1, cloneItem)
    }
  },
  created () {
    this.tweenCostTable = this.totalCost
  }
})
</script>
