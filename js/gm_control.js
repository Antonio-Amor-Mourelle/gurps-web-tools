// gm_control.js
var gm_control_sheet = new Array();
var gm_control_current_turn = 0;
var gm_control_current_combatatant = 0;
var gm_control_currently_editing = 0;
function gm_control_propogate_mooks() {
	debugConsole("gm_control_propogate_mooks() called");
	original_length = gm_control_sheet.length;
	for(count = 0; count < 5; count++) {
		gm_control_sheet.push( new class_character());
		gm_control_sheet[count + original_length].set_name("Long Name Mook #" + (count+1));
	}
	gm_control_display_sheet();
}

var gm_control_sheet_currently_selected = Array();

function gm_control_start_combat() {
	gm_control_current_turn = 1;
	gm_control_current_combatatant = 0;
	gm_control_sort_by_base_speed();
	gm_control_update_turn_box();
	$(".js-turn-controls").slideDown();
}

function gm_control_apply_damage(char_index, damage_amount) {
	gm_control_sheet[char_index].secondary.hp -= damage_amount;
	gm_control_sheet[char_index].shock_amount = damage_amount;
	if( gm_control_sheet[char_index].shock_amount > 4)
		gm_control_sheet[char_index].shock_amount = 4;
	gm_control_display_sheet();
}

function gm_control_next_combatatant() {
	gm_control_sheet[gm_control_current_combatatant].shock_amount = 0;

	gm_control_current_combatatant++;
	if(gm_control_current_combatatant >= gm_control_sheet.length) {
		gm_control_current_combatatant = 0;
		gm_control_current_turn++;
	}
	gm_control_update_turn_box();
}

function gm_control_stop_combat() {
	$(".js-turn-controls").slideUp();
	gm_control_current_turn = 0;
	gm_control_update_turn_box();
}

function gm_control_update_turn_box() {
	html = "<fieldset><legend>Combat Turn Control - Turn #" + gm_control_current_turn + "</legend>";
	if(gm_control_current_combatatant > 0) {
		html += '<a href="#" class="js-gm-control-go-to-beginning-turn"><span class="glyphicon glyphicon glyphicon-fast-backward" title="Go to start of turn"></span></a>';
		html += '<a href="#" class="js-gm-control-go-to-previous-turn"><span class="glyphicon glyphicon glyphicon-backward" title="Start back a turn"></span></a>';
	} else {
		html += '<span class="glyphicon glyphicon glyphicon-fast-backward" title="Start Combat Session">';
		html += '<span class="glyphicon glyphicon glyphicon-backward" title="Start Combat Session">';
	}
	html += '<a href="#" class="js-gm-control-stop-combat"><span class="glyphicon glyphicon glyphicon-stop" title="Stop Combat Session"></span></a>';
	html += '<a href="#" class="js-gm-control-go-to-next-turn"><span class="glyphicon glyphicon glyphicon-forward" title="Go to next turn"></span></a>';
	html += '</fieldset>';

	$(".js-turn-controls").html( html );

	$(".js-gm-control-go-to-beginning-turn").unbind('click');
	$(".js-gm-control-go-to-beginning-turn").click( function() {
		debugConsole(".js-gm-control-go-to-beginning-turn clicked");
		event.preventDefault();
		// TODO
		gm_control_current_combatatant = 0;
		gm_control_update_turn_box();
	});

	$(".js-gm-control-go-to-previous-turn").unbind('click');
	$(".js-gm-control-go-to-previous-turn").click( function() {
		debugConsole(".js-gm-control-go-to-previous-turn clicked");
		event.preventDefault();
		// TODO
		gm_control_update_turn_box();
	});

	$(".js-gm-control-stop-combat").unbind('click');
	$(".js-gm-control-stop-combat").click( function() {
		debugConsole(".js-gm-control-stop-combat clicked");
		event.preventDefault();
		// TODO
		gm_control_stop_combat();
	});

	$(".js-gm-control-go-to-next-turn").unbind('click');
	$(".js-gm-control-go-to-next-turn").click( function() {
		debugConsole(".js-gm-control-go-to-next-turn clicked");
		event.preventDefault();
		gm_control_next_combatatant();
		gm_control_update_turn_box();

	});

	gm_control_display_sheet();
}



