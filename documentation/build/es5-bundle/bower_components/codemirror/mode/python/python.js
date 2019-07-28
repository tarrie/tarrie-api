// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE
(function(mod){if("object"==("undefined"===typeof exports?"undefined":babelHelpers.typeof(exports))&&"object"==("undefined"===typeof module?"undefined":babelHelpers.typeof(module)))// CommonJS
mod(require("../../lib/codemirror"));else if("function"==typeof define&&define.amd)// AMD
define(["../../lib/codemirror"],mod);else// Plain browser env
mod(CodeMirror)})(function(CodeMirror){"use strict";function wordRegexp(words){return new RegExp("^(("+words.join(")|(")+"))\\b")}var wordOperators=wordRegexp(["and","or","not","is"]),commonKeywords=["as","assert","break","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","lambda","pass","raise","return","try","while","with","yield","in"],commonBuiltins=["abs","all","any","bin","bool","bytearray","callable","chr","classmethod","compile","complex","delattr","dict","dir","divmod","enumerate","eval","filter","float","format","frozenset","getattr","globals","hasattr","hash","help","hex","id","input","int","isinstance","issubclass","iter","len","list","locals","map","max","memoryview","min","next","object","oct","open","ord","pow","property","range","repr","reversed","round","set","setattr","slice","sorted","staticmethod","str","sum","super","tuple","type","vars","zip","__import__","NotImplemented","Ellipsis","__debug__"];CodeMirror.registerHelper("hintWords","python",commonKeywords.concat(commonBuiltins));function top(state){return state.scopes[state.scopes.length-1]}CodeMirror.defineMode("python",function(conf,parserConf){for(var ERRORCLASS="error",delimiters=parserConf.delimiters||parserConf.singleDelimiters||/^[\(\)\[\]\{\}@,:`=;\.\\]/,operators=[parserConf.singleOperators,parserConf.doubleOperators,parserConf.doubleDelimiters,parserConf.tripleDelimiters,parserConf.operators||/^([-+*/%\/&|^]=?|[<>=]+|\/\/=?|\*\*=?|!=|[~!@]|\.\.\.)/],i=0;i<operators.length;i++){if(!operators[i])operators.splice(i--,1)}var hangingIndent=parserConf.hangingIndent||conf.indentUnit,myKeywords=commonKeywords,myBuiltins=commonBuiltins;if(parserConf.extra_keywords!=void 0)myKeywords=myKeywords.concat(parserConf.extra_keywords);if(parserConf.extra_builtins!=void 0)myBuiltins=myBuiltins.concat(parserConf.extra_builtins);var py3=!(parserConf.version&&3>+parserConf.version);if(py3){// since http://legacy.python.org/dev/peps/pep-0465/ @ is also an operator
var identifiers=parserConf.identifiers||/^[_A-Za-z\u00A1-\uFFFF][_A-Za-z0-9\u00A1-\uFFFF]*/;myKeywords=myKeywords.concat(["nonlocal","False","True","None","async","await"]);myBuiltins=myBuiltins.concat(["ascii","bytes","exec","print"]);var stringPrefixes=/^(([rbuf]|(br)|(fr))?('{3}|"{3}|['"]))/i}else{var identifiers=parserConf.identifiers||/^[_A-Za-z][_A-Za-z0-9]*/;myKeywords=myKeywords.concat(["exec","print"]);myBuiltins=myBuiltins.concat(["apply","basestring","buffer","cmp","coerce","execfile","file","intern","long","raw_input","reduce","reload","unichr","unicode","xrange","False","True","None"]);var stringPrefixes=/^(([rubf]|(ur)|(br))?('{3}|"{3}|['"]))/i}var keywords=wordRegexp(myKeywords),builtins=wordRegexp(myBuiltins);// tokenizers
function tokenBase(stream,state){var sol=stream.sol()&&"\\"!=state.lastToken;if(sol)state.indent=stream.indentation();// Handle scope changes
if(sol&&"py"==top(state).type){var scopeOffset=top(state).offset;if(stream.eatSpace()){var lineOffset=stream.indentation();if(lineOffset>scopeOffset)pushPyScope(state);else if(lineOffset<scopeOffset&&dedent(stream,state)&&"#"!=stream.peek())state.errorToken=!0/* ignoreName */ /* skipSlots */;return null}else{var style=tokenBaseInner(stream,state);if(0<scopeOffset&&dedent(stream,state))style+=" "+ERRORCLASS;return style}}return tokenBaseInner(stream,state)}function tokenBaseInner(stream,state){if(stream.eatSpace())return null;// Handle Comments
if(stream.match(/^#.*/))return"comment";// Handle Number Literals
if(stream.match(/^[0-9\.]/,/* eat */ /* ignoreName */!1/* skipSlots */ /* skipSlots */)){var floatLiteral=!1;// Floats
if(stream.match(/^[\d_]*\.\d+(e[\+\-]?\d+)?/i)){floatLiteral=!0}if(stream.match(/^[\d_]+\.\d*/)){floatLiteral=!0}if(stream.match(/^\.\d+/)){floatLiteral=!0}if(floatLiteral){// Float literals may be "imaginary"
stream.eat(/J/i);return"number"}// Integers
var intLiteral=!1;// Hex
if(stream.match(/^0x[0-9a-f_]+/i))intLiteral=!0;// Binary
if(stream.match(/^0b[01_]+/i))intLiteral=!0;// Octal
if(stream.match(/^0o[0-7_]+/i))intLiteral=!0;// Decimal
if(stream.match(/^[1-9][\d_]*(e[\+\-]?[\d_]+)?/)){// Decimal literals may be "imaginary"
stream.eat(/J/i);// TODO - Can you have imaginary longs?
intLiteral=!0}// Zero by itself with no other piece of number.
if(stream.match(/^0(?![\dx])/i))intLiteral=!0;if(intLiteral){// Integer literals may be "long"
stream.eat(/L/i);return"number"}}// Handle Strings
if(stream.match(stringPrefixes)){var isFmtString=-1!==stream.current().toLowerCase().indexOf("f");if(!isFmtString){state.tokenize=tokenStringFactory(stream.current(),state.tokenize);return state.tokenize(stream,state)}else{state.tokenize=formatStringFactory(stream.current(),state.tokenize);return state.tokenize(stream,state)}}for(var i=0;i<operators.length;i++){if(stream.match(operators[i]))return"operator"}if(stream.match(delimiters))return"punctuation";if("."==state.lastToken&&stream.match(identifiers))return"property";if(stream.match(keywords)||stream.match(wordOperators))return"keyword";if(stream.match(builtins))return"builtin";if(stream.match(/^(self|cls)\b/))return"variable-2";if(stream.match(identifiers)){if("def"==state.lastToken||"class"==state.lastToken)return"def";return"variable"}// Handle non-detected items
stream.next();return ERRORCLASS}function formatStringFactory(delimiter,tokenOuter){while(0<="rubf".indexOf(delimiter.charAt(0).toLowerCase())){delimiter=delimiter.substr(1)}var singleline=1==delimiter.length,OUTCLASS="string";function tokenNestedExpr(depth){return function(stream,state){var inner=tokenBaseInner(stream,state);if("punctuation"==inner){if("{"==stream.current()){state.tokenize=tokenNestedExpr(depth+1)}else if("}"==stream.current()){if(1<depth)state.tokenize=tokenNestedExpr(depth-1);else state.tokenize=tokenString}}return inner}}function tokenString(stream,state){while(!stream.eol()){stream.eatWhile(/[^'"\{\}\\]/);if(stream.eat("\\")){stream.next();if(singleline&&stream.eol())return OUTCLASS}else if(stream.match(delimiter)){state.tokenize=tokenOuter;return OUTCLASS}else if(stream.match("{{")){// ignore {{ in f-str
return OUTCLASS}else if(stream.match("{",!1)){// switch to nested mode
state.tokenize=tokenNestedExpr(0);if(stream.current())return OUTCLASS;else return state.tokenize(stream,state)}else if(stream.match("}}")){return OUTCLASS}else if(stream.match("}")){// single } in f-string is an error
return ERRORCLASS}else{stream.eat(/['"]/)}}if(singleline){if(parserConf.singleLineStringErrors)return ERRORCLASS;else state.tokenize=tokenOuter}return OUTCLASS}tokenString.isString=!0;return tokenString}function tokenStringFactory(delimiter,tokenOuter){while(0<="rubf".indexOf(delimiter.charAt(0).toLowerCase())){delimiter=delimiter.substr(1)}var singleline=1==delimiter.length,OUTCLASS="string";function tokenString(stream,state){while(!stream.eol()){stream.eatWhile(/[^'"\\]/);if(stream.eat("\\")){stream.next();if(singleline&&stream.eol())return OUTCLASS}else if(stream.match(delimiter)){state.tokenize=tokenOuter;return OUTCLASS}else{stream.eat(/['"]/)}}if(singleline){if(parserConf.singleLineStringErrors)return ERRORCLASS;else state.tokenize=tokenOuter}return OUTCLASS}tokenString.isString=!0;return tokenString}function pushPyScope(state){while("py"!=top(state).type){state.scopes.pop()}state.scopes.push({offset:top(state).offset+conf.indentUnit,type:"py",align:null})}function pushBracketScope(stream,state,type){var align=stream.match(/^([\s\[\{\(]|#.*)*$/,!1)?null:stream.column()+1;state.scopes.push({offset:state.indent+hangingIndent,type:type,align:align})}function dedent(stream,state){var indented=stream.indentation();while(1<state.scopes.length&&top(state).offset>indented){if("py"!=top(state).type)return!0;state.scopes.pop()}return top(state).offset!=indented}function tokenLexer(stream,state){if(stream.sol())state.beginningOfLine=!0;var style=state.tokenize(stream,state),current=stream.current();// Handle decorators
if(state.beginningOfLine&&"@"==current)return stream.match(identifiers,!1)?"meta":py3?"operator":ERRORCLASS;if(/\S/.test(current))state.beginningOfLine=!1;if(("variable"==style||"builtin"==style)&&"meta"==state.lastToken)style="meta";// Handle scope changes.
if("pass"==current||"return"==current)state.dedent+=1;if("lambda"==current)state.lambda=!0;if(":"==current&&!state.lambda&&"py"==top(state).type)pushPyScope(state);if(1==current.length&&!/string|comment/.test(style)){var delimiter_index="[({".indexOf(current);if(-1!=delimiter_index)pushBracketScope(stream,state,"])}".slice(delimiter_index,delimiter_index+1));delimiter_index="])}".indexOf(current);if(-1!=delimiter_index){if(top(state).type==current)state.indent=state.scopes.pop().offset-hangingIndent;else return ERRORCLASS}}if(0<state.dedent&&stream.eol()&&"py"==top(state).type){if(1<state.scopes.length)state.scopes.pop();state.dedent-=1}return style}var external={startState:function startState(basecolumn){return{tokenize:tokenBase,scopes:[{offset:basecolumn||0,type:"py",align:null}],indent:basecolumn||0,lastToken:null,lambda:!1,dedent:0}},token:function token(stream,state){var addErr=state.errorToken;if(addErr)state.errorToken=!1;var style=tokenLexer(stream,state);if(style&&"comment"!=style)state.lastToken="keyword"==style||"punctuation"==style?stream.current():style;if("punctuation"==style)style=null;if(stream.eol()&&state.lambda)state.lambda=!1;return addErr?style+" "+ERRORCLASS:style},indent:function indent(state,textAfter){if(state.tokenize!=tokenBase)return state.tokenize.isString?CodeMirror.Pass:0;var scope=top(state),closing=scope.type==textAfter.charAt(0);if(null!=scope.align)return scope.align-(closing?1:0);else return scope.offset-(closing?hangingIndent:0)},electricInput:/^\s*[\}\]\)]$/,closeBrackets:{triples:"'\""},lineComment:"#",fold:"indent"};return external});CodeMirror.defineMIME("text/x-python","python");var words=function words(str){return str.split(" ")};CodeMirror.defineMIME("text/x-cython",{name:"python",extra_keywords:words("by cdef cimport cpdef ctypedef enum except "+"extern gil include nogil property public "+"readonly struct union DEF IF ELIF ELSE")})});