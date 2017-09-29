//wnd[0]/scrptPersonas_1497060315057
//UI Controls Fields
	//Personnel No.
	var ctrl_pers_nbr = session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subSLOT_DET3:SAPLCORU_S:0400/ctxtAFRUD-PERNR");
	//Custom: Qty Reqd
	var ctrl_qty_reqd = session.findById("wnd[0]/usr/boxPersonas_149995858475760/txtPersonas_149995864930877");
	//Yield
	var ctrl_yield = session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subSLOT_DET1:SAPLCORU_S:0205/txtAFRUD-LMNGA");
	//Confirm.type
	var ctrl_confirm_type = session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subSLOT_CONF_TYPE:SAPLCORU_S:0105/cmbAFRUD-AUERU");
	//Confirmation
	var ctrl_conf_nbr = session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subSLOT_HDR:SAPLCORU_S:0111/txtAFRUD-RUECK");

var username = session.info.user; //Current user
var FM = session.createRFC("BAPI_USER_GET_DETAIL");

FM.setParameter("USERNAME",username);
FM.requestResults(JSON.stringify(["ADDRESS","ADMINDATA","LOGONDATA","RETURN"]));
FM.send();

var address = JSON.parse(FM.getResult("ADDRESS"));
var admindata = JSON.parse(FM.getResult("ADMINDATA"));
var logondata = JSON.parse(FM.getResult("LOGONDATA"));

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
ctrl_pers_nbr.text = _USR_PERNR;

//Check if the Confirmation field is populated and then populate page with actual data
if (ctrl_conf_nbr.text !== "")
{
	//Set Confirmation Type field to 'Automatic'
	ctrl_confirm_type.key = "1";
		
	//Press the 'Actual Data' button
	session.findById("wnd[0]/tbar[1]/btn[13]").press();

	//Set value of the 'Qty Reqd' field to match the actual data of the 'Yield / Quantity Produced' field
	ctrl_qty_reqd.text = ctrl_yield.text;
	
	if (ctrl_yield.text === "") {
		alert("This confirmation is open by another user. Please try again later.");
		session.utils.executeScript("wnd[0]/scrptPersonas_1500321974256");
	}
	else {
	//call scr_get_conf_details
	session.utils.executeScript("wnd[0]/scrptPersonas_1500665691018");
	}
	
}	
else { 
	alert("No Confirmation Found"); 
}


