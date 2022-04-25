import { spawn } from "child_process";
import createServer from "./server/http";
import "colors";

import Convert from "ansi-to-html";

import { loader, remove, saver } from "@otox/saver";

import ws from "ws";
import logger from "../logger";

const log = new logger();
const convert = new Convert({});

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
    // console.log(command);
    if (command === undefined) {
      remove(process.cwd());
      const dt = [`[otox] running: > ${commands} ${args.join(" ")}`.gray, ""];
      ws.send(JSON.stringify({ message: "run", data: date }));
      ws.send(
        JSON.stringify({
          message: "log",
          data: convert.toHtml(dt[0]),
        })
      );
      ws.send(
        JSON.stringify({
          message: "log",
          data: dt[1],
        })
      );
      saver(process.cwd(), dt[0]);
      saver(process.cwd(), dt[1]);
      console.log("[INFO]".green + " starting program..\n");
      command = spawn(commands, args, {
        shell: true,
      });
      // console.log(command);
    } else {
      // console.log("[INFO]".green + " loading program..");
      loader(process.cwd()).forEach((line) => {
        ws.send(JSON.stringify({ message: "log", data: convert.toHtml(line) }));
      });
    }
    if (command) {
      command.stdout.on("data", (data) => {
        log.push(data.toString());
        saver(process.cwd(), data.toString());
        ws.send(
          JSON.stringify({
            message: "log",
            data: convert.toHtml(data.toString()),
          })
        );
      });

      command.stderr.on("data", (data) => {
        log.push(data.toString());
        saver(process.cwd(), data.toString());
        ws.send(
          JSON.stringify({
            message: "log",
            data: convert.toHtml(data.toString()),
          })
        );
      });

      command.on("close", () => {
        log.push(`\n[otox] program exited`.gray);
        saver(process.cwd(), "");
        saver(process.cwd(), `[otox] program exited`.gray);
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
      });
    }

    ws.on("message", (message) => {
      const data = JSON.parse(message.toString());
    });
  });
}

// run(3000);
