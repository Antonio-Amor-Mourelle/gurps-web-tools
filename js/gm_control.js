// gm_control.js
var gm_control_sheet = new Array();
var gm_control_currently_editing = 0;
function gm_control_propogate_mooks() {
	debugConsole("gm_control_propogate_mooks() called");
	for(count = 0; count < 5; count++) {
		gm_control_sheet.push( new class_character());
		gm_control_sheet[count].set_name("Long Name Mook #" + (count+1));
	}
}

var gm_control_sheet_currently_selected = Array();

function gm_control_export_json() {
	export_object = Array();

	for(count = 0; count < gm_control_sheet.length; count++) {
		export_item = {
			name: gm_control_sheet[count].get_name(),

			attributes: {
				st: gm_control_sheet[count].get_attribute('st'),
				dx: gm_control_sheet[count].get_attribute('dx'),
				iq: gm_control_sheet[count].get_attribute('iq'),
				ht: gm_control_sheet[count].get_attribute('ht')
			},

			secondary: {
				will: gm_control_sheet[count].get_secondary('will'),
				per: gm_control_sheet[count].get_secondary('per'),
				fatigue: gm_control_sheet[count].get_secondary('fatigue'),
				curr_fatigue: gm_control_sheet[count].get_secondary('curr_fatigue'),
				hp: gm_control_sheet[count].get_secondary('hp'),
				curr_hp: gm_control_sheet[count].get_secondary('curr_hp'),

				speed: gm_control_sheet[count].get_secondary('speed'),
				move: gm_control_sheet[count].get_secondary('move'),

				reaction: gm_control_sheet[count].get_secondary('reaction'),
				dr: gm_control_sheet[count].get_secondary('dr')
			}
		}
		export_object.push(  export_item );
	}
	return JSON.stringify( export_object );
}

function gm_control_import_json(import_string) {
	debugConsole("gm_control_import_json() called");
	import_object = JSON.parse(import_string);
	debugConsole("gm_control_import_json() - type is " + typeof(import_object));
	if (typeof(import_object) == "object") {
		debugConsole("gm_control_import_json() - import is an array");
		for( import_count = 0; import_count < import_object.length; import_count++) {
			imported_object = gm_control_import_object( import_object[import_count] );
			gm_control_sheet.push( imported_object );
		}
	}
	gm_control_display_sheet();
}

function gm_control_import_object( importing_object ) {
	debugConsole("gm_control_import_object() called");
	return_value = new class_character();

	if( typeof(importing_object.name) != "undefined")
		return_value.set_name( importing_object.name );

	if( typeof(importing_object.attributes.st) != "undefined")
		return_value.set_attribute( 'st', importing_object.attributes.st );
	if( typeof(importing_object.attributes.dx) != "undefined")
		return_value.set_attribute( 'dx', importing_object.attributes.dx );
	if( typeof(importing_object.attributes.iq) != "undefined")
		return_value.set_attribute( 'iq', importing_object.attributes.iq );
	if( typeof(importing_object.attributes.ht) != "undefined")
		return_value.set_attribute( 'ht', importing_object.attributes.ht );

	if( typeof(importing_object.secondary.will) != "undefined")
		return_value.set_secondary( 'will', importing_object.secondary.will );
	if( typeof(importing_object.secondary.per) != "undefined")
		return_value.set_secondary( 'per', importing_object.secondary.per );
	if( typeof(importing_object.secondary.fatigue) != "undefined")
		return_value.set_secondary( 'fatigue', importing_object.secondary.fatigue );
	if( typeof(importing_object.secondary.curr_fatigue) != "undefined")
		return_value.set_secondary( 'curr_fatigue', importing_object.secondary.curr_fatigue );

	if( typeof(importing_object.secondary.hp) != "undefined")
		return_value.set_secondary( 'hp', importing_object.secondary.hp );
			if( typeof(importing_object.secondary.curr_hp) != "undefined")
		return_value.set_secondary( 'curr_hp', importing_object.secondary.curr_hp );

	if( typeof(importing_object.secondary.dr) != "undefined")
		return_value.set_secondary( 'dr', importing_object.secondary.dr );
	if( typeof(importing_object.secondary.reaction) != "undefined")
		return_value.set_secondary( 'reaction', importing_object.secondary.reaction );

	if( typeof(importing_object.secondary.move) != "undefined")
		return_value.set_secondary( 'move', importing_object.secondary.move );
	if( typeof(importing_object.secondary.speed) != "undefined")
		return_value.set_secondary( 'speed', importing_object.secondary.speed );

	return return_value;
}

