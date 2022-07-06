const express = require('express')
const app = express()


const calculateSplit = (req,res,next) => {

    console.log(req.body)

    var SplitBreakdown = []
    
    const INITIAL_AMOUNT = req.body.Amount
    var currentAmount = INITIAL_AMOUNT
    var balance = currentAmount

    var totalRatio = 0


    const flats = req.body.SplitInfo.filter((info) => info.SplitType === 'FLAT')
    const percentages = req.body.SplitInfo.filter((info) => info.SplitType === 'PERCENTAGE')
    const ratios = req.body.SplitInfo.filter((info) => info.SplitType === 'RATIO')

    flats.forEach((flat) => {
        const returnValue = calculateFlats(currentAmount,flat.SplitValue)
        currentAmount = balance = returnValue.balance
        SplitBreakdown.push({SplitEntityId:flat.SplitEntityId,Amount:returnValue.amount})
    })


    percentages.forEach((percentage) => {
        const returnValue = calculatePercentages(currentAmount,percentage.SplitValue)
        currentAmount = balance = returnValue.balance
        SplitBreakdown.push({SplitEntityId:percentage.SplitEntityId,Amount:returnValue.amount})
    })

    ratios.forEach((ratio) => {
        totalRatio += ratio.SplitValue
    })

    ratios.forEach((ratio) => {
        const returnValue = calculateRatios(currentAmount,balance,ratio.SplitValue,totalRatio)
        balance = returnValue.balance
        SplitBreakdown.push({SplitEntityId:ratio.SplitEntityId,Amount:returnValue.amount})

    })

    // console.log(INITIAL_AMOUNT)
    // console.log(currentAmount)
    // console.log(balance)

    req.Balance = balance
    req.SplitBreakdown = SplitBreakdown
    next()
}

const calculateFlats = (amount,splitValue) => {
    return {balance:amount - splitValue,amount:splitValue}
}

const calculatePercentages = (amount,splitValue) => {
    var splitAmount = ((splitValue/100) * amount)
    return {balance:(amount - splitAmount),amount:splitAmount}
}


const calculateRatios = (amount,balance,splitValue,totalRatio) => {
    var splitAmount = ((splitValue/totalRatio) * amount)
    return {balance:(balance - splitAmount),amount:splitAmount}
}


module.exports = calculateSplit