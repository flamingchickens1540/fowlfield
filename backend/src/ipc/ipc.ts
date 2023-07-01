import child_process from 'child_process';
import {dirname, join} from 'path'
import { IPCData, IPCMessage, IPCMatch, DriverStation } from '@fowltypes';


interface IPCHandlers {
    dsStatus:(data:IPCData["ds_status"]) => void;
}

export class IPCClient {
    private child:child_process.ChildProcess;
    private listeners:{[event:string]:(message:IPCMessage) => void} = {}
    
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
        
        this.child.on("message", (msg, _handle) => {
            this.handleMessage(msg as IPCMessage)
        })
    }
    
    private sendMessage(message:IPCMessage) {this.child.send(message)}
    private send(cmd:string, data:IPCData) {this.sendMessage({cmd, data})}
    
    private handleMessage(message:IPCMessage) {
        const listener = this.listeners[message.cmd];
        if (listener != null) {
            listener(message)
            return;
        }
        
        switch (message.cmd) {
            case "dsStatus": this.handlers.dsStatus(message.data.ds_status!); break;
            default: console.warn("unhandled message",message)
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
    estop(station:DriverStation) {
        this.send('estop', {alliancestation:station});
    }
    
    async awaitResponse(commands:string[], timeout:number=100):Promise<IPCMessage> {
        let promises:Promise<IPCMessage>[] = []
        for (let command of commands) {
            let cb:(data:IPCMessage) => void;
            promises.push(new Promise((resolve) => {
                cb = (data) => resolve(data)
            }))

            this.listeners[command] = cb
        }
        promises.push(new Promise(function(_resolve, reject){
            setTimeout(() => reject('Timed out'), timeout);
        }));
        return Promise.race(promises)
    }
}