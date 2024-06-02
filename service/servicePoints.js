const { 
    ROLECREATEDAT,
    ROLENAME,
    ROLEPOINTS,
    MEMBERROLES,
    MEMBERPOINTS,
    ROLESTATUS,
    ABLED
} = require("../constLists");

let primay_buffer = 0, senior_buffer = 0, junior_buffer = 0, top_buffer = 0;
/**
 * This bot has the function to add points for each role based on a particular schedule.
 * In this case, this shedule is that 
 * for primary role add 1 points per 10 seconds
 * for junior role add 2 points per 10 seconds
 * for senior role add 3 points per 10 seconds
 * for top role add 4 points per 10 seconds
 * And a role is removed then that rolepoints stop adding .
 * Next, that role is added again then that rolepoints start adding.
 * @param {Array} memberlist 
 * @param {Date} present 
 */
const servicePoint = (memberlist, present, period) => {
    for (let i = 0; i < memberlist.length; i++) {
        for (let j = 0; j < memberlist[i][MEMBERROLES].length; j++) {
            switch (memberlist[i][MEMBERROLES][j][ROLENAME]) {
                case "primary": {
                    if (memberlist[i][MEMBERROLES][j][ROLESTATUS] == ABLED) {
                        memberlist[i][MEMBERROLES][j][ROLEPOINTS] = primay_buffer + Math.floor((present - memberlist[i][MEMBERROLES][j][ROLECREATEDAT]) / period);
                    } else {
                        primay_buffer = memberlist[i][MEMBERROLES][j][ROLEPOINTS];
                    }
                    break;
                }
                case "junior": {
                    if (memberlist[i][MEMBERROLES][j][ROLESTATUS] == ABLED) {
                        memberlist[i][MEMBERROLES][j][ROLEPOINTS] = junior_buffer  + 2 * Math.floor((present - memberlist[i][MEMBERROLES][j][ROLECREATEDAT]) / period);
                    } else {
                        junior_buffer  = memberlist[i][MEMBERROLES][j][ROLEPOINTS];
                    }
                    break;
                }
                case "senior": {
                    if (memberlist[i][MEMBERROLES][j][ROLESTATUS] == ABLED) {
                        memberlist[i][MEMBERROLES][j][ROLEPOINTS] = senior_buffer + 3 * Math.floor((present - memberlist[i][MEMBERROLES][j][ROLECREATEDAT]) / period);
                    } else {
                        senior_buffer = memberlist[i][MEMBERROLES][j][ROLEPOINTS];
                    }
                    break;
                }
                case "top": {
                    if (memberlist[i][MEMBERROLES][j][ROLESTATUS] == ABLED) {
                        memberlist[i][MEMBERROLES][j][ROLEPOINTS] = top_buffer + 4 * Math.floor((present - memberlist[i][MEMBERROLES][j][ROLECREATEDAT]) / period);
                    } else {
                        top_buffer = memberlist[i][MEMBERROLES][j][ROLEPOINTS];
                    }
                    break;
                }
                default: break;
            }
        }
    }

    for (let i = 0; i < memberlist.length; i++) {
        memberlist[i][MEMBERPOINTS] = 0;
        for (let j = 0; j < memberlist[i][MEMBERROLES].length; j++) {
            memberlist[i][MEMBERPOINTS] += memberlist[i][MEMBERROLES][j][ROLEPOINTS];
        }
    }
}

module.exports = servicePoint;