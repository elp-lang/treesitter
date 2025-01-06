; Highlights
; ----------

; Keywords

(var) @keyword
(const) @keyword
(import) @keyword
(export) @keyword
(from) @keyword
(as) @keyword
(enum) @keyword
(if) @keyword
(elseif) @keyword
(else) @keyword
(fn) @keyword
(object) @keyword
(match) @keyword
(external) @keyword
(implements) @keyword
(public) @keyword
(private) @keyword
(component) @keyword
("..") @keyword

; Types

(elp_type) @type
(enum_member) @constructor

; Functions

(fn_header_def
  name: (variable_access) @function)

(function_def
  name: (variable_access) @function)
  
(component_def
  name: (variable_access) @function)
  
(macro) @function.macro

; Variables

(variable_access) @variable
(variable_declaration
  name: (ident) @variable)
(contextual_variable_access) @variable

; Parameters

(function_argument
  name: (ident) @variable.parameter)

; Constants

(number) @number
(string) @string

; Operators

(operand) @operator
(bitwise_operand) @operator

; Punctuation

("{" "}") @punctuation.bracket
("(" ")") @punctuation.bracket
("[" "]") @punctuation.bracket
("." (ident)) @punctuation.delimiter
("," (ident)) @punctuation.delimiter
(";" (ident)) @punctuation.delimiter
(":") @punctuation.delimiter

; Comments

; TODO

; Identifiers

(ident) @variable
