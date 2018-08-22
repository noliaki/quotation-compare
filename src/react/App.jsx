import * as React from 'react'
import TweenLite from 'gsap/TweenLite'

import costTable from '../cost-table.json'
import Category from './component/Category'
import config from '../config.json'

export default class App extends React.Component {
  constructor () {
    super()
    this.onChangeVolume = this.onChangeVolume.bind(this)
    this.state = {
      costTable,
      tweenTotalCost: 0,
      params: ''
    }
  }

  stateToParams () {
    const hasVolume = this.state.costTable.find(item => item.volume !== 0)

    if (!hasVolume) return ''

    return this.state.costTable.map(item => `${item.id}=${item.volume}`).join('&')
  }

  paramsToState (paramString) {
    if (!paramString) {
      return this.state.costTable
    }

    return paramString.split('&').reduce((prev, current) => {
      const valArr = current.split('=')
      prev.push({
        id: valArr[0],
        volume: valArr[1]
      })

      return prev
    }, [])
  }

  categorized () {
    return this.state.costTable.reduce((prev, current, index) => {
      if (typeof prev[current.category] === 'undefined') {
        prev[current.category] = []
      }

      prev[current.category].push(current)

      return prev
    }, {})
  }

  onChangeVolume (id, volume) {
    const index = this.state.costTable.findIndex(item => item.id === id)
    const cloneItem = Object.assign({}, this.state.costTable[index], { volume })

    const newCostTable = [
      ...this.state.costTable.slice(0, index),
      cloneItem,
      ...this.state.costTable.slice(index + 1)
    ]

    this.setState({
      costTable: newCostTable,
      params: this.stateToParams()
    }, () => {
      const self = this
      const obj = {
        val: this.state.tweenTotalCost
      }

      TweenLite.to(obj, config.duration, {
        val: this.totalCost(),
        onUpdate () {
          self.setState({
            tweenTotalCost: Math.floor(obj.val)
          })
        }
      })
    })
  }

  totalCost () {
    return this.state.costTable.reduce((prev, current) => {
      prev += current.volume * current.cost

      return prev
    }, 0)
  }

  render () {
    const categorized = this.categorized()
    const categories = Object.keys(categorized).map(key => (
      <Category
        categoryName={key}
        items={categorized[key]}
        key={key}
        onChangeVolume={this.onChangeVolume}
      />
    ))

    return (
      <div className="wrapper">
        { categories }
        <div className="total-cost">{ this.state.tweenTotalCost.toLocaleString() }</div>
      </div>
    )
  }
}
