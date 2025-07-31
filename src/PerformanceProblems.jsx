import { useState, useEffect, useRef } from 'react'

// 性能问题18: 内存泄漏 - 大量数据存储在组件状态中
export const MemoryLeakComponent = () => {
  const [largeDataSet, setLargeDataSet] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  
  // 性能问题19: 无限增长的数据
  const generateLargeData = () => {
    setIsGenerating(true)
    const newData = Array.from({ length: 10000 }, (_, i) => ({
      id: Date.now() + i,
      data: new Array(1000).fill(0).map(() => Math.random()),
      timestamp: new Date().toISOString(),
      description: `Large data item ${i}`.repeat(50)
    }))
    
    // 不断累积数据，不清理旧数据
    setLargeDataSet(prev => [...prev, ...newData])
    setIsGenerating(false)
  }
  
  return (
    <div style={{ padding: '20px', border: '2px solid #ff6b6b', borderRadius: '8px', margin: '10px 0' }}>
      <h3>内存泄漏组件</h3>
      <p>当前数据量: {largeDataSet.length} 项</p>
      <button 
        onClick={generateLargeData}
        disabled={isGenerating}
        style={{
          padding: '10px 20px',
          backgroundColor: '#ff6b6b',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isGenerating ? 'not-allowed' : 'pointer'
        }}
      >
        {isGenerating ? '生成中...' : '生成大量数据'}
      </button>
      <button 
        onClick={() => setLargeDataSet([])}
        style={{
          padding: '10px 20px',
          backgroundColor: '#51cf66',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginLeft: '10px'
        }}
      >
        清理数据
      </button>
    </div>
  )
}

// 性能问题20: 不必要的网络请求
export const NetworkHeavyComponent = ({ trigger }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  
  // 性能问题21: 没有防抖的API调用
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      console.log('发起网络请求...')
      
      // 模拟API调用
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts')
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('网络请求失败:', error)
      } finally {
        setLoading(false)
      }
    }
    
    // 每次trigger变化都会发起请求，没有缓存
    fetchData()
  }, [trigger]) // 依赖trigger，但没有防抖
  
  return (
    <div style={{ padding: '20px', border: '2px solid #4ecdc4', borderRadius: '8px', margin: '10px 0' }}>
      <h3>网络重组件</h3>
      <p>触发器值: {trigger}</p>
      {loading && <p>加载中...</p>}
      <p>已加载数据: {data.length} 项</p>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {data.slice(0, 10).map(item => (
          <div key={item.id} style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
            {item.title}
          </div>
        ))}
      </div>
    </div>
  )
}

// 性能问题22: 大量的事件监听器
export const EventHeavyComponent = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollPosition, setScrollPosition] = useState(0)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const containerRef = useRef(null)
  
  useEffect(() => {
    // 性能问题23: 高频事件没有节流
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }
    
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    
    // 添加多个高频事件监听器
    document.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    
    // 性能问题24: 忘记清理事件监听器
    // return () => {
    //   document.removeEventListener('mousemove', handleMouseMove)
    //   window.removeEventListener('scroll', handleScroll)
    //   window.removeEventListener('resize', handleResize)
    // }
  }, [])
  
  // 性能问题25: 在渲染中创建大量DOM元素
  const renderManyElements = () => {
    return Array.from({ length: 100 }, (_, i) => (
      <div 
        key={i}
        style={{
          width: '10px',
          height: '10px',
          backgroundColor: `hsl(${i * 3.6}, 70%, 50%)`,
          display: 'inline-block',
          margin: '1px'
        }}
        onMouseEnter={() => console.log(`鼠标进入元素 ${i}`)}
        onMouseLeave={() => console.log(`鼠标离开元素 ${i}`)}
      />
    ))
  }
  
  return (
    <div 
      ref={containerRef}
      style={{ 
        padding: '20px', 
        border: '2px solid #ffa726', 
        borderRadius: '8px', 
        margin: '10px 0',
        minHeight: '300px'
      }}
    >
      <h3>事件重组件</h3>
      <p>鼠标位置: ({mousePosition.x}, {mousePosition.y})</p>
      <p>滚动位置: {scrollPosition}px</p>
      <p>窗口大小: {windowSize.width} x {windowSize.height}</p>
      
      <div style={{ marginTop: '20px' }}>
        <h4>100个带事件监听器的元素:</h4>
        <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
          {renderManyElements()}
        </div>
      </div>
    </div>
  )
}

// 性能问题26: 复杂的状态更新逻辑
export const ComplexStateComponent = () => {
  const [complexState, setComplexState] = useState({
    users: [],
    posts: [],
    comments: [],
    likes: {},
    shares: {},
    metadata: {
      lastUpdated: null,
      version: 1,
      settings: {
        theme: 'light',
        language: 'zh',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      }
    }
  })
  
  // 性能问题27: 深度嵌套的状态更新
  const updateNestedState = (path, value) => {
    setComplexState(prevState => {
      // 性能问题28: 每次都深拷贝整个状态对象
      const newState = JSON.parse(JSON.stringify(prevState))
      
      // 复杂的嵌套更新逻辑
      if (path === 'theme') {
        newState.metadata.settings.theme = value
      } else if (path === 'email') {
        newState.metadata.settings.notifications.email = value
      } else if (path === 'addUser') {
        newState.users.push(value)
        newState.metadata.lastUpdated = new Date().toISOString()
        newState.metadata.version += 1
      }
      
      return newState
    })
  }
  
  const addRandomUser = () => {
    const user = {
      id: Date.now(),
      name: `User ${Math.floor(Math.random() * 1000)}`,
      email: `user${Math.floor(Math.random() * 1000)}@example.com`,
      posts: Array.from({ length: Math.floor(Math.random() * 10) }, (_, i) => ({
        id: Date.now() + i,
        title: `Post ${i}`,
        content: `Content for post ${i}`.repeat(10)
      }))
    }
    updateNestedState('addUser', user)
  }
  
  return (
    <div style={{ padding: '20px', border: '2px solid #9c88ff', borderRadius: '8px', margin: '10px 0' }}>
      <h3>复杂状态组件</h3>
      <p>用户数量: {complexState.users.length}</p>
      <p>当前主题: {complexState.metadata.settings.theme}</p>
      <p>版本: {complexState.metadata.version}</p>
      <p>最后更新: {complexState.metadata.lastUpdated || '从未'}</p>
      
      <div style={{ marginTop: '15px' }}>
        <button 
          onClick={addRandomUser}
          style={{
            padding: '8px 16px',
            backgroundColor: '#9c88ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          添加随机用户
        </button>
        
        <button 
          onClick={() => updateNestedState('theme', 
            complexState.metadata.settings.theme === 'light' ? 'dark' : 'light'
          )}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff8a80',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          切换主题
        </button>
      </div>
      
      <div style={{ marginTop: '15px', maxHeight: '150px', overflowY: 'auto' }}>
        {complexState.users.map(user => (
          <div key={user.id} style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
            {user.name} - {user.posts.length} 篇文章
          </div>
        ))}
      </div>
    </div>
  )
}
