<template>
<div class="wrapper">
  <div class="share-url">
    <input class="share-url-input" type="text" :value="shareURL" ref="urlInput" readOnly />
    <button class="share-url-btn" type="button" @click=copyShareUrl><i class="far fa-clipboard"></i></button>
  </div>
  <Category
    v-for="key in Object.keys(categorized)"
    :categoryName="key"
    :items="categorized[key]"
    :onChangeVolume="onChangeVolume"
    :key="key"
  />
  <div class="total-cost">¥ {{ tweenCostTable.toLocaleString() }}</div>
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
    },
    shareURL () {
      const params = this.stateToParams
      return `${location.protocol}//${location.host}${location.pathname}${params ? '?' + params : ''}`
    },
    stateToParams () {
      const filteredState = this.costTable.filter(item => item.volume !== 0)

      if (!filteredState.length) return ''

      return filteredState.map(item => `${item.id}=${item.volume}`).join('&')
    }
  },
  methods: {
    onChangeVolume(id, volume) {
      const index = this.costTable.findIndex(item => item.id === id)
      const cloneItem = Object.assign({}, this.costTable[index], {volume})

      this.costTable.splice(index, 1, cloneItem)
    },
    copyShareUrl () {
      this.$refs['urlInput'].select()
      document.execCommand('copy')
    },
    paramsToState (paramString) {
      if (!paramString) {
        return this.costTable
      }

      return paramString.split('&').reduce((prev, current) => {
        const valArr = current.split('=')
        const id = parseInt(valArr[0], 10)
        const volume = parseInt(valArr[1], 10)

        if (isNaN(id) || isNaN(volume)) {
          prev.push({
            id,
            volume: isNaN(volume) || volume < 0 ? 0 : volume
          })
        }

        return prev
      }, [])
    },
    mergeParamsToState (paramsState) {
      paramsState.forEach(item => {
        const index = this.costTable.findIndex(stateItem => stateItem.id === item.id)

        if (index > -1) {
          const clone = Object.assign({}, this.costTable[index], {
            volume: item.volume
          })

          this.costTable.splice(index, 1, clone)
        }
      })
    }
  },
  created () {
    this.tweenCostTable = this.totalCost
  },
  mounted () {
    const params = location.search.slice(1)
    if (params) {
      this.mergeParamsToState(this.paramsToState(params))
    }
  }
})
</script>
