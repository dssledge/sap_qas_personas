//wnd[0]/scrptPersonas_1504720308798
//Traverse all sequences for the confirmation and sum the pauses (-1) starts (+1) as task_sum.
//A value of 0 = stopped confirmation, 1 = ready to be stopped confirmation, >1 = cannot be stopped (several people working on the job)

var lv_test_mode = false;

if (lv_test_mode === false) {
var lv_prod_nbr = session.utils.get("pv_prod_nbr");
var lv_confirm_nbr = session.utils.get("pv_confirm_nbr");
var lv_person_nbr = session.utils.get("pv_person_nbr");
var lv_task_type = session.utils.get("pv_task_type");
var lv_yield_qty = session.utils.get("pv_yield_qty");
var lv_activity_3 = session.utils.get("pv_activity_3");
	
}
else { 
	session.utils.log("ENTERING TESTING MODE");
	var lv_prod_nbr = "000001072354";
	var lv_confirm_nbr = "943023";
	var lv_person_nbr = "78470";
	var lv_task_type = "Paused";
}

//Save the confirmation ticket and exit the tcode
//		session.findById("wnd[0]/tbar[0]/btn[11]").press();

var cnf_ctr = 0;
var try_err = ""; //expecting 'E' once no additional records are found in the confirmation
var conf_dtls;
var	return_stat;

var person = ["Hulk"]; //Hulk smash!!
var person_task_cnt = [0];
var rfc = session.createRFC("BAPI_PRODORDCONF_GETDETAIL");
			
do {
		if (try_err !== "E" && cnf_ctr > 0) {
			if (person.indexOf(conf_dtls.PERS_NO) === -1) {
				person.push(conf_dtls.PERS_NO);
				person_task_cnt.push(0);
			
			}
				curr_person_indx = person.indexOf(conf_dtls.PERS_NO);
			switch (conf_dtls.CONF_TEXT) {
				case "Started":
					person_task_cnt[curr_person_indx]++;
					break;
				case "Paused":
					person_task_cnt[curr_person_indx]--;
					break;
				default:	
			} //switch
			//session.utils.log("Current Person Index: " + curr_person_indx + " ID: " + person[curr_person_indx] + " Task Sum: " + person_task_cnt[curr_person_indx]);
		} //if
	
	
	cnf_ctr++;
	rfc.setParameter( "CONFIRMATIONCOUNTER",cnf_ctr);
	rfc.setParameter("CONFIRMATION",lv_confirm_nbr);
	rfc.requestResults(JSON.stringify(["CONF_DETAIL","RETURN"]));
	rfc.send();

	conf_dtls = rfc.getResultObject("CONF_DETAIL");
	return_stat = rfc.getResultObject("RETURN");
	try_err = return_stat.TYPE;

} //end do
while (try_err != "E");

//Exit CO11n
session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subSLOT_HDR:SAPLCORU_S:0111/txtAFRUD-RUECK").setFocus();
session.findById("wnd[0]/tbar[0]/btn[15]").press();

session.findById("wnd[1]/usr/btnSPOP-OPTION2").press();
//------------------

// An OnLoad or OnAfterRefresh script was executed.

session.findById("wnd[0]/usr/subPersonas_150187838242348/txtPersonas_150220241392069").text = "100";
session.findById("wnd[0]/usr/subPersonas_150187838242348/txtPersonas_15023960657572").text = "";


person.forEach(f_get_person_task);

f_set_person_task(lv_prod_nbr, lv_confirm_nbr, lv_person_nbr, "Completed", lv_yield_qty, lv_activity_3);

//Save the confirmation ticket and exit the tcode
//		session.findById("wnd[0]/tbar[0]/btn[11]").press();

function f_commit() {

//Save the transactions
var oRFC = session.createRFC("BAPI_TRANSACTION_COMMIT");
oRFC.requestResults(["RETURN"]);
oRFC.setParameter("WAIT", "X");
oRFC.send();
var _RETURN = oRFC.getResultObject("RETURN");

}

function f_rollback() {
		var oRFC_rb = session.createRFC("BAPI_TRANSACTION_ROLLBACK");
		oRFC_rb.requestResults(["RETURN"]);
		oRFC_rb.send();
		var RETURN = oRFC_rb.getResultObject("RETURN");
}

function f_get_person_task(item , index) {

	if (person_task_cnt[index] > 0 && item !== lv_person_nbr) {
		//alert("Item: " + item + " Index: " + index);
		f_set_person_task(lv_prod_nbr, lv_confirm_nbr, item, lv_task_type, "",0);
	}
}