function gm_control_export_json(selected_only) {
	export_object = Array();

	for(count = 0; count < gm_control_sheet.length; count++) {
		export_item = {
			name: gm_control_sheet[count].get_name(),

			attributes: {
				st: gm_control_sheet[count].get_attribute('st') / 1,
				dx: gm_control_sheet[count].get_attribute('dx') / 1,
				iq: gm_control_sheet[count].get_attribute('iq') / 1,
				ht: gm_control_sheet[count].get_attribute('ht') / 1
			},

			secondary: {
				will: gm_control_sheet[count].get_secondary('will') / 1,
				per: gm_control_sheet[count].get_secondary('per') / 1,
				fatigue: gm_control_sheet[count].get_secondary('fatigue') / 1,
				curr_fatigue: gm_control_sheet[count].get_secondary('curr_fatigue') / 1,
				hp: gm_control_sheet[count].get_secondary('hp') / 1,
				curr_hp: gm_control_sheet[count].get_secondary('curr_hp') / 1,

				speed: gm_control_sheet[count].get_secondary('speed') / 1,
				move: gm_control_sheet[count].get_secondary('move') / 1,

				reaction: gm_control_sheet[count].get_secondary('reaction') / 1,
				dr: gm_control_sheet[count].get_secondary('dr') / 1
			}
		}

		if( selected_only ) {
			if( $.inArray(count, gm_control_sheet_currently_selected) > -1 )
				export_object.push(  export_item );
		} else {
			export_object.push(  export_item );
		}
	}
	return JSON.stringify( export_object );
}

function gm_control_save_to_local_storage() {
	debugConsole("gm_control_save_to_local_storage() called");
	local_storage_save("gm_control_items", gm_control_export_json(true) );
}


function gm_control_import_json(import_string, overwrite) {
	debugConsole("gm_control_import_json() called");
	import_object = JSON.parse(import_string);

	if( overwrite )
		gm_control_sheet = Array();

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
		return_value.set_attribute( 'st', importing_object.attributes.st / 1 );
	if( typeof(importing_object.attributes.dx) != "undefined")
		return_value.set_attribute( 'dx', importing_object.attributes.dx / 1 );
	if( typeof(importing_object.attributes.iq) != "undefined")
		return_value.set_attribute( 'iq', importing_object.attributes.iq / 1 );
	if( typeof(importing_object.attributes.ht) != "undefined")
		return_value.set_attribute( 'ht', importing_object.attributes.ht / 1 );

	if( typeof(importing_object.secondary.will) != "undefined")
		return_value.set_secondary( 'will', importing_object.secondary.will / 1 );
	if( typeof(importing_object.secondary.per) != "undefined")
		return_value.set_secondary( 'per', importing_object.secondary.per / 1 );
	if( typeof(importing_object.secondary.fatigue) != "undefined")
		return_value.set_secondary( 'fatigue', importing_object.secondary.fatigue / 1 );
	if( typeof(importing_object.secondary.curr_fatigue) != "undefined")
		return_value.set_secondary( 'curr_fatigue', importing_object.secondary.curr_fatigue / 1 );

	if( typeof(importing_object.secondary.hp) != "undefined")
		return_value.set_secondary( 'hp', importing_object.secondary.hp / 1 );
			if( typeof(importing_object.secondary.curr_hp) != "undefined")
		return_value.set_secondary( 'curr_hp', importing_object.secondary.curr_hp / 1 );

	if( typeof(importing_object.secondary.dr) != "undefined")
		return_value.set_secondary( 'dr', importing_object.secondary.dr / 1 );
	if( typeof(importing_object.secondary.reaction) != "undefined")
		return_value.set_secondary( 'reaction', importing_object.secondary.reaction / 1 );

	if( typeof(importing_object.secondary.move) != "undefined")
		return_value.set_secondary( 'move', importing_object.secondary.move / 1 );
	if( typeof(importing_object.secondary.speed) != "undefined")
		return_value.set_secondary( 'speed', importing_object.secondary.speed / 1 );

	return return_value;
}

