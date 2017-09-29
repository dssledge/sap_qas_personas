//wnd[0]/scrptPersonas_1506447853155

var lv_task_type = "Started";
//Defaults Table
var conf_tbl_defaults = session.findById("wnd[0]/usr/subCOL_SUG_TICKET1:SAPLCORU:0805/tblSAPLCORUTABCDEF_0805");
alert (conf_tbl_defaults.getColumnName(14)); //AFRD-PERNR
conf_tbl_defaults.modifyCell(0,"AFRD-PERNR",f_get_pers_id());

//Confirmations Table
var conf_tbl = session.findById("wnd[0]/usr/subCOL_TICKET1:SAPLCORU:0806/tblSAPLCORUTABCNTR_0806");
//alert(conf_tbl.rowCount);
//alert(conf_tbl.getColumnName(1));
var conf_nbr;
var conf_index = 0;
do {
	conf_nbr=conf_tbl.getCellValue(conf_index,"AFRUD-RUECK");
	//alert(conf_nbr);
	if (conf_nbr !== "") {
	f_set_conf_text(conf_index, lv_task_type);
	}
	conf_index ++;
	
} 
while (conf_nbr !== "");


function f_set_conf_text(pv_index, pv_task_type) {

session.findById("wnd[0]/usr/subCOL_TICKET1:SAPLCORU:0806/tblSAPLCORUTABCNTR_0806").selectedRowsAbsolute = pv_index + "";
session.findById("wnd[0]/usr/subCOL_TICKET1:SAPLCORU:0806/tblSAPLCORUTABCNTR_0806/txtCORUF-GM_ICON[0,1]").setFocus();
session.findById("wnd[0]/usr/btnSHOWDETAIL").press();

session.findById("wnd[0]/usr/subVAR_CNF_10:SAPLCORU:0900/txtAFRUD-LTXA1").text = pv_task_type;
session.findById("wnd[0]/usr/subVAR_CNF_10:SAPLCORU:0900/txtAFRUD-LTXA1").setFocus();
session.findById("wnd[0]/tbar[0]/btn[3]").press();
}

function f_get_pers_id() {
	var username = session.info.user; //Current user
	//Gets current user personnel id and populates the associated text field with the same
var oRFC = session.createRFC("RP_GET_PERNR_FROM_USERID");
oRFC.setParameter("BEGDA", "2000-01-01");
oRFC.setParameter("ENDDA", "9998-12-31");
oRFC.setParameter("USRID", username);
oRFC.setParameter("USRTY", "0001");
oRFC.requestResults(["USR_PERNR"]);
oRFC.send();
var _USR_PERNR = oRFC.getResultObject("USR_PERNR");

//Set the Personnel No. field to the the current user personnel number
//ctrl_pers_nbr.text = _USR_PERNR;
	return _USR_PERNR;
}