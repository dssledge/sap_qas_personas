//wnd[0]/scrptPersonas_1500650516341

//This script expects one of the following values for the parameter pv_task_type
//start -- a request to start a new task
//pause -- a request to pause a task
//stop -- a request to stop (finalize) a task

var lv_task_type = session.utils.get("pv_task_type");
var confirm_task_chg = false; //True when the user confirms to change the task type

//--------------------------
//--Provide Date/Time values
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

//Date Formatting
if(dd<10) {
    dd='0' +dd;
} 

if(mm<10) {
    mm='0'+mm;
} 

//Time Formatting
var mins = today.getMinutes() - 1;
var secs = today.getSeconds();

if (mins<10) { 
mins='0'+mins;
}

if (secs<10) {
	secs = '0'+secs;
	}

var curtime = today.getHours() + ":" + mins + ":" + secs;
today = mm+'/'+dd+'/'+yyyy;
//-----------------------------------------

//Variables to hold the UI control objects
var ctrl_start_date = session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subSLOT_DET4:SAPLCORU_S:0500/ctxtAFRUD-ISDD");
var ctrl_start_time = session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subSLOT_DET4:SAPLCORU_S:0500/ctxtAFRUD-ISDZ");
var ctrl_end_date = session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subSLOT_DET4:SAPLCORU_S:0500/ctxtAFRUD-IEDD");
var ctrl_end_time = session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subSLOT_DET4:SAPLCORU_S:0500/ctxtAFRUD-IEDZ");
var ctrl_labor_hrs = session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subSLOT_DET2:SAPLCORU_S:0300/txtAFRUD-ISM03");
var ctrl_comment = session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subSLOT_DET6:SAPLCORU_S:0800/cntlTEXTEDITOR1/shellcont/shell");
var ctrl_yield = session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subSLOT_DET1:SAPLCORU_S:0205/txtAFRUD-LMNGA"); 
var ctrl_confirm_type = session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subSLOT_CONF_TYPE:SAPLCORU_S:0105/cmbAFRUD-AUERU");
var persn_nbr = "00000000" + session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subSLOT_DET3:SAPLCORU_S:0400/ctxtAFRUD-PERNR").text;
persn_nbr = persn_nbr.slice(-8);
//Prep environment for the task type
switch (lv_task_type) {
		
	case "start":
		ctrl_comment.text = "Started";
		ctrl_start_date.text = today;
		ctrl_start_time.text = curtime;
		ctrl_end_date.text = "";
		ctrl_end_time.text = "00:00:00";
		ctrl_labor_hrs.text = "0";
		ctrl_yield.text = "0";
		ctrl_confirm_type.key = "";	
		task_sum = 1;
		//confirm_task_chg = confirm("Do you want to start this confirmation?");
		confirm_task_chg = true;
		break;
		
	case "pause":	
		ctrl_comment.text = "Paused";
		ctrl_start_date.text = today;
		ctrl_start_time.text = curtime;
		ctrl_end_date.text = "";
		ctrl_end_time.text = "00:00:00";
		ctrl_labor_hrs.text = "0";
		ctrl_yield.text = "0";
		ctrl_confirm_type.key = "";			
		task_sum = 1;
		//confirm_task_chg = confirm("Do you want to pause this confirmation?");
		confirm_task_chg = true;
		break;
		
	case "stop":
		//Traverse all sequences for the confirmation and sum the pauses (-1) starts (+1) as task_sum.
		//A value of 0 = stopped confirmation, 1 = ready to be stopped confirmation, >1 = cannot be stopped (several people working on the job)
		var rfc = session.createRFC("BAPI_PRODORDCONF_GETDETAIL");
		var ctrl_confirm_nbr = session.findById("wnd[0]/usr/ssubSUB01:SAPLCORU_S:0010/subSLOT_HDR:SAPLCORU_S:0111/txtAFRUD-RUECK").text;
		var cnf_ctr = 0;
		var try_err = ""; //expecting 'E' once no additional records are found in the confirmation
		var conf_dtls;
		var	return_stat;
		var task_sum = 0;
		var user_task_sum = 0;
		var task_active = 0; //the count of started/paused tasks by all users
		ctrl_end_date.text = today;
		ctrl_end_time.text = curtime;
		ctrl_comment.text = "Completed";
		ctrl_confirm_type.key = "X";
		do {
				if (try_err !== "E" && cnf_ctr > 0) {
					switch (conf_dtls.CONF_TEXT) {
						case "Started":
							task_sum++;
							task_active++;
							if (conf_dtls.PERS_NO == persn_nbr) {
								user_task_sum++;
								task_active--; 
							}
							break;
						case "Paused":
							task_sum--;
							task_active++;
							if (conf_dtls.PERS_NO == persn_nbr) {
								user_task_sum--;
								task_active--;
							}
							break;
						default:	
					} //switch
				} //if
			
			cnf_ctr++;
			rfc.setParameter( "CONFIRMATIONCOUNTER",cnf_ctr);
			rfc.setParameter("CONFIRMATION",ctrl_confirm_nbr);
			rfc.requestResults(JSON.stringify(["CONF_DETAIL","RETURN"]));
			rfc.send();
			conf_dtls = rfc.getResultObject("CONF_DETAIL");
			return_stat = rfc.getResultObject("RETURN");
			try_err = return_stat.TYPE;
	
		} //end do
		while (try_err != "E");
		
		//------------------------------------------------------------
	
		//When task_active is zero this means that only the current user has any tasks on the confirmation, if not then there are
		//additional team members working the confirmation
		if (task_active > 0) {
					confirm_task_chg = confirm("There are additional people ACTIVELY working on this confirmation.\nDo you want to stop the work on the confirmation?");
					if (confirm_task_chg === true) {
						confirm_task_chg = confirm("This is to verify you want to finalize the confirmation for ALL.");
					}
		}
		else //there is no one else working the confirmation and the user can stop without concern about affecting other members
		{
			confirm_task_chg = confirm("Ok to finalize this confirmation ticket?");
		}
		break;
} //end switch

