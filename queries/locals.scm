; Scopes
; ------

; Function Scopes
(function_def
  name: (variable_access) @function.declaration
  body: (_)
  (#lua-match? @function.declaration "^_?[a-zA-Z_]+$")
  (#set! function)
)

(component_def
  name: (variable_access) @function.declaration
  body: (_)
  (#lua-match? @function.declaration "^_?[a-zA-Z_]+$")
  (#set! function)
)

(function_argument
  name: (ident) @variable.parameter
  (#lua-match? @variable.parameter "^_?[a-zA-Z_]+$")
)

; Variable Scopes

(variable_declaration
  name: (ident) @variable.declaration
  (#lua-match? @variable.declaration "^_?[a-zA-Z_]+$")
  (#set! variable)
)

(variable_access
  (#lua-match? @variable.declaration "^_?[a-zA-Z_]+$")
)
