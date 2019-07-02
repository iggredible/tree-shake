# Tree-shake

Is your project 100% tree-shakeable?

With treeshake, you can find out which files and code lines that are not tree-shakeable.

Simply run `npx treeshake` in your project root. Make sure you have your entry point defined in `package.json` under either `"module"` or `"main"`.

```
random-library: treeshake

********** reading files **********
Awesome! Code is 100% tree-shakeable
```

# How do I make my project tree-shakeable?
1. Use ES6's [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) and [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
2. As much as possible, not have [side-effects](https://stackoverflow.com/questions/8129105/javascript-closures-and-side-effects-in-plain-english-separately)

For more on tree-shaking, check out this [awesome blog](https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80#.jnypozs9n) by Rich Harris.

