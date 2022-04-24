import http from "http";
export default class server {
  port;

  constructor(port: number) {
    this.port = port;
  }

  start() {
    const server = http.createServer((req, res) => {
      if (req.url === "/core.js") {
        res.writeHead(200, { "Content-Type": "text/javascript" });
        res.end(
          `const ws = new WebSocket('ws://localhost:${this.port}');const send = (data) => ws.send(JSON.stringify(data));ws.onopen = (event) => {window.setStatus(0);send({message: "connect"})}
  /*handle*/
  ws.onmessage = (event) => {let data = JSON.parse(event.data);if (data.message === "log"){ window.otoxPushData(data.data); }else if (data.message === "run") {
    window.setRunningTime(data.data);
  }
  
  ws.onclose = (event) => {send({message: "disconnect"})}

  setInterval(() => {if (ws.readyState === WebSocket.CLOSED) {
    window.setStatus(1);
 } else {window.setStatus(0)}}, 500)};
  `
        );
      } else if (req.url === "/static.js") {
        res.writeHead(200, { "Content-Type": "text/javascript" });
        res.end(`
  /*define*/
  const e = document.getElementById("__otox");
  const connection = document.getElementById("__otox_connection");

  let counter = 0;
  window.otoxPushData = (data) => {
    counter += 1;
    var elcontainer = document.createElement("div");
    var el = document.createElement("div"); // line number
    var ele = document.createElement("div"); // content
    elcontainer.setAttribute("id", "otox-container");
    el.setAttribute("id", "otox-line");
    el.innerText = counter;
    ele.innerHTML = data.replace(/\\n/g, "<br />");
    ele.className = "otox-log";

    elcontainer.appendChild(el);
    elcontainer.appendChild(ele);
    e.appendChild(elcontainer);
    
    console.log(e.scrollTop,e.scrollHeight - e.clientHeight);
    if (e.scrollTop > e.scrollHeight - e.clientHeight - 50) { e.scrollTop = e.scrollHeight; }
  }
  window.setStatus = (status) => {
    if (status === 1 && connection.innerText !== "disconnected") {
      connection.innerText = "disconnected";
    } else if (status === 0 && connection.innerText !== "connected") {
      connection.innerText = "connected";
    }
  }

  window.setRunningTime = (time) => {
    const el = document.getElementById("__otox_running");
    el.innerText = new Date(time).toLocaleString();
  }

  `);
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          `<!DOCTYPE html><html><head><style>
          @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300&display=swap');
          html,
          body {
            margin: 0;
            width: 100%;
            height: 100%;
            font-family: 'Rubik', sans-serif;
          }
          #otox-container {display:flex}
          #otox-container:hover #otox-line {
            color: #e8ebed;
          }
          #__otox::-webkit-scrollbar {
            width: 10px;
            height: 95%;
          }
          a {
            color: inherit;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          #__otox::-webkit-scrollbar-track {
            display: none;
            margin-top: 5px;
            margin-bottom: 5px;
            margin-right: 5px;
          }
          #__otox::-webkit-scrollbar-thumb {
            background-color: #545454;
            border-radius: 10px;
          }
          #__otox{  overflow-x: hidden; /* Hide horizontal scrollbar */
          
          background-color: #151a1e;
          color: #f9fafa;
          width: 95%;
          margin: 10px auto;
          border-radius: 7px;
          padding: 30px 10px;

            font-family: "Lucida Console", "Courier New", monospace;font-size: 0.8rem; 
            height: 65%;overflow-y: scroll;}
#otox-line{vertical-align: middle;

              -moz-user-select: none;
              -khtml-user-select: none;
              -webkit-user-select: none;
              -ms-user-select: none;
              user-select: none;width: 35px;padding-right: 5px;text-align: right;color: #a4a8ad;}
            .otox-log{vertical-align: middle;
              word-wrap:break-word;width: 100%;padding: 0px 25px 2px;margin: 0 auto;border-left: 2px solid #676c6f;}
              background-color: #151a1e;border-radius: 2px;}.otox-log:hover{background-color: #34383c;}</style>
<meta charset="utf-8"><title>otox</title></head>

<div id="__otox_status">
<div class="st">
status: <span id="__otox_connection" style="font-weight: bold;">connected</span></div>
<div class="st">
running time: <span style="font-weight: bold;" id="__otox_running"></span></div>
</div>
</div>
<body><div id="__otox"></div>
<style>
#__otox_status {
  width: 95%;
  margin: 10px auto;
  display: flex;
}
.st {
  margin-left: 20px;
}
</style>
<script src="/static.js"></script><script src="/core.js"></script>
</body></html>`
        );
      }
    });

    server.listen(this.port);

    return server;
  }
}
