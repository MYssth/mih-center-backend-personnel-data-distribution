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
      `http://${process.env.backendHost}:${process.env.himsPort}/api/himspsn/getallpsndata`
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
    console.log("getPersonnel complete");
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
      .query(
        "SELECT * FROM psn_sig WHERE psn_id = @psn_id"
      );
    const jsonData = {
      psn_id: psn_id,
      data: Buffer.from(
        result.recordset[0].data
      ).toString(),
    };
    console.log("getSignature complete");
    console.log("====================");
    return jsonData;
  } catch (error) {
    console.error(error);
    return { status: "error", message: error.message };
  }
}

module.exports = {
  getPersonnel: getPersonnel,
  getPersonnelById: getPersonnelById,
  getLevels: getLevels,
  getLevelViews: getLevelViews,
  getLevelList: getLevelList,
  getDepartments: getDepartments,
  getMihapps: getMihapps,
  getSignature: getSignature,
};
