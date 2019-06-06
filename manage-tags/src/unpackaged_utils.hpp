#ifndef __UNPACKAGED_UTILS__
#define __UNPACKAGED_UTILS__

inline uint64_t ascii_to_uint64(const char* s){
    // Inlined to avoid multiple definition error
    uint64_t n = 0;
    while (*s != 0){
        n *= 10;
        n += *s - '0';
        ++s;
    }
    return n;
}

inline uint64_t ascii_to_uint64(char*& s){
    // Inlined to avoid multiple definition error
    uint64_t n = 0;
    while (*s >= '0'  &&  *s <= '9'){
        n *= 10;
        n += *s - '0';
        ++s;
    }
    return n;
}

#endif