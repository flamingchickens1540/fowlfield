import child_process from 'child_process';
import {dirname, join} from 'path'
import { AllianceStationStatus, IPCMessage, Match } from './types';


let client:IPCClient|null = null;

export default function createIPC(handlers:IPCHandlers):IPCClient {
  if (client == null) {
    client = new IPCClient(handlers);
    
  }
  return client
}

interface IPCHandlers {
  dsStatus:(data:{[key:string]:AllianceStationStatus}) => void;
}

class IPCClient {
  private child:child_process.ChildProcess;

  constructor(private handlers:IPCHandlers) {
    
    this.child = child_process.spawn('go', ['run', '.'], {
      stdio: [0, 1, 2, 'ipc'],
      cwd: join(dirname(dirname(__filename)), "field")
    });
  
    this.child.on('close', (code) => {
      process.exit(code??1);
    });

    this.child.on("message", (msg, handle) => {
      this.handleMessage(msg as IPCMessage)
    })
  }

  private sendMessage(message:IPCMessage) {this.child.send(message)}
  private send(cmd:string, data:any) {this.sendMessage({cmd, data})}

  private handleMessage(message:IPCMessage) {
    switch (message.cmd) {
      case "dsStatus": this.handlers.dsStatus(message.data); break;
    }
  }

  load(data:Match) {
    this.send('load', data);
  }
  
  start(data:Match) {
    this.send('start', data);
  }
}
