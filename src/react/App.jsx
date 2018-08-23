import * as React from 'react'
import TweenLite from 'gsap/TweenLite'

import costTable from '../cost-table.json'
import Category from './component/Category'
import config from '../config.json'

export default class App extends React.Component {
  constructor () {
    super()
    this.onChangeVolume = this.onChangeVolume.bind(this)
    this.copyShareUrl = this.copyShareUrl.bind(this)
    this.urlInput = React.createRef()
    this.state = {
      costTable,
      tweenTotalCost: 0,
      params: ''
    }
  }

  shareURL () {
    const params = this.stateToParams()
    return `${location.protocol}//${location.host}${location.pathname}${params ? '?' + params : ''}`
  }

  paramsToState (paramString) {
    if (!paramString) {
      return this.state.costTable
    }

    return paramString.split('&').reduce((prev, current) => {
      const valArr = current.split('=')
      const id = parseInt(valArr[0], 10)
      const volume = parseInt(valArr[1], 10)

      prev.push({
        id,
        volume: isNaN(volume) || volume < 0 ? 0 : volume
      })

      return prev
    }, [])
  }

  stateToParams () {
    const filteredState = this.state.costTable.filter(item => item.volume !== 0)

    if (!filteredState.length) return ''

    return filteredState.map(item => `${item.id}=${item.volume}`).join('&')
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

  copyShareUrl (event) {
    this.urlInput.current.select()
    document.execCommand('copy')
  }

  componentDidMount () {
    const params = location.search.slice(1)
    if (params) {
      this.mergeParamsToState(this.paramsToState(params))
    }
  }

  mergeParamsToState (paramsState) {
    const shallowState = this.state.costTable.slice()

    paramsState.forEach(item => {
      const index = this.state.costTable.findIndex(stateItem => stateItem.id === item.id)

      if (index > -1) {
        const clone = Object.assign({}, this.state.costTable[index], {
          volume: item.volume
        })

        shallowState.splice(index, 1, clone)
      }
    })

    this.setState({
      costTable: shallowState
    }, () => {
      this.tweenTotalCost()
    })
  }

  tweenTotalCost () {
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
      this.tweenTotalCost()
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
        <div className="share-url">
          <input className="share-url-input" type="text" value={this.shareURL()} ref={this.urlInput} readOnly />
          <button className="share-url-btn" type="button" onClick={this.copyShareUrl}><i className="far fa-clipboard"></i></button>
        </div>
        { categories }
        <div className="total-cost">{ this.state.tweenTotalCost.toLocaleString() }</div>
      </div>
    )
  }
}
