<template>
<tr :key="content.id" :class="{'is-edited': totalCost !== 0}">
  <td>{{ content.subject }}</td>
  <td class="text-center">
    <input
      type="number"
      :value="content.volume"
      @input="onInput"
      min="0"
    >
  </td>
  <td class="text-center">{{ content.cost.toLocaleString() }}</td>
  <td class="text-center">¥ {{ tweenTotalCost.toLocaleString() }}</td>
</tr>
</template>
<script>
import TweenLite from 'gsap/TweenLite'

export default {
  data () {
    return {
      tweenTotalCost: 0,
      volume: this.content.volume
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
          self.tweenTotalCost = Math.floor(obj.val)
        }
      })
    }
  },
  methods: {
    onInput (event) {
      const val = parseInt(event.currentTarget.value, 10)

      if (typeof val !== 'number' || isNaN(val)) {
        this.volume = 0
        this.onChangeVolume(this.content.id, 0)
        return
      }

      this.volume = val
      this.onChangeVolume(this.content.id, val)
    }
  },
  computed: {
    totalCost () {
      return this.content.volume * this.content.cost
    }
  },
  props: {
    content: {
      type: Object,
      required: true
    },
    onChangeVolume: {
      type: Function,
      required: true
    }
  }
}
</script>