function gm_control_display_sheet() {
	debugConsole("gm_control_display_sheet() called");
	html = "";
	activate_sort_table = false;
	if(gm_control_sheet.length > 0) {
		for(count = 0; count < gm_control_sheet.length; count++) {
			html += '<tr class="dragrow" ref="' + count + '">';
			checked = '';
			if( $.inArray(count, gm_control_sheet_currently_selected) > -1 ) {
				checked = 'checked="checked" ';
			}

			html += '<td><input ' + checked + 'type="checkbox" ref="' + count + '" class="js-select-check" /></td>';
			html += '<td>' + gm_control_sheet[count].get_name() + '</td>';

			html += '<td>' + gm_control_sheet[count].get_attribute('st') + ' / ' + gm_control_sheet[count].get_attribute('dx') + ' / ' + gm_control_sheet[count].get_attribute('iq') + ' / ' + gm_control_sheet[count].get_attribute('ht') + '</td>';
			html += '<td>' + gm_control_sheet[count].get_secondary('will') + ' / ' + gm_control_sheet[count].get_secondary('per') + '</td>';
			html += '<td>' + gm_control_sheet[count].get_secondary('speed') + '</td>';
			html += '<td>' + gm_control_sheet[count].get_secondary('move') + '</td>';
			html += '<td>' + gm_control_sheet[count].get_secondary('dr') + '</td>';
			html += '<td>' + gm_control_sheet[count].get_secondary('curr_hp') + ' / ' + gm_control_sheet[count].get_secondary('hp') + '</td>';
			html += '<td>' + gm_control_sheet[count].get_secondary('curr_fatigue') + ' / ' + gm_control_sheet[count].get_secondary('fatigue') + '</td>';
			html += '<td>' + gm_control_sheet[count].get_secondary('reaction') + '</td>';
			html += '<td class="text-center">';
			html += ' <a href="#" ref="' + count + '" title="Edit This Entry" class="js-gm-control-line-edit"><span class="glyphicon glyphicon-edit"></span></a> ';
			html += ' <a href="#" ref="' + count + '" title="Duplicate This Entry" class="js-gm-control-line-duplicate"><span class="glyphicon glyphicon-share"></span></a> ';
			html += ' <a href="#" ref="' + count + '" title="Remove This Entry" class="js-gm-control-line-remove"><span class="glyphicon glyphicon-trash"></span></a> ';
//			html += '<a href="#" ref="' + count + '" title="Duplicate This Entry" class="js-gm-control-duplicate-line"><span class="glyphicon glyphicon-minus"></span></a>';


			html += '</td>';
			html += '</tr>';
			activate_sort_table = true;
		}
	} else {
		html += "<tr><td colspan='11'>There are no items in your control sheet</td></tr>"
	}

	$(".js-gm-control-sheet-display-data").html( html );

	gm_control_refresh_events();
	if( activate_sort_table ) {


		//$(".js-gm-control-sheet-display-data").sortable();
		$('.sorted_table').sortable({
			containerSelector: 'table',
			itemPath: '> tbody',
			itemSelector: '.dragrow',
			placeholder: '<tr class="placeholder" />',
			onDrop: function  (item, container, _super) {
				var field,
				newIndex = item.index();
				oldIndex = item.attr("ref");

				var temp_item = gm_control_sheet[oldIndex];
				gm_control_sheet[oldIndex] = gm_control_sheet[newIndex];
				gm_control_sheet[newIndex] = temp_item;

				// now swap the oldIndex with the newIndex in the gm_control_sheet_currently_selected
				for( select_count = 0; select_count < gm_control_sheet_currently_selected.length;select_count++) {
					if( gm_control_sheet_currently_selected[select_count] / 1 == oldIndex / 1) {
						gm_control_sheet_currently_selected[select_count] = newIndex / 1;
					} else {
						if( gm_control_sheet_currently_selected[select_count] / 1 == newIndex / 1)
							gm_control_sheet_currently_selected[select_count] = oldIndex / 1;
					}
				}
				temp_item = "";
				gm_control_display_sheet();
			}
		});
		$('.sorted_table').touchDraggable();

		sessionStorage.current_sheet = gm_control_export_json();
	} else {
		$(".sorted_table").sortable("disable");
	}


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
		$(".js-char-field-name").val('');

		$(".js-char-field-st").val('10');
		$(".js-char-field-dx").val('10');
		$(".js-char-field-iq").val('10');
		$(".js-char-field-ht").val('10');

		$(".js-char-field-speed").val('5');
		$(".js-char-field-move").val('5');
		$(".js-char-field-will").val('10');
		$(".js-char-field-per").val('10');

		$(".js-char-field-reaction").val('0');

		$(".js-char-field-dr").val('0');
		$(".js-char-field-hp").val('10');
		$(".js-char-field-curr_hp").val('10');
	}
}


