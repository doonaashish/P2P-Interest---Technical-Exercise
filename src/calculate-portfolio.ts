import csv from 'csv-parser';
import fs from 'fs';
import { Holding, Portfolio, Rates } from "./types/models";
import { PROMO_RATE } from './utils/constants';

const getHoldings = async (): Promise<Holding[]> => {
    const data: Holding[] = [];

    return new Promise(function (resolve, reject) {
        fs.createReadStream('./assets/holdings.csv')
            .pipe(csv({ headers: false }))
            .on('error', error => reject(error))
            .on('data', row => data.push({
                accountId: row[1],
                balance: row[2],
                investorId: row[0]
            }))
            .on('end', () => {
                resolve(data);
            });
    });
}

const getRates = async (): Promise<Rates[]> => {
    const data: Rates[] = [];

    return new Promise(function (resolve, reject) {
        fs.createReadStream('./assets/rates.csv')
            .pipe(csv({ headers: false }))
            .on('error', error => reject(error))
            .on('data', row => data.push({
                accountId: row[0],
                rate: row[1]
            }))
            .on('end', () => {
                resolve(data);
            });
    });
}

function getSum(a: number, b: number) {
    return (+a + +b);
}

export const CalculatePortfolio = async (): Promise<Portfolio[]> => {
    const result: Portfolio[] = [];
    const holdings: Holding[] = await getHoldings();
    const ratesData: Rates[] = await getRates();
    
    let balance = 0;
    for (const holding of holdings) {
        balance = 0;
        if (result.filter(e => e.investorId === holding.investorId).length <= 0) {
            const investorId = holding.investorId;
            const investorHoldings = holdings.filter(x => x.investorId === investorId).sort((a, b) => b.balance - a.balance);
            for (let index = 0; index < investorHoldings.length; ++index) {
                let accountRate = ratesData.filter(rate => rate.accountId === investorHoldings[index].accountId)[0].rate;
                if (index === 0) {
                    accountRate = getSum(accountRate, PROMO_RATE);
                }
                const tempBalance = getSum(investorHoldings[index].balance, accountRate * investorHoldings[index].balance);
                balance = getSum(balance, tempBalance);
            }
            result.push({
                investorId: holding.investorId,
                value: balance,
            })
        }
    }

    return result;
}