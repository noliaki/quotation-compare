import * as React from 'react'
import style from './style.css'

console.log(style)

export default class Item extends React.Component {
  render () {
    return <div className={style.item}>hoge</div>
  }
}
