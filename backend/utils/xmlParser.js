import fs from "fs";
import xml2js from "xml2js";

export const parseExperianXML = async (filePath) => {
  const xmlData = fs.readFileSync(filePath, "utf8");
  const parser = new xml2js.Parser({ explicitArray: false });
  const result = await parser.parseStringPromise(xmlData);
  const report = result?.INProfileResponse || {};

  // ---------------------- Basic Details ----------------------
  const applicant =
    report?.Current_Application?.Current_Application_Details
      ?.Current_Applicant_Details || {};

  const name =
    `${applicant?.First_Name || ""} ${applicant?.Last_Name || ""}`.trim() ||
    "Unknown";
  const mobile = applicant?.MobilePhoneNumber || "";
  const pan =
    report?.CAIS_Account?.CAIS_Account_DETAILS?.[0]?.CAIS_Holder_Details
      ?.Income_TAX_PAN ||
    applicant?.Income_TAX_PAN ||
    "";
  const creditScore = Number(report?.SCORE?.BureauScore || 0);

  // ---------------------- Report Summary ----------------------
  const caisSummary = report?.CAIS_Account?.CAIS_Summary || {};

  const reportSummary = {
    totalAccounts: Number(caisSummary?.Credit_Account?.CreditAccountTotal || 0),
    activeAccounts: Number(
      caisSummary?.Credit_Account?.CreditAccountActive || 0
    ),
    closedAccounts: Number(
      caisSummary?.Credit_Account?.CreditAccountClosed || 0
    ),
    currentBalanceAmount: Number(
      caisSummary?.Total_Outstanding_Balance?.Outstanding_Balance_All || 0
    ),
    securedAccountsAmount: Number(
      caisSummary?.Total_Outstanding_Balance?.Outstanding_Balance_Secured || 0
    ),
    unsecuredAccountsAmount: Number(
      caisSummary?.Total_Outstanding_Balance?.Outstanding_Balance_UnSecured || 0
    ),
    last7DaysCreditEnquiries: Number(
      report?.CAPS?.CAPS_Summary?.Last7DaysCreditEnquiries || 0
    ),
  };

  // ---------------------- Credit Accounts ----------------------
  const accountsRaw = report?.CAIS_Account?.CAIS_Account_DETAILS || [];
  const accountsArray = Array.isArray(accountsRaw)
    ? accountsRaw
    : [accountsRaw];

  const creditAccounts = accountsArray.map((acc) => {
    const holderAddress = acc?.CAIS_Holder_Address_Details || {};

    const address = [
      holderAddress?.First_Line_Of_Address_non_normalized,
      holderAddress?.Second_Line_Of_Address_non_normalized,
      holderAddress?.Third_Line_Of_Address_non_normalized,
      holderAddress?.City_non_normalized,
      holderAddress?.State_non_normalized,
      holderAddress?.ZIP_Postal_Code_non_normalized,
      holderAddress?.CountryCode_non_normalized,
    ]
      .filter(Boolean)
      .join(", ");

    return {
      bankName: acc?.Subscriber_Name || "",
      accountNumber: acc?.Account_Number || "",
      accountType: acc?.Account_Type || "",
      currentBalance: Number(acc?.Current_Balance || 0),
      amountOverdue: Number(acc?.Amount_Past_Due || 0),
      address,
    };
  });

  return {
    basicDetails: { name, mobilePhone: mobile, pan, creditScore },
    reportSummary,
    creditAccounts,
  };
};
