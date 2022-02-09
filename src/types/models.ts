export interface Holding {
    investorId: number;
    accountId: string;
    balance: number;
}

export interface Rates {
    accountId: string;
    rate: number;
}

export interface Portfolio  {
    investorId: number;
    value: number;
}