function gm_control_display_sheet() {
	debugConsole("gm_control_display_sheet() called");
	html = "";
	activate_sort_table = false;
	local_storage_save( "gm_control_current_sheet" , gm_control_export_json(), true );
	if(gm_control_sheet.length > 0) {
		for(count = 0; count < gm_control_sheet.length; count++) {
			current_combatatant = "";
			if( gm_control_current_turn > 0 && gm_control_current_combatatant == count)
				current_combatatant = " current-combatatant";
			html += '<tr class="dragrow' + current_combatatant + '" ref="' + count + '">';
			checked = '';
			if( $.inArray(count, gm_control_sheet_currently_selected) > -1 ) {
				checked = 'checked="checked" ';
			}

			html += '<td class="text-right"><span class="glyphicon glyphicon-move drag-select"></span><input ' + checked + 'type="checkbox" ref="' + count + '" class="js-select-check" /></td>';
			html += '<td>';
			html += '<a href="#" ref="' + count + '" title="View This Entry" class="js-gm-control-line-view hidden-sm hidden-md hidden-lg hidden-xl"><span class="glyphicon glyphicon-eye-open"></span></a> ';
			if( gm_control_sheet[count].shock_amount )
				html += "<span class='shock-damage' title='This character is in shock!'>-" + gm_control_sheet[count].shock_amount + "</span>";
			html += gm_control_sheet[count].get_name();
			// TODO Small Screen Dropdown/Controls
			html += '<div class="js-mobile-details js-mobile-details-' + count + '" style="display:none">';
			html += '<h5>Attributes</h5>';
			html += '<div><strong>ST</strong>: ' + gm_control_sheet[count].get_attribute('st') + ' <strong>DX</strong>: ' + gm_control_sheet[count].get_attribute('dx') + ' <strong>IQ</strong>: ' + gm_control_sheet[count].get_attribute('iq') + ' <strong>HT</strong>: ' + gm_control_sheet[count].get_attribute('ht') + '</div>';
			html += '<div>Reaction: ' + gm_control_sheet[count].get_secondary('reaction') + '</div>';
			html += '<div class="text-right">';
			html += ' <a href="#" ref="' + count + '" title="Edit This Entry" class="js-gm-control-line-edit"><span class="glyphicon glyphicon-edit"></span></a> ';
			html += ' <a href="#" ref="' + count + '" title="Duplicate This Entry" class="js-gm-control-line-duplicate"><span class="glyphicon glyphicon-share"></span></a> ';
			html += ' <a href="#" ref="' + count + '" title="Remove This Entry" class="js-gm-control-line-remove"><span class="glyphicon glyphicon-trash"></span></a> ';
			html += '</div>';
			html += '</div>';
			html += '</td>';

			html += '<td class="hidden-xs">' + gm_control_sheet[count].get_attribute('st') + ' / ' + gm_control_sheet[count].get_attribute('dx') + ' / ' + gm_control_sheet[count].get_attribute('iq') + ' / ' + gm_control_sheet[count].get_attribute('ht') + '</td>';
			html += '<td class="hidden-xs">' + gm_control_sheet[count].get_secondary('will') + ' / ' + gm_control_sheet[count].get_secondary('per') + '</td>';
			html += '<td>' + gm_control_sheet[count].get_secondary('speed');
			if(gm_control_sheet[count].random_roll)
				html += ' <sub title="This is the random roll for ties">' + gm_control_sheet[count].random_roll + '</sub>';
			html += ' </td>';
			html += '<td>' + gm_control_sheet[count].get_secondary('move') + '</td>';
			html += '<td>' + gm_control_sheet[count].get_secondary('dr') + '</td>';
			html += '<td>' + gm_control_sheet[count].get_secondary('curr_hp') + ' / ' + gm_control_sheet[count].get_secondary('hp') + '</td>';
			html += '<td>' + gm_control_sheet[count].get_secondary('curr_fatigue') + ' / ' + gm_control_sheet[count].get_secondary('fatigue') + '</td>';
			html += '<td class="hidden-xs">' + gm_control_sheet[count].get_secondary('reaction') + '</td>';
			html += '<td class="hidden-xs text-center">';
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
			handle: '.drag-select',
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

	} else {
		$(".sorted_table").sortable("disable");
	}




}

function gm_control_init_entry_form(character) {
	debugConsole("gm_control_init_entry_form() called");
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

		$(".js-char-field-fatigue").val( character.get_secondary('fatigue')  );
		$(".js-char-field-curr_fatigue").val( character.get_secondary('curr_fatigue') );
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

		$(".js-char-field-fatigue").val('10');
		$(".js-char-field-curr_fatigue").val('10');
	}

	$(".js-char-field-st").unbind("keyup");
	$(".js-char-field-st").keyup( function() {
			gm_control_update_edit_char()
		}
	);

	$(".js-char-field-dx").unbind("keyup");
	$(".js-char-field-dx").keyup( function() {
			gm_control_update_edit_char()
		}
	);

	$(".js-char-field-iq").unbind("keyup");
	$(".js-char-field-iq").keyup( function() {
			gm_control_update_edit_char()
		}
	);

	$(".js-char-field-ht").unbind("keyup");
	$(".js-char-field-ht").keyup( function() {
			gm_control_update_edit_char()
		}
	);
}

