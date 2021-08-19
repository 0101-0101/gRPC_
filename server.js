const grpc  = require("@grpc/grpc-js")
const PROTO_PATH = "./news.proto"
var protoLoader = require("@grpc/proto-loader")

require('dotenv').config()
const connectDB = require('./db')
connectDB();

const News = require('./news.model')



// const {MongoClient} = require('mongodb');
// // const client = new MongoClient(process.env.MONGO_URI);

// MongoClient.connect( process.env.MONGO_URI,(err,client)=>{
//     if(!err) {
//         console.log("successful connection with the server");  
//     }
//     else
//         console.log("Error in the connectivity");
// })

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  };

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const newsProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
// let news = [
//   { id: "1", title: "Note 1", body: "Content 1", postImage: "Post image 1" },
//   { id: "2", title: "Note 2", body: "Content 2", postImage: "Post image 2" },
// ];

// server.addService(newsProto.NewsService.service, {
//   getAllNews: (_, callback) => { callback(null, {news} ); },
//   addNews: (call, callback ) => {
//     const _news = { id: Date.now() ,...call.request };
//     news.push(_news);
//     callback(null , {_news});
//   }
// });

server.addService(newsProto.NewsService.service, {
  getAllNews: async (_, callback) => {
    const news = await News.find({})
    console.log(news)
    callback(null, {news});
  },
  getNews: async (_, callback) => {
    const newsId = _.request.id;
    // const newsItem = news.find(({ id }) => newsId == id);
    const newsItem =  await News.findById(newsId)
    callback(null, {newsItem});
  },
  deleteNews: async (_, callback) => {
    const newsId = _.request.id;
    // news = news.filter(({ id }) => id !== newsId);
    const newsItem =  await News.findByIdAndDelete(newsId)
    callback(null, {});
  },
  editNews: async (_, callback) => {
    const newsId = _.request.id;
    // const newsItem = news.find(({ id }) => newsId == id);
    // newsItem.body = _.request.body;
    // newsItem.postImage = _.request.postImage;
    // newsItem.title = _.request.title;

    const newsItem = await News.findByIdAndUpdate(newsId, {title:_.request.title,body:_.request.body,postImage:_.request.postImage}, {new: true})


    callback(null, {newsItem});
  },
  addNews: async (call, callback) => {
    let _news = { id: Date.now(), ...call.request };
    let val= await new News(_news)
    val.save()
    // news.push(_news);
    callback(null, {_news});
  },
});

server.bindAsync(
  process.env.PORT,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at http://127.0.0.1:50051");
    server.start();
  }
);

// const PROTO_PATH = "./news.proto"

// var grpc = require('@grpc/grpc-js');
// var protoLoader = require('@grpc/proto-loader');
// var packageDefinition = protoLoader.loadSync(
//     PROTO_PATH,
//     {keepCase: true,
//      longs: String,
//      enums: String,
//      defaults: true,
//      oneofs: true
//     });
// var hello_proto = grpc.loadPackageDefinition(packageDefinition);

// /**
//  * Implements the SayHello RPC method.
//  */
// function sayHello(call, callback) {
//   callback(null, {message: 'Hello ' + call.request.name});
// }

// /**
//  * Starts an RPC server that receives requests for the Greeter service at the
//  * sample server port
//  */
// function main() {
//   var server = new grpc.Server();
//   server.addService(hello_proto.Greeter.service, {sayHello: sayHello});
//   server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
//     console.log("Server running at 0.0.0.0:50051")
//     server.start();
//   });
// }

// main();

