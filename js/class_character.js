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
		this.secondary.curr_fatigue = 10;
		this.secondary.hp = 10;
		this.secondary.curr_hp = 10;

		this.secondary.speed = 5;
		this.secondary.move = 5;

		this.secondary.reaction = 0;
		this.secondary.dr = 0;

		this.points = 0;
	}

	this.calc = calc;
	function calc() {
		debugConsole("calc() called");
	}

	// On creation of object, set the default attributes
	this.reset();

	this.set_name = set_name;
	function set_name(new_value) {
		debugConsole("set_name('" + new_value + "') called");
		this.name = new_value;
	}

	this.get_name = get_name;
	function get_name() {
		debugConsole("get_name() called");
		return this.name;
	}

	this.get_attribute = get_attribute;
	function get_attribute(attr_name) {
		debugConsole("get_attribute('" + attr_name + "') called");
		if(typeof(this.attributes[attr_name]) != "undefined")
			return this.attributes[attr_name];
		return "(undefined)";
	}

	this.get_secondary = get_secondary;
	function get_secondary(attr_name) {
		debugConsole("get_secondary('" + attr_name + "') called");
		if(typeof(this.secondary[attr_name]) != "undefined")
			return this.secondary[attr_name];
		return "(undefined)";
	}

	this.set_attribute = set_attribute;
	function set_attribute(attr_name, new_value) {
		debugConsole("set_attribute('" + attr_name + "', '" + new_value + "') called");
		if(this.attributes[attr_name]) {
			this.attributes[attr_name] = new_value;
			this.calc();
			return this.attributes[attr_name];
		} else {
			return false;
		}	}

	this.set_secondary = set_secondary;
	function set_secondary(attr_name, new_value) {
		debugConsole("set_secondary('" + attr_name + "', '" + new_value + "') called");
		if(this.secondary[attr_name]) {
			this.secondary[attr_name] = new_value;
			this.calc();
			return this.secondary[attr_name];
		} else {
			return false;
		}
	}

}