import * as React from 'react'
import TweenLite from 'gsap/TweenLite'
import config from '../../config.json'

export default class Item extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tweenTotalCost: 0
    }
  }

  onChange (id, event) {
    event.preventDefault()

    const prevVal = this.props.content.volume
    const nextVal = parseInt(event.currentTarget.value, 10)

    const self = this
    const obj = {
      val: prevVal
    }

    TweenLite.to(obj, config.duration, {
      val: nextVal,
      onUpdate () {
        self.setState({
          tweenTotalCost: Math.floor(obj.val * self.props.content.cost * self.props.content.man_hour)
        })
      }
    })

    this.props.onChangeVolume(id, nextVal)
  }

  rowClassName () {
    return this.props.content.volume ? 'is-edited' : ''
  }

  render () {
    return (
      <tr className={this.rowClassName()}>
        <td>{ this.props.content.subject }</td>
        <td className="text-center">
          <input
            type="number"
            value={this.props.content.volume}
            min="0"
            onChange={(event) => this.onChange(this.props.content.id, event)}
          />
        </td>
        <td className="text-center">{ this.props.content.cost.toLocaleString() }</td>
        <td className="text-center">{ this.state.tweenTotalCost.toLocaleString() }</td>
      </tr>
    )
  }
}
