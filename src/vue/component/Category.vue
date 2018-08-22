<template>
<div class="category">
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
        <Item
          v-for="item in items"
          :content="item"
          :onChangeVolume="onChangeVolume"
          :key="item.id"
        />
      </tbody>
    </table>
  </div>
</div>
</template>
<script>
import Item from './Item'

export default {
  props: {
    categoryName: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    onChangeVolume: {
      type: Function,
      required: true
    }
  },
  components: {
    Item
  }
}
</script>
