function $$$obj_type2parent_type(obj_type){
	switch(obj_type){
		case 'f':
			return 'd';
		case 'd':
			return 'D';
		case 'D':
			return 'P';
	}
}

function $$$nickname2name(obj_type){
	switch(obj_type){
		case 'f':
			return 'file';
		case 'd':
			return 'dir';
		case 'D':
			return 'device';
		case 'P':
			return 'protocol';
	}
}

function $$$nickname2fullname(obj_type){
	switch(obj_type){
		case 'f':
			return 'file';
		case 'd':
			return 'directory';
		case 'D':
			return 'device';
		case 'P':
			return 'protocol';
	}
}

function $$$add_to_db(obj_type){
	const queue = $$$document_getElementById('add-'+obj_type+'-queue');
	const parent_type = $$$obj_type2parent_type(obj_type);
	
	if(obj_type==='t'){
		const tag_names = [];
		queue.innerText.replace(/(?:^|\n)([^\n]+)/g, function(group0, group1){
			tag_names.push(group1);
		});
		if(tag_names.length===0)
			return;
		const tagselect = $('#tagselect-self-p');
		const parent_ids = tagselect.val();
		if(parent_ids.length === 0)
			return;
		$$$ajax_POST_data_w_text_response("/t/add/"+parent_ids.join(",")+"/", tag_names.join("\n"), function(){
			tagselect.val("").change();
			queue.innerHTML = ""; // Remove URLs
			$$$alert("Success");
		});
		return;
	}
	
	const urls = [];
	queue.innerText.replace(/(?:^|\n)URL:[\s]*([^\n]+)\nParent:[\s]*([^\n]+)/g, function(group0, url, parent){
		const parent_id = Object.entries($$$window[parent_type]).filter(([key,[name,_]]) => name==parent)[0][0];
		urls.push([parent_id, url]);
	});
	if(urls.length===0){
		$$$alert("No URLs");
		return;
	}
	let tagselect;
	let tag_ids;
	if(obj_type==='f'){
		// TODO: Allow tagging of directories and devices
		tagselect = $('#tagselect-files');
		tag_ids = tagselect.val();
		if(tag_ids.length === 0){
			// TODO: Replace with confirmation dialog
			$$$alert("No tags");
			return;
		}
	}
	
	for(const [_parent_id, url] of urls){
		const parent_name = $$$window[parent_type][parseInt(_parent_id)][0];
		if(!url.startsWith(parent_name)){
			const parent_type_name = $$$nickname2fullname(parent_type);
			const err_txt = $$$nickname2fullname(obj_type) + " URL does not begin with assigned " + parent_type_name + "\nURL: " + url + "\n" + parent_type_name + ": " + parent_name;
			if(obj_type !== 'd'){
				$$$alert(err_txt);
				return;
			}
			if(!confirm(err_txt + "\nContinue?")){
				return;
			}
		}
	}
	$$$ajax_POST_data_w_text_response(
		"/" + obj_type + "/add/" + ((obj_type==='f')?tag_ids.join(",")+"/":""), // Trailing slash is for server's convenience
		urls.map(([parent,url]) => parent+'\t'+url).join('\n'),
		function(){
			if(obj_type==='f')
				tagselect.val("").change();
			queue.innerHTML = ""; // Remove URLs
			$$$alert("Success");
			if((obj_type!=='f')&&(obj_type!=='d'))
				$$$refetch_json(obj_type, '/a/'+obj_type+'.json');
		}
	);
}

function $$$add_to_db__append(obj_type){
	const inp = $$$document_getElementById('add-' + obj_type + '-input');
	const x = inp.value;
	if(x === ""){
		$$$alert("Enter a tag or URL");
		return;
	}
	
	if(obj_type==='t'){
		$$$document_getElementById('add-' + obj_type + '-queue').innerText += "\n" + inp.value;
	}else{
		const parent_type = $$$obj_type2parent_type(obj_type);
		const parent_select_id = $$$nickname2name(parent_type) + "select";
		const parent = $$$window[parent_type][$$$document_getElementById(parent_select_id).value];
		let parent_name;
		if(parent === undefined){
			// Guess the directory
			const tpl = $$$guess_parenty_thing_from_name(parent_type, x);
			if(tpl === undefined){
				const parent_type_name = $$$nickname2fullname(parent_type);
				$$$alert("Cannot find suitable " + parent_type_name + "\nPlease create a " + parent_type_name + " object that is a prefix of the " + $$$nickname2fullname(obj_type) + " URL");
				return;
			}
			parent_name = tpl[1];
		} else {
			parent_name = parent[0];
		}
		$$$document_getElementById('add-' + obj_type + '-queue').innerText += "\nURL:    " + inp.value + "\nParent: " + parent_name + "\n";
	}
	inp.value = "";
}
