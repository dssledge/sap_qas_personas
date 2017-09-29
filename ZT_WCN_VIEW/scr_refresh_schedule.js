//wnd[0]/scrptPersonas_1505825544027
	work_center = session.findById("wnd[0]/usr/subPersonas_150187838242348/txtPersonas_150220241392069").text;
					//Finalized confirmation, refresh the report for the production order number
					session.findById("wnd[0]/tbar[0]/okcd").text = "/nzt_wcn";
					session.findById("wnd[0]").sendVKey(0);
					//session.findById("wnd[0]/usr/ctxtS_AUFNR-LOW").text = prod_order;
					session.findById("wnd[0]/usr/ctxtS_ARBPL-LOW").text = work_center;
					session.findById("wnd[0]/usr/ctxtS_AUFNR-HIGH").setFocus();
					session.findById("wnd[0]/tbar[1]/btn[8]").press();
					session.findById("wnd[0]").sendVKey(0);
					session.findById("wnd[0]/tbar[0]/btn[15]").press();
					session.findById("wnd[0]/usr/ctxtS_GLTRP-LOW").setFocus();
					session.findById("wnd[0]/tbar[0]/btn[15]").press();
