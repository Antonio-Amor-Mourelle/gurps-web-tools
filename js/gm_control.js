// gm_control.js
var gm_control_sheet = new Array();

function propogateMooks() {
	for(count = 0; count < 5; count++) {
		gm_control_sheet.push( new class_character());
		gm_control_sheet[count].set_name("Mook #" + (count+1));
	}

}

function display_control_sheet() {
	html = "";
	set_events = false;
	if(gm_control_sheet.length > 0) {
		for(count = 0; count < gm_control_sheet.length; count++) {
			html += '<tr>';
			html += '<td>' + gm_control_sheet[count].get_name() + '</td>';
			html += '<td>0</td>';
			html += '<td>' + gm_control_sheet[count].get_attribute('st') + ' / ' + gm_control_sheet[count].get_attribute('dx') + ' / ' + gm_control_sheet[count].get_attribute('iq') + ' / ' + gm_control_sheet[count].get_attribute('ht') + '</td>';
			html += '<td>' + gm_control_sheet[count].get_secondary('will') + ' / ' + gm_control_sheet[count].get_secondary('per') + '</td>';
			html += '<td>' + gm_control_sheet[count].get_secondary('speed') + ' / ' + gm_control_sheet[count].get_secondary('move') + '</td>';
			html += '<td>2</td>';
			html += '<td>' + gm_control_sheet[count].get_secondary('curr_hp') + ' / ' + gm_control_sheet[count].get_secondary('hp') + '</td>';
			html += '<td>';
			html += '<a href="#" ref="' + count + '" title="Remove This Entry" class="js-gm-control-remove-line"><span class="glyphicon glyphicon-trash"></span></a>';
			html += '<a href="#" ref="' + count + '" title="Duplicate This Entry" class="js-gm-control-remove-line"><span class="glyphicon glyphicon-minus"></span></a>';
			html += '</td>';
			html += '</tr>';
			set_events = true;
		}
	} else {
		html += "<tr><td colspan='8'>There are no items in your control sheet</td></tr>"
	}
	if( set_events )
		refresh_gm_control_events();

	$(".js-gm-control-sheet-display-data").html(html);
}

function refresh_gm_control_events() {
	// function for making sure any new HTML created have events tied
}

$( document ).ready( function() {
	propogateMooks();
	display_control_sheet();
});