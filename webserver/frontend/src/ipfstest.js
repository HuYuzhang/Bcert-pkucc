//const ipfsClient = require('ipfs-http-client')
//const ipfs = ipfsClient('http://localhost:5001')

const ipfsAPI = require('ipfs-api')
const ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})
const buffer = Buffer.from('this is a demo')
ipfs.add(buffer)
    .then( rsp => console.log(rsp[0].hash))
.catch(err => console.error(err))

//console.log('从ipfs读取数据。')
/* pdf QmZV2wA363rM8Sk4mpKXYS988oCjurjYau1LWNJvMZSu2h*/
/* readme QmU7mDpFvqDBvQ2pSbdCuF9BEHdd9h8kykjQWLD1FRxfFG*/
//var hash = 'QmZV2wA363rM8Sk4mpKXYS988oCjurjYau1LWNJvMZSu2h'
//var res = ipfs.add('intro.jpg')
//console.log(res)
        

