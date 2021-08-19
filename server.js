const grpc  = require("@grpc/grpc-js")
const PROTO_PATH = "./news.proto"
var protoLoader = require("@grpc/proto-loader")

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
let news = [
  { id: "1", title: "Note 1", body: "Content 1", postImage: "Post image 1" },
  { id: "2", title: "Note 2", body: "Content 2", postImage: "Post image 2" },
];

// server.addService(newsProto.NewsService.service, {
//   getAllNews: (_, callback) => { callback(null, {news} ); },
//   addNews: (call, callback ) => {
//     const _news = { id: Date.now() ,...call.request };
//     news.push(_news);
//     callback(null , {_news});
//   }
// });

server.addService(newsProto.NewsService.service, {
  getAllNews: (_, callback) => {
    callback(null, {news});
  },
  getNews: (_, callback) => {
    const newsId = _.request.id;
    const newsItem = news.find(({ id }) => newsId == id);
    callback(null, {newsItem});
  },
  deleteNews: (_, callback) => {
    const newsId = _.request.id;
    news = news.filter(({ id }) => id !== newsId);
    callback(null, {});
  },
  editNews: (_, callback) => {
    const newsId = _.request.id;
    const newsItem = news.find(({ id }) => newsId == id);
    newsItem.body = _.request.body;
    newsItem.postImage = _.request.postImage;
    newsItem.title = _.request.title;
    callback(null, {newsItem});
  },
  addNews: (call, callback) => {
    let _news = { id: Date.now(), ...call.request };
    news.push(_news);
    callback(null, {_news});
  },
});

server.bindAsync(
  "127.0.0.1:50051",
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

