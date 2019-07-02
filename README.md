# Tree-shake

_Inspired by [agadoo](https://github.com/Rich-Harris/agadoo) lib_

Is your project 100% tree-shakeable?

With treeshake, you can find out which files and code lines that are not tree-shakeable.

## Usage

Simply run `npx treeshake` in your project root. Make sure you have your entry point defined in `package.json` under either `"module"` or `"main"`.

Upon running, you'll get notification whether your code is 100% tree-shakeable or not. If not, it will tell which file(s) are causing/ affected by side-effects and the codes that caused it.

```
********** reading files **********

     tree88shakey
  TREESHAKEtRe eSha
 kETREESHaKetreeshAKE
TreeShakEY o0o tREeSHAKE
    Es6  /T r eesHakeY
      \///  /Thanks
        \//////
         |||||
         |||||
         |||||
   .....//||||\....
Awesome! Your code is 100% tree-shakeable!
```

or
```
********** reading files **********
Unshaken files:

/path/to/your/file.js

/another/path/to/your/file.js

********** reading codes **********
Unshaken codes:
console.log("Side-effects");

********** Finished Reading **********
```

## How do I make my project tree-shakeable?

1. Use ES6's [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) and [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
2. As much as possible, not have [side-effects](https://stackoverflow.com/questions/8129105/javascript-closures-and-side-effects-in-plain-english-separately)

For more on tree-shaking, check out this [awesome blog](https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80#.jnypozs9n) by Rich Harris.

## More resources on JS modules
- [Anatomy of JS module systems](https://www.freecodecamp.org/news/anatomy-of-js-module-systems-and-building-libraries-fadcd8dbd0e/)
- [JS module system](https://github.com/kamleshchandnani/js-module-system)
- [RollupJS](https://rollupjs.org/guide/en/)
- [ESM](https://github.com/standard-things/esm)
- [ESM usage](https://hackernoon.com/7-different-ways-to-use-es-modules-today-fc552254ebf4)
- [ESM cartoon](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)
- [Why you should use ESM](https://dev.to/bennypowers/you-should-be-using-esm-kn3)
- [Does node run all code inside required modules?](https://stackoverflow.com/questions/40464552/does-node-run-all-the-code-inside-required-modules)

