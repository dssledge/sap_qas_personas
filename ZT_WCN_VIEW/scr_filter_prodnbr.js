//wnd[0]/scrptPersonas_1502399245731

//Value of production number
var prod_number = session.findById("wnd[0]/usr/subPersonas_150187838242348/txtPersonas_15023960657572").text;
var prod_number = prod_number.trim();
var sched_tbl = session.findById("wnd[0]/usr/cntlGRID1/shellcont/shell");

if (prod_number === "Back") {
	session.utils.executeScript("wnd[0]/scrptPersonas_1499956115936");
}



set_filter(prod_number,"6");

var flt_table = session.findById("wnd[0]/usr/cntlGRID1/shellcont/shell");
if (flt_table.rowCount !== 0) {
	sched_tbl.doubleClick(0,"RUECK");
	sched_tbl.setCurrentCell(0,"RUECK");
}
else {
	alert("Confirmation not found: Check your entry.");
}
//


function set_filter(pv_number , pv_position) {
	//pv_position - 5=Production Number , 6=Confirmation Number
	
// An OnLoad or OnAfterRefresh script was executed.
session.findById("wnd[0]/tbar[1]/btn[29]").press();

session.findById("wnd[1]/usr/subSUB_DYN0500:SAPLSKBH:0600/cntlCONTAINER1_FILT/shellcont/shell").executeWebRequest("post", "action", "53", "row_index="+pv_position+"&column_index=1", null);
session.findById("wnd[1]/usr/subSUB_DYN0500:SAPLSKBH:0600/cntlCONTAINER1_FILT/shellcont/shell").clearSelection();
session.findById("wnd[1]/usr/subSUB_DYN0500:SAPLSKBH:0600/cntlCONTAINER1_FILT/shellcont/shell").selectedRowsAbsolute = "" +  (pv_position-1) + "" ;
session.findById("wnd[1]/usr/subSUB_DYN0500:SAPLSKBH:0600/cntlCONTAINER1_FILT/shellcont/shell").executeWebRequest("post", "action", "53", "row_index="+pv_position+"&column_index=1", null);
session.findById("wnd[1]/usr/subSUB_DYN0500:SAPLSKBH:0600/cntlCONTAINER1_FILT/shellcont/shell").setFocus();
session.findById("wnd[1]/usr/subSUB_DYN0500:SAPLSKBH:0600/btnAPP_WL_SING").press();

session.findById("wnd[1]/usr/subSUB_DYN0500:SAPLSKBH:0600/btn600_BUTTON").press();

session.findById("wnd[2]/usr/ssub%_SUBSCREEN_FREESEL:SAPLSSEL:1105/ctxt%%DYN001-LOW").text = pv_number;
session.findById("wnd[2]/usr/ssub%_SUBSCREEN_FREESEL:SAPLSSEL:1105/ctxt%%DYN001-LOW").setFocus();
session.findById("wnd[2]/tbar[0]/btn[0]").press();


}










