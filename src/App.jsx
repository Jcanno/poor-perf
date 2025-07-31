import { useState, useEffect, useContext, createContext } from 'react'
import './App.css'
import {
  MemoryLeakComponent,
  NetworkHeavyComponent,
  EventHeavyComponent,
  ComplexStateComponent
} from './PerformanceProblems'

// 性能问题9: 创建不必要的Context，导致大量组件重新渲染
const GlobalContext = createContext()

// 性能问题10: Context Provider的value每次都是新对象
const GlobalProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    theme: 'light',
    user: { name: 'User', id: 1 },
    settings: { notifications: true, language: 'zh' }
  })

  // 每次渲染都创建新的value对象
  const value = {
    globalState,
    setGlobalState,
    // 每次渲染都创建新的函数
    updateTheme: (theme) => setGlobalState(prev => ({ ...prev, theme })),
    updateUser: (user) => setGlobalState(prev => ({ ...prev, user }))
  }

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  )
}

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

// 性能问题11: 频繁的DOM操作和状态更新
const AnimationComponent = ({ isActive }) => {
  const [position, setPosition] = useState(0)
  const [color, setColor] = useState('#ff0000')

  // 性能问题12: 没有清理的定时器和事件监听器
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setPosition(prev => (prev + 1) % 200)
        setColor(`hsl(${Math.random() * 360}, 70%, 50%)`)
      }, 50) // 每50ms更新一次，频率过高

      // 没有清理定时器
      // return () => clearInterval(interval)
    }
  }, [isActive])

  // 性能问题13: 在渲染中进行DOM查询
  const elementCount = document.querySelectorAll('div').length

  return (
    <div style={{
      width: '200px',
      height: '100px',
      border: '2px solid #ccc',
      position: 'relative',
      margin: '20px 0',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '20px',
        height: '20px',
        backgroundColor: color,
        position: 'absolute',
        left: `${position}px`,
        top: '40px',
        borderRadius: '50%',
        transition: 'none' // 禁用CSS过渡，强制使用JS动画
      }} />
      <p style={{ fontSize: '12px', margin: '5px' }}>
        DOM元素数量: {elementCount}
      </p>
    </div>
  )
}

// 性能问题14: 大量的内联样式对象创建
const StyleHeavyComponent = ({ data }) => {
  console.log('渲染样式重组件')

  return (
    <div>
      {data.slice(0, 20).map((item, index) => (
        <div
          key={item.id}
          style={{
            // 每次渲染都创建新的样式对象
            padding: `${10 + index}px`,
            margin: `${5 + index}px`,
            backgroundColor: `hsl(${item.id * 10}, 50%, ${50 + index * 2}%)`,
            border: `${1 + index}px solid #${item.id.toString(16).padStart(6, '0')}`,
            borderRadius: `${5 + index * 2}px`,
            fontSize: `${12 + index}px`,
            color: index % 2 === 0 ? '#ffffff' : '#000000',
            textShadow: `${index}px ${index}px ${index * 2}px rgba(0,0,0,0.5)`,
            boxShadow: `${index}px ${index}px ${index * 3}px rgba(0,0,0,0.3)`,
            transform: `rotate(${index * 2}deg) scale(${1 + index * 0.05})`,
            transition: `all ${100 + index * 10}ms ease-in-out`
          }}
        >
          项目 {item.name} - 索引 {index}
        </div>
      ))}
    </div>
  )
}