function f_set_person_task(pv_prod_nbr, pv_confirm_nbr, pv_person_nbr, pv_task_type, pv_cnf_yield_qty, pv_activity_3)  {
	//Create the time ticket
	//This does not save the transaction
	var lv_final = "";
	var lv_cnf_vield_qty = "0";
	var lv_activity_3 = pv_activity_3 * 1;
	var lv_activity_4 = 0;
	if (lv_activity_3 === 0) {
		lv_activity_3 = 0;
	}
	if (pv_task_type == "Completed") {
		lv_final = "X";
		lv_cnf_yield_qty = "";
	}
	
	var oRFC = session.createRFC("BAPI_PRODORDCONF_CREATE_TT");

	oRFC.setParameter("TIMETICKETS", [{"CONF_NO":pv_confirm_nbr,"ORDERID":pv_prod_nbr,"SEQUENCE":"000000","OPERATION":"","SUB_OPER":"","CAPA_CATEGORY":"","SPLIT":0,"FIN_CONF":lv_final,"CLEAR_RES":"","POSTG_DATE":"0000-00-00","DEV_REASON":"","CONF_TEXT":pv_task_type,"PLANT":"","WORK_CNTR":"","RECORDTYPE":"","CONF_QUAN_UNIT":"","CONF_QUAN_UNIT_ISO":"","YIELD":pv_cnf_yield_qty,"SCRAP":0,"REWORK":0,"CONF_ACTI_UNIT1":"","CONF_ACTI_UNIT1_ISO":"","CONF_ACTIVITY1":10,"NO_REMN_ACTI1":"","CONF_ACTI_UNIT2":"","CONF_ACTI_UNIT2_ISO":"","CONF_ACTIVITY2":20,"NO_REMN_ACTI2":"","CONF_ACTI_UNIT3":"","CONF_ACTI_UNIT3_ISO":"","CONF_ACTIVITY3":lv_activity_3,"NO_REMN_ACTI3":"","CONF_ACTI_UNIT4":"","CONF_ACTI_UNIT4_ISO":"","CONF_ACTIVITY4":lv_activity_4,"NO_REMN_ACTI4":"","CONF_ACTI_UNIT5":"","CONF_ACTI_UNIT5_ISO":"","CONF_ACTIVITY5":50,"NO_REMN_ACTI5":"","CONF_ACTI_UNIT6":"","CONF_ACTI_UNIT6_ISO":"","CONF_ACTIVITY6":60,"NO_REMN_ACTI6":"","CONF_BUS_PROC_UNIT1":"","CONF_BUS_PROC_UNIT1_ISO":"","CONF_BUS_PROC1":0,"NO_REMN_BUS_PROC1":"","EXEC_START_DATE":"0000-00-00","EXEC_START_TIME":"00:00:00","SETUP_FIN_DATE":"0000-00-00","SETUP_FIN_TIME":"00:00:00","PROC_START_DATE":"0000-00-00","PROC_START_TIME":"00:00:00","PROC_FIN_DATE":"0000-00-00","PROC_FIN_TIME":"00:00:00","TEARDOWN_START_DATE":"0000-00-00","TEARDOWN_START_TIME":"00:00:00","EXEC_FIN_DATE":"0000-00-00","EXEC_FIN_TIME":"00:00:00","FCST_FIN_DATE":"0000-00-00","FCST_FIN_TIME":"00:00:00","STD_UNIT1":"","STD_UNIT1_ISO":"","FORCAST_STD_VAL1":0,"STD_UNIT2":"","STD_UNIT2_ISO":"","FORCAST_STD_VAL2":0,"STD_UNIT3":"","STD_UNIT3_ISO":"","FORCAST_STD_VAL3":0,"STD_UNIT4":"","STD_UNIT4_ISO":"","FORCAST_STD_VAL4":0,"STD_UNIT5":"","STD_UNIT5_ISO":"","FORCAST_STD_VAL5":0,"STD_UNIT6":"","STD_UNIT6_ISO":"","FORCAST_STD_VAL6":0,"FORCAST_BUS_PROC_UNIT1":"","FORC_BUS_PROC_UNIT1_ISO":"","FORCAST_BUS_PROC_VAL1":0,"PERS_NO":pv_person_nbr,"TIMEID_NO":"00000000","WAGETYPE":"","SUITABILITY":"","NO_OF_EMPLOYEE":0,"WAGEGROUP":"","BREAK_UNIT":"","BREAK_UNIT_ISO":"","BREAK_TIME":0,"EX_CREATED_BY":"","EX_CREATED_DATE":"0000-00-00","EX_CREATED_TIME":"00:00:00","TARGET_ACTI1":"","TARGET_ACTI2":"","TARGET_ACTI3":"","TARGET_ACTI4":"","TARGET_ACTI5":"","TARGET_ACTI6":"","TARGET_BUS_PROC1":"","EX_IDENT":"","LOGDATE":"0000-00-00","LOGTIME":"00:00:00","WIP_BATCH":"","VENDRBATCH":"","ME_SFC_ID":"","ME_2ND_CONF_QTY":0}]);
	oRFC.requestResults(["RETURN","TIMETICKETS","DETAIL_RETURN"]);
	oRFC.send();
	var _RETURN = oRFC.getResultObject("RETURN");
	var _TIMETICKETS = oRFC.getResultObject("TIMETICKETS");
	var _DETAIL_RETURN = oRFC.getResultObject("DETAIL_RETURN");
	//f_message("f_set_person_task",pv_prod_nbr,pv_confirm_nbr,pv_person_nbr,pv_task_type);
	
	if (_RETURN.MESSAGE !== "") {
		session.utils.log(_RETURN.MESSAGE);
		alert("The confirmation cannot be saved right now. Please wait a few moments and try again.\nMessage:" + _RETURN.MESSAGE + "\nPerson: " + pv_person_nbr);
		f_rollback();
	}
	
	session.utils.log("Production Nbr: " + pv_prod_nbr + " Confirmation Nbr: " + pv_confirm_nbr + " Person: " + pv_person_nbr + " Task: " + pv_task_type);
	
	//f_rollback();
	f_commit();
}

function f_message(pv_calling_function, pv_prod_nbr,pv_confirm_nbr,pv_person_nbr,pv_task_type) {
	alert("Calling From: " + pv_calling_function + "\nProduction Number: " + pv_prod_nbr + "\nConfirmation Number: " + pv_confirm_nbr + "\nPerson Number: " + pv_person_nbr + "\nTask Type: " + pv_task_type);
}