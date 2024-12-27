import httpClient from "../http-common";

const createEvaluation = data => {
    return httpClient.post("/checkrules/", data);
};

const getAll = () => {
    return httpClient.get("/checkrules/");
};

const getById = id => {
    return httpClient.get(`/checkrules/${id}`);
};

const getByCreditID = creditID => {
    return httpClient.get(`/checkrules/credit/${creditID}`)
}

const calculateQuotaIncome = async (checkID) => {
    return httpClient.post(`/checkrules/check1/${checkID}/calculate`);
}

const calculateDebtIncome = async (checkID, currentDebt) => {
    return httpClient.post(`/checkrules/check4/${checkID}/${currentDebt}`);
}

const calculateApplicationAge = async (checkID) => {
    return httpClient.post(`/checkrules/check6/${checkID}`);
}

const creditEvaluation = async (checkId, evaluationData) => {
    try {
        await httpClient.post(`/checkrules/check1/${checkId}/${evaluationData.quoteIncomeRatioCheck}`);
        await httpClient.post(`/checkrules/check2/${checkId}/${evaluationData.creditHistoryCheck}`);
        await httpClient.post(`/checkrules/check3/${checkId}/${evaluationData.employmentStabilityCheck}`);
        await httpClient.post(`/checkrules/check4/${checkId}/${evaluationData.currentDebtCheck}`);
        await httpClient.post(`/checkrules/check6/${checkId}/${evaluationData.applicantAgeCheck}`);
        await httpClient.post(`/checkrules/check71/${checkId}/${evaluationData.minimumBalanceCheck}`);
        await httpClient.post(`/checkrules/check72/${checkId}/${evaluationData.savingHistoryCheck}`);
        await httpClient.post(`/checkrules/check73/${checkId}/${evaluationData.periodicDepositsCheck}`);
        await httpClient.post(`/checkrules/check74/${checkId}/${evaluationData.balanceYearsAgoCheck}`);
        await httpClient.post(`/checkrules/check75/${checkId}/${evaluationData.recentWithdrawalsCheck}`);

        return { success: true };
    } catch (error) {
        console.error("Error en la evaluación de crédito:", error);
        return { success: false, error: error.response.data };
    }
};


export default {
    createEvaluation,
    getAll,
    getById,
    calculateQuotaIncome,
    calculateDebtIncome,
    calculateApplicationAge,
    creditEvaluation,
    getByCreditID
};