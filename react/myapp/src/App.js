import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// 定义组件类
class App extends Component {
  constructor(){
    // 当使用类的构造函数时，第一句调用父类的构造函数
    super();
    // 组件类中默认包含一个state字段
    // 该字段存储组件中使用的数据
    this.state = {
        name:'珍珍',
        age:20,
        isSleep:false,
        list:[
          {name:'珍珍',age:28},
          {name:'叶子',age:21},
          {name:'珍珍',age:28},
          {name:'叶子',age:21},
          {name:'珍珍',age:28},
          {name:'叶子',age:21},
          {name:'珍珍',age:28},
          {name:'叶子',age:21},
        ]
    }
  }
  // 渲染
  // render函数的返回值就是这个组件的视图模板
  // react一大特色：jsx支持js和html的混写，遇到<认为是HTML，遇到{}认为是js；
  // 这个视图模板最外层只有一个标签；
  render() {
    var arr = [1,2,3]
    var result1 = arr.map(item=>{
      return item*3
    })
    console.log(arr)
    return (
      // className指明class样式类名称
      // react中组件css文件中的样式没有组件隔离机制，也可以作用于其他组件，都以文件名为前缀，便于区别；
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {/*{this.state.name}数据展示：{}里面是js代码*/}
        <h1>你好！{this.state.name}</h1>
        <p>1+1={1+1}</p>
        {/*react中的boolean类型的数据不显示*/}
        <p>睡着了吗？{this.state.isSleep}</p>
        {/*条件渲染,列表渲染,react不支持指令操作*/}
        {/*&&逻辑运算且（与）当前面表达式为假，结果注定为假，后面的表达式不再执行，当前面的表达式为真时，结果取决于后面的表达式，后面的表达式会执行*/}
        {this.state.age>=18&&<p>她20多岁了</p>}
        <ul>
          {
            this.state.list.map((item,index)=>{
               return <li key={index}>{item.name}------{item.age}</li>
            })
          }
        </ul>
        {/*
          <ol>
          {
            [<li>111111</li>,<li>2222222</li>,<li>3333333333</li>]
          }
        </ol>
        */}
        
      </div>
    );
  }
}
// 导出组件类
export default App;
