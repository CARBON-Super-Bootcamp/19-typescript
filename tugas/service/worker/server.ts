import {createServer, IncomingMessage,ServerResponse} from 'http';
import * as url from 'url';
import {stdout} from 'process';
import {
  listSvc,
  registerSvc,
  removeSvc,
  infoSvc,
  getPhotoSvc,
} from './worker.service';

let server;

function run(callback):void {


  server = createServer((req:IncomingMessage, res:ServerResponse) => {
    // cors
    const aborted = cors(req, res);
    if (aborted) {
      return;
    }

    let respond=(statusCode:number, message?):void=> {
      res.statusCode = statusCode || 200;
      res.write(message || '');
      res.end();
    }

    try {

      const uri = url.parse(req.url, true);
      switch (uri.pathname) {
        case '/register':
          if (req.method === 'POST') {
            return registerSvc(req, res);
          } else {
            respond(404);
          }
          break;
        case '/list':
          if (req.method === 'GET') {
            return listSvc(req, res);
          } else {
            respond(404);
          }
          break;
        case '/info':
          if (req.method === 'GET') {
            return infoSvc(req, res);
          } else {
            respond(404);
          }
          break;
        case '/remove':
          if (req.method === 'DELETE') {
            return removeSvc(req, res);
          } else {
            respond(404);
          }
          break;
        default:
        
          if (/^\/photo\/\w+/.test(uri.pathname)) {
            return getPhotoSvc(req, res);
          }
          respond(404);
      }
    } catch (err) {
      respond(500, 'unkown server error');
    }
  });

  // stop handler
  server.on('close', () => {
    if (callback) {
      callback();
    }
  });

  // run server
  const PORT = 7001;
  server.listen(PORT, () => {
    stdout.write(`🚀 worker service listening on port ${PORT}\n`);
  });
}

function cors(req:IncomingMessage, res:ServerResponse) {
  // handle preflight request
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }
}

function stop():void {
  if (server) {
    server.close();
  }
}


const workerServer = {
  run,
  stop,
  cors
}

export default workerServer;