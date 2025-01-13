/**
 * @file Treesitter code for the Elp programming language
 * @author davemackintosh <me@dav3.co>
 * @license GNU
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "elp",

  rules: {
    module: $ => repeat($._expression),

    _expression: $ => choice(
      $.import,
      $.number,
      $.object_instantiation,
      $.block,
      $.string,
      $.macro_attribute,
      $.macro_fn_call,
      $.export,
      $.enum,
      $.if_tree,
      $.object_def,
      $.component_def,
      $.external_symbol,
      $.external_block,
      $.function_def,
      $.function_call,
      $.match_tree,
      $.bitwise_operation,
      $.variable_assignment,
      $.value_assignment,
      $.variable_declaration,
      $.variable_access,
      $.contextual_variable_access,
      $.function_component_call,
      $.function_return_value,
      $.operand,
      $.comment,
      $.for_loop,
      $.object_value_spread,
    ),

    block: $ => seq('{', repeat($._expression), '}'),
    comment: () => token(seq('//', /.*/)),

    // <import>
    import: $ => seq(
      'import',
      '{',
      sepBy(",", $.import_name),
      optional(","),
      '}',
      'from',
      $.string,
    ),

    import_name: $ => seq(
      $.ident,
      optional($.import_name_alias),
    ),

    import_name_alias: $ => seq('as', $.ident),
    // </import>

    export: $ => seq(
      'export',
      $._expression
    ),

    // <unary binary>
    bitwise_operation: $ => seq(choice($.variable_access, $.number), $.bitwise_operand, choice($.variable_access, $.number)),
    // </unary binary>

    // <elp type>
    elp_type: $ => choice(seq('[', $.elp_type, ']'), seq(optional($.pointer_semantics), $.ident, optional($.elp_type_generic))),
    elp_type_generic: $ => seq('<', sepBy(",", $.elp_type_generic_param), '>'),
    elp_type_generic_param: $ => seq($.elp_type, optional($.elp_type_generic_constraint)),
    elp_type_generic_constraint: $ => seq(':', $.elp_type, optional(sepBy('+', $.elp_type))),
    // </elp type>

    // <enum>
    enum: $ => seq('enum', $.ident, '{', sepBy(",", $.enum_member), optional(","), '}'),
    enum_member: $ => seq('.', $.ident, optional(seq('(', sepBy(",", $.elp_type), ')'))),
    // </enum>

    // Loops and arrays.
    for_loop: $ => seq('for', $._expression, 'in', $._expression, $.block),

    // <externals>
    external_block: $ => seq('external', '{', repeat(choice($.fn_header_def, $.object_def)), '}'),
    external_symbol: $ => seq('external', choice($.fn_header_def, $.object_def)),
    // </externals>

    // <if trees>
    if_tree: $ => seq('if', $._expression, $.block, optional(repeat($.elseif_tree)), optional($.else_block)),
    elseif_tree: $ => seq('elseif', $._expression, $.block),
    else_block: $ => seq('else', $.block),
    // </if trees>

    // <macro>
    macro_fn_call: $ => seq('@', $.ident, '(', sepBy(",", $.elp_type), ')'),
    macro_attribute: $ => seq('@', $.ident),
    precomp: $ => seq('#', $.ident, '(', sepBy(",", $.elp_type), ')'),
    // </macro>

    // <variables>
    mutability_selector: _ => choice('var', 'const'),
    visibility_selector: _ => choice('public', 'private'),
    pointer_semantics: _ => choice('*', '&'),
    variable_access: $ => prec.left(
      seq(optional(choice('*', '&')), seq($.ident, optional(repeat(seq('.', $.ident)))))),
    variable_declaration: $ => prec.left(seq($.mutability_selector, $.ident, optional($.elp_type))),
    variable_assignment: $ => prec.left(1, seq(choice($.variable_declaration, $.variable_access))),
    contextual_variable_access: $ => seq(".", $.ident),

    value_assignment: $ => prec(2, seq($.operand, $._expression)),
    // </variables>

    // <objects>
    object_def: $ => seq('object', $.ident, optional($.elp_type_generic), optional($.object_implements), '{', sepBy(",", $.object_member), optional(','), '}'),
    object_implements: $ => seq('implements', sepBy(",", $.elp_type)),
    object_member: $ => seq(optional($.visibility_selector), optional($.mutability_selector), '.', $.ident, $.elp_type, optional($.object_key_default_value), optional($.object_key_tags)),
    object_key_default_value: $ => seq('=', $._expression),
    object_key_tags: $ => seq('`', sepBy(",", seq($.ident, ":", $.string)), '`'),
    object_value_spread: $ => seq('...', $._expression),

    object_instantiation: $ => prec(2, seq($.ident, '{', sepBy(",", choice($.object_value_spread, seq('.', $.ident, $.variable_assignment))), optional(","), '}')),
    // </objects>

    // <functions>
    fn_header_def: $ => seq(optional($.pointer_semantics), 'fn', $.variable_access, optional($.elp_type_generic), $.function_arguments, $.function_return_type),
    function_def: $ => seq(optional($.pointer_semantics), 'fn', $.variable_access, optional($.elp_type_generic), $.function_arguments, optional($.function_return_type), $.block),
    function_arguments: $ => seq('(', sepBy(",", $.function_argument), optional(","), ')'),
    function_argument: $ => seq(optional($.pointer_semantics), $.ident, optional($.elp_type)),
    function_return_type: $ => prec.right(2, seq('->', sepBy(",", $.elp_type))),
    function_return_value: $ => seq("return", $._expression),

    function_call: $ => seq(choice($.variable_access, $.contextual_variable_access), optional($.elp_type_generic), '(', sepBy(",", $._expression), ')'),

    function_component_call: $ => prec(2, seq($.function_call, $.block)),
    // </functions>

    // <component_def>
    component_def: $ => seq('component', seq($.ident, repeat(seq('.', $.ident))), optional($.function_arguments), optional($.function_return_type), $.block),
    // </component_def>

    // <match>
    match_tree: $ => seq('match', $._expression, '{', repeat($.match_arm), '}'),
    match_arm: $ => prec(2, seq($._expression, '->', choice($.block, $._expression), optional(','))),
    // </match>

    // <lexer tokens>
    ident: () => /[a-zA-Z0-9_]+/,
    number: () => /\d+/,
    string: () => /"([^"]*)"/,
    bitwise_operand: () => choice('~', '<<', '>>', '|'),
    operand: () => choice('+=', '-=', '*=', '/=', '%=', '^=', '&=', '~=', '=', '!=', '=='),
    // </lexer tokens>
  }
});

/**
 * @param {string} sep
 * @param {RuleOrLiteral} rule
 */
function sepBy1(sep, rule) {
  return seq(rule, repeat(seq(sep, rule)))
}

/**
 * @param {string} sep
 * @param {RuleOrLiteral} rule
 */
function sepBy(sep, rule) {
  return optional(sepBy1(sep, rule))
}
