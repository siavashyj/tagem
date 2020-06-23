#pragma once


namespace help {
	constexpr
	const char* const text =
		"USAGE\n"
		"	[[OPTIONS]] p [PORT_NUMBER] c [THUMBNAIL_DIRECTORY] [[EXTERNAL_DATABASES]]\n"
		"\n"
		"OPTIONS\n"
		"	X /path/to/file\n"
		"		Write external commands to this file\n"
		"		Hint: If these are BASH commands, could execute these lines as they are written:\n"
		"			mkfifo /tmp/tagem-external-cmds.pipe\n"
		"			(./server X /tmp/tagem-external-cmds.txt ...)&\n"
		"			while read line; do  eval \"$line\";  done < /tmp/tagem-external-cmds.pipe\n"
		"		Obviously security concerns etc.\n"
		"	Y [youtube-dl format]\n"
		"		DEFAULT\n"
		"			The default value restricts downloads to [height<=720] and prioritises the most compressed formats.\n"
		"		EXAMPLES\n"
		"			See https://github.com/TheFrenchGhosty/TheFrenchGhostys-YouTube-DL-Archivist-Scripts\n"
		"EXTERNAL DATABASES\n"
		"	Optional\n"
		"	List of environmental variables, each preceded by \"x\", pointing to files of the same format as $TAGEM_MYSQL_CFG, containing login data for foreign databases\n"
		"	Eg\n"
		"		x REDDIT_MYSQL_CFG x TWITTER_MYSQL_CFG\n"
		"	These foreign databases should contain, at a minimum, a \"post\" table\n"
		"	Each database should be of a unique name.\n"
		"	The tagem database itself contains the \"post2file\" table, which maps the external database's posts to tagem's files\n"
		// The alternative - the external database containing this table - would involve a lot more database calls. With this system, we can do a simple join, to tell clients that which posts are available in which external databases, and then only access the external database from file info and advanced queries.
		"	Other obtional tables, that will be recognised and used if available, are:\n"
		"		\"user\" for users\n"
		"		\"user2tagem_tag\" linking the user to tagem's tag table\n"
		"		\"follow\" linking users to other users\n"
		"		\"post2mention\" and \"post2like\" linking users to posts\n"
		"		\"cmnt\" for comments\n"
		"		\"cmnt2mention\" and \"cmnt2like\" linking users to comments\n"
		"		\"hashtag2tagem_tag\" linking tagem's tag table to the foreign hashtags\n"
		"		\"hashtag\"\n"
		"		\"post2hashtag\" linking posts to hashtags\n"
		"		\"follow_hashtag\" linking users to hashtags\n"
	;
};
