// class_character.js

function class_character() {

	this.reset = reset;
	function reset() {
		debugConsole("reset() called");
		this.name = "";

		this.attributes = {};
		this.attributes.st = 10;
		this.attributes.dx = 10;
		this.attributes.iq = 10;
		this.attributes.ht = 10;

		this.secondary = {};
		this.secondary.will = 10;
		this.secondary.per = 10;
		this.secondary.fatigue = 10;
		this.secondary.hp = 10;
		this.secondary.curr_hp = 10;

		this.secondary.speed = 5;
		this.secondary.move = 5;
	}

	// On creation of object, set the default attributes
	this.reset();

	this.set_name = set_name;
	function set_name(new_name) {
		this.name = new_name;
	}

	this.get_name = get_name;
	function get_name() {
		return this.name;
	}

	this.get_attribute = get_attribute;
	function get_attribute(attr_name) {
		if(this.attributes[attr_name])
			return this.attributes[attr_name];
		return "(undefined)";
	}

	this.get_secondary = get_secondary;
	function get_secondary(attr_name) {
		if(this.secondary[attr_name])
			return this.secondary[attr_name];
		return "(undefined)";
	}

}