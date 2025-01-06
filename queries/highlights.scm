;; Highlights for the Elp programming language

[
  ;; General constructs
  (module) @none

  ;; Keywords
  "import" @keyword
  "export" @keyword
  "enum" @keyword
  "if" @keyword
  "elseif" @keyword
  "else" @keyword
  "external" @keyword
  "object" @keyword
  "implements" @keyword
  "match" @keyword
  "var" @keyword
  "const" @keyword
  "fn" @keyword
  "component" @keyword
  "return" @keyword

  ;; Match comments and assign them to `@comment`
  (comment) @comment

  ;; Identifiers
  (ident) @variable

  ;; Strings
  (string) @string

  ;; Numbers
  (number) @number

  ;; Types
  (elp_type) @type
  (elp_type_generic) @type
  (elp_type_generic_param) @type

  ;; Enum members
  (enum_member) @constant

  ;; Operators
  (bitwise_operand) @operator
  (operand) @operator

  ;; Blocks
  (block) @block

  ;; Object definitions and members
  (object_def) @type
  (object_member) @property
  (object_key_default_value) @property
  (object_key_tags) @comment

  ;; Functions
  (function_def) @function
  (fn_header_def) @function
  (function_call) @function
  (function_arguments) @parameter
  (function_argument) @parameter
  (function_return_type) @type

  ;; Components
  (component_def) @type

  ;; Match
  (match_tree) @conditional
  (match_range) @operator
  (match_arm) @conditional

  ; Macros

  ; Function Form Macro
  (function_call
    (variable_access
      (ident) @function.macro
      (#match? @function.macro "^[@][a-zA-Z_]+$")
    )
  )

  ; Attribute Form Macro
  (macro
    (ident) @function.macro)

  ;; Variables
  (variable_declaration) @variable.builtin
  (variable_assignment) @variable
  (variable_access) @variable
  (contextual_variable_access) @variable.builtin

  ;; Externals
  (external_block) @attribute
  (external_symbol) @attribute

  ;; Imports
  (import) @include
;;  (_import_name) @variable
;;  (_import_name_alias) @variable

  ;; Conditionals
  (if_tree) @conditional
  (elseif_tree) @conditional
  (else_block) @conditional
]

