// scope kind
var SCOPE_PROTO        = 0;
var SCOPE_MESSAGE    = 1;
var SCOPE_ENUM        = 2;
var SCOPE_SERVICE    = 3;

var syntax = "proto2";
var scopes = [];

// scope struct
function Scope() {
    var startOffset;
    var endOffset;
    var kind;
}

function addScope(startOffset, endOffset, kind) {
    var scope = new Scope();
    scope.startOffset = startOffset;
    scope.endOffset = endOffset;
    scope.kind = kind;
    scopes.push(scope);
}


/*
    Default template driver for JS/CC generated parsers running as
    browser-based JavaScript/ECMAScript applications.
    
    WARNING:     This parser template will not run as console and has lesser
                features for debugging than the console derivates for the
                various JavaScript platforms.
    
    Features:
    - Parser trace messages
    - Integrated panic-mode error recovery
    
    Written 2007, 2008 by Jan Max Meyer, J.M.K S.F. Software Technologies
    
    This is in the public domain.
*/

var _dbg_withtrace        = false;
var _dbg_string            = new String();

function __dbg_print( text )
{
    _dbg_string += text + "\n";
}

function __lex( info )
{
    var state        = 0;
    var match        = -1;
    var match_pos    = 0;
    var start        = 0;
    var pos            = info.offset + 1;

    do
    {
        pos--;
        state = 0;
        match = -2;
        start = pos;

        if( info.src.length <= start )
            return 70;

        do
        {

switch( state )
{
    case 0:
        if( ( info.src.charCodeAt( pos ) >= 9 && info.src.charCodeAt( pos ) <= 10 ) || info.src.charCodeAt( pos ) == 13 || info.src.charCodeAt( pos ) == 32 ) state = 1;
        else if( info.src.charCodeAt( pos ) == 40 ) state = 2;
        else if( info.src.charCodeAt( pos ) == 41 ) state = 3;
        else if( info.src.charCodeAt( pos ) == 44 ) state = 4;
        else if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 5;
        else if( info.src.charCodeAt( pos ) == 59 ) state = 6;
        else if( info.src.charCodeAt( pos ) == 60 ) state = 7;
        else if( info.src.charCodeAt( pos ) == 61 ) state = 8;
        else if( info.src.charCodeAt( pos ) == 62 ) state = 9;
        else if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 103 && info.src.charCodeAt( pos ) <= 104 ) || ( info.src.charCodeAt( pos ) >= 106 && info.src.charCodeAt( pos ) <= 108 ) || info.src.charCodeAt( pos ) == 110 || info.src.charCodeAt( pos ) == 113 || ( info.src.charCodeAt( pos ) >= 117 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 91 ) state = 11;
        else if( info.src.charCodeAt( pos ) == 93 ) state = 12;
        else if( info.src.charCodeAt( pos ) == 123 ) state = 13;
        else if( info.src.charCodeAt( pos ) == 125 ) state = 14;
        else if( info.src.charCodeAt( pos ) == 34 ) state = 35;
        else if( info.src.charCodeAt( pos ) == 116 ) state = 37;
        else if( info.src.charCodeAt( pos ) == 45 ) state = 38;
        else if( info.src.charCodeAt( pos ) == 46 ) state = 40;
        else if( info.src.charCodeAt( pos ) == 47 ) state = 42;
        else if( info.src.charCodeAt( pos ) == 109 ) state = 61;
        else if( info.src.charCodeAt( pos ) == 114 ) state = 62;
        else if( info.src.charCodeAt( pos ) == 101 ) state = 77;
        else if( info.src.charCodeAt( pos ) == 102 ) state = 90;
        else if( info.src.charCodeAt( pos ) == 111 ) state = 91;
        else if( info.src.charCodeAt( pos ) == 105 ) state = 102;
        else if( info.src.charCodeAt( pos ) == 115 ) state = 103;
        else if( info.src.charCodeAt( pos ) == 112 ) state = 111;
        else state = -1;
        break;

    case 1:
        state = -1;
        match = 1;
        match_pos = pos;
        break;

    case 2:
        state = -1;
        match = 27;
        match_pos = pos;
        break;

    case 3:
        state = -1;
        match = 28;
        match_pos = pos;
        break;

    case 4:
        state = -1;
        match = 23;
        match_pos = pos;
        break;

    case 5:
        if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 5;
        else if( info.src.charCodeAt( pos ) == 46 ) state = 16;
        else state = -1;
        match = 33;
        match_pos = pos;
        break;

    case 6:
        state = -1;
        match = 22;
        match_pos = pos;
        break;

    case 7:
        state = -1;
        match = 25;
        match_pos = pos;
        break;

    case 8:
        state = -1;
        match = 24;
        match_pos = pos;
        break;

    case 9:
        state = -1;
        match = 26;
        match_pos = pos;
        break;

    case 10:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 11:
        state = -1;
        match = 29;
        match_pos = pos;
        break;

    case 12:
        state = -1;
        match = 30;
        match_pos = pos;
        break;

    case 13:
        state = -1;
        match = 20;
        match_pos = pos;
        break;

    case 14:
        state = -1;
        match = 21;
        match_pos = pos;
        break;

    case 15:
        state = -1;
        match = 32;
        match_pos = pos;
        break;

    case 16:
        if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 16;
        else state = -1;
        match = 34;
        match_pos = pos;
        break;

    case 17:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else state = -1;
        match = 10;
        match_pos = pos;
        break;

    case 18:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else state = -1;
        match = 8;
        match_pos = pos;
        break;

    case 19:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else state = -1;
        match = 16;
        match_pos = pos;
        break;

    case 20:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else state = -1;
        match = 11;
        match_pos = pos;
        break;

    case 21:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else state = -1;
        match = 18;
        match_pos = pos;
        break;

    case 22:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else state = -1;
        match = 19;
        match_pos = pos;
        break;

    case 23:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else state = -1;
        match = 7;
        match_pos = pos;
        break;

    case 24:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else state = -1;
        match = 4;
        match_pos = pos;
        break;

    case 25:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 98 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 97 ) state = 57;
        else state = -1;
        match = 5;
        match_pos = pos;
        break;

    case 26:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else state = -1;
        match = 2;
        match_pos = pos;
        break;

    case 27:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else state = -1;
        match = 6;
        match_pos = pos;
        break;

    case 28:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else state = -1;
        match = 3;
        match_pos = pos;
        break;

    case 29:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else state = -1;
        match = 17;
        match_pos = pos;
        break;

    case 30:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else state = -1;
        match = 12;
        match_pos = pos;
        break;

    case 31:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else state = -1;
        match = 13;
        match_pos = pos;
        break;

    case 32:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else state = -1;
        match = 15;
        match_pos = pos;
        break;

    case 33:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else state = -1;
        match = 14;
        match_pos = pos;
        break;

    case 34:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else state = -1;
        match = 9;
        match_pos = pos;
        break;

    case 35:
        if( info.src.charCodeAt( pos ) == 34 ) state = 15;
        else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 33 ) || ( info.src.charCodeAt( pos ) >= 35 && info.src.charCodeAt( pos ) <= 254 ) ) state = 35;
        else state = -1;
        break;

    case 36:
        if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 41 ) || ( info.src.charCodeAt( pos ) >= 43 && info.src.charCodeAt( pos ) <= 254 ) ) state = 44;
        else if( info.src.charCodeAt( pos ) == 42 ) state = 48;
        else state = -1;
        match = 1;
        match_pos = pos;
        break;

    case 37:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 110 ) || ( info.src.charCodeAt( pos ) >= 112 && info.src.charCodeAt( pos ) <= 113 ) || ( info.src.charCodeAt( pos ) >= 115 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 111 ) state = 17;
        else if( info.src.charCodeAt( pos ) == 114 ) state = 64;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 38:
        if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 5;
        else state = -1;
        break;

    case 39:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 111 ) || ( info.src.charCodeAt( pos ) >= 113 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 112 ) state = 18;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 40:
        if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 16;
        else state = -1;
        break;

    case 41:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 98 ) || ( info.src.charCodeAt( pos ) >= 100 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 99 ) state = 19;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 42:
        if( info.src.charCodeAt( pos ) == 42 ) state = 44;
        else if( info.src.charCodeAt( pos ) == 47 ) state = 46;
        else state = -1;
        break;

    case 43:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 108 ) || ( info.src.charCodeAt( pos ) >= 110 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 109 ) state = 20;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 44:
        if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 41 ) || ( info.src.charCodeAt( pos ) >= 43 && info.src.charCodeAt( pos ) <= 254 ) ) state = 44;
        else if( info.src.charCodeAt( pos ) == 42 ) state = 48;
        else state = -1;
        break;

    case 45:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 101 ) state = 21;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 46:
        if( info.src.charCodeAt( pos ) == 10 ) state = 1;
        else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 9 ) || ( info.src.charCodeAt( pos ) >= 11 && info.src.charCodeAt( pos ) <= 254 ) ) state = 46;
        else state = -1;
        break;

    case 47:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 101 ) state = 22;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 48:
        if( info.src.charCodeAt( pos ) == 47 ) state = 36;
        else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 41 ) || ( info.src.charCodeAt( pos ) >= 43 && info.src.charCodeAt( pos ) <= 46 ) || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 254 ) ) state = 44;
        else if( info.src.charCodeAt( pos ) == 42 ) state = 48;
        else state = -1;
        break;

    case 49:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 101 ) || ( info.src.charCodeAt( pos ) >= 103 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 102 ) state = 23;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 50:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 115 ) || ( info.src.charCodeAt( pos ) >= 117 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 116 ) state = 24;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 51:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 109 ) || ( info.src.charCodeAt( pos ) >= 111 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 110 ) state = 25;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 52:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 119 ) || ( info.src.charCodeAt( pos ) >= 121 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 120 ) state = 26;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 53:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 101 ) state = 27;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 54:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 101 ) state = 28;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 55:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 114 ) || ( info.src.charCodeAt( pos ) >= 116 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 115 ) state = 29;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 56:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 101 ) state = 30;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 57:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 107 ) || ( info.src.charCodeAt( pos ) >= 109 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 108 ) state = 31;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 58:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 99 ) || ( info.src.charCodeAt( pos ) >= 101 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 100 ) state = 32;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 59:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 99 ) || ( info.src.charCodeAt( pos ) >= 101 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 100 ) state = 33;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 60:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 99 ) || ( info.src.charCodeAt( pos ) >= 101 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 100 ) state = 34;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 61:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 98 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 97 ) state = 39;
        else if( info.src.charCodeAt( pos ) == 101 ) state = 104;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 62:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 111 ) || ( info.src.charCodeAt( pos ) >= 113 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 112 ) state = 41;
        else if( info.src.charCodeAt( pos ) == 101 ) state = 106;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 63:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 116 ) || ( info.src.charCodeAt( pos ) >= 118 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 117 ) state = 43;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 64:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 116 ) || ( info.src.charCodeAt( pos ) >= 118 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 117 ) state = 45;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 65:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 114 ) || ( info.src.charCodeAt( pos ) >= 116 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 115 ) state = 47;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 66:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 110 ) || ( info.src.charCodeAt( pos ) >= 112 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 111 ) state = 49;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 67:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 113 ) || ( info.src.charCodeAt( pos ) >= 115 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 114 ) state = 50;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 68:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 110 ) || ( info.src.charCodeAt( pos ) >= 112 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 111 ) state = 51;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 69:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 98 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 97 ) state = 52;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 70:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 102 ) || ( info.src.charCodeAt( pos ) >= 104 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 103 ) state = 53;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 71:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 102 ) || ( info.src.charCodeAt( pos ) >= 104 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 103 ) state = 54;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 72:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 109 ) || ( info.src.charCodeAt( pos ) >= 111 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 110 ) state = 55;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 73:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 98 ) || ( info.src.charCodeAt( pos ) >= 100 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 99 ) state = 56;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 74:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 101 ) state = 58;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 75:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 101 ) state = 59;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 76:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 101 ) state = 60;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 77:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 109 ) || ( info.src.charCodeAt( pos ) >= 111 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 110 ) state = 63;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 78:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 107 ) || ( info.src.charCodeAt( pos ) >= 109 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 108 ) state = 65;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 79:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 101 ) state = 66;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 80:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 110 ) || ( info.src.charCodeAt( pos ) >= 112 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 111 ) state = 67;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 81:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 104 ) || ( info.src.charCodeAt( pos ) >= 106 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 105 ) state = 68;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 82:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 115 ) || ( info.src.charCodeAt( pos ) >= 117 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 116 ) state = 69;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 83:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 98 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 97 ) state = 70;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 84:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 98 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 97 ) state = 71;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 85:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 113 ) || ( info.src.charCodeAt( pos ) >= 115 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 114 ) state = 72;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 86:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 104 ) || ( info.src.charCodeAt( pos ) >= 106 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 105 ) state = 73;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 87:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 115 ) || ( info.src.charCodeAt( pos ) >= 117 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 116 ) state = 74;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 88:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 113 ) || ( info.src.charCodeAt( pos ) >= 115 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 114 ) state = 75;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 89:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 117 ) || ( info.src.charCodeAt( pos ) >= 119 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 118 ) state = 76;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 90:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 98 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 97 ) state = 78;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 91:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 109 ) || info.src.charCodeAt( pos ) == 111 || ( info.src.charCodeAt( pos ) >= 113 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 110 ) state = 79;
        else if( info.src.charCodeAt( pos ) == 112 ) state = 93;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 92:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 111 ) || ( info.src.charCodeAt( pos ) >= 113 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 112 ) state = 80;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 93:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 115 ) || ( info.src.charCodeAt( pos ) >= 117 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 116 ) state = 81;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 94:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 109 ) || ( info.src.charCodeAt( pos ) >= 111 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 110 ) state = 82;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 95:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 114 ) || ( info.src.charCodeAt( pos ) >= 116 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 115 ) state = 83;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 96:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 106 ) || ( info.src.charCodeAt( pos ) >= 108 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 107 ) state = 84;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 97:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 116 ) || ( info.src.charCodeAt( pos ) >= 118 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 117 ) state = 85;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 98:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 117 ) || ( info.src.charCodeAt( pos ) >= 119 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 118 ) state = 86;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 99:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 98 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 97 ) state = 87;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 100:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 104 ) || ( info.src.charCodeAt( pos ) >= 106 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 105 ) state = 88;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 101:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 113 ) || ( info.src.charCodeAt( pos ) >= 115 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 114 ) state = 89;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 102:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 108 ) || ( info.src.charCodeAt( pos ) >= 110 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 109 ) state = 92;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 103:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 120 ) || info.src.charCodeAt( pos ) == 122 ) state = 10;
        else if( info.src.charCodeAt( pos ) == 121 ) state = 94;
        else if( info.src.charCodeAt( pos ) == 101 ) state = 107;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 104:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 114 ) || ( info.src.charCodeAt( pos ) >= 116 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 115 ) state = 95;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 105:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 98 ) || ( info.src.charCodeAt( pos ) >= 100 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 99 ) state = 96;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 106:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 111 ) || info.src.charCodeAt( pos ) == 114 || ( info.src.charCodeAt( pos ) >= 117 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 116 ) state = 97;
        else if( info.src.charCodeAt( pos ) == 112 ) state = 108;
        else if( info.src.charCodeAt( pos ) == 113 ) state = 109;
        else if( info.src.charCodeAt( pos ) == 115 ) state = 110;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 107:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 113 ) || ( info.src.charCodeAt( pos ) >= 115 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 114 ) state = 98;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 108:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 101 ) state = 99;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 109:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 116 ) || ( info.src.charCodeAt( pos ) >= 118 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 117 ) state = 100;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 110:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 101 ) state = 101;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

    case 111:
        if( info.src.charCodeAt( pos ) == 46 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 98 && info.src.charCodeAt( pos ) <= 122 ) ) state = 10;
        else if( info.src.charCodeAt( pos ) == 97 ) state = 105;
        else state = -1;
        match = 31;
        match_pos = pos;
        break;

}


            pos++;

        }
        while( state > -1 );

    }
    while( 1 > -1 && match == 1 );

    if( match > -1 )
    {
        info.att = info.src.substr( start, match_pos - start );
        info.offset = match_pos;
        
switch( match )
{
    case 20:
        {
         info.att = ( info.offset - info.att.length ) 
        }
        break;

    case 21:
        {
         info.att = ( info.offset - info.att.length ) 
        }
        break;

    case 32:
        {
         info.att = info.att.substr( 1, info.att.length - 2 ); 
        }
        break;

}


    }
    else
    {
        info.att = new String();
        match = -1;
    }

    return match;
}


