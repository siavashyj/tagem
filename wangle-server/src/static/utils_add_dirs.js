"function add_dirs_dialog(){"
	"hide_all_except(['deviceselect-container', 'add-dirs-dialog']);"
"}"

"function add_dir(){"
	"const queue = document.getElementById('add-dirs-queue');"
	"const urls = Array.from(queue.getElementsByTagName('ul')).map(x => x.textContent);"
	"if(urls.length===0)"
		"return;"
	"const device = document.getElementById(\"deviceselect\").value;"
	"if(device === \"\"){"
		"alert(\"Please set the device - likely a common prefix of all the URLs\");"
		"return;"
	"}"
	"const _device_name = D[parseInt(device)][0];"
	"for(const url of urls){"
		"if(!url.startsWith(_device_name)){"
			"const b = confirm(\"The device '\" + _device_name + \"' is not a common prefix of all the URLs. Still proceed?\");"
			"if(!b)"
				"return;"
		"}"
	"}"
	"$.ajax({"
		"type:\"POST\","
		"url:\"http://localhost:1999/add-d/\" + device,"
		"data:urls.join(\"\\n\"),"
		"success:function(){"
			"queue.innerHTML = \"\";" // Remove URLs
			"alert(\"Success\");"
			"refetch_json('d', '/a/d.json');"
		"},"
		"dataType:\"text\""
	"});"
"}"

"function add_dirs__append(){"
	"const inp = document.getElementById('add-dir-input');"
	"const x = inp.value;"
	"if(x !== \"\")"
		"document.getElementById('add-dirs-queue').innerHTML += \"<ul>\" + inp.value + \"</ul>\";"
	"inp.value = \"\";"
"}"