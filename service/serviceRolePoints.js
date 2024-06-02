const { MEMBERNAME, MEMBERID, MEMBERROLES, ROLENAME, ROLEPOINTS, ETHWALLETADDRESS, SOLWALLETADDRESS, TWITTERADDRESS } = require("../constLists");
/**
 * this function makes csv file headers and contents.
 * @param {Arrary} memberslist 
 * @returns [headers, data]
 */
const serverRolePoints = (memberslist, monitorRoles) => {
    let headers = [{ id: "member", title: "Member" }];
    for (let i = 0; i < monitorRoles.length; i++) {
        let header = {
            id: `${monitorRoles[i]}`.toLowerCase(),
            title: `${monitorRoles[i]}`
        };
        headers.push(header);
    }
    headers.push({ id: "etherwallet", title: "EtherWallet"});
    headers.push({ id: "solanawallet", title: "SolanaWallet"});
    headers.push({ id: "twitteraddress", title: "TwitterAddress"});
    let datas = [];
    for (let i = 0; i < memberslist.length; i++) {
        let data = {};
        data["member"] = memberslist[i][MEMBERNAME];
        for (let j = 0; j < monitorRoles.length; j++) {
            for (let k = 0; k < memberslist[i][MEMBERROLES].length; k++) {
                if (memberslist[i][MEMBERROLES][k][ROLENAME] == monitorRoles[j]) {
                    data[monitorRoles[j].toLowerCase()] = memberslist[i][MEMBERROLES][k][ROLEPOINTS];
                    break;
                }
                data[monitorRoles[j].toLowerCase()] = 0;
            }
        }
        data["etherwallet"] = memberslist[i][ETHWALLETADDRESS] ? memberslist[i][ETHWALLETADDRESS] : 0;
        data["solanawallet"] = memberslist[i][SOLWALLETADDRESS] ? memberslist[i][SOLWALLETADDRESS] : 0;
        data["twitteraddress"] = memberslist[i][TWITTERADDRESS] ? memberslist[i][TWITTERADDRESS] : 0;
        datas.push(data);
    }
    return [headers, datas];
};

module.exports = serverRolePoints;