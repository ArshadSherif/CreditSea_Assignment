import { Schema, model } from "mongoose";

const CreditAccountSchema = new Schema({
  bankName: { type: String },
  accountNumber: { type: String },
  accountType: { type: String },
  currentBalance: { type: Number, default: 0 },
  amountOverdue: { type: Number, default: 0 },
  address: { type: String },
});

const CreditReportSchema = new Schema({
  basicDetails: {
    name: { type: String },
    mobilePhone: { type: String },
    pan: { type: String },
    creditScore: { type: Number },
  },
  reportSummary: {
    totalAccounts: { type: Number, default: 0 },
    activeAccounts: { type: Number, default: 0 },
    closedAccounts: { type: Number, default: 0 },
    currentBalanceAmount: { type: Number, default: 0 },
    securedAccountsAmount: { type: Number, default: 0 },
    unsecuredAccountsAmount: { type: Number, default: 0 },
    last7DaysCreditEnquiries: { type: Number, default: 0 },
  },
  creditAccounts: [CreditAccountSchema],
  createdAt: { type: Date, default: Date.now },
});

export default model("CreditReport", CreditReportSchema);
