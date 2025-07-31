import { useState, useEffect } from 'react'
import './App.css'

// 性能问题1: 在组件内部定义复杂对象，每次渲染都会重新创建
const createExpensiveData = () => {
  console.log('创建昂贵的数据...') // 这会在每次渲染时执行
  const data = []
  for (let i = 0; i < 10000; i++) {
    data.push({
      id: i,
      name: `Item ${i}`,
      value: Math.random() * 1000,
      description: `这是第${i}个项目的描述信息`.repeat(10)
    })
  }
  return data
}

// 性能问题2: 没有使用React.memo的子组件
const ExpensiveListItem = ({ item, onUpdate }) => {
  console.log(`渲染列表项 ${item.id}`) // 这会显示不必要的重新渲染

  // 性能问题3: 在渲染过程中进行复杂计算
  const expensiveCalculation = () => {
    let result = 0
    for (let i = 0; i < 100000; i++) {
      result += Math.sin(i) * Math.cos(i)
    }
    return result
  }

  return (
    <div style={{
      padding: '10px',
      border: '1px solid #ccc',
      margin: '5px',
      backgroundColor: item.id % 2 === 0 ? '#f0f0f0' : '#fff'
    }}>
      <h3>{item.name}</h3>
      <p>值: {item.value.toFixed(2)}</p>
      <p>复杂计算结果: {expensiveCalculation()}</p>
      <p>{item.description}</p>
      <button onClick={() => onUpdate(item.id)}>
        更新项目 {item.id}
      </button>
    </div>
  )
}

// 性能问题4: 没有使用React.memo的搜索组件
const SearchBox = ({ onSearch, searchTerm }) => {
  console.log('渲染搜索框')
  return (
    <div style={{ margin: '20px 0' }}>
      <input
        type="text"
        placeholder="搜索项目..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        style={{
          padding: '10px',
          fontSize: '16px',
          width: '300px',
          border: '2px solid #ddd',
          borderRadius: '4px'
        }}
      />
    </div>
  )
}

function App() {
  const [count, setCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [updateCounter, setUpdateCounter] = useState(0)

  // 性能问题5: 每次渲染都创建新的数据
  const expensiveData = createExpensiveData()

  // 性能问题6: 在每次渲染时过滤数据，没有使用useMemo
  const filteredData = expensiveData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 性能问题7: useEffect没有正确的依赖数组
  useEffect(() => {
    console.log('Effect运行了，当前计数:', count)
    // 模拟一些副作用操作
    const timer = setTimeout(() => {
      console.log('定时器执行')
    }, 1000)

    return () => clearTimeout(timer)
  }) // 缺少依赖数组，会在每次渲染后执行

  // 性能问题8: 在渲染中创建新的函数
  const handleItemUpdate = (itemId) => {
    console.log(`更新项目 ${itemId}`)
    setUpdateCounter(prev => prev + 1)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>性能问题演示应用</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          点击计数: {count}
        </button>
        <span style={{ marginLeft: '20px' }}>
          更新计数器: {updateCounter}
        </span>
      </div>

      <SearchBox onSearch={handleSearch} searchTerm={searchTerm} />

      <div style={{ marginBottom: '20px' }}>
        <h2>数据列表 (显示 {filteredData.length} 项)</h2>
        <p style={{ color: '#666' }}>
          打开浏览器开发者工具的控制台，观察性能问题的日志输出
        </p>
      </div>

      <div style={{
        maxHeight: '400px',
        overflowY: 'auto',
        border: '2px solid #ddd',
        borderRadius: '4px',
        padding: '10px'
      }}>
        {filteredData.slice(0, 50).map(item => (
          <ExpensiveListItem
            key={item.id}
            item={item}
            onUpdate={handleItemUpdate}
          />
        ))}
      </div>

      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>这个应用存在的性能问题：</h3>
        <ul style={{ textAlign: 'left' }}>
          <li>1. 在组件内部创建昂贵的数据，每次渲染都重新计算</li>
          <li>2. 子组件没有使用React.memo，导致不必要的重新渲染</li>
          <li>3. 在渲染过程中进行复杂的计算</li>
          <li>4. 没有使用useMemo缓存过滤后的数据</li>
          <li>5. useEffect缺少依赖数组</li>
          <li>6. 在渲染中创建新的函数引用</li>
          <li>7. 大量DOM元素同时渲染</li>
        </ul>
      </div>
    </div>
  )
}

export default App