// 性能问题15: 深度嵌套的组件树，没有优化
const DeepNestedComponent = ({ level, maxLevel, data }) => {
  console.log(`渲染嵌套组件 level ${level}`)

  // 性能问题16: 在每个嵌套层级都进行复杂计算
  const expensiveValue = Array.from({ length: 1000 }, (_, i) =>
    Math.sin(i * level) * Math.cos(i * level)
  ).reduce((sum, val) => sum + val, 0)

  if (level >= maxLevel) {
    return (
      <div style={{
        padding: '5px',
        border: '1px solid #ddd',
        backgroundColor: `rgba(255, 0, 0, ${0.1 * level})`
      }}>
        叶子节点 - Level {level} - 计算值: {expensiveValue.toFixed(2)}
      </div>
    )
  }

  return (
    <div style={{
      padding: '10px',
      border: '2px solid #333',
      margin: '5px',
      backgroundColor: `rgba(0, 255, 0, ${0.1 * level})`
    }}>
      <h4>Level {level} - 计算值: {expensiveValue.toFixed(2)}</h4>
      {/* 创建多个子组件，增加渲染负担 */}
      {Array.from({ length: 3 }, (_, i) => (
        <DeepNestedComponent
          key={`${level}-${i}`}
          level={level + 1}
          maxLevel={maxLevel}
          data={data}
        />
      ))}
    </div>
  )
}

