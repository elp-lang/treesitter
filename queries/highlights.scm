;; Highlights for the Elp programming language

;; Keywords
[
  "component" 
  "const" 
  "else" 
  "elseif" 
  "enum" 
  "export" 
  "external" 
  "fn" 
  "for" 
  "if" 
  "implements" 
  "import" 
  "match" 
  "object" 
  "var" 
] @keyword

[
  "in"
  "is"
  "as"
  "return"
  "not"
  "public"
  "private"
 ] @module.builtin

;; Match comments and assign them to `@comment`
(comment) @comment

;; Identifiers
(ident) @local.definition

;; Strings
(string) @string

;; Numbers
(number) @number

;; Types
(elp_type) @type
(elp_type_generic) @attribute
(elp_type_generic_param) @attribute.builtin

;; Enum members
(enum_member) @constant

;; Operators
(bitwise_operand) @operator
(operand) @operator

;; Blocks
(block) @block

;; Object definitions and members
(object_def 
  (ident) @local.definition
   @block)

;; Functions
(function_def) @function
(fn_header_def) @function
(function_arguments) @parameter
(function_argument) @local.definition
(function_return_type) @type

(function_call) @function.method
(function_component_call) @function.method

;; Components
(component_def) @function

; Macros

; Function Form Macro
(function_call
  (variable_access
    (ident) @function.macro
    (#match? @function.macro "^[@][a-zA-Z_]+$")
  )
)

; Attribute Form Macro
(macro_attribute) @function.macro

;; Variables
(variable_declaration) @variable
(variable_assignment) @variable
(variable_access) @variable
(contextual_variable_access) @variable.builtin

;; Externals
(external_block) @attribute
(external_symbol) @attribute

;; Imports
(import) @include
  (import_name) @variable
  (import_name_alias) @variable

;; Conditionals
(if_tree) @conditional
(elseif_tree) @conditional
(else_block) @conditional

