var express = require("express")
var Sequelize = require("sequelize")
var bodyParser = require("body-parser")
var request = require("request")

var app = express()

app.use(express.static(__dirname))
app.use(bodyParser.json())

var sequelize = new Sequelize('mydb','root', '', 
    {dialect : 'mysql', port : 3306})
    

var User = sequelize.define('user', {
    name : {
        type : Sequelize.STRING,
        allowNull : false
    },
    password : {
        type : Sequelize.STRING,
        validate: {
            len : [6,20]
        },
        allowNull : false
    },
    email : {
        type : Sequelize.STRING,
        validate : {
            isEmail : true
        }
    }
})


var Item = sequelize.define('item', {
    id :{
        primaryKey: true,
        type : Sequelize.INTEGER,
        autoIncrement: true
    },
    iName : {
        type: Sequelize.STRING,
        allowNull: false
    },
    color : {
        type : Sequelize.TEXT,
        allowNull: false
    },
    size : {
        type : Sequelize.INTEGER.UNSIGNED,
        allowNull: false
    }
})



User.hasMany(Item, {foreignKey : 'userId'})
Item.belongsTo(User, {foreignKey : 'userId'})



app.get('/createMyDb', function(req, res){
    sequelize
        .sync({force : true})
        .then(function(){
            res.status(201).send('created')
        })
        .catch(function(error){
            console.warn(error)
            res.status(500).send('not created')
        })
})


app.get('/users', function(req, res){
    User
        .findAll({attributes : ['id', 'name', 'email', 'password']})
        .then(function(users){
            res.status(200).send(users)
        })
        .catch(function(error){
            console.warn(error)
            res.status(404).send('not found')
        })
})


app.post('/users', function(req, res){
    var u = req.body
    User
        .create(u)
        .then(function(){
            res.status(201).send('created')
        })
        .catch(function(error){
            console.warn(error)
            res.status(404).send('not created')
        })
})


app.get('/users/:name',function(req, res) {
    User
        .find({where:{name:req.params.name},attributes:['id','name','password','email']})
        .then(function(user){
            res.status(200).send(user)
        }).catch(function(error){
            console.warn(error)
            res.send(500).send('not created')
        })
})


app.put('/users/:id', function(req, res){
    User
        .find({where : {name : req.params.id}})
        .then(function(user){
            user.updateAttributes(req.body)
        })
        .then(function(){
            res.status(200).send('updated')
        })
        .catch(function(error){
            console.warn(error)
            res.status(404).send('not found')
        })
})


app.delete('/users/:id', function(req,res){
    var id=req.params.id
    User
        .find({where : {id : id}})
        .then(function(user){
            user.destroy()
        })
        .then(function(){
            res.status(200).send('updated')
        })
        .catch(function(error){
            console.warn(error)
            res.status(500).send('not updated')
        })
})


app.get('/users/:name/items', function(req, res) {
	var name = req.params.name
	User
		.find({where : {name : name}, include : [Item]})
		.then(function(user){
			return user.getItems()
		})
		.then(function(items){
			console.warn(items)
			res.status(200).send(items)
		})
		.catch(function(error){
			console.warn(error)
			res.status(500).send('error')
		})
})


app.post('/users/:name/items', function(req, res){
  var name=req.params.name
  User
    .find({where: {name: name}})
    .then(function(user){
        if(user){
            return Item.create({
                iName: req.body.iName,
                color: req.body.color,
                size: req.body.size,
                userId: user.id
            })
        }
    })
    .then(function(){
        res.status(201).send('created')
    })
    .catch(function(error){
        console.warn(error)
        res.status(500).send('error')
    })
})


app.put('/users/:name/items/:id', function(req, res) {
    var name = req.params.name
    var id = req.params.id
    User
        .find({where : {name : name}})
        .then(function(user){
            if(user){
                Item
                    .find({where : {id: id}})
                    .then(function(item){
                        item.updateAttributes(req.body)
                    })
                    .then(function(){
                        res.status(200).send('updated')
                    })
                    .catch(function(error){
                        res.status(500).send(error)
                    })
            }
        })
        .then(function(){
            res.status(200).send('updated')
        })
        .catch(function(error){
            console.warn(error)
            res.status(404).send('not found')
        })
})

app.delete('/users/:name/items/:id', function(req, res) {
    var name = req.params.name
    var id = req.params.id
    User
        .find({where : {name : name}})
        .then(function(user){
            if(user){
                Item
                    .find({where : {id: id}})
                    .then(function(item){
                        item.destroy()
                    })
                    .then(function(){
                        res.status(200).send('updated')
                    })
                    .catch(function(error){
                        res.status(500).send(error)
                    })
            }
        })
        .then(function(){
            res.status(200).send('updated')
        })
        .catch(function(error){
            console.warn(error)
            res.status(404).send('not found')
        })
})


app.listen(8080)