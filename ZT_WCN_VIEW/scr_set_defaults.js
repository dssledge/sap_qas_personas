//wnd[0]/scrptPersonas_1502213087357

//Display the selected work center
session.findById("wnd[0]/usr/subPersonas_150187838242348/txtPersonas_150220241392069").text = session.findById("wnd[0]/usr/cntlGRID1/shellcont/shell").getCellValue(0, "ARBPL");
//Set focus on the Production Order seach box
session.findById("wnd[0]/usr/subPersonas_150187838242348/txtPersonas_15023960657572").setFocus();







