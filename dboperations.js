require('dotenv').config();
var config = require('./dbconfig');
const sql = require('mssql');

async function getPersonnel() {
    try {

        console.log("getPersonnel call try to connect server");
        let pool = await sql.connect(config);
        console.log("connect complete");
        let result = await pool.request().query("SELECT ROW_NUMBER() OVER (ORDER BY personnel.personnel_id) AS id," +
            "personnel_id" +
            ",personnel_secret" +
            ",personnel_firstname" +
            ",personnel_lastname" +
            ",personnel_isactive" +
            ",personnel.position_id" +
            ",personnel_positions.position_name" +
            ",personnel_positions.department_id" +
            ",personnel_departments.department_name" +
            ",personnel_departments.faction_id" +
            ",personnel_factions.faction_name" +
            ",personnel_factions.field_id" +
            ",personnel_fields.field_name" +
            " FROM personnel " +
            "INNER JOIN personnel_positions ON personnel_positions.position_id = personnel.position_id " +
            "INNER JOIN personnel_departments ON personnel_departments.department_id = personnel_positions.department_id " +
            "INNER JOIN personnel_factions ON personnel_factions.faction_id = personnel_departments.faction_id " +
            "INNER JOIN personnel_fields ON personnel_fields.field_id = personnel_factions.field_id ");
        console.log("get complete");
        console.log("====================");
        return result.recordsets;

    }
    catch (error) {
        console.error(error);
        return { "status": "error", "message": error.message };
    }
}

async function getPersonnelById(personnel_id) {
    try {

        console.log("getPersonnelById call try to connect server id = " + personnel_id);
        let pool = await sql.connect(config);
        console.log("connect complete");
        let result = await pool.request().input('personnel_id', sql.VarChar, personnel_id)
            .query("SELECT personnel_id" +
                ",personnel_secret" +
                ",personnel_firstname" +
                ",personnel_lastname" +
                ",personnel_isactive" +
                ",personnel.position_id" +
                ",personnel_positions.position_name" +
                ",personnel_positions.department_id" +
                ",personnel_departments.department_name" +
                ",personnel_departments.faction_id" +
                ",personnel_factions.faction_name" +
                ",personnel_factions.field_id" +
                ",personnel_fields.field_name" +
                " FROM personnel " +
                "INNER JOIN personnel_positions ON personnel_positions.position_id = personnel.position_id " +
                "INNER JOIN personnel_departments ON personnel_departments.department_id = personnel_positions.department_id " +
                "INNER JOIN personnel_factions ON personnel_factions.faction_id = personnel_departments.faction_id " +
                "INNER JOIN personnel_fields ON personnel_fields.field_id = personnel_factions.field_id " +
                "WHERE personnel_id = @personnel_id");
        console.log("getPersonnelById complete");
        console.log("====================");
        return result.recordset;

    }
    catch (error) {
        console.error(error);
        return { "status": "error", "message": error.message };
    }
}

async function getLevels(){

    try{

        console.log("getLevels request try to connect server");
        let pool = await sql.connect(config);
        console.log("connect complete");
        let result = await pool.request().query("SELECT * FROM personnel_levels");
        console.log("getLevels compelete");
        console.log("====================");
        return result.recordsets
        
    }
    catch(error){
        console.error(error);
        return { "status": "error", "message": error.message };
    }

}

async function getLevelList(personnel_id) {
    try {

        console.log("getLevelList request try to connect server id = " + personnel_id);
        let pool = await sql.connect(config);
        console.log("connect complete");
        let result = await pool.request().input('personnel_id', sql.VarChar, personnel_id)
            .query("SELECT personnel_level_list.level_id" +
                ",personnel_levels.level_name" +
                ",personnel_levels.level_description" +
                ",personnel_levels.mihapp_id" +
                ",personnel_mihapps.mihapp_name" +
                " FROM personnel_level_list " +
                "INNER JOIN personnel_levels ON personnel_levels.level_id = personnel_level_list.level_id " +
                "INNER JOIN personnel_mihapps ON personnel_mihapps.mihapp_id = personnel_levels.mihapp_id " +
                "WHERE personnel_id = @personnel_id");
        console.log("getLevelList complete");
        console.log("====================");
        return result.recordsets

    }
    catch (error) {
        console.error(error);
        return { "status": "error", "message": error.message };
    }

}

async function getPositions() {
    try {

        console.log("getPositions call try to connect server");
        let pool = await sql.connect(config);
        console.log("connect complete");
        let result = await pool.request().query("SELECT * FROM personnel_positions");
        console.log("getPositions complete");
        console.log("====================");
        return result.recordsets;

    }
    catch (error) {
        console.error(error);
        return { "status": "error", "message": error.message };
    }
}

async function getDepartments() {

    try {
        console.log("getDepartments call try connect to server");
        let pool = await sql.connect(config);
        console.log("connect complete");
        let result = await pool.request().query("SELECT * FROM personnel_departments");
        console.log("getDepartments complete");                                                                                               
        console.log("====================");
        return result.recordsets;
    }
    catch(error){
        console.error(error);
    }

}

async function getMihapps() {
    try{
        
        console.log("getMihapps call try to connect server");
        let pool = await sql.connect(config);
        console.log("connect complete");
        let result = await pool.request().query("SELECT * FROM personnel_mihapps");
        console.log("getMihapps complete");
        console.log("====================");
        return result.recordsets;

    }
    catch(error){
        console.error(error);
        return { "status": "error", "message": error.message };
    }
}

module.exports = {
    getPersonnel: getPersonnel,
    getPersonnelById: getPersonnelById,
    getLevels: getLevels,
    getLevelList: getLevelList,
    getPositions: getPositions,
    getDepartments: getDepartments,
    getMihapps: getMihapps,
}