function gm_control_update_edit_char() {
	debugConsole("gm_control_update_edit_char() called");
	new_speed = ( $(".js-char-field-ht").val() / 1+ $(".js-char-field-st").val() / 1 ) / 4;
	$(".js-char-field-speed").val( new_speed );
	$(".js-char-field-move").val( Math.floor(new_speed) );
	$(".js-char-field-will").val( $(".js-char-field-iq").val() );
	$(".js-char-field-per").val( $(".js-char-field-iq").val() );

	$(".js-char-field-hp").val( $(".js-char-field-st").val() );
	$(".js-char-field-curr_hp").val( $(".js-char-field-st").val() );

	$(".js-char-field-fatigue").val( $(".js-char-field-ht").val() );
	$(".js-char-field-curr_fatigue").val( $(".js-char-field-ht").val() );
}

function gm_control_assign_data_to_char(character) {
	debugConsole("gm_control_assign_data_to_char() called");
	character.set_name( $(".js-char-field-name").val()  );

	character.set_attribute("st", $(".js-char-field-st").val() / 1 );
	character.set_attribute("dx", $(".js-char-field-dx").val() / 1 );
	character.set_attribute("iq", $(".js-char-field-iq").val() / 1 );
	character.set_attribute("ht", $(".js-char-field-ht").val() / 1 );

	character.set_secondary("speed", $(".js-char-field-speed").val() / 1 );
	character.set_secondary("move", $(".js-char-field-move").val() / 1 );
	character.set_secondary("will", $(".js-char-field-will").val() / 1 );
	character.set_secondary("per", $(".js-char-field-per").val() / 1 );

	character.set_secondary("reaction", $(".js-char-field-reaction").val() / 1 );

	character.set_secondary("dr", $(".js-char-field-dr").val() / 1 );
	character.set_secondary("hp", $(".js-char-field-hp").val() / 1 );
	character.set_secondary("curr_hp", $(".js-char-field-curr_hp").val() / 1 );

	character.set_secondary("fatigue", $(".js-char-field-fatigue").val() / 1 );
	character.set_secondary("curr_fatigue", $(".js-char-field-curr_fatigue").val() / 1 );


	return character;
}

