import child_process from 'child_process';
import {dirname, join} from 'path'
import { IPCData, IPCMessage, IPCMatch } from '@fowltypes';


interface IPCHandlers {
  dsStatus:(data:IPCData["ds_status"]) => void;
}

export class IPCClient {
  private child:child_process.ChildProcess;
  
  constructor(private handlers:IPCHandlers) {
    
    this.child = child_process.spawn('go', ['run', '.'], {
      stdio: [0, "pipe", 2, 'ipc'],
      cwd: join(dirname(dirname(__filename)), "field")
    });
    let ipcStdout = ''
    this.child.stdout!.on('data', function (chunk) {
      ipcStdout += chunk
      const lines = ipcStdout.split('\n')
      while(lines.length > 1) {
        const line = lines.shift()
        console.log('[GO]',line)
      }
      ipcStdout = lines.shift() ?? ""
    })
    this.child.stdout!.on('end', function () {
      console.log('[GO]', ipcStdout)
    })
    
    this.child.on('close', (code) => {
      process.exit(code??1);
    });
    
    this.child.on("message", (msg, handle) => {
      this.handleMessage(msg as IPCMessage)
    })
  }
  
  private sendMessage(message:IPCMessage) {this.child.send(message)}
  private send(cmd:string, data:IPCData) {this.sendMessage({cmd, data})}
  
  private handleMessage(message:IPCMessage) {
    switch (message.cmd) {
      case "dsStatus": this.handlers.dsStatus(message.data.ds_status!); break;
    }
  }
  
  load(data:IPCMatch) {
    this.send('load', {match:data});
  }
  
  start(data:IPCMatch) {
    this.send('start', {match:data});
  }

  abort() {
    this.send('abort', {});
  }
}
