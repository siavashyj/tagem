#include "mainwindow.hpp"

#include <compsky/mysql/query.hpp>

#include <QApplication>
#include <QCompleter>
#include <QStringList>

#ifdef VID
  #include <QtAVWidgets>
#endif

#include <map> // for std::map
#include <cstdlib> // for atof



namespace _mysql {
	MYSQL* obj;
	constexpr static const size_t auth_sz = 512;
	char auth[auth_sz];
}
MYSQL_RES* RES1;
MYSQL_ROW ROW1;
MYSQL_RES* RES2;
MYSQL_ROW ROW2;


int dummy_argc = 0;
char** dummy_argv;


QCompleter* tagcompleter;
QStringList tagslist;
std::map<uint64_t, QString> tag_id2name;


int main(const int argc,  const char** argv){
    compsky::mysql::init(_mysql::obj, _mysql::auth, _mysql::auth_sz, getenv("TAGEM_MYSQL_CFG"));
	
# ifdef VID
	QtAV::Widgets::registerRenderers();
# endif
	QApplication app(dummy_argc, dummy_argv);
	MainWindow player;
	
	bool show_gui = true;
	double volume = 1.0;
	while((*(++argv)) != 0){
		const char* const arg = *argv;
		
		if (arg[0] != '-'  ||  arg[1] == 0  ||  arg[2] != 0)
			break; // i.e. goto after_opts_parsed
		switch(arg[1]){
			case '-':
				goto after_opts_parsed;
		  #ifdef VID
			case 'a':
				player.auto_next = true;
				break;
			case 'v':
				// tmp - common flags such as "-v" and "-q" are misleading
				player.set_volume(atof(*(++argv)));
				break;
		  #endif
			case 's':
				show_gui = false;
				break;
			default:
				return 33;
		}
	}
	after_opts_parsed:
	
	compsky::mysql::query_buffer(_mysql::obj,  RES1,  "SELECT id, name FROM tag");
	{
		uint64_t id;
		const char* name;
		while (compsky::mysql::assign_next_row(RES1,  &ROW1,  &id, &name)){
			const QString s = name;
			tag_id2name[id] = s;
			tagslist << s;
		}
	}
	tagcompleter = new QCompleter(tagslist);
	
	const char* const inlist_filter_rule = *argv;
	
	if (inlist_filter_rule != nullptr){
		player.inlist_filter_dialog->load(inlist_filter_rule);
		player.inlist_filter_dialog->get_results();
	}
    player.show();
	if (player.auto_next)
		player.media_next();
    
    int rc = app.exec();
    compsky::mysql::wipe_auth(_mysql::auth, _mysql::auth_sz);
    return rc;
}
