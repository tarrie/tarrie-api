(function(Prism){var typeExpression=/(?:[a-zA-Z]\w*|[|\\[\]])+/.source;Prism.languages.phpdoc=Prism.languages.extend("javadoclike",{parameter:{pattern:RegExp("(@(?:global|param|property(?:-read|-write)?|var)\\s+(?:"+typeExpression+"\\s+)?)\\$\\w+"),lookbehind:!0/* ignoreName */ /* skipSlots */}});Prism.languages.insertBefore("phpdoc","keyword",{"class-name":[{pattern:RegExp("(@(?:global|package|param|property(?:-read|-write)?|return|subpackage|throws|var)\\s+)"+typeExpression),lookbehind:!0,inside:{keyword:/\b(?:callback|resource|boolean|integer|double|object|string|array|false|float|mixed|bool|null|self|true|void|int)\b/,punctuation:/[|\\[\]()]/}}]});Prism.languages.javadoclike.addSupport("php",Prism.languages.phpdoc)})(Prism);