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
    const nextValue = parseInt(event.currentTarget.value, 10)

    if (isNaN(nextValue)) {
      this.props.onChangeVolume(this.props.content.id, this.props.content.volume)
      return
    }

    this.props.onChangeVolume(this.props.content.id, nextValue)
  }

  rowClassName () {
    return this.props.content.volume ? 'is-edited' : ''
  }

  shouldComponentUpdate (nextProps, nextState) {
    const hasChangedProps = nextProps.content.volume !== this.props.content.volume
    const hasChangedState = nextState.tweenTotalCost !== this.state.tweenTotalCost

    if (hasChangedProps || hasChangedState) {
      return true
    }

    return false
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

  render () {
    return (
      <tr className={this.rowClassName()}>
        <td>{ this.props.content.subject }</td>
        <td className="text-center">
          <input
            type="number"
            value={this.props.content.volume}
            min="0"
            onInput={this.onChange}
          />
        </td>
        <td className="text-center">{ this.props.content.cost.toLocaleString() }</td>
        <td className="text-center">{ this.state.tweenTotalCost.toLocaleString() }</td>
      </tr>
    )
  }
}
