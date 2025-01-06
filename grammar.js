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
    ),

    block: $ => seq('{', repeat($._expression),  '}'),

    // <import>
    "import": $ => seq(
      'import',
      '{',
      repeat($._import_name),
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

    // <if trees>
    if_tree: $ => seq('if', $._expression, $.block, optional(repeat($.elseif_tree)), optional($.else_block)),
    elseif_tree: $ => seq('elseif', $._expression, $.block),
    else_block: $ => seq('else', $.block),
    // </if trees>

    // <macro>
    macro: $ => seq('@', $.ident, '(', commaSep($.elp_type), ')'),
    // </macro>

    ident: $ => /[a-zA-Z_]+/,
    number: $ => /\d+/,
    "var": $ => 'var',
    "const": $ => 'const',
    string: $ => /"([^"]*)"/,
  }
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)))
}

function commaSep(rule) {
  return optional(commaSep1(rule))
}
