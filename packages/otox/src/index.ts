import { spawn } from "child_process";
import createServer from "./server/http";
import "colors";

import Convert from "ansi-to-html";

import ws from "ws";

const convert = new Convert();

export default function run(port: number, commands: string, args: string[]) {
  const server = new createServer(port);

  const svr = server.start();

  console.log(
    `server running on: ${
      `http://localhost:${(svr.address() as any).port}`.green.bold
    }`
  );

  const wss = new ws.Server({ server: svr });
  let command;
  let date = new Date();
  wss.on("connection", (ws: ws) => {
    if (command === undefined) {
      console.log("[INFO]".green + " starting program..");
      command = spawn(commands, args, {
        shell: true,
      });
    }
    if (command) {
      command.stdout.on("data", (data) => {
        ws.send(
          JSON.stringify({
            message: "log",
            data: convert.toHtml(data.toString()),
          })
        );
      });

      command.stderr.on("data", (data) => {
        ws.send(
          JSON.stringify({
            message: "log",
            data: convert.toHtml(data.toString()),
          })
        );
      });

      command.on("close", () => {
        ws.send(
          JSON.stringify({
            message: "log",
            data: "",
          })
        );
        ws.send(
          JSON.stringify({
            message: "log",
            data: convert.toHtml(`[otox] program exited`.gray),
          })
        );
        command = undefined;
      });
    }

    ws.on("message", (message) => {
      const data = JSON.parse(message.toString());
      ws.send(JSON.stringify({ message: "run", data: date }));
      ws.send(
        JSON.stringify({
          message: "log",
          data: convert.toHtml(
            `[otox] running: > ${commands} ${args.join(" ")}`.gray
          ),
        })
      );
      ws.send(
        JSON.stringify({
          message: "log",
          data: "",
        })
      );
    });
  });
}

// run(3000);
