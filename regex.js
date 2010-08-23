

(function (window, document, undefined)
{

window.REGEX = {

	regex: null,
	regexreplace: null,
	input: null,
	output: null,
	info: null,

	last_regex : '',

	option: {
		multiline: null,
		case_sensitive: null,
		global: null
	},

	/* INIT */
	
	initEvents: function()
	{
		this.regex.onkeyup = REGEX.onKeyUp;
		this.regexreplace.onkeyup = REGEX.onKeyUp;
		this.input.onkeyup = REGEX.onKeyUp;

		this.regex.onchange = REGEX.update;
		this.regexreplace.onchange = REGEX.update;
		this.input.onchange = REGEX.update;

		this.regex.onfocus = REGEX.onHelp;
		this.regexreplace.onfocus = REGEX.onHelp;
		this.regex.onblur  = REGEX.hideHelp;
		this.regexreplace.onblur = REGEX.hideHelp;
	},

	init: function()
	{
		this.regex = this.gebi('regex');
		this.regexreplace = this.gebi('replace');
		this.input = this.gebi('input');
		this.output = this.gebi('output');
		this.info = this.gebi('info');
		this.count = this.gebi('search-count');
		this.found = this.gebi('found');
		this.helpdiv = this.gebi('help');

		this.option.multiline = this.gebi('op-multiline');
		this.option.case_sensitive= this.gebi('op-case-sensitive');
		this.option.global = this.gebi('op-global');
		this.option.help = this.gebi('op-help');

		this.initEvents();
		this.update();
	},

	/* EVENTS */

	onHelp: function()
	{
		//REGEX.helpdiv.top = this.
		REGEX.helpdiv.style.top = this.offsetTop+this.offsetHeight + "px";
		REGEX.helpdiv.style.left = this.offsetLeft+"px";

		REGEX.helpdiv.style.display = REGEX.option.help.checked ? "block" : "none";
	},

	onKeyUp: function()
	{
		if (REGEX.timeout)
			clearTimeout(REGEX.timeout);

		REGEX.timeout = setTimeout(REGEX.update, 250);
	},

	/* METHODS */

	getReplace: function()
	{
		return this.regexreplace.value;
	},

	getRegexValue: function()
	{
		return this.regex.value;
	},

	getRegex: function(what)
	{
		var modifier = (this.option.multiline.checked ? 'm' : '') +
		               (this.option.case_sensitive.checked ? '': 'i') +
			       (this.option.global ? 'g': '')
		;

		if (what === undefined)
			what = this.getRegexValue(); 

		try {
			return new RegExp(what, modifier);
		} catch(e)
		{
			this._error(e);
		}
	},

	_error: function(e)
	{
		REGEX.found.innerHTML = '<li class="error">ERROR: ' + e + '</li>';
	},

	getInput: function()
	{
		return this.input.value;
	},

	replace: function()
	{
		var regex = this.getRegex();
		var replace = this.getReplace();

		var result = this.getInput().replace(regex, replace);
		this.output.value = result;
	},

	setInfo: function(count, options)
	{
		REGEX.count.innerHTML = count;
		REGEX.found.innerHTML = options;
	},

	generateInfo: function(r, s, input)
	{
		var result = "";
		var options = '';
		var count = 0;

		do {
			count++;
			var option = '<li onclick="REGEX.select.apply(this)" value="' + r.index + '" len="' + r[0].length + '">';
			var label  = r[0] + " @ " + r.index;
			
			if (r.length > 2)
			{
				label = '<img title="Click to see groups" onclick="return REGEX.opengroup.apply(this);" src="tree_close.gif" />' + label;
				
				var sm = '';
				for (var i = 1; i < r.length; i++)
					sm += '<li>' + r[i] + '</li>';
				label += '<ol>' + sm + '</ol>';
			}

			options += option + label +  "</li>";
		} while (s.global && (r = s.exec(input)));

		this.setInfo(count, options);
	},

	clearTimeout: function()
	{
		clearTimeout(REGEX.timeout);
	},

	search: function() 
	{
		var input = this.getInput();
		if (input.length == 0) return;

		var s = this.getRegex();

		if (s === undefined) return;

		var r = s.exec(input);

		if (r)	this.generateInfo(r, s, input);
	},

	// TODO This is needed so the list doesnt get updated for no reason.
	changed: function()
	{
		return (REGEX.regex.value !== REGEX.regex.last_value) ||
		       (REGEX.input.value !== REGEX.input.last_value);
	},

	changedReplace: function()
	{
	       return (REGEX.regexreplace.value !== REGEX.regexreplace.last_value);
	},

	saveValues: function()
	{
		REGEX.regex.last_value = REGEX.regex.value;
		REGEX.regexreplace.last_value = REGEX.regexreplace.value;
		REGEX.input.last_value = REGEX.input.value;
	},

	hideHelp: function()
	{
		REGEX.helpdiv.style.display = 'none';
	},

	update: function()
	{
		if (REGEX.timeout)
			REGEX.clearTimeout();

		if (REGEX.changed())
		{
			REGEX.saveValues();
			REGEX.search();
		}

		if (REGEX.regexreplace.value && REGEX.changedReplace())
			REGEX.replace();
	},

	gebi: function(id)
	{
		return document.getElementById(id);
	},

	select: function()
	{
		var input = REGEX.input;
		input.selectionStart = this.value;
		input.selectionEnd   = parseInt(this.value) + parseInt(this.getAttribute("len"));
	},

	opengroup: function()
	{
		var ol = this.nextSibling.nextSibling;
		
		if (ol.style.display=='' || ol.style.display == 'none')
		{
			ol.style.display = 'block';
			this.src = 'tree_open.gif';
		} else
		{
			ol.style.display = 'none';
			this.src = 'tree_close.gif';
		}

		return false;
	}

};

window.onload = function() { REGEX.init(); };

})(this, this.document);

var REGEXold = {

	format: function()
	{
		REGEX.search();
		REGEX._replace(REGEX.found.text());
	},

	highlight: function(r)
	{
		var t  = REGEX.input.val();
		var t1 = t.substr(0, r.index);
		var t2 = t.substr(r.index, r[0].length);
		var t3 = t.substr(r.index + r[0].length, t.length);

		t = t1 + '<span style="background-color: gray">' + t2 + '</span>' + t3;
		REGEX.input.html(t);
	},

	showSpinner: function(d)
	{
		var w = d.innerWidth();
		var h = d.innerHeight();
		var off = d.offset();

		REGEX.spinner
			.css("left", off.left)
			.css("top", off.top)
			.width(d.width())
			.height(d.height())
			.fadeTo(0, 0.3)
		;

		var spi = $("img", REGEX.spinner);
		spi.css("left", w/2 - spi.width() / 2)
		   .css("top", h/2 - spi.height() / 2)
		;

		REGEX.spinner.show()
	},

	hideSpinner: function()
	{
		REGEX.spinner.hide();
	}


};
