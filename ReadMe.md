# JQuery Electrical
> For all your responsive needs...

## Introduction

JQuery Electrical (JQE) comprises two components: dynamic device/window/element measurement and `class-` swapping.

### Measurement

The gauge elements are special `<input>` types with `form=gauge` (and `type=radio`, but that's added automatically):

```html
<input form="gauge"                   max-width="555px" value="tiny" />
<input form="gauge" min-width="556px" max-width="999px" value="small" />
```

These are reevaluated whenever the page dimensions change (and of course on `ready`, `load`, etc).

As a set of radio buttons, the gauge measures and effectively characterises its containing element:

```css
[form=gauge][value=tiny]:checked ~* {
	// Style any following siblings
}

[form=gauge][value=tiny]:checked ~* .my-class {
	// Style any descendants with `.my-class` of any following siblings
}
```

For page wide characterisation, these elements are commonly added at the top of body:

```html
<body class="font-lato-300 font-black background-white">
	<input form="gauge"                   max-width="555px" value="tiny" />
	<input form="gauge" min-width="556px" max-width="999px" value="small" />
	<div>
		<!-- ... -->
	</div>
</body>
```

But they can be placed anywhere you need accurate size control:

```html
<article class="media">
	<input form="gauge"                   max-width="555px" value="tiny" />
	<input form="gauge" min-width="556px" max-width="999px" value="small" />
	<div>
		<figure>
			<!-- ... -->
		</figure>
		<details>
			<!-- ... -->
		</details>
	</div>
</article>
```

In this case CSS can be applied based on the dimensions of the enclosing `<article>` to determine whether `<figure>` and `<details>` should have a horizontal or vertical layout.

There are several more attributes available for measurement (displayed here using glob syntax):

	{min,max}-{window,device,element}-{width,height}

With `window` measurement available by default:

	{min,max}-{width,height}

### Swapping

For class-heavy markup (e.g. OOCSS) it's useful to define alternative `classLists` for each layout.

```html
<ol class="four vertical columns"
    class-small="three vertical columns"
    class-tiny="two vertical columns">
    <!-- ... -->
</ol>
```

With JQE loaded, the relevant `class-` is swapped in (while the original is saved to `class-default`) depending on the state of any ancestral gauge elements.

## Usage

JQE is invoked by the initialiser function [`gauge`](https://github.com/tosyx/jquery-electrical/blob/master/jquery-electrical.js#L17):

```js
$.gauge()
```

This registers the necessary callbacks for dimension-change events and determines the gauge selector. The following are equivalent:

```js
$.gauge()
$.gauge('[form=gauge]')
$.gauge({ selector: '[form=gauge]', ready: 'ready page:load pjax:success' })
```
