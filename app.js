const path =require('path');
const Koa = require('koa');
const Router = require("koa-router");
const bodyParser = require('koa-bodyparser');

// 连接服务器
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

function _connect(callback) {
    MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
        if(err) throw err;
        callback(client);
    })
}


const app = new Koa();
let router = new Router();

const dbName='test';
const obj ={};
// obj.find = async function(cname,filter,fn){
//     let obj ={}
//     await _connect(async function(client){
//         const col = client.db(dbName).collection(cname);
//        await col.find(filter).toArray(function(err,docs) {
//             client.close();
//             console.log('时间哈哈哈',docs)
//             obj =docs;
//         })
//     })
//     return obj;
// }
// obj.find = function(cname,filter,fn){

//     return Promise((resolve, reject)=>{
//         _connect(function(client){
//             const col = client.db(dbName).collection(cname);
//             col.find(filter).toArray(function(err,docs) {
//                 client.close();


//                 fn(err,docs);
//             })
//         })
//     })
// }


obj.find = function(cname,filter,fn){

    return new Promise((resolve, reject)=>{
        _connect(function(client){
            const col = client.db(dbName).collection(cname);
            col.find(filter).toArray(function(err,docs) {
                resolve(docs);
                if(err){
                    reject(err)
                }
                client.close();
            })
        })
    })
}

 function    sleep(time){
     return new Promise((resolve)=>{
         setTimeout(() => {
             resolve()
         }, time * 1000);
     })
}
router.get('/',async ctx => {
    const findData = await obj.find('test',{name:"jack01"});
    await sleep(1)
    ctx.response.body={
        code:'1',
        data: findData
    }
})
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)