require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
var config = require("./dbconfig");
const sql = require("mssql");

async function finalizeData(himsPsn) {
  console.log("finalize personnel data");
  let pool = await sql.connect(config);
  let result = await pool
    .request()
    .query(
      "SELECT ROW_NUMBER() OVER (ORDER BY id) AS id, id AS psn_id, exp_date FROM psn"
    );
  if (himsPsn.length !== undefined) {
    for (let i = 0; i < himsPsn.length; i += 1) {
      await Object.assign(himsPsn[i], { id: i + 1 });
      for (let n = 0; n < result.recordset.length; n += 1) {
        if (himsPsn[i].psn_id === result.recordset[n].psn_id) {
          await Object.assign(himsPsn[i], {
            exp_date: result.recordset[n].exp_date,
          });
          break;
        }
      }
    }
  } else {
    for (let n = 0; n < result.recordset.length; n += 1) {
      if (himsPsn.psn_id === result.recordset[n].psn_id) {
        await Object.assign(himsPsn, {
          exp_date: result.recordset[n].exp_date,
        });
        break;
      }
    }
  }
  return himsPsn;
}

async function getPersonnel() {
  try {
    console.log("getPersonnel call, get personnel data from HIMS");
    const himsPsn = await fetch(
      `http://${process.env.backendHost}:${process.env.himsPort}/api/himspsn/getallpsn`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("getAllPSN complete");
        return data;
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("cancelled");
        } else {
          console.error("Error:", error);
        }
      });
    const result = await finalizeData(himsPsn);
    console.log("getPersonnel complete");
    console.log("====================");
    return result;
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function getActvPersonnel() {
  try {
    console.log("getActvPersonnel call, get personnel data from HIMS");
    const himsPsn = await fetch(
      `http://${process.env.backendHost}:${process.env.himsPort}/api/himspsn/getactvpsn`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("getActvPSN complete");
        return data;
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("cancelled");
        } else {
          console.error("Error:", error);
        }
      });
    const result = await finalizeData(himsPsn);
    console.log("getActvPersonnel complete");
    console.log("====================");
    return result;
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function getPersonnelById(psn_id) {
  try {
    console.log(
      "getPersonnelById call id = " + psn_id + ", get personnel data from HIMS"
    );
    const himsPsn = await fetch(
      `http://${process.env.backendHost}:${process.env.himsPort}/api/himspsn/getpsndatabyid/${psn_id}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("getAllPSNData complete");
        return data;
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("cancelled");
        } else {
          console.error("Error:", error);
        }
      });
    const result = await finalizeData(himsPsn);
    console.log("getPersonnelById complete");
    console.log("====================");
    return result;
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function getLevels() {
  try {
    console.log("getLevels request try to connect server");
    let pool = await sql.connect(config);
    console.log("connect complete");
    let result = await pool.request().query("SELECT * FROM psn_lv");
    console.log("getLevels compelete");
    console.log("====================");
    return result.recordsets[0];
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function getLevelViews() {
  try {
    console.log("getLevelViews request try to connect server");
    let pool = await sql.connect(config);
    console.log("connect complete");
    let result = await pool.request().query("SELECT * FROM psn_lv_view_list");
    console.log("getLevelViews compelete");
    console.log("====================");
    return result.recordsets[0];
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function getLevelList(psn_id) {
  try {
    console.log("getLevelList request try to connect server id = " + psn_id);
    let pool = await sql.connect(config);
    console.log("connect complete");
    let result = await pool
      .request()
      .input("psn_id", sql.VarChar, psn_id)
      .query(
        "SELECT psn_lv_list.lv_id" +
          ",psn_lv.name AS lv_name" +
          ",psn_lv.descr AS lv_descr" +
          ",psn_lv_list.view_id" +
          ",psn_lv_view_list.name AS view_name" +
          ",psn_lv_view_list.descr AS view_descr" +
          ",psn_lv.mihapp_id" +
          ",psn_mihapps.name AS mihapps_name" +
          " FROM psn_lv_list " +
          "INNER JOIN psn_lv ON psn_lv.id = psn_lv_list.lv_id " +
          "INNER JOIN psn_mihapps ON psn_mihapps.id = psn_lv.mihapp_id " +
          "LEFT JOIN psn_lv_view_list ON psn_lv_view_list.id = psn_lv_list.view_id " +
          "WHERE psn_id = @psn_id"
      );
    console.log("getLevelList complete");
    console.log("====================");
    return result.recordsets[0];
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function getDepartments() {
  try {
    console.log("getDepartments call try connect to server");
    const himsDept = await fetch(
      `http://${process.env.backendHost}:${process.env.himsPort}/api/himspsn/getalldept`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("getAllDeptData complete");
        return data;
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("cancelled");
        } else {
          console.error("Error:", error);
        }
      });
    console.log("getDepartments complete");
    console.log("====================");
    return himsDept;
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function getMihapps() {
  try {
    console.log("getMihapps call try to connect server");
    let pool = await sql.connect(config);
    console.log("connect complete");
    let result = await pool.request().query("SELECT * FROM psn_mihapps");
    console.log("getMihapps complete");
    console.log("====================");
    return result.recordsets[0];
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function getSignature(psn_id) {
  try {
    console.log("getSignature call try to connect server");
    let pool = await sql.connect(config);
    console.log("connect complete");
    let result = await pool
      .request()
      .input("psn_id", sql.VarChar, psn_id)
      .query("SELECT * FROM psn_sig WHERE psn_id = @psn_id");
    const jsonData = {
      psn_id: psn_id,
      data: Buffer.from(result.recordset[0].data).toString(),
    };
    console.log("getSignature complete");
    console.log("====================");
    return jsonData;
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function deletePersonnelLevel(psn_id) {
  let pool = await sql.connect(config);
  await pool
    .request()
    .input("psn_id", sql.VarChar, psn_id)
    .query("DELETE FROM psn_lv_list WHERE psn_id = @psn_id");
}

async function addPersonnelLevel(psn_id, lv_list) {
  let pool = await sql.connect(config);
  var queryText = "INSERT INTO psn_lv_list (psn_id, lv_id, view_id) VALUES ";
  for (let i = 0; i < lv_list.length; i++) {
    queryText +=
      "('" + psn_id + "', '" + lv_list[i].lv_id + "', '" + lv_list[i].view_id + "') ";
    if (i < lv_list.length - 1) {
      queryText += ",";
    }
  }
  await pool.request().query(queryText);
}

async function addSignature(data) {
  try {
    console.log(
      "addSignature call try connect to server, personnel_id = " + data.psn_id
    );
    let pool = await sql.connect(config);
    console.log("connect complete");
    console.log("check is signature exist for personnel_id = " + data.psn_id);
    let dupCheck = await isSignatureExist(data.psn_id);
    if (dupCheck > 0) {
      console.log(
        "signature found, delete old signature to keep new signature"
      );
      await delSignature(data.psn_id);
    }
    console.log("signature check done, add new signature");
    await pool
      .request()
      .input("psn_id", sql.VarChar, data.psn_id)
      .input("sig_data", sql.VarBinary, Buffer.from(data.sig_data))
      .query("INSERT INTO psn_sig (psn_id, data) VALUES (@psn_id, @sig_data)");
    console.log("addSignature complete");
    console.log("====================");
    return { status: "ok" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function isSignatureExist(psn_id) {
  let pool = await sql.connect(config);
  const result = await pool
    .request()
    .input("psn_id", sql.VarChar, psn_id)
    .query(
      "SELECT COUNT(psn_id) as counter FROM psn_sig WHERE psn_id = @psn_id"
    );
  return result.recordset[0].counter;
}

async function delSignature(psn_id) {
  try {
    console.log("delSignature call try connect to server");
    let pool = await sql.connect(config);
    console.log("connect complete");
    await pool
      .request()
      .input("psn_id", sql.VarChar, psn_id)
      .query("DELETE FROM psn_sig WHERE psn_id = @psn_id");
    console.log("delSignature complete");
    console.log("====================");
    return { status: "ok" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function updatePersonnel(data) {
  try {
    console.log("updatePersonnelLevel call with id =" + data.psn_id);
    if (
      data.lv_list !== "" &&
      data.lv_list !== null &&
      data.lv_list !== undefined
    ) {
      console.log("update level to level list");
      await deletePersonnelLevel(data.psn_id);
      await addPersonnelLevel(data.psn_id, data.lv_list);
      console.log("update level complete");
    }
    if (
      data.sig_data !== null &&
      data.sig_data !== "" &&
      data.sig_data !== undefined
    ) {
      console.log("signature detect, adding signature");
      await addSignature(data);
    }
    console.log("update complete");
    console.log("====================");
    return { status: "ok" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function resetSecret(psn_id) {
  try {
    console.log("resetSecret call id = " + psn_id + " try connect to server");
    let pool = await sql.connect(config);
    console.log("connect complete");
    await pool
      .request()
      .input("psn_id", sql.VarChar, psn_id)
      .query("DELETE FROM psn WHERE id = @psn_id");
    console.log("resetSecret complete");
    console.log("====================");
    return { status: "ok" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

async function getVersion() {
  try {
    return process.env.version;
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

// async function addLvToAll() {
//     try {
//         let pool = await sql.connect(config);
//         const qry = await pool.request().query("SELECT personnel_id FROM personnel WHERE personnel_isactive = 1");
//         const result = qry.recordsets[0];
//         for (let i = 0; i < result.length; i += 1) {
//             console.log(`${i}. add ${result[i].personnel_id}`)
//             addPersonnelLevel(result[i].personnel_id, ["CBS_USER"], []);
//         }
//         return { "status": "ok" }
//     }
//     catch (error) {
//         console.error(error);
//         return { "status": "error", "message": error.message };
//     }
// }

module.exports = {
  getPersonnel: getPersonnel,
  getActvPersonnel: getActvPersonnel,
  getPersonnelById: getPersonnelById,
  getLevels: getLevels,
  getLevelViews: getLevelViews,
  getLevelList: getLevelList,
  getDepartments: getDepartments,
  getMihapps: getMihapps,
  getSignature: getSignature,
  updatePersonnel: updatePersonnel,
  resetSecret: resetSecret,
  getVersion: getVersion,
  // addLvToAll: addLvToAll,
};
