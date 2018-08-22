import * as React from 'react'
import TweenLite from 'gsap/TweenLite'
import config from '../../config.json'

export default class Item extends React.Component {
  constructor (props) {
    super(props)

    this.onChange = this.onChange.bind(this)
    this.state = {
      tweenTotalCost: 0
    }
  }

  onChange (event) {
    event.preventDefault()
    const nextValue = parseInt(event.currentTarget.value, 10)

    if (typeof nextValue !== 'number' || isNaN(nextValue)) {
      this.props.onChangeVolume(this.props.content.id, 0)
      return
    }

    this.props.onChangeVolume(this.props.content.id, nextValue)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.content.volume !== this.props.content.volume) {
      const self = this
      const obj = {
        val: prevProps.content.volume
      }

      TweenLite.to(obj, config.duration, {
        val: this.props.content.volume,
        onUpdate () {
          self.setState({
            tweenTotalCost: Math.floor(obj.val * self.props.content.cost)
          })
        }
      })
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const hasChangedProps = nextProps.content.volume !== this.props.content.volume
    const hasChangedState = nextState.tweenTotalCost !== this.state.tweenTotalCost

    if (hasChangedProps || hasChangedState) {
      return true
    }

    return false
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
            defaultValue={this.props.content.volume}
            min="0"
            onChange={this.onChange}
          />
        </td>
        <td className="text-center">{ this.props.content.cost.toLocaleString() }</td>
        <td className="text-center">{ this.state.tweenTotalCost.toLocaleString() }</td>
      </tr>
    )
  }
}
