"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calc = exports.GetRates = exports.GetHoldings = void 0;
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const holdings = [];
const rates = [];
const GetHoldings = () => {
    fs_1.default.createReadStream('holdings.csv')
        .pipe((0, csv_parser_1.default)({ headers: false }))
        .on('data', (data) => holdings.push({
        accountId: data[1],
        balance: data[2],
        investorId: data[0]
    }))
        .on('end', () => {
        console.log(holdings);
    });
};
exports.GetHoldings = GetHoldings;
const GetRates = () => {
    fs_1.default.createReadStream('rates.csv')
        .pipe((0, csv_parser_1.default)({ headers: false }))
        .on('data', (data) => rates.push({
        accountId: data[0],
        rate: data[1]
    }))
        .on('end', () => {
        console.log(rates);
    });
};
exports.GetRates = GetRates;
const Calc = () => {
    (0, exports.GetHoldings)();
    (0, exports.GetRates)();
    // fs.createReadStream('holdings.csv')
    //     .pipe(csv({ headers: false }))
    //     .on('data', (data) => holdings.push({
    //         accountId: data[1],
    //         balance: data[2],
    //         investorId: data[0]
    //     }))
    //     .on('end', () => {
    //         console.log(holdings);
    //     });
};
exports.Calc = Calc;
//# sourceMappingURL=calc%20copy.js.map