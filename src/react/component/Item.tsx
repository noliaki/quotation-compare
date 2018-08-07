import * as React from 'react'

export interface Props {
  content: string
}

export default class Item extends React.Component<Props, {}> {
  render () {
    return <div>{this.props.content}</div>
  }
}