function gm_control_assign_data_to_char(character) {
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
	$(".js-gm-control-line-dialog-title").text("Adding Entry");

	$('.js-gm-control-line-dialog-action-button').unbind('click');
	$('.js-gm-control-line-dialog-action-button').on("click", function(event) {
		event.preventDefault();
		// TODO: Add entry data to new character
		newChar = new class_character();
		newChar = gm_control_assign_data_to_char( newChar );

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
	$(".js-gm-control-line-dialog-action-button").val("Save").button('refresh');
	$(".js-gm-control-line-dialog-title").text("Editing Entry");

	gm_control_currently_editing = index;
	$('.js-gm-control-line-dialog-action-button').unbind('click');
	$('.js-gm-control-line-dialog-action-button').on("click", function(event) {
		event.preventDefault();
		// Update data to exiting character in gm_control_sheet
		gm_control_sheet[gm_control_currently_editing] = gm_control_assign_data_to_char( gm_control_sheet[gm_control_currently_editing] );
		// Refresh Sheet
		gm_control_display_sheet();
		gm_control_currently_editing = 0;
		$('.js-gm-control-line-dialog').modal('hide');
		return false;
	} );


	$('.js-gm-control-line-dialog').modal();
}

function gm_control_show_duplicate_line_dialog(character) {
	gm_control_init_entry_form(character);
	$(".js-gm-control-line-dialog-action-button").val("Add").button('refresh');
	$(".js-gm-control-line-dialog-title").text("Duplicating Entry");

	$('.js-gm-control-line-dialog-action-button').unbind('click');
	$('.js-gm-control-line-dialog-action-button').on("click", function(event) {
		event.preventDefault();
		// Create a new character object
		newChar = new class_character();

		// Add entry data to new character
		newChar = gm_control_assign_data_to_char( newChar );

		// add to gm_control_sheet array
		gm_control_sheet.push( newChar );

		// Refresh Sheet
		gm_control_display_sheet();

		// hide dialog
		$('.js-gm-control-line-dialog').modal('hide');
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

	// Entry Item Controls
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
		gm_control_show_edit_line_dialog(gm_control_sheet[ $(this).attr("ref")], $(this).attr("ref"));
		return false;
	} );

	$('.js-select-check').unbind('change');
	$(".js-select-check").change( function() {
		gm_control_sheet_currently_selected = Array()
		$(".js-select-check:checked").each( function() {
			debugConsole("SELECTCHECK() called - " + $(this).attr('ref'));
			gm_control_sheet_currently_selected.push( $(this).attr('ref') / 1);
		});
	});

}

$( document ).ready( function() {
//	gm_control_propogate_mooks();
	gm_control_display_sheet();
	if( sessionStorage.current_sheet ) {
		gm_control_import_json( sessionStorage.current_sheet );
	}
});