"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatePortfolio = void 0;
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const constants_1 = require("./utils/constants");
const getHoldings = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = [];
    return new Promise(function (resolve, reject) {
        fs_1.default.createReadStream('./assets/holdings.csv')
            .pipe((0, csv_parser_1.default)({ headers: false }))
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
});
const getRates = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = [];
    return new Promise(function (resolve, reject) {
        fs_1.default.createReadStream('./assets/rates.csv')
            .pipe((0, csv_parser_1.default)({ headers: false }))
            .on('error', error => reject(error))
            .on('data', row => data.push({
            accountId: row[0],
            rate: row[1]
        }))
            .on('end', () => {
            resolve(data);
        });
    });
});
function getSum(a, b) {
    return (+a + +b);
}
const CalculatePortfolio = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = [];
    const holdings = yield getHoldings();
    const ratesData = yield getRates();
    let balance = 0;
    for (const holding of holdings) {
        balance = 0;
        if (result.filter(e => e.investorId === holding.investorId).length <= 0) {
            const investorId = holding.investorId;
            const investorHoldings = holdings.filter(x => x.investorId === investorId).sort((a, b) => b.balance - a.balance);
            for (let index = 0; index < investorHoldings.length; ++index) {
                let accountRate = ratesData.filter(rate => rate.accountId === investorHoldings[index].accountId)[0].rate;
                if (index === 0) {
                    accountRate = getSum(accountRate, constants_1.PROMO_RATE);
                }
                const tempBalance = getSum(investorHoldings[index].balance, accountRate * investorHoldings[index].balance);
                balance = getSum(balance, tempBalance);
            }
            result.push({
                investorId: holding.investorId,
                value: balance,
            });
        }
    }
    return result;
});
exports.CalculatePortfolio = CalculatePortfolio;
//# sourceMappingURL=calculate-portfolio.js.map