//User has confirmed to change the task type
if (confirm_task_chg === true) {
	//Get the production order number
	var prod_order = session.findById("wnd[0]/usr/boxPersonas_149995858475760/txtPersonas_150272523629876").text;
	prod_order = prod_order.substring(5,12);
	
	if (task_active > 0) { //Process Team Pause 
		//Run the script to pause all other user tasks
		session.utils.put("pv_prod_nbr",prod_order);
		session.utils.put("pv_confirm_nbr",ctrl_confirm_nbr);
		session.utils.put("pv_person_nbr",persn_nbr);
		session.utils.put("pv_task_type","Paused");
		session.utils.put("pv_yield_qty",ctrl_yield.text);
		session.utils.put("pv_activity_3",ctrl_labor_hrs.text);
		session.utils.executeScript("wnd[0]/scrptPersonas_1504720308798");
		f_update_schedule();
	}
	else { //Non-Team transaction
		//Save the confirmation ticket and exit the tcode
		session.findById("wnd[0]/tbar[0]/btn[11]").press();
				
		//Toolbar messages
		var message_bar_text = session.findById("wnd[0]/sbar").text;
		//alert(message_bar_text);
		//Check if the transaction saves, if not then present the error
		//if 	(message_bar_text.includes("saved") === true)
		if (includes(message_bar_text, "saved") === true)
		{
			
			
			//A STOP task will signal that the schedule report needs to be refreshed by ZT_WCN
			if (lv_task_type == "stop") 
				{ 
					f_update_schedule();
				}
			else {
				f_return2dashboard();
			}
			
			
		}
		else 
		{
			alert(message_bar_text + "\nThis task change will not be saved.");
			session.utils.executeScript("wnd[0]/scrptPersonas_1500321974256"); //cancels the current screen
		}
	}
	}
	

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

function f_update_schedule() {
	//alert("Press OK to refresh the schedule");
					//Finalized confirmation, refresh the report for the production order number
					session.findById("wnd[0]/tbar[0]/okcd").text = "/nzt_wcn";
					session.findById("wnd[0]").sendVKey(0);
					session.findById("wnd[0]/usr/ctxtS_AUFNR-LOW").text = prod_order;
					session.findById("wnd[0]/usr/ctxtS_AUFNR-HIGH").setFocus();
					session.findById("wnd[0]/tbar[1]/btn[8]").press();
					session.findById("wnd[0]").sendVKey(0);
					session.findById("wnd[0]/tbar[0]/btn[15]").press();
					session.findById("wnd[0]/usr/ctxtS_GLTRP-LOW").setFocus();
					session.findById("wnd[0]/tbar[0]/btn[15]").press();
}

function f_return2dashboard() {
	//Returns user to Dashboard

//Exit ZT_WCN_VIEW Schedule Report Screen
session.findById("wnd[0]/tbar[0]/btn[15]").press();
//Exit ZT_WCN_VIEW Workcenter selection scree
session.findById("wnd[0]/tbar[0]/btn[15]").press();
	
}
