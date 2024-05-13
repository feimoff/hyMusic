export default function querySelect(selector,_thisIns) {
  return new Promise(resolve => {
    // 在封装createSelectorQuery()函数时
    // 需要注意传递当前的组件实例对象
    // 如果用wx进行调用，会获取不到
    const query = _thisIns.createSelectorQuery()
    query.select(selector).boundingClientRect()
    query.exec((res) => {
      resolve(res)
    })
  })
}
