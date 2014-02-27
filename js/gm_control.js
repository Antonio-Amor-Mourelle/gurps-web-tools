// gm_control.js
var gm_control_sheet = new Array();

function gm_control_propogate_mooks() {
	debugConsole("gm_control_propogate_mooks() called");
	for(count = 0; count < 5; count++) {
		gm_control_sheet.push( new class_character());
		gm_control_sheet[count].set_name("Long Name Mook #" + (count+1));
	}

}

function gm_control_display_sheet() {
	debugConsole("gm_control_display_sheet() called");
	html = "";
	set_events = false;
	if(gm_control_sheet.length > 0) {
		for(count = 0; count < gm_control_sheet.length; count++) {
			html += '<tr>';
			html += '<td>' + gm_control_sheet[count].get_name() + '</td>';

			html += '<td>' + gm_control_sheet[count].get_attribute('st') + ' / ' + gm_control_sheet[count].get_attribute('dx') + ' / ' + gm_control_sheet[count].get_attribute('iq') + ' / ' + gm_control_sheet[count].get_attribute('ht') + '</td>';
			html += '<td>' + gm_control_sheet[count].get_secondary('will') + ' / ' + gm_control_sheet[count].get_secondary('per') + '</td>';
			html += '<td>' + gm_control_sheet[count].get_secondary('speed') + '</td>';
			html += '<td>' + gm_control_sheet[count].get_secondary('move') + '</td>';
			html += '<td>2</td>';
			html += '<td>' + gm_control_sheet[count].get_secondary('curr_hp') + ' / ' + gm_control_sheet[count].get_secondary('hp') + '</td>';
			html += '<td>0</td>';
			html += '<td>';
			html += ' <a href="#" ref="' + count + '" title="Edit This Entry" class="js-gm-control-line-edit"><span class="glyphicon glyphicon-edit"></span></a> ';
			html += ' <a href="#" ref="' + count + '" title="Duplicate This Entry" class="js-gm-control-line-duplicate"><span class="glyphicon glyphicon-share"></span></a> ';
			html += ' <a href="#" ref="' + count + '" title="Remove This Entry" class="js-gm-control-line-remove"><span class="glyphicon glyphicon-trash"></span></a> ';
//			html += '<a href="#" ref="' + count + '" title="Duplicate This Entry" class="js-gm-control-duplicate-line"><span class="glyphicon glyphicon-minus"></span></a>';


			html += '</td>';
			html += '</tr>';
			set_events = true;
		}
	} else {
		html += "<tr><td colspan='8'>There are no items in your control sheet</td></tr>"
	}

	$(".js-gm-control-sheet-display-data").html( html );

	if( set_events )
		gm_control_refresh_events();
}

function gm_control_init_entry_form(character) {
	if(character) {
		$(".js-char-field-name").val( character.get_name() );

		$(".js-char-field-st").val( character.get_attribute('st') );
		$(".js-char-field-dx").val( character.get_attribute('dx') );
		$(".js-char-field-iq").val( character.get_attribute('iq') );
		$(".js-char-field-ht").val( character.get_attribute('ht') );

		$(".js-char-field-speed").val( character.get_secondary('speed') );
		$(".js-char-field-move").val( character.get_secondary('move') );
		$(".js-char-field-will").val( character.get_secondary('will') );
		$(".js-char-field-per").val( character.get_secondary('per') );

		$(".js-char-field-reaction").val( character.get_secondary('reaction') );

		$(".js-char-field-dr").val( character.get_secondary('dr') );
		$(".js-char-field-hp").val( character.get_secondary('hp') );
		$(".js-char-field-curr_hp").val( character.get_secondary('curr_hp') );
	} else {
		$(".js-char-field-name").val();

		$(".js-char-field-st").val();
		$(".js-char-field-dx").val();
		$(".js-char-field-iq").val();
		$(".js-char-field-ht").val();

		$(".js-char-field-speed").val();
		$(".js-char-field-move").val();
		$(".js-char-field-will").val();
		$(".js-char-field-per").val();

		$(".js-char-field-reaction").val();

		$(".js-char-field-dr").val();
		$(".js-char-field-hp").val();
		$(".js-char-field-curr_hp").val();
	}
}

function assignDataToChar(character) {
	character.set_name( $(".js-char-field-name").val()  );

	character.set_attribute("st", $(".js-char-field-st").val() );
	character.set_attribute("dx", $(".js-char-field-dx").val() );
	character.set_attribute("iq", $(".js-char-field-iq").val() );
	character.set_attribute("ht", $(".js-char-field-ht").val() );

	character.set_secondary("speed", $(".js-char-field-speed").val() );
	character.set_secondary("move", $(".js-char-field-move").val() );
	character.set_secondary("will", $(".js-char-field-will").val() );
	character.set_secondary("per", $(".js-char-field-per").val() );

	character.set_secondary("reaction", $(".js-char-field-reaction").val() );

	character.set_secondary("dr", $(".js-char-field-dr").val() );
	character.set_secondary("hp", $(".js-char-field-hp").val() );
	character.set_secondary("curr_hp", $(".js-char-field-curr_hp").val() );

	return character;
}

