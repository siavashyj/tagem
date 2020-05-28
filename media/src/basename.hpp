#pragma once

#include <compsky/mysql/query.hpp>
#include "dropdown_dialog.hpp"
#include "device.hpp"


namespace _mysql {
	extern MYSQL* obj;
}
extern char BUF[];


inline
size_t pardir_length__naiive(const QString& s){
	int end_of_dirname__indx = 0;
	for(auto i = 0;  i < s.size();  ){
		if (s.at(i) == QChar('/'))
			end_of_dirname__indx = i;
		++i;
	}
	return end_of_dirname__indx + 1;
}


inline
bool is_in_subdir_of(const char* path,  const char* dir){
	printf("is_in_usbdir_of\n\t%s\n\t%s\n", path, dir);
	// WARNING: path is assumed to be a child of dir.
	while(*path == *dir){
		++path;
		++dir;
	}
	while(true){
		if (*path == '/')
			return true;
		if (*path == 0)
			return false;
		++path;
	}
}


inline
size_t pardir_length__qry(const char* const file_path){
	constexpr static const compsky::asciify::flag::Escape f_esc;
	compsky::mysql::query(_mysql::obj, RES1, BUF,
		"SELECT name "
		"FROM dir "
		"WHERE name=LEFT(\"", f_esc, '"', file_path, "\", LENGTH(name)) "
		"ORDER BY LENGTH(name) DESC "
		"LIMIT 1"
	);
	const char* dir_name = nullptr;
	while(compsky::mysql::assign_next_row(RES1, &ROW1, &dir_name));
	if ((dir_name != nullptr)  and  (not is_in_subdir_of(file_path, dir_name)))
		return strlen(dir_name);
	return 0;
}


template<typename... Args>
void record_dir_from_filepath(const char* const _file_path,  Args... args){
	constexpr static const compsky::asciify::flag::Escape f_esc;
	
	bool ok;
	const QString prefix_qstr = QInputDialog::getText(
		nullptr,
		"New directory",
		"This filepath is from a new 'directory'. Please input the directory path (which only involves deleting characters from the end of the string). For instance, for YouTube videos, the 'directory' would be https://www.youtube.com/watch?v=. For a Mac/UNIX filesystem, it would be something like /path/to/directory/",
		QLineEdit::Normal,
		_file_path,
		&ok
	);
	const QByteArray ba = prefix_qstr.toLocal8Bit();
	const char* const prefix = ba.data();
	
	const uint64_t device = get_device_id__insert_if_not_exist(prefix, args...);
	compsky::mysql::exec(
		_mysql::obj,
		BUF,
		"INSERT INTO dir (device, name) "
		"SELECT ",
			device, ","
			"\"", f_esc, '"', prefix, "\" "
		"FROM dir "
		"WHERE NOT EXISTS ("
			"SELECT id "
			"FROM dir "
			"WHERE name=\"", f_esc, '"', prefix, "\""
		")"
		"LIMIT 1"
	);
	
	// WARNING: What happens if user tries to insert a directory which already exists in '_dir', but which they do not have permission to view (thus not appearing in the 'dir' view)?
}


template<typename... Args>
size_t pardir_length(const char* const file_path,  Args... args){
	while(true){
		const size_t sz = pardir_length__qry(file_path);
		if (sz)
			return sz;
		
		record_dir_from_filepath(file_path, args...);
	}
}


template<typename... Args>
size_t pardir_length(const QString& qstr,  Args... args){
	const QByteArray ba = qstr.toLocal8Bit();
	const char* const file_path = ba.data();
	return pardir_length(file_path);
}


inline
const char* basename(const char* s){
	return s + pardir_length(s);
}


inline
void update_file_from_path(const uint64_t _file_id,  const char* const _file_path){
	constexpr static const compsky::asciify::flag::Escape f_esc;
	constexpr static const compsky::asciify::flag::StrLen f_strlen;
	compsky::mysql::exec(
		_mysql::obj,
		BUF,
		"UPDATE file "
		"SET "
			"name=\"", f_esc, '"', basename(_file_path), "\","
			"dir=(SELECT id FROM dir WHERE name=\"", f_esc, '"', f_strlen, pardir_length(_file_path), _file_path, "\")"
		"WHERE id=", _file_id
	);
}


template<typename... Args>
void insert_file_from_path(const char* const _file_path,  Args... args){
	constexpr static const compsky::asciify::flag::Escape f_esc;
	constexpr static const compsky::asciify::flag::StrLen f_strlen;
	compsky::mysql::exec(
		_mysql::obj,
		BUF,
		"INSERT INTO file (dir, name) VALUES ("
			"(SELECT id FROM dir WHERE name=\"", f_esc, '"', f_strlen, pardir_length(_file_path, args...), _file_path, "\"),"
			"\"", f_esc, '"', basename(_file_path), "\""
		") ON DUPLICATE KEY UPDATE dir=dir"
	);
}
