#include "utils_global_vars.js"
#include "utils_core.js"
#include "utils_select2.js"
#include "humanise.js"
#include "utils_tags.js"
#include "utils_dirs.js"
#include "utils_files.js"
#include "utils_tbls.js"
#include "utils_external_dbs.js"
#include "utils_tasks.js"
#include "utils__add_to_db.js"
#include "utils_add_tags.js"
#include "utils_add_file.js"
#include "utils_add_dirs.js"
#include "utils_add_devices.js"
#include "utils_update_orig_src.js"
#include "utils_cookies.js"
#include "text-editor.js"
#include "qry.js"

"function sleep(ms){"
	"return new Promise(resolve => setTimeout(resolve, ms));"
"}"

"const YOUTUBE_DEVICE_ID = \"1\";"

"function init_selects(var_name){"
	"let s = \"\";"
	"const col = tbl2namecol[var_name];"
	"$(tbl2selector[var_name]).select2({"
		"placeholder: nickname2fullname[var_name] + (use_regex)?\" pattern\":\"\","
		"ajax:{"
			"transport: function (params, success, failure){"
				"let arr = Object.entries(window[var_name]);" // WARNING: I don't see why there aren't scope issues
				"if(params.data.q !== undefined){"
					"const pattern = (use_regex) ? new RegExp(params.data.q) : params.data.q;"
					"arr = arr.filter(x => x[1][0].search(pattern)>=0);"
				"}"
				"if(arr.length > 50){"
					"arr = arr.slice(0, 50);"
					"arr.unshift(['0', ['Truncated to 50 results']]);"
				"}"
				"success(arr);"
			"},"
			"processResults: function(data){"
				"return{"
					"results: data.map(([id,tpl]) => ({id:id, text:tpl[0]}))"
				"};"
			"}"
		"}"
	"});" // Initialise
"}"

"function refetch_json(var_name, url, fn){"
	"get_json(url + '?' + (new Date().getTime()), function(data){"
		// Cache buster url parameter
		"console.log(\"Cache busting\", var_name);"
		"window[var_name] = data;"
		"if(fn !== undefined)"
			"fn();"
		"init_selects(var_name);"
	"});"
"}"
