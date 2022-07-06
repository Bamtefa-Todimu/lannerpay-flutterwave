const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const split = require('./middleware/split')


app.use(bodyParser.json())



app.get('/',(req,res) => {
    res.status(200).json({
        message : 'Server is up and running'
    })
})


app.post('/split-payments/compute',split,(req,res) => {
    res.status(200).json({ID:req.body.ID,Balance:req.Balance,SplitBreakdown:req.SplitBreakdown})
})


const port = process.env.PORT || 5000


app.listen(port,() => {
    console.log(`*** Server listening on port ${port} 🔥🔥 ***`)
})