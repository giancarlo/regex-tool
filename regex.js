
(function (window, document, undefined)
{

var
	REGEX = function()
	{
	var
		gebi = function(el)
		{
			return document.getElementById(el);
		}, 

		/* HTML ELEMENTS */
		regex   = gebi('regex'),
		replace = gebi('replace'),
		input   = gebi('input'),
		output  = gebi('output'),
		count   = gebi('search-count'),
		helpdiv = gebi('help'),
		saved   = gebi('saved'),
		found   = gebi('found'),
		error_search = gebi('error-search'),
		option  = {
			multiline: gebi('op-multiline'),
			case_sensitive: gebi('op-case-sensitive'),
			global: gebi('op-global'),
			help: gebi('op-help')
		},

		timeout = 250,

		/* EVENT HANDLERS */

		onHelp= function()
		{
			helpdiv.style.top     = this.offsetTop+this.offsetHeight + "px";
			helpdiv.style.left    = this.offsetLeft+"px";
			helpdiv.style.display = option.help.checked ? "block" : "none";
		},

		onKeyUp= function()
		{
			if (timeout)
				clearTimeout(timeout);

			timeout = setTimeout(update, 250);
		},
		
		onSelect= function()
		{
			input.selectionStart = this.value;
			input.selectionEnd   = parseInt(this.value) + parseInt(this.getAttribute("len"));
		},

		onOpenGroup= function()
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
		},

		/* METHODS */
		getRegex= function()
		{
			var modifier = (option.multiline.checked ? 'm' : '') +
				       (option.case_sensitive.checked ? '': 'i') +
				       (option.global ? 'g': ''),
					what = regex.value
			;

			if (what)
			{
				try {
					return new RegExp(what, modifier);
				} catch(e)
				{
					error_search.innerHTML = e;
				}
			}
		},

		doReplace= function()
		{
			output.value = input.value.replace(getRegex(), replace.value);
		},

		setInfo= function(searchcount, options)
		{
			count.innerHTML = searchcount;
			found.innerHTML = options;
		},

		generateInfo= function(r, s)
		{
			var options = '', count = 0, option, label, sm, i;

			do {
				count++;
				option = '<li onclick="REGEX.onSelect.apply(this)" value="' + r.index + '" len="' + r[0].length + '">';
				label  = r[0] + " @ " + r.index;
				
				if (r.length > 2)
				{
					label = '<img title="Click to see groups" onclick="return REGEX.onOpenGroup.apply(this);" src="tree_close.gif" />' + label;
					
					sm = '';
					for (i = 1; i < r.length; i++)
						sm += '<li>' + r[i] + '</li>';
					label += '<ol>' + sm + '</ol>';
				}

				options += option + label +  "</li>";

			} while (s.global && (r = s.exec(input.value)));

			setInfo(count, options);
		},

		// TODO This is needed so the list doesnt get updated for no reason.
		changed= function()
		{
			return (regex.value !== regex.last_value) ||
			       (input.value !== input.last_value);
		},

		clearInfo= function()
		{
			found.innerHTML = '';
			error_search.innerHTML = '';
			count.innerHTML = 0;
		},

		search= function() 
		{
			clearInfo();

			if (input.value.length > 0)
			{
				var s = getRegex(), r;

				if (s)
				{
					r = s.exec(input.value);
					if (r)	
						generateInfo(r, s);
				}
			} 
		},

		changedReplace= function()
		{
		       return (replace.value !== replace.last_value);
		},

		saveValues= function()
		{
			regex.last_value = regex.value;
			input.last_value = input.value;
		},

		hideHelp= function()
		{
			helpdiv.style.display = 'none';
		},

		update= function(force)
		{
			clearTimeout(timeout);

			if (changed())
			{
				saveValues();
				search();
			}

			if (replace.value && changedReplace())
			{
				replace.last_value = replace.value;
				doReplace();
			}
		},

		save= function()
		{
			var s   = document.createElement("DIV"), 
			    img = document.createElement("A"), 
			    sp = document.createElement("SPAN")
			;

			sp.innerHTML = regex.value;
			
			sp.title = sp.innerHTML;
			sp.replace = replace.value;

			sp.onclick = function() { regex.value = this.innerHTML; replace.value = this.replace; update(); }
			img.onclick = function() { this.parentNode.parentNode.removeChild(this.parentNode); return false; }

			img.innerHTML = "X";

			s.appendChild(sp);
			s.appendChild(img);
			
			saved.appendChild(s);
		}
		;

		/* INITIALIZE EVENTS */
		regex.onkeyup = onKeyUp;
		replace.onkeyup = onKeyUp;
		input.onkeyup = onKeyUp;

		regex.onchange = update;
		replace.onchange = update;
		input.onchange = update;

		regex.onfocus = onHelp;
		replace.onfocus = onHelp;
		regex.onblur  = hideHelp;
		replace.onblur = hideHelp;

		this.onSelect = onSelect;
		this.onOpenGroup = onOpenGroup;
		this.update = update;
		this.save = save;
	};

	window.onload = function() { 
		window.REGEX = new REGEX(); 
	};

})(this, document);
