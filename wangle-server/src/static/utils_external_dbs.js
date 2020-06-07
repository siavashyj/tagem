"function display_cmnts(db_id, ls){"
	// ls is an array of: [cmnt_id, parent_id, user_id, timestamp, cmnt_content], with parent_id==0 first (order by (parent_id=0) ASC)
	"let s = \"\";"
	"for (const [cmnt_id, parent_id, user_id, timestamp, username, cmnt_content] of ls){"
		"const _s ="
			"'<div id=\"c' + cmnt_id + '\" class=\"cmnt\">' +"
				"'<div class=\"head\">' +"
					"'<a class=\"user\" onclick=\"view_user(' + db_id + ',\\'' + user_id + '\\')\">' + username + '</a>' +" // Encasing ID in quotes because Javascript rounds large numbers
					"'<time data-t=\"' + timestamp + '\">' + timestamp2dt(timestamp) + '</time>' +"
				"'</div>' +"
				"'<p>' +"
					"cmnt_content +"
				"'</p>' +"
				"'<div class=\\'replies\\'></div>' +"
			"'</div>'"
		";"
		"if (parent_id === 0){"
			"s += _s;"
		"} else if (s !== undefined){"
			"document.getElementById('cmnts').innerHTML = s;"
			"s = undefined;"
		"} else {"
			"document.getElementById('c' + parent_id).getElementsByClassName('replies')[0].innerHTML = _s;"
		"}"
	"}"
	"if (s !== undefined)"
		"document.getElementById('cmnts').innerHTML = s;"
	"unhide(\"cmnts\");"
"}"

"function display_post_meta(_db_id, tpl){"
	"const [user, t, n_cmnts, n_likes, username, txt] = tpl;"
	"document.getElementById('post-user').onclick = function(){view_user(_db_id, user)};"
	// I don't know much about Javascript's memory management, but _db_id - although a local parameter of the function within which the function is created - seems to be preserved
	"document.getElementById('post-user').innerText = username;"
	"document.getElementById('post-time').innerText = timestamp2dt(t);"
	"document.getElementById('post-text').innerText = txt;"
"}"

"function view_post(db_id, post_id){"
	"unhide('post-container');"
	"$.ajax({"
		"dataType: \"json\","
		"url: \"/a/x/p/\"+db_id+\"/\"+post_id,"
		"success: function(data){"
			"display_post_meta(db_id, data[0]);"
			"display_cmnts(db_id, data[1]);"
		"},"
		"error: function(){"
			"alert(\"Error getting file data\");"
		"}"
	"});"
"}"

"function view_user(_db_id, _user_id){"
	"unhide('tags-container');"
	"hide('parents-container');"
	"hide('children-container');"
	"hide('f');"
	"hide('d');"
	"hide('t');"
	"hide('before-files-tbl');"
	"hide('files-tagging');"
	"hide('tagselect-files-container');"
	"hide('tagselect-self-p-container');"
	"hide('tagselect-self-c-container');"
	
	"if (_db_id !== undefined){"
		"user_id = _user_id;"
		"db_id = _db_id;"
		"$.ajax({"
			"dataType: \"json\","
			"url: \"/a/x/u/\"+db_id+\"/\"+_user_id,"
			"success: function(data){"
				"document.getElementById('profile-img').src = \"\";"
				
				"tags = data[4];"
				"if (tags !== \"\"){"
					"display_tags(tags.split(\",\"), \"#tags\");"
				"}"
				
				"user_name = data[0];"
				"$('#profile-name').text(user_name);"
			"},"
			"error: function(){"
				"alert(\"Error populating user info\");"
			"}"
		"});"
	"} else {"
		"$('#profile-name').text(user_name);"
	"}"
	
	"window.location.hash = 'x' + x[db_id] + '/u' + user_id;" // db_id is actually the index of the database in the server's runtime command arguments, and could therefore easily change. Hence using the database name instead.
"}"
