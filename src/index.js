const fs = require('fs');

const dataSales = fs.readFileSync("sales.csv", "utf8")
const dataCashback = fs.readFileSync("cashback.csv", "utf8")

outputSales()

function getCashbackData(saleDate) {
    const cashbacks = dataCashback.split("\r\n").slice(1) // split lines
    const timeLimit = 5000 // milliseconds
    var cashbackData = []

    for (let i in cashbacks) {
        fields = cashbacks[i].split(";") // split fields
        cashbackTime = new Date(fields[2])
        const diff = cashbackTime - saleDate


        if (diff <= timeLimit && diff > 0) {
            cashbackData = fields
            return cashbackData
        }
    }
    return cashbackData
}

function calculateBitcoin(saleAmount, cashbackAmount) {
    rewardsRate = 0.005 // 0,5% of cashback
    cashbackReais = saleAmount*rewardsRate
    bitcoin = cashbackReais/cashbackAmount
    return bitcoin
}

// for each sale checks if there is an associated cashback
// then outputs the sale's data with or without the cashback data
function outputSales() {
    const sales = dataSales.split("\r\n").slice(1) // splits the lines of the file and removes the first one

    for (let i in sales) {
        fields = sales[i].split(";") // splits the fields in each sale

        saleId  = fields[0]
        saleAmount = fields[1]/100 // cents to reais
        saleDate = new Date(fields[2])
        
        cashbackData = getCashbackData(saleDate)
        saleDate = saleDate.toISOString() // reformats the sale's date to ISO8601 after getting the cashback's data 

        // in case the chashback data array is empty return the fields as nulll
        // else if the cashback data is filled, calculates btc's price and the amount of cashback in btc 
        if (cashbackData.length === 0) {
            cashbackData = null

            console.log(
                "ID: " + saleId,
                "\ntimestamp: " + saleDate,
                "\namount: R$" + saleAmount.toFixed(2),
                "\ncashback: " + cashbackData,
                "\n"
            )

        } else {

            cashbackId = cashbackData[0]
            cashbackAmount = cashbackData[1]/100000000 // 10^8 BTC = 1 satoshi
            cashbackDate = cashbackData[2]

            console.log(
                "ID: " + saleId,
                "\ntimestamp: " + saleDate,
                "\namount: R$" + saleAmount.toFixed(2),
                "\ncashback: ",
                "\n{ID: " + cashbackId,
                "\ntimestamp: " + cashbackDate,
                "\namount: " + cashbackAmount + " BTC",
                "\nBitcoin Price: R$" + calculateBitcoin(saleAmount, cashbackAmount).toFixed(2) + "}",
                "\n"
            )
        }
    }
}