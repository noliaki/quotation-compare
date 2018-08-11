import * as React from 'react'
import Item from './component/Item'

export default class MyComponent extends React.Component {
  render () {
    return (
      <div>
        {this.props.content}
        <Item />
      </div>
    )
  }
}