function gm_control_show_add_line_dialog() {
	debugConsole("gm_control_show_add_line_dialog() called");
	gm_control_init_entry_form();
	$(".js-gm-control-line-dialog-action-button").text("Add").button('refresh');
	$(".js-gm-control-line-dialog-title").text("Adding Entry");
	$(".js-area-add-more").show();

	$('.js-gm-control-line-dialog-action-button').unbind('click');
	$('.js-gm-control-line-dialog-action-button').on("click", function(event) {
		event.preventDefault();
		// TODO: Add entry data to new character
		number_to_add = $(".js-char-field-add-more").val();

		if(number_to_add > 1) {
			for( add_count = 0; add_count < number_to_add; add_count++) {
				new_name = $(".js-char-field-name").val() + " #" + (add_count + 1 );

				// Create a new character object
				newChar = new class_character();

				// Add entry data to new character
				newChar = gm_control_assign_data_to_char( newChar );

				newChar.set_name( new_name );
				gm_control_sheet.push( newChar );
			}
		} else {
			// Create a new character object
			newChar = new class_character();

			// Add entry data to new character
			newChar = gm_control_assign_data_to_char( newChar );

			// add to gm_control_sheet array
			gm_control_sheet.push( newChar );
		}

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

	$(".js-area-add-more").hide();
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
	$(".js-area-add-more").show();


	$('.js-gm-control-line-dialog-action-button').unbind('click');
	$('.js-gm-control-line-dialog-action-button').on("click", function(event) {
		event.preventDefault();

		number_to_add = $(".js-char-field-add-more").val();

		if(number_to_add > 1) {
			for( add_count = 0; add_count < number_to_add; add_count++) {
				new_name = $(".js-char-field-name").val() + " #" + (add_count + 1 );

				// Create a new character object
				newChar = new class_character();

				// Add entry data to new character
				newChar = gm_control_assign_data_to_char( newChar );

				newChar.set_name( new_name );
				gm_control_sheet.push( newChar );
			}
		} else {
			// Create a new character object
			newChar = new class_character();

			// Add entry data to new character
			newChar = gm_control_assign_data_to_char( newChar );

			// add to gm_control_sheet array
			gm_control_sheet.push( newChar );
		}

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
		debugConsole(".js-gm-control-new clicked");
		event.preventDefault();
		if( confirm("This will clear out all your items in your current control sheet. Are you sure you want to do this?") )
			gm_control_sheet = Array();
		gm_control_display_sheet();
		return false;
	} );

	$('.js-gm-control-start-combat').unbind('click');
	$('.js-gm-control-start-combat').click( function(event) {
		debugConsole(".js-gm-control-start-combat clicked");
		event.preventDefault();
		gm_control_start_combat();
		return false;
	} );

	$('.js-gm-control-add-line').unbind('click');
	$('.js-gm-control-add-line').click( function(event) {
		debugConsole(".js-gm-control-add-line clicked");
		event.preventDefault();
		gm_control_show_add_line_dialog();
		return false;
	} );

	$('.js-gm-control-save').unbind('click');
	$('.js-gm-control-save').click( function(event) {
		debugConsole(".js-gm-control-save clicked");
		event.preventDefault();
		create_alert("This function is still a work in progress", "danger");
		return false;
	} );

	$('.js-gm-control-load').unbind('click');
	$('.js-gm-control-load').click( function(event) {
		debugConsole(".js-gm-control-load clicked");
		event.preventDefault();
		create_alert("This function is still a work in progress", "danger");
		return false;
	} );

	$('.js-gm-control-import').unbind('click');
	$('.js-gm-control-import').click( function(event) {
		debugConsole(".js-gm-control-import clicked");
		event.preventDefault();
		create_alert("This function is still a work in progress", "danger");
		return false;
	} );

	$('.js-gm-control-export').unbind('click');
	$('.js-gm-control-export').click( function(event) {
		debugConsole(".js-gm-control-export clicked");
		event.preventDefault();
		create_alert("This function is still a work in progress", "danger");
		return false;
	} );

	// Entry Item Controls
	$('.js-gm-control-line-remove').unbind('click');
	$('.js-gm-control-line-remove').click( function(event) {
		debugConsole(".js-gm-control-remove clicked");
		event.preventDefault();
		if( confirm("Are you sure you want to delete this line?") )
			gm_control_sheet.splice( $(this).attr("ref"), 1);
		gm_control_display_sheet();
		return false;
	} );

	$('.js-gm-control-line-duplicate').unbind('click');
	$('.js-gm-control-line-duplicate').click( function(event) {
		debugConsole(".js-gm-control-duplicate clicked");
		event.preventDefault();
		gm_control_show_duplicate_line_dialog(gm_control_sheet[ $(this).attr("ref")]);
		return false;
	} );

	$('.js-gm-control-line-edit').unbind('click');
	$('.js-gm-control-line-edit').click( function(event) {
		debugConsole(".js-gm-control-edit clicked");
		event.preventDefault();
		gm_control_show_edit_line_dialog(gm_control_sheet[ $(this).attr("ref")], $(this).attr("ref"));
		return false;
	} );

	$('.js-select-check').unbind('change');
	$(".js-select-check").change( function() {
		debugConsole(".js-select-check changed");
		gm_control_sheet_currently_selected = Array()
		$(".js-select-check:checked").each( function() {
			debugConsole("SELECTCHECK() called - " + $(this).attr('ref'));
			gm_control_sheet_currently_selected.push( $(this).attr('ref') / 1);
		});
	});

	$(".js-gm-control-check-all").unbind('change');
	$(".js-gm-control-check-all").change( function() {
		debugConsole(".js-gm-control-check-all changeed");
		if( $(".js-gm-control-check-all").is(":checked") )
			$(".js-select-check").prop('checked',true);
		else
			$(".js-select-check").prop('checked',false);

		gm_control_sheet_currently_selected = Array()
		$(".js-select-check:checked").each( function() {
			gm_control_sheet_currently_selected.push( $(this).attr('ref') / 1);
		});
	} );

	$(".js-gm-control-trash").unbind('click');
	$(".js-gm-control-trash").click( function() {
		debugConsole(".js-gm-control-trash clicked");
		event.preventDefault();
		if( confirm("Are you sure you want to remove the selected items?") ) {
			for (var i = gm_control_sheet_currently_selected.length -1; i >= 0; i--)
   				gm_control_sheet.splice(gm_control_sheet_currently_selected[i],1);
   			gm_control_sheet_currently_selected = Array();
			gm_control_display_sheet();
		}
	});

	$(".js-gm-control-add-mooks").unbind('click');
	$(".js-gm-control-add-mooks").click( function() {
		debugConsole(".js-gm-control-add-mooks clicked");
		event.preventDefault();
		gm_control_propogate_mooks();
	});

	$(".js-gm-control-line-view").unbind('click');
	$(".js-gm-control-line-view").click( function() {
		event.preventDefault();
		debugConsole(".js-gm-control-line-view clicked");
		ref = $(this).attr("ref");

		if( $(".js-mobile-details-" + ref).is(":visible") ) {
			$(".js-mobile-details-" + ref).slideUp();
		} else {
			$(".js-mobile-details").slideUp();
			$(".js-mobile-details-" + ref).stop().slideDown();
		}
	});


	$(".js-gm-control-add-mooks").unbind('click');
	$(".js-gm-control-add-mooks").click( function() {
		debugConsole(".js-gm-control-add-mooks clicked");
		event.preventDefault();
		gm_control_propogate_mooks();
	});

	$(".js-gm-control-sort-by-name").unbind('click');
	$(".js-gm-control-sort-by-name").click( function() {
		debugConsole(".js-gm-control-sort-by-name clicked");
		event.preventDefault();
		gm_control_sort_by_name();
	});

	$(".js-gm-control-sort-by-base-speed").unbind('click');
	$(".js-gm-control-sort-by-base-speed").click( function() {
		debugConsole(".js-gm-control-sort-by-base-speed clicked");
		event.preventDefault();
		gm_control_sort_by_base_speed();

	});


}

function sort_chars_by_name(a,b) {
	return a.name > b.name;
}

function sort_chars_by_speed(a,b) {
	if (a.secondary.speed < b.secondary.speed){
		return -1;
	} else {
		if (a.secondary.speed > b.secondary.speed) {
			return 1;
		} else {
			return a.name > b.name;

		}
	}
}

function sort_chars_by_speed_reverse(a,b) {

	if (a.secondary.speed > b.secondary.speed){
		return -1;
	} else {
		if (a.secondary.speed < b.secondary.speed) {
			return 1;
		} else {
			if (a.attributes.dx > b.attributes.dx){
				return -1;
			} else {
				if (a.attributes.dx < b.attributes.dx){
					return 1;
				} else {
					if (a.random_roll > b.random_roll){
					} else {
						if (a.random_roll < b.random_roll){
							return 1;
						} else {
							return -1;
						}
					}
				}
			}
		}
	}
}

function gm_control_sort_by_base_speed() {
	debugConsole("gm_control_sort_by_base_speed called");
	for(gm_rand_count = 0; gm_rand_count < gm_control_sheet.length; gm_rand_count++) {
		gm_control_sheet[gm_rand_count].random_roll = rollDice("1d6");
	}
	gm_control_sheet.sort( sort_chars_by_speed_reverse );
	gm_control_display_sheet();
}

function gm_control_sort_by_name() {
	debugConsole("gm_control_sort_by_name called");
	for(gm_rand_count = 0; gm_rand_count < gm_control_sheet.length; gm_rand_count++) {
		gm_control_sheet[gm_rand_count].random_roll = 0;
	}
	gm_control_sheet.sort( sort_chars_by_name );
	gm_control_display_sheet();
}

$( document ).ready( function() {
	gm_control_current_sheet_obj = local_storage_retrieve("gm_control_current_sheet", 0);
	if( gm_control_current_sheet_obj ) {
		gm_control_import_json( JSON.stringify( gm_control_current_sheet_obj ), 1 );
	}

	gm_control_display_sheet();
});