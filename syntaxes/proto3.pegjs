/*
 * Proto3 Grammar
 * ==========================
 *
 */
Proto
  = Syntax (Message / Enum / Service)*

Syntax
  = __ 'syntax' __ '=' __ string __ ';'

Message
  = __ 'msg' __

Enum
  = __ 'enum' __

Service
  = __ 'service' __

string "string"
  = quotation_mark chars:char* quotation_mark

__
  = (WhiteSpace / LineTerminatorSequence / Comment)*

_
  = (WhiteSpace / MultiLineCommentNoLineTerminator)*

Comment "comment"
  = MultiLineComment
  / SingleLineComment

MultiLineComment
  = "/*" (!"*/" SourceCharacter)* "*/"

MultiLineCommentNoLineTerminator
  = "/*" (!("*/" / LineTerminator) SourceCharacter)* "*/"

SingleLineComment
  = "//" (!LineTerminator SourceCharacter)*

SourceCharacter
  = .

LineTerminatorSequence "end of line"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"

LineTerminator
  = [\n\r\u2028\u2029]
  
WhiteSpace "whitespace"
  = "\t"
  / "\v"
  / "\f"
  / " "
  / "\u00A0"
  / "\uFEFF"
  / Zs
// Separator, Space
Zs = [\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]
char = [0-9a-zA-z_]
quotation_mark = '"'