//wnd[0]/scrptPersonas_1506018916744
var scan_input_box = session.findById("wnd[0]/usr/txtPersonas_150601889147321");


if (scan_input_box.text == "WC") {
	session.findById("wnd[0]/usr/btnPersonas_149989141688489").press();
}