function __parse( src, err_off, err_la )
{
    var        sstack            = new Array();
    var        vstack            = new Array();
    var     err_cnt            = 0;
    var        act;
    var        go;
    var        la;
    var        rval;
    // var     parseinfo        = new Function( "", "var offset; var src; var att;" );
    // var        info            = new parseinfo();
    var info = {offset:null, src:null, att:null};
    
/* Pop-Table */
var pop_tab = new Array(
    new Array( 0/* Proto' */, 1 ),
    new Array( 35/* Proto */, 2 ),
    new Array( 35/* Proto */, 0 ),
    new Array( 36/* TopLevel */, 1 ),
    new Array( 36/* TopLevel */, 1 ),
    new Array( 36/* TopLevel */, 1 ),
    new Array( 36/* TopLevel */, 1 ),
    new Array( 36/* TopLevel */, 1 ),
    new Array( 36/* TopLevel */, 1 ),
    new Array( 36/* TopLevel */, 1 ),
    new Array( 37/* Syntax */, 4 ),
    new Array( 38/* Package */, 3 ),
    new Array( 39/* Import */, 3 ),
    new Array( 40/* Option */, 5 ),
    new Array( 44/* OptionValue */, 1 ),
    new Array( 44/* OptionValue */, 1 ),
    new Array( 44/* OptionValue */, 1 ),
    new Array( 44/* OptionValue */, 1 ),
    new Array( 44/* OptionValue */, 1 ),
    new Array( 44/* OptionValue */, 1 ),
    new Array( 41/* Message */, 5 ),
    new Array( 45/* MessageBody */, 2 ),
    new Array( 45/* MessageBody */, 2 ),
    new Array( 45/* MessageBody */, 2 ),
    new Array( 45/* MessageBody */, 2 ),
    new Array( 45/* MessageBody */, 2 ),
    new Array( 45/* MessageBody */, 2 ),
    new Array( 45/* MessageBody */, 0 ),
    new Array( 46/* Field */, 7 ),
    new Array( 49/* FieldRule */, 1 ),
    new Array( 49/* FieldRule */, 1 ),
    new Array( 49/* FieldRule */, 1 ),
    new Array( 49/* FieldRule */, 0 ),
    new Array( 50/* FieldType */, 1 ),
    new Array( 50/* FieldType */, 1 ),
    new Array( 54/* MapFieldType */, 6 ),
    new Array( 51/* FieldName */, 1 ),
    new Array( 52/* Tag */, 1 ),
    new Array( 53/* FieldOption */, 5 ),
    new Array( 53/* FieldOption */, 0 ),
    new Array( 47/* Oneof */, 5 ),
    new Array( 55/* FieldList */, 2 ),
    new Array( 55/* FieldList */, 1 ),
    new Array( 48/* Reserved */, 3 ),
    new Array( 48/* Reserved */, 3 ),
    new Array( 56/* ReservedTags */, 3 ),
    new Array( 56/* ReservedTags */, 1 ),
    new Array( 56/* ReservedTags */, 3 ),
    new Array( 57/* ReservedNames */, 1 ),
    new Array( 57/* ReservedNames */, 3 ),
    new Array( 42/* Enum */, 5 ),
    new Array( 58/* EnumBody */, 2 ),
    new Array( 58/* EnumBody */, 2 ),
    new Array( 58/* EnumBody */, 0 ),
    new Array( 59/* Const */, 5 ),
    new Array( 60/* ConstName */, 1 ),
    new Array( 61/* ConstValue */, 1 ),
    new Array( 62/* ConstOption */, 5 ),
    new Array( 62/* ConstOption */, 0 ),
    new Array( 43/* Service */, 5 ),
    new Array( 63/* ServiceBody */, 2 ),
    new Array( 63/* ServiceBody */, 2 ),
    new Array( 63/* ServiceBody */, 0 ),
    new Array( 64/* Method */, 10 ),
    new Array( 65/* MethodName */, 1 ),
    new Array( 66/* Request */, 1 ),
    new Array( 67/* Response */, 1 ),
    new Array( 68/* MethodBody */, 1 ),
    new Array( 68/* MethodBody */, 3 ),
    new Array( 69/* OptionList */, 2 ),
    new Array( 69/* OptionList */, 0 )
);

/* Action-Table */
var act_tab = new Array(
    /* State 0 */ new Array( 70/* "$" */,-2 , 2/* "syntax" */,-2 , 3/* "package" */,-2 , 4/* "import" */,-2 , 5/* "option" */,-2 , 6/* "message" */,-2 , 11/* "enum" */,-2 , 12/* "service" */,-2 ),
    /* State 1 */ new Array( 2/* "syntax" */,10 , 3/* "package" */,11 , 4/* "import" */,12 , 5/* "option" */,13 , 6/* "message" */,14 , 11/* "enum" */,15 , 12/* "service" */,16 , 70/* "$" */,0 ),
    /* State 2 */ new Array( 70/* "$" */,-1 , 2/* "syntax" */,-1 , 3/* "package" */,-1 , 4/* "import" */,-1 , 5/* "option" */,-1 , 6/* "message" */,-1 , 11/* "enum" */,-1 , 12/* "service" */,-1 ),
    /* State 3 */ new Array( 70/* "$" */,-3 , 2/* "syntax" */,-3 , 3/* "package" */,-3 , 4/* "import" */,-3 , 5/* "option" */,-3 , 6/* "message" */,-3 , 11/* "enum" */,-3 , 12/* "service" */,-3 ),
    /* State 4 */ new Array( 70/* "$" */,-4 , 2/* "syntax" */,-4 , 3/* "package" */,-4 , 4/* "import" */,-4 , 5/* "option" */,-4 , 6/* "message" */,-4 , 11/* "enum" */,-4 , 12/* "service" */,-4 ),
    /* State 5 */ new Array( 70/* "$" */,-5 , 2/* "syntax" */,-5 , 3/* "package" */,-5 , 4/* "import" */,-5 , 5/* "option" */,-5 , 6/* "message" */,-5 , 11/* "enum" */,-5 , 12/* "service" */,-5 ),
    /* State 6 */ new Array( 70/* "$" */,-6 , 2/* "syntax" */,-6 , 3/* "package" */,-6 , 4/* "import" */,-6 , 5/* "option" */,-6 , 6/* "message" */,-6 , 11/* "enum" */,-6 , 12/* "service" */,-6 ),
    /* State 7 */ new Array( 70/* "$" */,-7 , 2/* "syntax" */,-7 , 3/* "package" */,-7 , 4/* "import" */,-7 , 5/* "option" */,-7 , 6/* "message" */,-7 , 11/* "enum" */,-7 , 12/* "service" */,-7 ),
    /* State 8 */ new Array( 70/* "$" */,-8 , 2/* "syntax" */,-8 , 3/* "package" */,-8 , 4/* "import" */,-8 , 5/* "option" */,-8 , 6/* "message" */,-8 , 11/* "enum" */,-8 , 12/* "service" */,-8 ),
    /* State 9 */ new Array( 70/* "$" */,-9 , 2/* "syntax" */,-9 , 3/* "package" */,-9 , 4/* "import" */,-9 , 5/* "option" */,-9 , 6/* "message" */,-9 , 11/* "enum" */,-9 , 12/* "service" */,-9 ),
    /* State 10 */ new Array( 24/* "=" */,17 ),
    /* State 11 */ new Array( 31/* "Identifier" */,18 ),
    /* State 12 */ new Array( 32/* "String" */,19 ),
    /* State 13 */ new Array( 31/* "Identifier" */,20 ),
    /* State 14 */ new Array( 31/* "Identifier" */,21 ),
    /* State 15 */ new Array( 31/* "Identifier" */,22 ),
    /* State 16 */ new Array( 31/* "Identifier" */,23 ),
    /* State 17 */ new Array( 32/* "String" */,24 ),
    /* State 18 */ new Array( 22/* ";" */,25 ),
    /* State 19 */ new Array( 22/* ";" */,26 ),
    /* State 20 */ new Array( 24/* "=" */,27 ),
    /* State 21 */ new Array( 20/* "{" */,28 ),
    /* State 22 */ new Array( 20/* "{" */,29 ),
    /* State 23 */ new Array( 20/* "{" */,30 ),
    /* State 24 */ new Array( 22/* ";" */,31 ),
    /* State 25 */ new Array( 70/* "$" */,-11 , 2/* "syntax" */,-11 , 3/* "package" */,-11 , 4/* "import" */,-11 , 5/* "option" */,-11 , 6/* "message" */,-11 , 11/* "enum" */,-11 , 12/* "service" */,-11 ),
    /* State 26 */ new Array( 70/* "$" */,-12 , 2/* "syntax" */,-12 , 3/* "package" */,-12 , 4/* "import" */,-12 , 5/* "option" */,-12 , 6/* "message" */,-12 , 11/* "enum" */,-12 , 12/* "service" */,-12 ),
    /* State 27 */ new Array( 31/* "Identifier" */,33 , 32/* "String" */,34 , 33/* "Integer" */,35 , 34/* "Float" */,36 , 18/* "true" */,37 , 19/* "false" */,38 ),
    /* State 28 */ new Array( 21/* "}" */,-27 , 5/* "option" */,-27 , 13/* "optional" */,-27 , 14/* "required" */,-27 , 15/* "repeated" */,-27 , 31/* "Identifier" */,-27 , 8/* "map" */,-27 , 7/* "oneof" */,-27 , 9/* "reserved" */,-27 , 11/* "enum" */,-27 , 6/* "message" */,-27 ),
    /* State 29 */ new Array( 21/* "}" */,-53 , 5/* "option" */,-53 , 31/* "Identifier" */,-53 ),
    /* State 30 */ new Array( 21/* "}" */,-62 , 5/* "option" */,-62 , 16/* "rpc" */,-62 ),
    /* State 31 */ new Array( 70/* "$" */,-10 , 2/* "syntax" */,-10 , 3/* "package" */,-10 , 4/* "import" */,-10 , 5/* "option" */,-10 , 6/* "message" */,-10 , 11/* "enum" */,-10 , 12/* "service" */,-10 ),
    /* State 32 */ new Array( 22/* ";" */,42 ),
    /* State 33 */ new Array( 22/* ";" */,-14 , 30/* "]" */,-14 ),
    /* State 34 */ new Array( 22/* ";" */,-15 , 30/* "]" */,-15 ),
    /* State 35 */ new Array( 22/* ";" */,-16 , 30/* "]" */,-16 ),
    /* State 36 */ new Array( 22/* ";" */,-17 , 30/* "]" */,-17 ),
    /* State 37 */ new Array( 22/* ";" */,-18 , 30/* "]" */,-18 ),
    /* State 38 */ new Array( 22/* ";" */,-19 , 30/* "]" */,-19 ),
    /* State 39 */ new Array( 21/* "}" */,49 , 5/* "option" */,13 , 7/* "oneof" */,51 , 9/* "reserved" */,52 , 11/* "enum" */,15 , 6/* "message" */,14 , 13/* "optional" */,53 , 14/* "required" */,54 , 15/* "repeated" */,55 , 31/* "Identifier" */,-32 , 8/* "map" */,-32 ),
    /* State 40 */ new Array( 21/* "}" */,58 , 5/* "option" */,13 , 31/* "Identifier" */,60 ),
    /* State 41 */ new Array( 21/* "}" */,63 , 5/* "option" */,13 , 16/* "rpc" */,64 ),
    /* State 42 */ new Array( 70/* "$" */,-13 , 2/* "syntax" */,-13 , 3/* "package" */,-13 , 4/* "import" */,-13 , 5/* "option" */,-13 , 6/* "message" */,-13 , 11/* "enum" */,-13 , 12/* "service" */,-13 , 21/* "}" */,-13 , 13/* "optional" */,-13 , 14/* "required" */,-13 , 15/* "repeated" */,-13 , 31/* "Identifier" */,-13 , 8/* "map" */,-13 , 7/* "oneof" */,-13 , 9/* "reserved" */,-13 , 16/* "rpc" */,-13 ),
    /* State 43 */ new Array( 21/* "}" */,-26 , 5/* "option" */,-26 , 13/* "optional" */,-26 , 14/* "required" */,-26 , 15/* "repeated" */,-26 , 31/* "Identifier" */,-26 , 8/* "map" */,-26 , 7/* "oneof" */,-26 , 9/* "reserved" */,-26 , 11/* "enum" */,-26 , 6/* "message" */,-26 ),
    /* State 44 */ new Array( 21/* "}" */,-25 , 5/* "option" */,-25 , 13/* "optional" */,-25 , 14/* "required" */,-25 , 15/* "repeated" */,-25 , 31/* "Identifier" */,-25 , 8/* "map" */,-25 , 7/* "oneof" */,-25 , 9/* "reserved" */,-25 , 11/* "enum" */,-25 , 6/* "message" */,-25 ),
    /* State 45 */ new Array( 21/* "}" */,-24 , 5/* "option" */,-24 , 13/* "optional" */,-24 , 14/* "required" */,-24 , 15/* "repeated" */,-24 , 31/* "Identifier" */,-24 , 8/* "map" */,-24 , 7/* "oneof" */,-24 , 9/* "reserved" */,-24 , 11/* "enum" */,-24 , 6/* "message" */,-24 ),
    /* State 46 */ new Array( 21/* "}" */,-23 , 5/* "option" */,-23 , 13/* "optional" */,-23 , 14/* "required" */,-23 , 15/* "repeated" */,-23 , 31/* "Identifier" */,-23 , 8/* "map" */,-23 , 7/* "oneof" */,-23 , 9/* "reserved" */,-23 , 11/* "enum" */,-23 , 6/* "message" */,-23 ),
    /* State 47 */ new Array( 21/* "}" */,-22 , 5/* "option" */,-22 , 13/* "optional" */,-22 , 14/* "required" */,-22 , 15/* "repeated" */,-22 , 31/* "Identifier" */,-22 , 8/* "map" */,-22 , 7/* "oneof" */,-22 , 9/* "reserved" */,-22 , 11/* "enum" */,-22 , 6/* "message" */,-22 ),
    /* State 48 */ new Array( 21/* "}" */,-21 , 5/* "option" */,-21 , 13/* "optional" */,-21 , 14/* "required" */,-21 , 15/* "repeated" */,-21 , 31/* "Identifier" */,-21 , 8/* "map" */,-21 , 7/* "oneof" */,-21 , 9/* "reserved" */,-21 , 11/* "enum" */,-21 , 6/* "message" */,-21 ),
    /* State 49 */ new Array( 70/* "$" */,-20 , 2/* "syntax" */,-20 , 3/* "package" */,-20 , 4/* "import" */,-20 , 5/* "option" */,-20 , 6/* "message" */,-20 , 11/* "enum" */,-20 , 12/* "service" */,-20 , 21/* "}" */,-20 , 13/* "optional" */,-20 , 14/* "required" */,-20 , 15/* "repeated" */,-20 , 31/* "Identifier" */,-20 , 8/* "map" */,-20 , 7/* "oneof" */,-20 , 9/* "reserved" */,-20 ),
    /* State 50 */ new Array( 31/* "Identifier" */,66 , 8/* "map" */,68 ),
    /* State 51 */ new Array( 31/* "Identifier" */,69 ),
    /* State 52 */ new Array( 33/* "Integer" */,72 , 32/* "String" */,73 ),
    /* State 53 */ new Array( 31/* "Identifier" */,-29 , 8/* "map" */,-29 ),
    /* State 54 */ new Array( 31/* "Identifier" */,-30 , 8/* "map" */,-30 ),
    /* State 55 */ new Array( 31/* "Identifier" */,-31 , 8/* "map" */,-31 ),
    /* State 56 */ new Array( 21/* "}" */,-52 , 5/* "option" */,-52 , 31/* "Identifier" */,-52 ),
    /* State 57 */ new Array( 21/* "}" */,-51 , 5/* "option" */,-51 , 31/* "Identifier" */,-51 ),
    /* State 58 */ new Array( 70/* "$" */,-50 , 2/* "syntax" */,-50 , 3/* "package" */,-50 , 4/* "import" */,-50 , 5/* "option" */,-50 , 6/* "message" */,-50 , 11/* "enum" */,-50 , 12/* "service" */,-50 , 21/* "}" */,-50 , 13/* "optional" */,-50 , 14/* "required" */,-50 , 15/* "repeated" */,-50 , 31/* "Identifier" */,-50 , 8/* "map" */,-50 , 7/* "oneof" */,-50 , 9/* "reserved" */,-50 ),
    /* State 59 */ new Array( 24/* "=" */,74 ),
    /* State 60 */ new Array( 24/* "=" */,-55 ),
    /* State 61 */ new Array( 21/* "}" */,-61 , 5/* "option" */,-61 , 16/* "rpc" */,-61 ),
    /* State 62 */ new Array( 21/* "}" */,-60 , 5/* "option" */,-60 , 16/* "rpc" */,-60 ),
    /* State 63 */ new Array( 70/* "$" */,-59 , 2/* "syntax" */,-59 , 3/* "package" */,-59 , 4/* "import" */,-59 , 5/* "option" */,-59 , 6/* "message" */,-59 , 11/* "enum" */,-59 , 12/* "service" */,-59 ),
    /* State 64 */ new Array( 31/* "Identifier" */,76 ),
    /* State 65 */ new Array( 31/* "Identifier" */,78 ),
    /* State 66 */ new Array( 31/* "Identifier" */,-33 ),
    /* State 67 */ new Array( 31/* "Identifier" */,-34 ),
    /* State 68 */ new Array( 25/* "<" */,79 ),
    /* State 69 */ new Array( 20/* "{" */,80 ),
    /* State 70 */ new Array( 22/* ";" */,81 ),
    /* State 71 */ new Array( 23/* "," */,82 , 22/* ";" */,83 ),
    /* State 72 */ new Array( 10/* "to" */,84 , 22/* ";" */,-46 , 23/* "," */,-46 ),
    /* State 73 */ new Array( 23/* "," */,85 , 22/* ";" */,-48 ),
    /* State 74 */ new Array( 33/* "Integer" */,87 ),
    /* State 75 */ new Array( 27/* "(" */,88 ),
    /* State 76 */ new Array( 27/* "(" */,-64 ),
    /* State 77 */ new Array( 24/* "=" */,89 ),
    /* State 78 */ new Array( 24/* "=" */,-36 ),
    /* State 79 */ new Array( 31/* "Identifier" */,90 ),
    /* State 80 */ new Array( 13/* "optional" */,53 , 14/* "required" */,54 , 15/* "repeated" */,55 , 31/* "Identifier" */,-32 , 8/* "map" */,-32 ),
    /* State 81 */ new Array( 21/* "}" */,-44 , 5/* "option" */,-44 , 13/* "optional" */,-44 , 14/* "required" */,-44 , 15/* "repeated" */,-44 , 31/* "Identifier" */,-44 , 8/* "map" */,-44 , 7/* "oneof" */,-44 , 9/* "reserved" */,-44 , 11/* "enum" */,-44 , 6/* "message" */,-44 ),
    /* State 82 */ new Array( 33/* "Integer" */,72 ),
    /* State 83 */ new Array( 21/* "}" */,-43 , 5/* "option" */,-43 , 13/* "optional" */,-43 , 14/* "required" */,-43 , 15/* "repeated" */,-43 , 31/* "Identifier" */,-43 , 8/* "map" */,-43 , 7/* "oneof" */,-43 , 9/* "reserved" */,-43 , 11/* "enum" */,-43 , 6/* "message" */,-43 ),
    /* State 84 */ new Array( 33/* "Integer" */,94 ),
    /* State 85 */ new Array( 32/* "String" */,95 ),
    /* State 86 */ new Array( 29/* "[" */,97 , 22/* ";" */,-58 ),
    /* State 87 */ new Array( 29/* "[" */,-56 , 22/* ";" */,-56 ),
    /* State 88 */ new Array( 31/* "Identifier" */,99 ),
    /* State 89 */ new Array( 33/* "Integer" */,101 ),
    /* State 90 */ new Array( 23/* "," */,102 ),
    /* State 91 */ new Array( 21/* "}" */,104 , 13/* "optional" */,53 , 14/* "required" */,54 , 15/* "repeated" */,55 , 31/* "Identifier" */,-32 , 8/* "map" */,-32 ),
    /* State 92 */ new Array( 21/* "}" */,-42 , 13/* "optional" */,-42 , 14/* "required" */,-42 , 15/* "repeated" */,-42 , 31/* "Identifier" */,-42 , 8/* "map" */,-42 ),
    /* State 93 */ new Array( 23/* "," */,82 , 22/* ";" */,-45 ),
    /* State 94 */ new Array( 22/* ";" */,-47 , 23/* "," */,-47 ),
    /* State 95 */ new Array( 22/* ";" */,-49 ),
    /* State 96 */ new Array( 22/* ";" */,105 ),
    /* State 97 */ new Array( 31/* "Identifier" */,106 ),
    /* State 98 */ new Array( 28/* ")" */,107 ),
    /* State 99 */ new Array( 28/* ")" */,-65 ),
    /* State 100 */ new Array( 29/* "[" */,109 , 22/* ";" */,-39 ),
    /* State 101 */ new Array( 29/* "[" */,-37 , 22/* ";" */,-37 ),
    /* State 102 */ new Array( 31/* "Identifier" */,110 ),
    /* State 103 */ new Array( 21/* "}" */,-41 , 13/* "optional" */,-41 , 14/* "required" */,-41 , 15/* "repeated" */,-41 , 31/* "Identifier" */,-41 , 8/* "map" */,-41 ),
    /* State 104 */ new Array( 21/* "}" */,-40 , 5/* "option" */,-40 , 13/* "optional" */,-40 , 14/* "required" */,-40 , 15/* "repeated" */,-40 , 31/* "Identifier" */,-40 , 8/* "map" */,-40 , 7/* "oneof" */,-40 , 9/* "reserved" */,-40 , 11/* "enum" */,-40 , 6/* "message" */,-40 ),
    /* State 105 */ new Array( 21/* "}" */,-54 , 5/* "option" */,-54 , 31/* "Identifier" */,-54 ),
    /* State 106 */ new Array( 24/* "=" */,111 ),
    /* State 107 */ new Array( 17/* "returns" */,112 ),
    /* State 108 */ new Array( 22/* ";" */,113 ),
    /* State 109 */ new Array( 31/* "Identifier" */,114 ),
    /* State 110 */ new Array( 26/* ">" */,115 ),
    /* State 111 */ new Array( 31/* "Identifier" */,33 , 32/* "String" */,34 , 33/* "Integer" */,35 , 34/* "Float" */,36 , 18/* "true" */,37 , 19/* "false" */,38 ),
    /* State 112 */ new Array( 27/* "(" */,117 ),
    /* State 113 */ new Array( 21/* "}" */,-28 , 5/* "option" */,-28 , 13/* "optional" */,-28 , 14/* "required" */,-28 , 15/* "repeated" */,-28 , 31/* "Identifier" */,-28 , 8/* "map" */,-28 , 7/* "oneof" */,-28 , 9/* "reserved" */,-28 , 11/* "enum" */,-28 , 6/* "message" */,-28 ),
    /* State 114 */ new Array( 24/* "=" */,118 ),
    /* State 115 */ new Array( 31/* "Identifier" */,-35 ),
    /* State 116 */ new Array( 30/* "]" */,119 ),
    /* State 117 */ new Array( 31/* "Identifier" */,121 ),
    /* State 118 */ new Array( 31/* "Identifier" */,33 , 32/* "String" */,34 , 33/* "Integer" */,35 , 34/* "Float" */,36 , 18/* "true" */,37 , 19/* "false" */,38 ),
    /* State 119 */ new Array( 22/* ";" */,-57 ),
    /* State 120 */ new Array( 28/* ")" */,123 ),
    /* State 121 */ new Array( 28/* ")" */,-66 ),
    /* State 122 */ new Array( 30/* "]" */,124 ),
    /* State 123 */ new Array( 22/* ";" */,126 , 20/* "{" */,127 ),
    /* State 124 */ new Array( 22/* ";" */,-38 ),
    /* State 125 */ new Array( 21/* "}" */,-63 , 5/* "option" */,-63 , 16/* "rpc" */,-63 ),
    /* State 126 */ new Array( 21/* "}" */,-67 , 5/* "option" */,-67 , 16/* "rpc" */,-67 ),
    /* State 127 */ new Array( 21/* "}" */,-70 , 5/* "option" */,-70 ),
    /* State 128 */ new Array( 21/* "}" */,130 , 5/* "option" */,13 ),
    /* State 129 */ new Array( 21/* "}" */,-69 , 5/* "option" */,-69 ),
    /* State 130 */ new Array( 21/* "}" */,-68 , 5/* "option" */,-68 , 16/* "rpc" */,-68 )
);

/* Goto-Table */
var goto_tab = new Array(
    /* State 0 */ new Array( 35/* Proto */,1 ),
    /* State 1 */ new Array( 36/* TopLevel */,2 , 37/* Syntax */,3 , 38/* Package */,4 , 39/* Import */,5 , 40/* Option */,6 , 41/* Message */,7 , 42/* Enum */,8 , 43/* Service */,9 ),
    /* State 2 */ new Array( ),
    /* State 3 */ new Array( ),
    /* State 4 */ new Array( ),
    /* State 5 */ new Array( ),
    /* State 6 */ new Array( ),
    /* State 7 */ new Array( ),
    /* State 8 */ new Array( ),
    /* State 9 */ new Array( ),
    /* State 10 */ new Array( ),
    /* State 11 */ new Array( ),
    /* State 12 */ new Array( ),
    /* State 13 */ new Array( ),
    /* State 14 */ new Array( ),
    /* State 15 */ new Array( ),
    /* State 16 */ new Array( ),
    /* State 17 */ new Array( ),
    /* State 18 */ new Array( ),
    /* State 19 */ new Array( ),
    /* State 20 */ new Array( ),
    /* State 21 */ new Array( ),
    /* State 22 */ new Array( ),
    /* State 23 */ new Array( ),
    /* State 24 */ new Array( ),
    /* State 25 */ new Array( ),
    /* State 26 */ new Array( ),
    /* State 27 */ new Array( 44/* OptionValue */,32 ),
    /* State 28 */ new Array( 45/* MessageBody */,39 ),
    /* State 29 */ new Array( 58/* EnumBody */,40 ),
    /* State 30 */ new Array( 63/* ServiceBody */,41 ),
    /* State 31 */ new Array( ),
    /* State 32 */ new Array( ),
    /* State 33 */ new Array( ),
    /* State 34 */ new Array( ),
    /* State 35 */ new Array( ),
    /* State 36 */ new Array( ),
    /* State 37 */ new Array( ),
    /* State 38 */ new Array( ),
    /* State 39 */ new Array( 41/* Message */,43 , 42/* Enum */,44 , 48/* Reserved */,45 , 47/* Oneof */,46 , 46/* Field */,47 , 40/* Option */,48 , 49/* FieldRule */,50 ),
    /* State 40 */ new Array( 59/* Const */,56 , 40/* Option */,57 , 60/* ConstName */,59 ),
    /* State 41 */ new Array( 64/* Method */,61 , 40/* Option */,62 ),
    /* State 42 */ new Array( ),
    /* State 43 */ new Array( ),
    /* State 44 */ new Array( ),
    /* State 45 */ new Array( ),
    /* State 46 */ new Array( ),
    /* State 47 */ new Array( ),
    /* State 48 */ new Array( ),
    /* State 49 */ new Array( ),
    /* State 50 */ new Array( 50/* FieldType */,65 , 54/* MapFieldType */,67 ),
    /* State 51 */ new Array( ),
    /* State 52 */ new Array( 57/* ReservedNames */,70 , 56/* ReservedTags */,71 ),
    /* State 53 */ new Array( ),
    /* State 54 */ new Array( ),
    /* State 55 */ new Array( ),
    /* State 56 */ new Array( ),
    /* State 57 */ new Array( ),
    /* State 58 */ new Array( ),
    /* State 59 */ new Array( ),
    /* State 60 */ new Array( ),
    /* State 61 */ new Array( ),
    /* State 62 */ new Array( ),
    /* State 63 */ new Array( ),
    /* State 64 */ new Array( 65/* MethodName */,75 ),
    /* State 65 */ new Array( 51/* FieldName */,77 ),
    /* State 66 */ new Array( ),
    /* State 67 */ new Array( ),
    /* State 68 */ new Array( ),
    /* State 69 */ new Array( ),
    /* State 70 */ new Array( ),
    /* State 71 */ new Array( ),
    /* State 72 */ new Array( ),
    /* State 73 */ new Array( ),
    /* State 74 */ new Array( 61/* ConstValue */,86 ),
    /* State 75 */ new Array( ),
    /* State 76 */ new Array( ),
    /* State 77 */ new Array( ),
    /* State 78 */ new Array( ),
    /* State 79 */ new Array( ),
    /* State 80 */ new Array( 55/* FieldList */,91 , 46/* Field */,92 , 49/* FieldRule */,50 ),
    /* State 81 */ new Array( ),
    /* State 82 */ new Array( 56/* ReservedTags */,93 ),
    /* State 83 */ new Array( ),
    /* State 84 */ new Array( ),
    /* State 85 */ new Array( ),
    /* State 86 */ new Array( 62/* ConstOption */,96 ),
    /* State 87 */ new Array( ),
    /* State 88 */ new Array( 66/* Request */,98 ),
    /* State 89 */ new Array( 52/* Tag */,100 ),
    /* State 90 */ new Array( ),
    /* State 91 */ new Array( 46/* Field */,103 , 49/* FieldRule */,50 ),
    /* State 92 */ new Array( ),
    /* State 93 */ new Array( ),
    /* State 94 */ new Array( ),
    /* State 95 */ new Array( ),
    /* State 96 */ new Array( ),
    /* State 97 */ new Array( ),
    /* State 98 */ new Array( ),
    /* State 99 */ new Array( ),
    /* State 100 */ new Array( 53/* FieldOption */,108 ),
    /* State 101 */ new Array( ),
    /* State 102 */ new Array( ),
    /* State 103 */ new Array( ),
    /* State 104 */ new Array( ),
    /* State 105 */ new Array( ),
    /* State 106 */ new Array( ),
    /* State 107 */ new Array( ),
    /* State 108 */ new Array( ),
    /* State 109 */ new Array( ),
    /* State 110 */ new Array( ),
    /* State 111 */ new Array( 44/* OptionValue */,116 ),
    /* State 112 */ new Array( ),
    /* State 113 */ new Array( ),
    /* State 114 */ new Array( ),
    /* State 115 */ new Array( ),
    /* State 116 */ new Array( ),
    /* State 117 */ new Array( 67/* Response */,120 ),
    /* State 118 */ new Array( 44/* OptionValue */,122 ),
    /* State 119 */ new Array( ),
    /* State 120 */ new Array( ),
    /* State 121 */ new Array( ),
    /* State 122 */ new Array( ),
    /* State 123 */ new Array( 68/* MethodBody */,125 ),
    /* State 124 */ new Array( ),
    /* State 125 */ new Array( ),
    /* State 126 */ new Array( ),
    /* State 127 */ new Array( 69/* OptionList */,128 ),
    /* State 128 */ new Array( 40/* Option */,129 ),
    /* State 129 */ new Array( ),
    /* State 130 */ new Array( )
);



/* Symbol labels */
var labels = new Array(
    "Proto'" /* Non-terminal symbol */,
    "WHITESPACE" /* Terminal symbol */,
    "syntax" /* Terminal symbol */,
    "package" /* Terminal symbol */,
    "import" /* Terminal symbol */,
    "option" /* Terminal symbol */,
    "message" /* Terminal symbol */,
    "oneof" /* Terminal symbol */,
    "map" /* Terminal symbol */,
    "reserved" /* Terminal symbol */,
    "to" /* Terminal symbol */,
    "enum" /* Terminal symbol */,
    "service" /* Terminal symbol */,
    "optional" /* Terminal symbol */,
    "required" /* Terminal symbol */,
    "repeated" /* Terminal symbol */,
    "rpc" /* Terminal symbol */,
    "returns" /* Terminal symbol */,
    "true" /* Terminal symbol */,
    "false" /* Terminal symbol */,
    "{" /* Terminal symbol */,
    "}" /* Terminal symbol */,
    ";" /* Terminal symbol */,
    "," /* Terminal symbol */,
    "=" /* Terminal symbol */,
    "<" /* Terminal symbol */,
    ">" /* Terminal symbol */,
    "(" /* Terminal symbol */,
    ")" /* Terminal symbol */,
    "[" /* Terminal symbol */,
    "]" /* Terminal symbol */,
    "Identifier" /* Terminal symbol */,
    "String" /* Terminal symbol */,
    "Integer" /* Terminal symbol */,
    "Float" /* Terminal symbol */,
    "Proto" /* Non-terminal symbol */,
    "TopLevel" /* Non-terminal symbol */,
    "Syntax" /* Non-terminal symbol */,
    "Package" /* Non-terminal symbol */,
    "Import" /* Non-terminal symbol */,
    "Option" /* Non-terminal symbol */,
    "Message" /* Non-terminal symbol */,
    "Enum" /* Non-terminal symbol */,
    "Service" /* Non-terminal symbol */,
    "OptionValue" /* Non-terminal symbol */,
    "MessageBody" /* Non-terminal symbol */,
    "Field" /* Non-terminal symbol */,
    "Oneof" /* Non-terminal symbol */,
    "Reserved" /* Non-terminal symbol */,
    "FieldRule" /* Non-terminal symbol */,
    "FieldType" /* Non-terminal symbol */,
    "FieldName" /* Non-terminal symbol */,
    "Tag" /* Non-terminal symbol */,
    "FieldOption" /* Non-terminal symbol */,
    "MapFieldType" /* Non-terminal symbol */,
    "FieldList" /* Non-terminal symbol */,
    "ReservedTags" /* Non-terminal symbol */,
    "ReservedNames" /* Non-terminal symbol */,
    "EnumBody" /* Non-terminal symbol */,
    "Const" /* Non-terminal symbol */,
    "ConstName" /* Non-terminal symbol */,
    "ConstValue" /* Non-terminal symbol */,
    "ConstOption" /* Non-terminal symbol */,
    "ServiceBody" /* Non-terminal symbol */,
    "Method" /* Non-terminal symbol */,
    "MethodName" /* Non-terminal symbol */,
    "Request" /* Non-terminal symbol */,
    "Response" /* Non-terminal symbol */,
    "MethodBody" /* Non-terminal symbol */,
    "OptionList" /* Non-terminal symbol */,
    "$" /* Terminal symbol */
);


    
    info.offset = 0;
    info.src = src;
    info.att = new String();
    
    if( !err_off )
        err_off    = new Array();
    if( !err_la )
    err_la = new Array();
    
    sstack.push( 0 );
    vstack.push( 0 );
    
    la = __lex( info );

    while( true )
    {
        act = 132;
        for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
        {
            if( act_tab[sstack[sstack.length-1]][i] == la )
            {
                act = act_tab[sstack[sstack.length-1]][i+1];
                break;
            }
        }

        if( _dbg_withtrace && sstack.length > 0 )
        {
            __dbg_print( "\nState " + sstack[sstack.length-1] + "\n" +
                            "\tLookahead: " + labels[la] + " (\"" + info.att + "\")\n" +
                            "\tAction: " + act + "\n" + 
                            "\tSource: \"" + info.src.substr( info.offset, 30 ) + ( ( info.offset + 30 < info.src.length ) ?
                                    "..." : "" ) + "\"\n" +
                            "\tStack: " + sstack.join() + "\n" +
                            "\tValue stack: " + vstack.join() + "\n" );
        }
        
            
        //Panic-mode: Try recovery when parse-error occurs!
        if( act == 132 )
        {
            if( _dbg_withtrace )
                __dbg_print( "Error detected: There is no reduce or shift on the symbol " + labels[la] );
            
            err_cnt++;
            err_off.push( info.offset - info.att.length );            
            err_la.push( new Array() );
            for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
                err_la[err_la.length-1].push( labels[act_tab[sstack[sstack.length-1]][i]] );
            
            //Remember the original stack!
            var rsstack = new Array();
            var rvstack = new Array();
            for( var i = 0; i < sstack.length; i++ )
            {
                rsstack[i] = sstack[i];
                rvstack[i] = vstack[i];
            }
            
            while( act == 132 && la != 70 )
            {
                if( _dbg_withtrace )
                    __dbg_print( "\tError recovery\n" +
                                    "Current lookahead: " + labels[la] + " (" + info.att + ")\n" +
                                    "Action: " + act + "\n\n" );
                if( la == -1 )
                    info.offset++;
                    
                while( act == 132 && sstack.length > 0 )
                {
                    sstack.pop();
                    vstack.pop();
                    
                    if( sstack.length == 0 )
                        break;
                        
                    act = 132;
                    for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
                    {
                        if( act_tab[sstack[sstack.length-1]][i] == la )
                        {
                            act = act_tab[sstack[sstack.length-1]][i+1];
                            break;
                        }
                    }
                }
                
                if( act != 132 )
                    break;
                
                for( var i = 0; i < rsstack.length; i++ )
                {
                    sstack.push( rsstack[i] );
                    vstack.push( rvstack[i] );
                }
                
                la = __lex( info );
            }
            
            if( act == 132 )
            {
                if( _dbg_withtrace )
                    __dbg_print( "\tError recovery failed, terminating parse process..." );
                break;
            }


            if( _dbg_withtrace )
                __dbg_print( "\tError recovery succeeded, continuing" );
        }
        
        /*
        if( act == 132 )
            break;
        */
        
        
        //Shift
        if( act > 0 )
        {            
            if( _dbg_withtrace )
                __dbg_print( "Shifting symbol: " + labels[la] + " (" + info.att + ")" );
        
            sstack.push( act );
            vstack.push( info.att );
            
            la = __lex( info );
            
            if( _dbg_withtrace )
                __dbg_print( "\tNew lookahead symbol: " + labels[la] + " (" + info.att + ")" );
        }
        //Reduce
        else
        {        
            act *= -1;
            
            if( _dbg_withtrace )
                __dbg_print( "Reducing by producution: " + act );
            
            rval = void(0);
            
            if( _dbg_withtrace )
                __dbg_print( "\tPerforming semantic action..." );
            
switch( act )
{
    case 0:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 1:
    {
        rval = vstack[ vstack.length - 2 ];
    }
    break;
    case 2:
    {
        rval = vstack[ vstack.length - 0 ];
    }
    break;
    case 3:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 4:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 5:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 6:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 7:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 8:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 9:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 10:
    {
         syntax = vstack[ vstack.length - 2 ]; 
    }
    break;
    case 11:
    {
        rval = vstack[ vstack.length - 3 ];
    }
    break;
    case 12:
    {
        rval = vstack[ vstack.length - 3 ];
    }
    break;
    case 13:
    {
        rval = vstack[ vstack.length - 5 ];
    }
    break;
    case 14:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 15:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 16:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 17:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 18:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 19:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 20:
    {
         addScope(vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ], SCOPE_MESSAGE) 
    }
    break;
    case 21:
    {
        rval = vstack[ vstack.length - 2 ];
    }
    break;
    case 22:
    {
        rval = vstack[ vstack.length - 2 ];
    }
    break;
    case 23:
    {
        rval = vstack[ vstack.length - 2 ];
    }
    break;
    case 24:
    {
        rval = vstack[ vstack.length - 2 ];
    }
    break;
    case 25:
    {
        rval = vstack[ vstack.length - 2 ];
    }
    break;
    case 26:
    {
        rval = vstack[ vstack.length - 2 ];
    }
    break;
    case 27:
    {
        rval = vstack[ vstack.length - 0 ];
    }
    break;
    case 28:
    {
        rval = vstack[ vstack.length - 7 ];
    }
    break;
    case 29:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 30:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 31:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 32:
    {
        rval = vstack[ vstack.length - 0 ];
    }
    break;
    case 33:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 34:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 35:
    {
        rval = vstack[ vstack.length - 6 ];
    }
    break;
    case 36:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 37:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 38:
    {
        rval = vstack[ vstack.length - 5 ];
    }
    break;
    case 39:
    {
        rval = vstack[ vstack.length - 0 ];
    }
    break;
    case 40:
    {
        rval = vstack[ vstack.length - 5 ];
    }
    break;
    case 41:
    {
        rval = vstack[ vstack.length - 2 ];
    }
    break;
    case 42:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 43:
    {
        rval = vstack[ vstack.length - 3 ];
    }
    break;
    case 44:
    {
        rval = vstack[ vstack.length - 3 ];
    }
    break;
    case 45:
    {
        rval = vstack[ vstack.length - 3 ];
    }
    break;
    case 46:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 47:
    {
        rval = vstack[ vstack.length - 3 ];
    }
    break;
    case 48:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 49:
    {
        rval = vstack[ vstack.length - 3 ];
    }
    break;
    case 50:
    {
         addScope(vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ], SCOPE_ENUM) 
    }
    break;
    case 51:
    {
        rval = vstack[ vstack.length - 2 ];
    }
    break;
    case 52:
    {
        rval = vstack[ vstack.length - 2 ];
    }
    break;
    case 53:
    {
        rval = vstack[ vstack.length - 0 ];
    }
    break;
    case 54:
    {
        rval = vstack[ vstack.length - 5 ];
    }
    break;
    case 55:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 56:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 57:
    {
        rval = vstack[ vstack.length - 5 ];
    }
    break;
    case 58:
    {
        rval = vstack[ vstack.length - 0 ];
    }
    break;
    case 59:
    {
         addScope(vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ], SCOPE_SERVICE) 
    }
    break;
    case 60:
    {
        rval = vstack[ vstack.length - 2 ];
    }
    break;
    case 61:
    {
        rval = vstack[ vstack.length - 2 ];
    }
    break;
    case 62:
    {
        rval = vstack[ vstack.length - 0 ];
    }
    break;
    case 63:
    {
        rval = vstack[ vstack.length - 10 ];
    }
    break;
    case 64:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 65:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 66:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 67:
    {
        rval = vstack[ vstack.length - 1 ];
    }
    break;
    case 68:
    {
        rval = vstack[ vstack.length - 3 ];
    }
    break;
    case 69:
    {
        rval = vstack[ vstack.length - 2 ];
    }
    break;
    case 70:
    {
        rval = vstack[ vstack.length - 0 ];
    }
    break;
}



            if( _dbg_withtrace )
                __dbg_print( "\tPopping " + pop_tab[act][1] + " off the stack..." );
                
            for( var i = 0; i < pop_tab[act][1]; i++ )
            {
                sstack.pop();
                vstack.pop();
            }
                                    
            go = -1;
            for( var i = 0; i < goto_tab[sstack[sstack.length-1]].length; i+=2 )
            {
                if( goto_tab[sstack[sstack.length-1]][i] == pop_tab[act][0] )
                {
                    go = goto_tab[sstack[sstack.length-1]][i+1];
                    break;
                }
            }
            
            if( act == 0 )
                break;
                
            if( _dbg_withtrace )
                __dbg_print( "\tPushing non-terminal " + labels[ pop_tab[act][0] ] );
                
            sstack.push( go );
            vstack.push( rval );            
        }
        
        if( _dbg_withtrace )
        {        
            // alert( _dbg_string );
            _dbg_string = new String();
        }
    }

    if( _dbg_withtrace )
    {
        __dbg_print( "\nParse complete." );
        // alert( _dbg_string );
    }
    
    return err_cnt;
}



export function parse(text: string): any {
    var error_offsets = new Array();
    var error_lookaheads = new Array();
    var error_count = 0;
    error_count = __parse(text, error_offsets, error_lookaheads);
    //return error_count;
    return {
        syntax: syntax == "proto3" ? 3 : 2,
        scopes: scopes
    };
}
