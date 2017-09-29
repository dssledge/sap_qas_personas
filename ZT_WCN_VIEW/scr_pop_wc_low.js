//wnd[0]/scrptPersonas_1499889447560

var wc_choice = session.findById("wnd[0]/usr/cmbPersonas_149988935631844").text;

if (wc_choice === "Back") {
	session.utils.executeScript("wnd[0]/scrptPersonas_1502907606248");
}
else {
session.findById("wnd[0]/usr/txtS_ARBPL-LOW").text = wc_choice;
session.findById("wnd[0]/usr/txtS_ARBPL-LOW").setFocus();
session.findById("wnd[0]/tbar[1]/btn[8]").press();
	
	if (session.findById("wnd[0]/sbar").text === "E: Data not found") {
		alert("This work center has no outstanding operations to confirm");
		session.findById("wnd[0]/tbar[0]/btn[15]").press();
	}
}