function gm_control_show_add_line_dialog() {
	gm_control_init_entry_form();
	$(".js-gm-control-line-dialog-action-button").text("Add").button('refresh');

	$('.js-gm-control-line-dialog-action-button').unbind('click');
	$('.js-gm-control-line-dialog-action-button').click( function(event) {
		event.preventDefault();
		// TODO: Add entry data to new character
		newChar = new class_character();

		newChar = assignDataToChar(newChar);

		// add to gm_control_sheet array
		gm_control_sheet.push( newChar );

		// Refresh Sheet
		gm_control_display_sheet();
		$('.js-gm-control-line-dialog').modal('hide');
		return false;
	} );

	$('.js-gm-control-line-dialog').modal();
}

function gm_control_show_edit_line_dialog(character, index) {
	gm_control_init_entry_form(character);
	$(".js-gm-control-line-dialog-action-button").val("Save");

	$('.js-gm-control-add-line').unbind('click');
	$('.js-gm-control-add-line').click( function(event) {
		event.preventDefault();
		// TODO: Update data to exiting character in gm_control_sheet
		gm_control_sheet[index] = assignDataToChar(gm_control_sheet[index]);
		// Refresh Sheet
		gm_control_display_sheet();
		return false;
	} );


	$('.js-gm-control-line-dialog').modal();
}

function gm_control_show_duplicate_line_dialog(character) {
	gm_control_init_entry_form(character);
	$(".js-gm-control-line-dialog-action-button").val("Add");

	$('.js-gm-control-add-line').unbind('click');
	$('.js-gm-control-add-line').click( function(event) {
		event.preventDefault();
		newChar = new class_character();

		// Add entry data to new character
		gm_control_sheet.push( newChar );

		// add to gm_control_sheet array
		gm_control_sheet.push( newChar );

		// Refresh Sheet
		gm_control_display_sheet();
		return false;
	} );

	$('.js-gm-control-line-dialog').modal();
}

function gm_control_refresh_events() {
	// function for making sure any new HTML created have events tied
	debugConsole("gm_control_refresh_events() called");

	// Action Bar Controls
	$('.js-gm-control-new').unbind('click');
	$('.js-gm-control-new').click( function(event) {
		event.preventDefault();
		if( confirm("This will clear out all your items in your current control sheet. Are you sure you want to do this?") )
			gm_control_sheet = Array();
		gm_control_display_sheet();
		return false;
	} );

	$('.js-gm-control-add-line').unbind('click');
	$('.js-gm-control-add-line').click( function(event) {
		event.preventDefault();
		gm_control_show_add_line_dialog();
		return false;
	} );

	$('.js-gm-control-save').unbind('click');
	$('.js-gm-control-save').click( function(event) {
		event.preventDefault();
		create_alert("This function is still a work in progress", "danger");
		return false;
	} );

	$('.js-gm-control-load').unbind('click');
	$('.js-gm-control-load').click( function(event) {
		event.preventDefault();
		create_alert("This function is still a work in progress", "danger");
		return false;
	} );

	$('.js-gm-control-import').unbind('click');
	$('.js-gm-control-import').click( function(event) {
		event.preventDefault();
		create_alert("This function is still a work in progress", "danger");
		return false;
	} );

	$('.js-gm-control-export').unbind('click');
	$('.js-gm-control-export').click( function(event) {
		event.preventDefault();
		create_alert("This function is still a work in progress", "danger");
		return false;
	} );

	// Line Item Controls
	$('.js-gm-control-line-remove').unbind('click');
	$('.js-gm-control-line-remove').click( function(event) {
		event.preventDefault();
		if( confirm("Are you sure you want to delete this line?") )
			gm_control_sheet.splice( $(this).attr("ref"), 1);
		gm_control_display_sheet();
		return false;
	} );

	$('.js-gm-control-line-duplicate').unbind('click');
	$('.js-gm-control-line-duplicate').click( function(event) {
		event.preventDefault();
		gm_control_show_duplicate_line_dialog(gm_control_sheet[ $(this).attr("ref")]);
		return false;
	} );

	$('.js-gm-control-line-edit').unbind('click');
	$('.js-gm-control-line-edit').click( function(event) {
		event.preventDefault();
		gm_control_show_duplicate_line_dialog(gm_control_sheet[ $(this).attr("ref")], $(this).attr("ref"));
		return false;
	} );

}

$( document ).ready( function() {
	gm_control_propogate_mooks();
	gm_control_display_sheet();
});