function App() {
  const [count, setCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [updateCounter, setUpdateCounter] = useState(0)
  const [showAnimation, setShowAnimation] = useState(false)
  const [showDeepNesting, setShowDeepNesting] = useState(false)
  const [showStyleHeavy, setShowStyleHeavy] = useState(false)
  const [showMemoryLeak, setShowMemoryLeak] = useState(false)
  const [showNetworkHeavy, setShowNetworkHeavy] = useState(false)
  const [showEventHeavy, setShowEventHeavy] = useState(false)
  const [showComplexState, setShowComplexState] = useState(false)
  const [networkTrigger, setNetworkTrigger] = useState(0)

  // 性能问题17: 使用Context但没有优化
  const globalContext = useContext(GlobalContext) || {}

  // 性能问题29: 频繁触发网络请求的计数器
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkTrigger(prev => prev + 1)
    }, 3000) // 每3秒触发一次网络请求

    return () => clearInterval(interval)
  }, [])

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

      {/* 性能问题控制按钮 */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setShowAnimation(!showAnimation)}
          style={{
            padding: '8px 16px',
            backgroundColor: showAnimation ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showAnimation ? '关闭' : '开启'} 动画组件
        </button>

        <button
          onClick={() => setShowDeepNesting(!showDeepNesting)}
          style={{
            padding: '8px 16px',
            backgroundColor: showDeepNesting ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showDeepNesting ? '隐藏' : '显示'} 深度嵌套
        </button>

        <button
          onClick={() => setShowStyleHeavy(!showStyleHeavy)}
          style={{
            padding: '8px 16px',
            backgroundColor: showStyleHeavy ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showStyleHeavy ? '隐藏' : '显示'} 样式重组件
        </button>

        <button
          onClick={() => setShowMemoryLeak(!showMemoryLeak)}
          style={{
            padding: '8px 16px',
            backgroundColor: showMemoryLeak ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showMemoryLeak ? '隐藏' : '显示'} 内存泄漏
        </button>

        <button
          onClick={() => setShowNetworkHeavy(!showNetworkHeavy)}
          style={{
            padding: '8px 16px',
            backgroundColor: showNetworkHeavy ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showNetworkHeavy ? '隐藏' : '显示'} 网络重组件
        </button>

        <button
          onClick={() => setShowEventHeavy(!showEventHeavy)}
          style={{
            padding: '8px 16px',
            backgroundColor: showEventHeavy ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showEventHeavy ? '隐藏' : '显示'} 事件重组件
        </button>

        <button
          onClick={() => setShowComplexState(!showComplexState)}
          style={{
            padding: '8px 16px',
            backgroundColor: showComplexState ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showComplexState ? '隐藏' : '显示'} 复杂状态
        </button>
      </div>

      {/* 新增的性能问题组件 */}
      {showAnimation && (
        <div style={{ marginBottom: '20px' }}>
          <h3>动画组件 (频繁更新)</h3>
          <AnimationComponent isActive={showAnimation} />
        </div>
      )}

      {showStyleHeavy && (
        <div style={{ marginBottom: '20px' }}>
          <h3>样式重组件 (大量内联样式)</h3>
          <StyleHeavyComponent data={filteredData} />
        </div>
      )}

      {showDeepNesting && (
        <div style={{ marginBottom: '20px' }}>
          <h3>深度嵌套组件 (复杂组件树)</h3>
          <DeepNestedComponent level={1} maxLevel={4} data={filteredData} />
        </div>
      )}

      {/* 新增的高级性能问题组件 */}
      {showMemoryLeak && (
        <div style={{ marginBottom: '20px' }}>
          <MemoryLeakComponent />
        </div>
      )}

      {showNetworkHeavy && (
        <div style={{ marginBottom: '20px' }}>
          <NetworkHeavyComponent trigger={networkTrigger} />
        </div>
      )}

      {showEventHeavy && (
        <div style={{ marginBottom: '20px' }}>
          <EventHeavyComponent />
        </div>
      )}

      {showComplexState && (
        <div style={{ marginBottom: '20px' }}>
          <ComplexStateComponent />
        </div>
      )}

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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left' }}>
          <div>
            <h4>基础性能问题:</h4>
            <ul style={{ fontSize: '13px', margin: '10px 0' }}>
              <li>1. 在组件内部创建昂贵的数据，每次渲染都重新计算</li>
              <li>2. 子组件没有使用React.memo，导致不必要的重新渲染</li>
              <li>3. 在渲染过程中进行复杂的计算</li>
              <li>4. 没有使用useMemo缓存过滤后的数据</li>
              <li>5. useEffect缺少依赖数组</li>
              <li>6. 在渲染中创建新的函数引用</li>
              <li>7. 大量DOM元素同时渲染</li>
              <li>8. Context Provider的value每次都是新对象</li>
            </ul>

            <h4>渲染性能问题:</h4>
            <ul style={{ fontSize: '13px', margin: '10px 0' }}>
              <li>9. 频繁的DOM操作和状态更新 (动画组件)</li>
              <li>10. 没有清理的定时器和事件监听器</li>
              <li>11. 在渲染中进行DOM查询</li>
              <li>12. 大量的内联样式对象创建</li>
              <li>13. 深度嵌套的组件树，没有优化</li>
              <li>14. 在每个嵌套层级都进行复杂计算</li>
              <li>15. 使用Context但没有优化订阅</li>
            </ul>
          </div>

          <div>
            <h4>内存和网络问题:</h4>
            <ul style={{ fontSize: '13px', margin: '10px 0' }}>
              <li>16. 内存泄漏 - 大量数据存储在组件状态中</li>
              <li>17. 无限增长的数据，不清理旧数据</li>
              <li>18. 不必要的网络请求</li>
              <li>19. 没有防抖的API调用</li>
              <li>20. 频繁触发网络请求</li>
            </ul>

            <h4>事件和状态问题:</h4>
            <ul style={{ fontSize: '13px', margin: '10px 0' }}>
              <li>21. 大量的事件监听器</li>
              <li>22. 高频事件没有节流</li>
              <li>23. 忘记清理事件监听器</li>
              <li>24. 在渲染中创建大量DOM元素</li>
              <li>25. 复杂的状态更新逻辑</li>
              <li>26. 深度嵌套的状态更新</li>
              <li>27. 每次都深拷贝整个状态对象</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px', border: '1px solid #ffeaa7' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>🔧 性能分析工具:</h4>
          <ul style={{ fontSize: '12px', color: '#856404', margin: 0 }}>
            <li>打开浏览器开发者工具的 <strong>Performance</strong> 面板，录制性能分析</li>
            <li>使用 <strong>Memory</strong> 面板观察内存使用情况</li>
            <li>在 <strong>Network</strong> 面板中查看网络请求</li>
            <li>使用 <strong>React Developer Tools</strong> 的 Profiler 功能</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// 将App包装在GlobalProvider中以演示Context性能问题
const AppWithProvider = () => {
  return (
    <GlobalProvider>
      <App />
    </GlobalProvider>
  )
}

export default AppWithProvider
