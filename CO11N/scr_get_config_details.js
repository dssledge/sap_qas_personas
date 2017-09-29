//wnd[0]/scrptPersonas_1500665691018

var lv_message_bar = session.findById("wnd[0]/sbar").text;

if (includes(lv_message_bar, "already being processed") === true) {
	alert(lv_message_bar + "\nPlease wait until the operation is closed and try again.");
}



var rfc = session.createRFC("BAPI_PRODORDCONF_GETDETAIL");

var ctrl_confirm_nbr = session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subSLOT_HDR:SAPLCORU_S:0111/txtAFRUD-RUECK").text;
var ctrl_persno = "00000000" + session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subSLOT_DET3:SAPLCORU_S:0400/ctxtAFRUD-PERNR").text;
ctrl_persno = ctrl_persno.slice(-8);

//Check if the user does not have an associated person id
if (ctrl_persno === "00000000") {
	alert("Employee Number not Found. Cannot continue to confirmation.\nTry returning to the Work Center selection screen.\nContact IT if this continues.");
	session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subPersonas_149789412541690/boxPersonas_149805019525113/subPersonas_150057995534127/imagePersonas_150306813096613").click();
	
}

var switch_start = false;
var switch_pause = false;
var switch_stop =  false;

//Clickable area control references
var ctrl_start_image = session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subPersonas_149789412541690/boxPersonas_149805019525113/btnPersonas_15005799266075");
var ctrl_pause_image = session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subPersonas_149789412541690/boxPersonas_149805019525113/subPersonas_150057995534127/btnPersonas_150058055132528");
var ctrl_stop_image  = session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subPersonas_149789412541690/boxPersonas_149805019525113/subPersonas_150057995534127/btnPersonas_150058059546094");

//Images references
var pic_start_color = session.findById("wnd[0]/usr/imagePersonas_150185916877863");
var pic_start_grey  = session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subPersonas_149789412541690/boxPersonas_149805019525113/imagePersonas_150185917865844");
var pic_pause_color = session.findById("wnd[0]/usr/imagePersonas_150186159843941");
var pic_pause_grey  = session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subPersonas_149789412541690/boxPersonas_149805019525113/subPersonas_150185973159011/imagePersonas_150186161556666");
var pic_stop_color  = session.findById("wnd[0]/usr/imagePersonas_150186207242140");
var pic_stop_grey   = session.findById("wnd[0]/usr/imagePersonas_150186925316313");

//Traverses the confirmation number's counters starting with the first one
//and keeps looping until an error is returned signaling no additional rows
var cnf_ctr = 1;
var try_err = "";
var persno_last_task;
var conf_dtls;
var	return_stat = "1";
var task_sum = 0;
var text_cnt = 0; //counts number of times "Started" and "Paused" are encountered. 
do {
	
	rfc.setParameter( "CONFIRMATIONCOUNTER",cnf_ctr);
	rfc.setParameter("CONFIRMATION",ctrl_confirm_nbr);
	rfc.requestResults(JSON.stringify(["CONF_DETAIL","RETURN"]));
	rfc.send();

	return_stat = rfc.getResultObject("RETURN");
	conf_dtls = rfc.getResultObject("CONF_DETAIL");
	
	
	//alert("SEQUENCE: " + cnf_ctr + " CostCenter: " + conf_dtls.COSTCENTER + " Conf Name: " + conf_dtls.NAME + " OrderID: " + conf_dtls.ORDERID + " Text: " + conf_dtls.CONF_TEXT);
	cnf_ctr++;
	//Status of 'E' is an error, null is not an error.

	try_err = return_stat.TYPE;
	
	if (try_err !== "E") {
		//Sum the values of Started (1) and Paused (-1) to determine the current state of the confirmation.
		//User based 
		//session.utils.log("conf_dtls.PERS_NO: " + conf_dtls.PERS_NO + "    ctrl_persno: " + ctrl_persno);
		if (conf_dtls.PERS_NO == ctrl_persno ) {
			switch (conf_dtls.CONF_TEXT) {
				case "Started":
					task_sum++;
					text_cnt++;
					break;
				case "Paused":
					task_sum--;
					text_cnt++;
					break;
				default:
					
			}
		}
		//Edit box in the work area to hold the production order number
		session.findById("wnd[0]/usr/boxPersonas_149995858475760/txtPersonas_150272523629876").text = conf_dtls.ORDERID;
	}
	
} //end do
while (try_err != "E");

if (text_cnt === 0) {
	task_sum = -1;
}
var ctrl_task_state = session.findById("wnd[0]/usr/txtPersonas_15060211783353"); //Task State input box

	//Set up defaults for the task buttons	
	pic_start_color.hide();
	pic_start_grey.hide();
	pic_pause_color.hide();
	pic_pause_grey.hide();
	pic_stop_color.hide();
	pic_stop_grey.hide();
	
	//Check the transaction status
	switch (task_sum) {
		//case "Started":
		case 1:
			switch_start = false;
			switch_pause = true;
			switch_stop = true;
			
			pic_start_color.hide();
			pic_start_grey.show();
			pic_pause_color.show();
			pic_pause_grey.hide();
			pic_stop_color.show();
			pic_stop_grey.hide();
			ctrl_task_state.text = "1";
			break;
		//case "Paused":
		case 0:
			switch_start = true;
			switch_pause = false;
			switch_stop = true;
			
			pic_start_color.show();
			pic_start_grey.hide();
			pic_pause_color.hide();
			pic_pause_grey.show();
			pic_stop_color.show();
			pic_stop_grey.hide();
			ctrl_task_state.text = "2";
			break;
			
		default : //Default to allow starting if the comment does not follow the expected pattern
			switch_pause = false;
			switch_start = true;
			switch_stop = false;
			
			pic_start_color.show();
			pic_start_grey.hide();
			pic_pause_color.hide();
			pic_pause_grey.show();
			pic_stop_color.hide();
			pic_stop_grey.show();
			ctrl_task_state.text = "3";
	} //switch			
	
	ctrl_start_image.enabled = switch_start;	
	ctrl_pause_image.enabled = switch_pause;
	ctrl_stop_image.enabled = switch_stop;

//Scanner input box
session.findById("wnd[0]/usr/txtPersonas_150602057651862").setFocus();

//Internet Explorer does not support string.includes()
//https://www.sharmaprakash.com.np/javascript/ie-alternative-to-inludes/
function includes(container, value) {
	var returnValue = false;
	var pos = container.indexOf(value);
	if (pos >= 0) {
		returnValue = true;
	}
	return returnValue;
}