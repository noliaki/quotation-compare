import * as React from 'react'
import Item from './Item'

export default class Category extends React.Component {
  render () {
    const items = this.props.items.map(item => (
      <Item
        key={item.id}
        content={item}
        onChangeVolume={this.props.onChangeVolume}
      />
    ))

    return (
      <div className="category">
        <h2>{this.props.categoryName}</h2>
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
              { items }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
