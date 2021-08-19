const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "./news.proto";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const NewsService = grpc.loadPackageDefinition(packageDefinition).NewsService;

const client = new NewsService(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

client.getAllNews({}, (error, news) => {
// if (!error) throw error
    console.log(news);
});

// add a news
client.addNews(
  {
    title: "Title news 3",
    body: "Body content 3",
    postImage: "Image URL here",
  },
  (error, news) => {
    // if (error) throw error;
    console.log("Successfully created a news.");
  }
);

// edit a news
client.editNews(
  {
    id: 2,
    body: "Body content 2 edited.",
    postImage: "Image URL edited.",
    title: "Title for 2 edited.",
  },
  (error, news) => {
    // if (error) throw error;
    console.log("Successfully edited a news.");
  }
);

client.getAllNews({}, (error, news) => {
  // if (!error) throw error
      console.log(news);
  });

// delete a news
client.deleteNews(
  {
    id: 2,
  },
  (error, news) => {
    if (error) throw error;
    console.log("Successfully deleted a news item.");
  }
);

// const PROTO_PATH = "./news.proto";

// var parseArgs = require('minimist');
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

// function main() {
//   var argv = parseArgs(process.argv.slice(2), {
//     string: 'target'
//   });
//   var target;
//   if (argv.target) {
//     target = argv.target;
//   } else {
//     target = 'localhost:50051';
//   }
//   var client = new hello_proto.Greeter(target,
//                                        grpc.credentials.createInsecure());
//   var user;
//   if (argv._.length > 0) {
//     user = argv._[0]; 
//   } else {
//     user = 'world';
//   }
//   client.sayHello({name: user}, function(err, response) {
//     console.log('Greeting:', response.message);
//   });
// }

// main();




  




  