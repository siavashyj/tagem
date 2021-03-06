// 
// Copyright 2020 Adam Gray
// This file is part of the tagem program.
// The tagem program is free software: you can redistribute it and/or
// modify it under the terms of the GNU General Public License as published by the
// Free Software Foundation version 3 of the License.
// The tagem program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
// This copyright notice should be included in any copy or substantial copy of the tagem source code.
// The absense of this copyright notices on some other files in this project does not indicate that those files do not also fall under this license, unless they have a different license written at the top of the file.
// 
function $$$get_and_set_default_user_setting_tofrom_cookie__bool(key,_default,fn){
	let b = $$$get_cookie(key);
	if(b === undefined)
		b = _default;
	$$$set_bool_tbl_entry(key,b);
	if(fn!==undefined)
		fn(key,b);
	return b;
}

function $$$get_and_set_default_user_setting_tofrom_cookie__tbl_f_hide_col(key,_default){
	$$$get_and_set_default_user_setting_tofrom_cookie__bool("tbl_f_hide_col_"+key,_default,$$$set_bool_tbl_entry);
}


function $$$set_user_setting_as(key,val){
	$$$set_cookie(key,val,3600);
	$$$document_getElementById('setting-'+key).textContent = val
}

function $$$set_sleep_on_inanimate_media(){
	const n = $$$get_int();
	$$$set_user_setting_as('sleep_on_inanimate_media',n,3600);
}

function $$$set_sleep_after_media_err(){
	const n = $$$get_int();
	$$$set_user_setting_as('sleep_after_media_err',n,3600);
}

function $$$set_bool_tbl_entry(id,B){
	const b = ((B===true)||(B==="1"));
	$$$set_cookie(id, b?'1':'0', 3600);
	$$$document_getElementById('setting-'+id).textContent = b?"1":"0";
}

function $$$set_use_regex(){
	const b = $$$confirm("Use RegEx?\nSay no if you don't know what they are");
	$$$use_regex = (b===true);
	$$$set_bool_tbl_entry('use_regex',$$$use_regex);
}

function $$$set_tbl_f_hide_col(s){
	const b = $$$confirm("Hide the "+s+" column on the file table?");
	$$$set_bool_tbl_entry("tbl_f_hide_col_"+s,b);
	$$$for_node_in_document_getElementsByClassName_1args(s,$$$set_node_visibility,!b);
}

function $$$apply_f_tbl_col_hides(){
	for(let s of ["thumbnail","fname","ftitle","tags","dateadded","date_origin","file_size","duration","w","h","views","likes","dislikes","fps"]){
		const b = $$$get_cookie("tbl_f_hide_col_"+s);
		$$$for_node_in_document_getElementsByClassName_1args(s,$$$set_node_visibility,!(b==="1"));
	}
}
