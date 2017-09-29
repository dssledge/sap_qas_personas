//wnd[0]/scrptPersonas_1506020628934
var scan_input = session.findById("wnd[0]/usr/txtPersonas_150602057651862").text;
var task_type = session.findById("wnd[0]/usr/txtPersonas_15060211783353").text;

switch (scan_input) {
		//case "Started":
		case "Play":
			if (task_type == "2" || task_type == "3") {
				session.utils.log("Received request to Play");
				session.utils.put("pv_task_type","start");
				session.utils.executeScript("wnd[0]/scrptPersonas_1500650516341");
			}
			
			break;
		//case "Paused":
		case "Pause":
		if (task_type == "1") {
			session.utils.log("Received request to Pause");
				session.utils.put("pv_task_type","pause");
				session.utils.executeScript("wnd[0]/scrptPersonas_1500650516341");
			}
			
			break;
		case "Stop":
		if (task_type == "1" || task_type == "2") {
			session.utils.log("Received request to Stop");
				session.utils.put("pv_task_type","stop");
				session.utils.executeScript("wnd[0]/scrptPersonas_1500650516341");
			}
			
			break;			
		case "Back":
			session.utils.executeScript("wnd[0]/scrptPersonas_1500321974256");
}
