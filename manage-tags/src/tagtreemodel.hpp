#ifndef __TAGTREEMODEL__
#define __TAGTREEMODEL__

#include <QCompleter>
#include <QStandardItemModel>
#include <QMimeData>

namespace res1 {
    extern void free_result();
    template<typename... Args>void query(Args... args);
    template<typename... Args>void exec(Args... args);
    extern void query_buffer(const char*);
    extern void query_buffer(const char*,  size_t);
    template<typename... Args>void asciify(Args... args);
    template<typename... Args>bool assign_next_result(Args... args);
}

namespace compsky::asciify {
    extern char* BUF;
}

// Assumes res1 is already defined through mymysql_results.hpp import


class TagTreeModel : public QStandardItemModel {
    Q_OBJECT
 public:
    TagTreeModel(int a,  int b,  QObject* parent);
    
    QStringList tagslist;
    QCompleter* tagcompleter;
    
    std::map<uint64_t, QString> tag2name;
    std::map<uint64_t, QStandardItem*> tag2entry;
    std::map<uint64_t, uint64_t> tag2parent;
    std::map<uint64_t, uint64_t> tag2directoccurances;
    std::map<uint64_t, uint64_t> tag2occurances;
    
    bool dropMimeData(const QMimeData* data,  Qt::DropAction action,  int row,  int column,  const QModelIndex& dst_parent) override;
    
    bool removeRows(int row,  int count,  QModelIndex parent);
};

#endif