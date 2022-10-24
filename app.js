const express = require('express')
const app = express()

const Mock = require('mockjs') // mock

// 解决跨域
const cors = require('cors')
app.use(cors())

// 解析中间件
const bodyParse = require('body-parser')
app.use(bodyParse.json())

// 登陆
app.post('/login', (req, res) => {
  let { username, password } = req.body
  if (username === 'admin' && password === '12345') {
    // admin
    res.json({
      data: {
        token: 'admin-token',
      },
      menu: {
        status: 200,
        message: '登陆成功',
      },
    })
  } else if (username === 'root' && password === '12345') {
    // root
    res.json({
      data: {
        token: 'root-token',
      },
      menu: {
        status: 200,
        message: '登陆成功',
      },
    })
  } else {
    res.json({
      menu: { code: 400, message: '账号或密码有误，请重新输入' },
    })
  }
})
// menuList
app.get('/menu', (req, res) => {
  // 判断 userName 菜单权限
  const token = req.headers.authorization
  const userName = token.split('-')[0]
  // console.log(userName)
  // amdin 管理员
  if (userName === 'admin') {
    // admin 有权限管理
    res.json({
      data: [
        {
          id: '01',
          authName: '用户管理',
          path: null,
          icon: 'kehuguanli',
          children: [
            {
              id: '001',
              authName: '用户列表',
              path: '/users',
              icon: 'kehuliebiao',
              children: [],
            },
          ],
        },
        {
          id: '02',
          authName: '图书管理',
          path: null,
          icon: 'he_00-qingdanliebiao',
          children: [
            {
              id: '002',
              authName: '图书列表',
              path: '/books',
              icon: 'wendang',
              children: [],
            },
          ],
        },
        {
          id: '03',
          authName: '权限管理',
          path: null,
          icon: 'yinsibaohu',
          children: [
            {
              id: '003',
              authName: '权限列表',
              path: '/rights',
              icon: 'bankeliebiao',
              children: [],
            },
          ],
        },
      ],
      menu: {
        status: 200,
        message: '获取左侧菜单权限成功',
      },
    })
  } else {
    // root 无权限管理
    res.json({
      data: [
        {
          id: '01',
          authName: '用户管理',
          path: null,
          icon: 'kehuguanli',
          children: [
            {
              id: '001',
              authName: '用户列表',
              path: '/users',
              icon: 'kehuliebiao',
              children: [],
            },
          ],
        },
        {
          id: '02',
          authName: '图书管理',
          path: null,
          icon: 'he_00-qingdanliebiao',
          children: [
            {
              id: '002',
              authName: '图书列表',
              path: '/books',
              icon: 'wendang',
              children: [],
            },
          ],
        },
        // root 无权限管理
        // {
        //   id: '03',
        //   authName: '权限管理',
        //   path: null,
        //   icon: 'yinsibaohu',
        //   children: [
        //     {
        //       id: '003',
        //       authName: '权限列表',
        //       path: '/rights',
        //       icon: 'bankeliebiao',
        //       children: [],
        //     },
        //   ],
        // },
      ],
      menu: {
        status: 200,
        message: '获取左侧菜单权限成功',
      },
    })
  }
})

// mock 所需数据
let list = []
const count = 400
for (let i = 0; i < count; i++) {
  list.push({
    id: Mock.Random.id(),
    name: Mock.Random.cname(),
    address: Mock.Random.county(true),
    ip: Mock.Random.ip(),
    date: Mock.Random.datetime(),
  })
}

// 获取角色
app.get('/roles', (req, res) => {
  const { query, pagenum, pagesize } = req.query
  // console.log(query)
  const listTemp = list.filter((item) => {
    if (query) {
      return item.name.indexOf(query) !== -1
    } else {
      return true
    }
  })
  const listTemp2 = listTemp.filter((item, index) => {
    return index >= pagesize * (pagenum - 1) && index < pagesize * pagenum
  })
  res.json({
    data: { roles: listTemp2 },
    menu: {
      status: 200,
      message: '获取角色列表成功',
    },
  })
})

// 添加角色
app.post('/roles', (req, res) => {
  const { name, address, ip, date } = req.body
  // console.log(date)
  list.unshift({
    id: Mock.Random.id(),
    name: name,
    address: address,
    ip: ip,
    date: date.split('T')[0] + ' ' + '06:06:06',
  })
  res.json({
    data: {},
    menu: {
      status: 200,
      message: '角色添加成功',
    },
  })
})

// 查找角色
// app.get('/roles', (req, res) => {})

// 编辑角色
app.put('/roles', (req, res) => {
  const { id, address, ip, name, date } = req.body
  // some( )方法用于监测数组中的元素是否满足指定条件，方法会依次执行数组的每一个元素
  // 如果有一个元素满足条件，表达式返回true,剩余的元素不会再执行监测;如果没有满足条件的元素，则返回false
  // some( )不会对空数组进行监测，不会改变原来的数组
  list.some((item) => {
    if (item.id === id) {
      item.name = name
      item.address = address
      item.ip = ip
      item.date = date
      return true
    }
  }),
    res.json({
      data: {},
      menu: {
        status: 200,
        message: '角色修改成功',
      },
    })
})

// 删除角色
app.delete('/roles/:id', (req, res) => {
  const { id } = req.params
  list = list.filter((item) => item.id !== id)
  res.json({
    data: {},
    menu: {
      status: 200,
      message: '删除角色成功',
    },
  })
})

app.listen(3000)
