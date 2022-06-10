var express = require('express');
var path = require('path')
var router = express.Router();

let bodyParser = require('body-parser')
let urlencodedParser = bodyParser.urlencoded({ extended: false })

let userModel = require("./../models/userSchema");
// const { path } = require('../app');

/* GET users listing. */
router.get('/', function (req, res, next) {
  // res.send('respond with a resource');
  res.sendfile(path.join(__dirname + "../../views/login.html"))
});


//显示用户列表功能
router.get('/list', (req, res) => {
  // res.render('users',{ userlist:[] });
  // 第一步：
  // res.render('users',{ userlist:[{"username":"123","password":"456"}] });
  // 第二步:
  userModel.find((err, result) => {
    //console.log(result)
    //{layout:false}
    res.render('users', { userlist: result });
  })
});

//添加功能
router.get('/add', (req, res) => {
  let where = { username: req.body.username }
  userModel.findOne(where, (err, result) => {
    if (result == null) {
      //1、添加的对象
      var duixiang = new userModel(req.body)
      //2、向数据库添加
      duixiang.save((err, result) => {
        if (err) throw err
        console.log("添加成功");
        userModel.find((err, result) => {
          //console.log(result)
          //{layout:false}
          res.render('users', { userlist: result });
        })
      })
    }
    else {
      //返回注册页面  告知 该用户已存在
      res.redirect('/register')
    }
  })
})

//删除功能   根据id删除
router.get('delete', urlencodedParser, (req, res) => {
  //1、删除的条件
  var where = {
    _id: require('mongodb').ObjectId(req.body._id)
  }
  //2、向数据库删除
  duixiang.deleteOne(where, (err, result) => {
    if (err) throw err
    console.log("删除成功");
    //查询新的用户信息   并显示在users.hbs文件中
    userModel.find((err, result) => {
      res.render('users', { userlist: result });
    })
  })
})


//修改功能   根据id修改用户名  密码
router.get('update', urlencodedParser, (req, res) => {
  //1、删除的条件
  var where = {
    _id: require('mongodb').ObjectId(req.body._id),
    username: req.body.username,
    password: req.body.password,
    type: req.body.type
  }
  //2、向数据库删除
  duixiang.updateOne(where, (err, result) => {
    if (err) throw err
    console.log("修改成功");
    //查询新的用户信息   并显示在users.hbs文件中
    userModel.find((err, result) => {
      //console.log(result)
      //{layout:false}
      res.render('users', { userlist: result });
    })
  })
})

//登录功能
router.post("/login", urlencodedParser, (req, res) => {
  let where = req.body
  userModel.findOne(where, (err, result) => {
    if (result == null) {
      console.log('查询失败');
      res.redirect("/")
      // res.sendfile(path.join(__dirname,'../../views/login.html'))
    }
    else {
      console.log("查询成功");
      res.redirect('/home')
      // res.sendfile(path.join(__dirname,"../../views/home.html"))
    }
  })
})

module.exports = router;
