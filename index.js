const  { Server } = new require('node-osc');
const OBSWebSocket = new require('obs-websocket-js') 
const obs_config = new require('obs-websocket-js') 

const obs = new OBSWebSocket();
obs.connect({
        address: 'localhost:4444',
        password: 'pavaga'
    }).then(() => {
        console.log(`Connected to OBS`)
    })

var oscServer = new Server(3333, '0.0.0.0', () => {
        console.log('OSC Server is listening');
    });


oscServer.on('message', function (msg) {
    keys = msg[0].split("/").slice(1)
    switch (keys[0]) {
        case 'scene':
            parse_scene(msg)
            break;
        // case 'transition':
        //     parse_transition(msg)
        default:
            console.log("Invalid OSC");
            break;
    }
});

function parse_scene(msg) {
    keys = msg[0].split("/").slice(2)
    switch (keys[0]) {
        case 'select':
            result = obs.send('SetCurrentScene', {
                    'scene-name': msg[1]
                })
            result.catch(() => {
                console.log(`Invalid scene name`);      
            });
            break;
        default:
            break;
    }
}

// function parse_transition(msg) {
//     keys = msg[0].split("/").slice(2)
//     switch (keys[0]) {
//         case 'go':
//             result = obs.send('TransitionBegin', {
//                     'name': msg[1],
//                     'type': 'Stringer',
//                     'duration': -1
//                 })
//             result.catch(() => {
//                 console.log(msg[1]);
                
//                 console.log(`Invalid transition name`);      
//             });
//             break;
//         default:
//             break;
//     }
// }

// You must add this handler to avoid uncaught exceptions.
obs.on('error', err => {
    console.error('socket error:', err);
});