;; Locals for the Elp programming language

[
  ;; Module scope: defines the top-level scope for the program
  (module) @scope

  ;; Object definitions: defines the scope for object members
  (object_def
    (ident) @type
    (object_member
      (ident) @field))

  ;; Enum definitions: defines the scope for enum members
  (enum
    (ident) @type
    (enum_member
      (ident) @constant))

  ;; Function definitions: defines the scope for function arguments and variables
  (function_def
    (variable_access
      (ident) @function)
    (function_arguments
      (function_argument
        (ident) @parameter)))

  ;; Component definitions: defines the scope for components
  (component_def
    (ident) @type
    (function_arguments
      (function_argument
        (ident) @parameter)))

  ;; Variables: declarations and assignments
  (variable_declaration
    (ident) @variable)
  (variable_assignment
    (variable_access
      (ident) @variable))

  ;; If-Else blocks: scopes for conditional statements
  (if_tree) @scope
  (elseif_tree) @scope
  (else_block) @scope

  ;; Blocks: general scope
  (block) @scope
]
