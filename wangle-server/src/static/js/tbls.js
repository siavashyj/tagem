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
function $$$column_id2name(x, id, fn_name, col){
	const y = $$$document_getElementById(id).getElementsByClassName('tbody')[0];
	// x might be a dictionary itself (such as dirs/tags) or a string name of such a dictionary
	const data=(typeof x === "string")?$$$window[x]:x;
	if (col === undefined){
		$$$sub_into(data, y, fn_name);
	} else {
		for(let x of y.getElementsByClassName('tr'))
			$$$sub_into(data, x.getElementsByClassName('td')[col], fn_name);
	}
}
function $$$filter_tbl(tbl_id, name_col_ids, tags_col_ids){
	const tbl = $$$document_getElementById(tbl_id);
	const filters = tbl.getElementsByClassName('thead')[0].getElementsByClassName('tr')[1].getElementsByClassName('td');
	
	const name_regexps = [];
	for (const name_col_id of name_col_ids){
		const s = filters[name_col_id].getElementsByTagName('input')[0].value;
		name_regexps.push([(s === '') ? undefined : new RegExp(s),  name_col_id]);
	}
	const tags_regexps = [];
	for (const tags_col_id of tags_col_ids){
		const s = filters[tags_col_id].getElementsByTagName('input')[0].value;
		tags_regexps.push([(s === '') ? undefined : new RegExp(s),  tags_col_id]);
	}
	
	row_loop: 
	for (const row of tbl.getElementsByClassName('tbody')[0].getElementsByClassName('tr')){
		const cols = row.getElementsByClassName('td');
		const cl = row.classList;
		
		for (const [name_regexp, name_col_id] of name_regexps){
			if (name_regexp !== undefined){
				const name = cols[name_col_id].innerText;
				if (!(name_regexp.test(name))){
					cl.add('hidden');
					cl.remove('selected1');
					cl.remove('selected2');
					cl.remove('selected3');
					continue row_loop;
				}
			}
		}
		
		for (const [tags_regexp, tags_col_id] of tags_regexps){
			if (tags_regexp !== undefined){
				const name = cols[tags_col_id].innerText;
				if (!(tags_regexp.test(name))){
					cl.add('hidden');
					cl.remove('selected1');
					cl.remove('selected2');
					cl.remove('selected3');
					continue row_loop;
				}
			}
		}
		
		cl.remove('hidden');
	}
}

function $$$toggle_row_selected(tr, which){
	tr.classList.toggle("selected" + which);
}
function $$$select_rows(selector){
	$(selector).addClass("selected1");
}
function $$$deselect_rows(selector, which){
	$(selector).removeClass("selected" + which);
}
function $$$make_tbl_selectable(id){
	$$$get_tbl_body(id).addEventListener("mouseup", function(e){
		var tgt = e.target;
		
		// Climb the node tree until reach a row (success) - or the body itself (failure)
		while (tgt !== this  &&  !tgt.classList.contains("tr")) {
			tgt = tgt.parentNode;
		}
		if (tgt === this)
			return;
		
		$$$toggle_row_selected(tgt, e.which); // e.which is 1 for left, 2 for middle, 3 for right
	});
}

function $$$getCellValue(tr, idx){
	const node = tr.children[idx];
	return node.dataset.n || node.textContent
}

function $$$comparer(idx, asc){
	return (a, b) => (
		(v1, v2) => 
		v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
	)($$$getCellValue(asc ? a : b, idx), $$$getCellValue(asc ? b : a, idx));
}

function $$$init_tbls(){
	$(".thead .sort").each(function(i,el){el.addEventListener("click", function(){
		const tbl = el.parentNode.parentNode.parentNode.getElementsByClassName("tbody")[0]; // th < tr < thead < table
		Array.from(tbl.querySelectorAll('.tr'))
			.sort($$$comparer(Array.from(el.parentNode.children).indexOf(el), this.asc = !this.asc))
			.forEach(tr => tbl.appendChild(tr) );
	})});
	$(".thead .hide").each(function(i,el){
		el.addEventListener("click", function(){
			const tbl = el.parentNode.parentNode.parentNode.getElementsByClassName("tbody")[0]; // th < tr < thead < table
			Array.from(tbl.querySelectorAll('.tr'))
				.forEach(tr => tr.childNodes[Array.from(el.parentNode.children).indexOf(el)].classList.toggle('invisible'));
		});
	});
}
