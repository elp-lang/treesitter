; tags.scm

(function_def
  (variable_access
    (ident) @definition.function))

(variable_declaration
  (ident) @definition.variable)

(function_call
  (variable_access
    (ident) @reference.call))
