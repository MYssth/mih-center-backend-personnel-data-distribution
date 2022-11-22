require('dotenv').config();
var config = require('./dbconfig');
const sql = require('mssql');

async function getPersonnel() {
    try {

        console.log("getPersonnel call try to connect server");
        let pool = await sql.connect(config);
        console.log("connect complete");
        let result = await pool.request().query("SELECT personnel_id" +
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
        console.log("get complete");
        console.log("====================");
        return result.recordsets;

    }
    catch (error) {
        console.error(error);
        return { "status": "error", "message": error.message };
    }
}

async function getRoles(){

    try{

        console.log("getRoles request try to connect server");
        let pool = await sql.connect(config);
        console.log("connect complete");
        let result = await pool.request().query("SELECT * FROM personnel_roles");
        console.log("getRoles compelete");
        console.log("====================");
        return result.recordsets
        
    }
    catch(error){
        console.error(error);
        return { "status": "error", "message": error.message };
    }

}

async function getRoleList(personnel_id) {
    try {

        console.log("getRoleList request try to connect server id = " + personnel_id);
        let pool = await sql.connect(config);
        console.log("connect complete");
        let result = await pool.request().input('personnel_id', sql.VarChar, personnel_id)
            .query("SELECT personnel_role_list.role_id" +
                ",personnel_roles.role_name" +
                ",personnel_roles.role_description" +
                ",personnel_roles.mihapp_id" +
                ",personnel_mihapps.mihapp_name" +
                " FROM personnel_role_list " +
                "INNER JOIN personnel_roles ON personnel_roles.role_id = personnel_role_list.role_id " +
                "INNER JOIN personnel_mihapps ON personnel_mihapps.mihapp_id = personnel_roles.mihapp_id " +
                "WHERE personnel_id = @personnel_id");
        console.log("getRoleList complete");
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

        console.log("getPosition call try to connect server");
        let pool = await sql.connect(config);
        console.log("connect complete");
        let result = await pool.request().query("SELECT * FROM personnel_positions");
        console.log("get complete");
        console.log("====================");
        return result.recordsets;

    }
    catch (error) {
        console.error(error);
        return { "status": "error", "message": error.message };
    }
}

async function getMihapps() {
    try{
        
        console.log("getMihapps call try to connect server");
        let pool = await sql.connect(config);
        console.log("connect complete");
        let result = await pool.request().query("SELECT * FROM personnel_mihapps");
        console.log("get complete");
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
    getRoles: getRoles,
    getRoleList: getRoleList,
    getPositions: getPositions,
    getMihapps: getMihapps,
}