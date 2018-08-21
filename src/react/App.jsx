import * as React from 'react'
import costTable from '../cost-table.json'
import Item from './component/Item'
import TweenLite from 'gsap/TweenLite'
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

    console.log(hasVolume)

    if (!hasVolume) {
      return ''
    }

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
    const costTable = this.state.costTable.slice()
    const item = costTable.find(item => item.id === id)
    item.volume = volume

    this.setState({
      costTable,
      params: this.stateToParams()
    })

    console.log(this.stateToParams())
    console.log(this.paramsToState(this.stateToParams()))

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
  }

  totalCost () {
    return this.state.costTable.reduce((prev, current) => {
      prev += current.volume * current.man_hour * current.cost

      return prev
    }, 0)
  }

  render () {
    const categorized = this.categorized()
    const items = Object.keys(categorized).map(key => {
      return (
        <div className="category" key={key}>
          <h2>{key}</h2>
          <div className="items">
            <table>
              <thead>
                <tr>
                  <th>項目</th>
                  <th className="item-volume">数量</th>
                  <th className="item-unit_cost">単価</th>
                  <th className="item-total_cost">費用</th>
                </tr>
              </thead>
              <tbody>
                { categorized[key].map(item => <Item key={item.id} content={item} onChangeVolume={this.onChangeVolume} />) }
              </tbody>
            </table>
          </div>
        </div>
      )
    })
    return (
      <div className="wrapper">
        {items}
        <div className="total-cost">{ this.state.tweenTotalCost.toLocaleString() }</div>
      </div>
    )
  }
}
