import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// 渲染函数：
// para1:标签
// para2:容器标签
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
