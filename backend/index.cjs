var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/ipc.ts
var import_child_process = __toESM(require("child_process"), 1);
var import_path = require("path");
var client = null;
function createIPC(handlers) {
  console.log("creating");
  if (client == null) {
    client = new IPCClient(handlers);
  }
  console.log("created");
  return client;
}
var IPCClient = class {
  constructor(handlers) {
    this.handlers = handlers;
    this.child = import_child_process.default.spawn("go", ["run", "."], {
      stdio: [0, 1, 2, "ipc"],
      cwd: (0, import_path.join)((0, import_path.dirname)((0, import_path.dirname)(__filename)), "field")
    });
    this.child.on("close", (code) => {
      process.exit(code ?? 1);
    });
    this.child.on("message", (msg, handle) => {
      this.handleMessage(msg);
    });
  }
  child;
  sendMessage(message) {
    this.child.send(message);
  }
  send(cmd, data) {
    this.sendMessage({ cmd, data });
  }
  handleMessage(message) {
    switch (message.cmd) {
      case "dsStatus":
        this.handlers.dsStatus(JSON.parse(message.data));
        break;
    }
  }
  load(data) {
    this.send("load", JSON.stringify(data));
  }
  start(data) {
    this.send("start", JSON.stringify(data));
  }
};

// src/index.ts
var ipc = createIPC({
  dsStatus(data) {
    console.log(data);
  }
});
ipc.load({
  id: "Abc",
  matchNumber: 1,
  elimRound: -1,
  elimGroup: -1,
  elimInstance: -1,
  type: "qualification",
  red1: 0,
  red2: 0,
  red3: 0,
  blue1: 0,
  blue2: 0,
  blue3: 0
});
console.log("starting");
