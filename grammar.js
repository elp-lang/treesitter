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
      $.block,
      $.string,
      $.macro,
      $.export,
      $.enum,
      $.if_tree,
      $.object_def,
      $.component_def,
      $.external_symbol,
      $.external_block,
      $.function_def,
      $.function_call,
      $.object_instantiation,
      $.match_tree,
      $.bitwise_operation,
      $.variable_assignment,
      $.value_assignment,
      $.variable_declaration,
      $.variable_access,
      $.contextual_variable_access,
      $.function_component_call,
      $.operand,
    ),

    block: $ => seq('{', repeat($._expression), '}'),

    // <import>
    "import": $ => seq(
      'import',
      '{',
      commaSep($._import_name),
      '}',
      'from',
      $.string,
    ),

    _import_name: $ => seq(
      $.ident,
      optional($._import_name_alias),
    ),

    _import_name_alias: $ => seq('as', $.ident),
    // </import>

    "export": $ => seq(
      'export',
      $._expression
    ),

    // <unary binary>
    bitwise_operation: $ => seq(choice($.variable_access, $.number), $.bitwise_operand, choice($.variable_access, $.number)),
    // </unary binary>

    // <elp type>
    elp_type: $ => seq($.ident, $.elp_type_generic),
    elp_type_generic: $ => seq('<', commaSep($.elp_type_generic_param), '>'),
    elp_type_generic_param: $ => seq($.elp_type, optional($.elp_type_generic_constraint)),
    elp_type_generic_constraint: $ => seq(':', $.elp_type, optional(seq('+', $.elp_type))),
    // </elp type>

    // <enum>
    enum: $ => seq('enum', $.ident, '{', commaSep($.enum_member), '}'),
    enum_member: $ => seq('.', $.ident, optional(seq('(', commaSep($.elp_type), ')'))),
    // </enum>

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
    macro: $ => seq('@', $.ident, '(', commaSep($.elp_type), ')'),
    // </macro>

    // <variables>
    variable_access: $ => prec.left(2, seq(optional(choice('*', '&')), seq($.ident, optional(repeat(seq('.', $.ident)))))),
    variable_declaration: $ => prec.left(2, seq(choice('var', 'const'), $.ident, optional($.elp_type))),
    variable_assignment: $ => prec.right(2, seq(choice($.variable_declaration, $.variable_access))),
    contextual_variable_access: $ => seq(".", $.ident),

    value_assignment: $ => prec(2, seq($.operand, $._expression)),
    // </variables>

    // <objects>
    object_def: $ => seq('object', $.ident, optional($.object_implements), '{', commaSep($.object_member), '}'),
    object_implements: $ => seq('implements', commaSep($.elp_type)),
    object_member: $ => seq(optional(choice('public', 'private')), '.', $.ident, $.elp_type, optional($.object_key_default_value), optional($.object_key_tags)),
    object_key_default_value: $ => seq('=', $._expression),
    object_key_tags: $ => seq('`', commaSep(seq($.ident, $.string)), '`'),

    object_instantiation: $ => seq($.ident, '{', choice(seq('...', $._expression), seq('.', $.ident, '=', $._expression)), '}'),
    // </objects>

    // <functions>
    fn_header_def: $ => seq('fn', $.variable_access, optional($.elp_type_generic), $.function_arguments, $.function_return_type),
    function_def: $ => seq('fn', $.variable_access, optional($.elp_type_generic), $.function_arguments, optional($.function_return_type), $.block),
    function_arguments: $ => seq('(', commaSep($.function_argument), ')'),
    function_argument: $ => seq($.ident, optional($.elp_type)),
    function_return_type: $ => prec.right(2, seq('->', commaSep($.elp_type))),

    function_call: $ => seq(choice($.variable_access, $.contextual_variable_access), optional($.elp_type_generic), '(', commaSep($._expression), ')'),

    function_component_call: $ => prec(2, seq($.function_call, $.block)),
    // </functions>

    // <component_def>
    component_def: $ => seq('component', seq($.ident, repeat(seq('.', $.ident))), optional($.function_arguments), optional($.function_return_type), $.block),
    // </component_def>

    // <match>
    match_tree: $ => seq('match', $._expression, '{', repeat($.match_arm), '}'),
    _match_rangeables: $ => choice($.string, $.number, $.variable_access),
    match_range: $ => seq(choice($._match_rangeables, seq('..', optional($._match_rangeables)), seq($._match_rangeables, '..', $._match_rangeables))),
    match_arm: $ => prec(2, seq(choice($.function_call, $.contextual_variable_access, $.match_range), '->', choice($.block, $._expression), optional(','))),
    // </match>

    // <lexer tokens>
    ident: () => /[a-zA-Z_]+/,
    number: () => /\d+/,
    "var": () => 'var',
    "const": () => 'const',
    string: () => /"([^"]*)"/,
    bitwise_operand: () => choice('~', '<<', '>>', '|'),
    operand: () => choice('+=', '-=', '*=', '/=', '%=', '^=', '&=', '~=', '=', '!=', '=='),
    // </lexer tokens>
  }
});

/**
 * @param {RuleOrLiteral} rule
 */
function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)))
}

/**
 * @param {RuleOrLiteral} rule
 */
function commaSep(rule) {
  return optional(commaSep1(rule))
}
