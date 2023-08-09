require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
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

async function getLevels() {

    try {

        console.log("getLevels request try to connect server");
        let pool = await sql.connect(config);
        console.log("connect complete");
        let result = await pool.request().query("SELECT * FROM personnel_levels");
        console.log("getLevels compelete");
        console.log("====================");
        return result.recordsets

    }
    catch (error) {
        console.error(error);
        return { "status": "error", "message": error.message };
    }

}

async function getLevelViews() {

    try {

        console.log("getLevelViews request try to connect server");
        let pool = await sql.connect(config);
        console.log("connect complete");
        let result = await pool.request().query("SELECT * FROM personnel_level_view_list");
        console.log("getLevelViews compelete");
        console.log("====================");
        return result.recordsets

    }
    catch (error) {
        console.error(error);
        return { "status": "error", "message": error.message };
    }

}

async function getLvViews(){
    try{

        console.log("getLvViews request try to connect server");
        let pool = await sql.connect(config);
        console.log("connect complete");
        let result = await pool.request().query("SELECT * FROM personnel_level_view_list2");
        console.log("getLvViews compelete");
        console.log("====================");
        return result.recordsets[0];
    }
    catch (error) {
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
                ",personnel_level_list.view_id" +
                ",personnel_level_view_list.view_name" +
                ",personnel_level_view_list.view_description" +
                ",personnel_levels.mihapp_id" +
                ",personnel_mihapps.mihapp_name" +
                " FROM personnel_level_list " +
                "INNER JOIN personnel_levels ON personnel_levels.level_id = personnel_level_list.level_id " +
                "INNER JOIN personnel_mihapps ON personnel_mihapps.mihapp_id = personnel_levels.mihapp_id " +
                "LEFT JOIN personnel_level_view_list ON personnel_level_view_list.view_id = personnel_level_list.view_id " +
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
        let result = await pool.request().query("SELECT " +
            "position_id, " +
            "position_name, " +
            "position_isactive, " +
            "personnel_positions.hims_id, " +
            "personnel_positions.department_id, " +
            "personnel_departments.faction_id, " +
            "personnel_factions.field_id " +
            "FROM personnel_positions " +
            "INNER JOIN personnel_departments ON personnel_departments.department_id = personnel_positions.department_id " +
            "INNER JOIN personnel_factions ON personnel_factions.faction_id = personnel_departments.faction_id " +
            "INNER JOIN personnel_fields ON personnel_fields.field_id = personnel_factions.field_id");
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
        let result = await pool.request().query("SELECT " +
            "department_id, " +
            "department_name, " +
            "department_isactive, " +
            "personnel_departments.hims_id, " +
            "personnel_departments.faction_id, " +
            "personnel_factions.field_id " +
            "FROM personnel_departments " +
            "INNER JOIN personnel_factions ON personnel_factions.faction_id = personnel_departments.faction_id " +
            "INNER JOIN personnel_fields ON personnel_fields.field_id = personnel_factions.field_id");
        console.log("getDepartments complete");
        console.log("====================");
        return result.recordsets;
    }
    catch (error) {
        console.error(error);
        return { "status": "error", "message": error.message };
    }

}

async function getFactions() {

    try {
        console.log("getFactions call try connect to sserver");
        let pool = await sql.connect(config);
        console.log("connect complete");
        let result = await pool.request().query("SELECT " +
            "faction_id, " +
            "faction_name, " +
            "faction_isactive, " +
            "personnel_factions.hims_id, " +
            "personnel_factions.field_id " +
            "FROM personnel_factions " +
            "INNER JOIN personnel_fields ON personnel_fields.field_id = personnel_factions.field_id");
        console.log("getFactions complete");
        console.log("====================");
        return result.recordsets;
    }
    catch (error) {
        console.error(error);
        return { "status": "error", "message": error.message };
    }
}

async function getFields() {

    try {
        console.log("getField call try connect to server");
        let pool = await sql.connect(config);
        console.log("connect complete");
        let result = await pool.request().query("SELECT * FROM personnel_fields");
        console.log("getFields complete");
        console.log("====================");
        return result.recordsets;
    }
    catch (error) {
        console.error(error);
        return { "status": "error", "message": error.message };
    }
}

async function getMihapps() {
    try {

        console.log("getMihapps call try to connect server");
        let pool = await sql.connect(config);
        console.log("connect complete");
        let result = await pool.request().query("SELECT * FROM personnel_mihapps");
        console.log("getMihapps complete");
        console.log("====================");
        return result.recordsets;

    }
    catch (error) {
        console.error(error);
        return { "status": "error", "message": error.message };
    }
}

async function getSignature(personnel_id) {
    try {

        console.log("getSignature call try to connect server");
        let pool = await sql.connect(config);
        console.log("connect complete");
        let result = await pool.request().input('personnel_id', sql.VarChar, personnel_id)
            .query("SELECT * FROM personnel_signature WHERE personnel_id = @personnel_id");
        const jsonData = {
            personnel_id: personnel_id,
            signature_data: Buffer.from(result.recordset[0].signature_data).toString(),
        }
        console.log("getSignature complete");
        console.log("====================");
        return jsonData;
    }
    catch (error) {
        console.error(error);
        return { "status": "error", "message": error.message };
    }
}

module.exports = {
    getPersonnel: getPersonnel,
    getPersonnelById: getPersonnelById,
    getLevels: getLevels,
    getLevelViews: getLevelViews,
    getLvViews: getLvViews,
    getLevelList: getLevelList,
    getPositions: getPositions,
    getDepartments: getDepartments,
    getFactions: getFactions,
    getFields: getFields,
    getMihapps: getMihapps,
    getSignature: getSignature,
}