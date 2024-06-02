const { MEMBERNAME, ETHWALLETADDRESS, SOLWALLETADDRESS, TWITTERADDRESS } = require("../constLists");
/**
 * this function makes csv file headers and contents.
 * @param {Arrary} memberslist 
 * @returns [headers, data]
 */
const serviceAddress = (membersList) => {
    let headers = [
        { id: "member", title: "Member" },
        { id: "etherwalletaddress", title: "etherWalletAddress" },
        { id: "solanawalletaddress", title: "SolanaWalletAddress" },
        { id: "twitteraddress", title: "TwitterAddress" }
    ];
    let datas = [];
    for (let i = 0; i < membersList.length; i++) {
        let data = {};
        data["member"] = membersList[i][MEMBERNAME];
        data["etherwalletaddress"] = membersList[i][ETHWALLETADDRESS] ? membersList[i][ETHWALLETADDRESS] : "NO";
        data["solanawalletaddress"] = membersList[i][SOLWALLETADDRESS] ? membersList[i][SOLWALLETADDRESS] : "NO";
        data["twitteraddress"] = membersList[i][TWITTERADDRESS] ? membersList[i][TWITTERADDRESS] : "NO";
        datas.push(data);
    }
    return [headers, datas];
};

module.exports = serviceAddress;