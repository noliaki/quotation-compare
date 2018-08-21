<template>
<tr :key="item.id" :class="{'is-edited': totalCost !== 0}">
  <td>{{ item.subject }}</td>
  <td class="text-center"><input type="number" v-model.number="item.volume" min="0"></td>
  <td class="text-center">{{ item.cost.toLocaleString() }}</td>
  <td class="text-center">{{ tweenTotalCost }}</td>
</tr>
</template>
<script>
import TweenLite from 'gsap/TweenLite'

export default {
  data () {
    return {
      tweenTotalCost: '0'
    }
  },
  watch: {
    totalCost (next, prev) {
      const self = this

      const obj = {
        val: prev
      }

      TweenLite.to(obj, 0.3, {
        val: next,
        onUpdate () {
          self.tweenTotalCost = Math.floor(obj.val).toLocaleString()
        }
      })
    }
  },
  computed: {
    totalCost () {
      return this.item.volume * this.item.cost * this.item.man_hour
    }
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>
