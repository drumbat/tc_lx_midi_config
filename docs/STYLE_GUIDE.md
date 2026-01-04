# Cycle Instruments Frontend Style Guide

This style guide documents the coding conventions and patterns used across Cycle Instruments web properties. All developers should follow these standards to maintain consistency.

---

## Table of Contents

1. [HTML Structure & Organization](#1-html-structure--organization)
2. [CSS & Tailwind Conventions](#2-css--tailwind-conventions)
3. [Naming Conventions](#3-naming-conventions)
4. [Responsive Design](#4-responsive-design)
5. [Accessibility Standards](#5-accessibility-standards)
6. [JavaScript Patterns](#6-javascript-patterns)
7. [Component Patterns](#7-component-patterns)
8. [Comments & Documentation](#8-comments--documentation)

---

## 1. HTML Structure & Organization

### Document Declaration

Always use HTML5 doctype with US English language attribute:

```html
<!DOCTYPE html>
<html lang="en-US">
```

### Head Section Order

Organize the `<head>` section in this order:

1. Meta charset and viewport
2. Open Graph meta tags
3. Other meta tags (robots, etc.)
4. Stylesheets
5. Inline critical styles (if needed)

```html
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width">

	<meta property="og:title" content="Page Title">
	<meta property="og:description" content="Description">
	<meta property="og:url" content="https://cycleinstruments.com/page">
	<meta property="og:image" content="https://cycleinstruments.com/image.jpg">
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="Cycle Instruments">
	<meta name="twitter:card" content="summary_large_image">

	<meta name="robots" content="index, follow">

	<link rel="stylesheet" href="styles.css">
</head>
```

### Body Structure

Use semantic HTML elements with a consistent page wrapper structure:

```html
<body class="antialiased font-sans text-base text-dark bg-dark">
	<div id="page" class="min-h-screen flex flex-col mx-auto max-w-7xl">
		<header class="contents">
			<!-- Navigation -->
		</header>

		<main id="content" class="site-content flex-grow">
			<!-- Page content -->
		</main>

		<footer id="colophon" class="site-footer bg-white mb-8 pb-8" role="contentinfo">
			<!-- Footer content -->
		</footer>
	</div>
</body>
```

### Indentation

- Use **tabs** for indentation (not spaces)
- Each nested level increases by one tab
- Maintain consistent nesting throughout

```html
<div class="container">
	<nav class="navigation">
		<ul class="menu">
			<li class="menu-item">
				<a href="#">Link</a>
			</li>
		</ul>
	</nav>
</div>
```

---

## 2. CSS & Tailwind Conventions

### Framework

We use **Tailwind CSS** with a utility-first approach. Avoid writing custom CSS when Tailwind utilities can achieve the same result.

### Custom Typography Classes

Use the `lg-*` prefix for custom typography/letter-spacing classes:

| Class | Purpose |
|-------|---------|
| `lg-normal` | Standard letter-spacing |
| `lg-medium` | Medium letter-spacing |
| `lg-400` | Weight 400 variant |
| `lg-600` | Weight 600 variant |
| `lg-700` | Weight 700 variant |
| `lg-box-hyperlinks` | Box/button hyperlink styling |

### Color Palette

**Primary Colors:**
- Primary Blue: `#0EA5E9`
- Secondary Teal: `#14B8A6`

**Background Colors:**
- Dark: `bg-dark` (typically `#1a1a1a`)
- Light: `bg-light` or `bg-gray-50`
- White: `bg-white`

**Text Colors:**
- Dark text: `text-dark`
- Light text: `text-light`
- White text: `text-white`
- Gray variants: `text-gray-400`, `text-gray-500`, `text-gray-900`

### Common Utility Patterns

**Flexbox layouts:**
```html
<div class="flex flex-col items-center justify-center">
<div class="flex flex-row items-center justify-between">
```

**Grid layouts (6-column system):**
```html
<div class="grid grid-cols-6 gap-x-0">
	<div class="col-span-2">Left column</div>
	<div class="col-span-3">Center column</div>
	<div class="col-span-1">Right column</div>
</div>
```

**Spacing:**
```html
<!-- Margin -->
<div class="m-2 mt-4 mb-8 mx-auto my-2">

<!-- Padding -->
<div class="p-4 px-6 py-2">
```

**Hover states:**
```html
<a class="hover:border-2 hover:border-double hover:text-white hover:bg-dark">
```

---

## 3. Naming Conventions

### Element IDs

Use **kebab-case** with descriptive, functional names. Include breakpoint context when the element is breakpoint-specific:

```html
<!-- General elements -->
<div id="page">
<main id="content">
<footer id="colophon">

<!-- Breakpoint-specific elements -->
<button id="mobile-menu-btn">
<nav id="desktop-nav">
<div id="cycle-nav-btn-mobile">

<!-- Functional naming -->
<div id="subscription-thank-you-modal">
<form id="subscription-form-landing-desktop">
```

### Form Field IDs

Prefix form field IDs with the target breakpoint:

```html
<!-- Desktop form fields -->
<input id="desk_user_email">
<button id="desk_email_submit">

<!-- Mobile form fields -->
<input id="mob_user_email">
<button id="mob_email_submit">
```

### CSS Classes

Combine Tailwind utilities with custom `lg-*` classes:

```html
<span class="lg-box-hyperlinks uppercase text-xs">More details</span>
<div class="lg-normal text-xs text-dark hover:text-black mb-1">
```

---

## 4. Responsive Design

### Mobile-First Approach

Design for mobile first, then add complexity for larger screens using Tailwind breakpoint prefixes.

### Breakpoints

| Prefix | Min Width | Usage |
|--------|-----------|-------|
| (none) | 0px | Mobile (default) |
| `mobile-m:` | Custom | Medium mobile devices |
| `mobile-l:` | Custom | Large mobile devices |
| `sm:` | 640px | Small tablets and up |
| `md:` | 768px | Tablets and up |
| `lg:` | 1024px | Desktops and up |

### Visibility Patterns

**Mobile-only content:**
```html
<div class="visible sm:hidden">
	<!-- Visible on mobile, hidden on sm screens and up -->
</div>
```

**Desktop-only content:**
```html
<div class="invisible sm:visible hidden sm:block">
	<!-- Hidden on mobile, visible on sm screens and up -->
</div>
```

### Responsive Navigation Pattern

Maintain separate navigation structures for mobile and desktop:

```html
<!-- Mobile Navigation -->
<nav class="block sm:hidden m-auto mx-2">
	<div class="flex flex-row items-center justify-between w-full bg-dark">
		<a href="#"><div id="cycle-nav-btn-mobile" class="..."></div></a>
		<button id="mobile-menu-btn" onClick="toggleMobileMenu()">
			<span class="sr-only">Open main menu</span>
			<svg id="menu-hidden-icon" class="block h-8 w-8">...</svg>
			<svg id="menu-showing-icon" class="hidden h-8 w-8">...</svg>
		</button>
	</div>
	<div class="invisible hidden" id="mobile-menu">
		<!-- Mobile menu items -->
	</div>
</nav>

<!-- Desktop Navigation -->
<nav class="invisible sm:visible hidden sm:grid w-full grid-cols-6">
	<!-- Desktop nav with column layout -->
</nav>
```

### Responsive Spacing

Apply different spacing at different breakpoints:

```html
<div class="mt-2 sm:mt-5 md:mt-8">
<div class="px-4 md:px-8 lg:px-12">
```

---

## 5. Accessibility Standards

### ARIA Attributes

Add ARIA attributes to interactive elements:

```html
<!-- Dialogs/Modals -->
<div id="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
	<h2 id="modal-title">Modal Title</h2>
</div>

<!-- Navigation landmarks -->
<footer role="contentinfo">
```

### Screen Reader Text

Use `sr-only` class for content that should be accessible to screen readers but visually hidden:

```html
<button>
	<span class="sr-only">Open main menu</span>
	<svg class="h-8 w-8"><!-- hamburger icon --></svg>
</button>

<label for="email" class="sr-only">Email address</label>
<input type="email" id="email" placeholder="Email">
```

### Semantic HTML

Always use semantic elements:

- `<header>` for page headers
- `<nav>` for navigation
- `<main>` for primary content
- `<footer>` for page footers
- `<section>` for thematic groupings
- `<article>` for self-contained content

---

## 6. JavaScript Patterns

### jQuery Usage

Use jQuery with the standard document-ready pattern:

```javascript
jQuery(function($) {
	// Your code here
});
```

### Data Attributes

Use `data-*` attributes for configuration values:

```html
<button id="buy-button" data-product-id="72" class="add-to-cart-button">
	Add to Cart
</button>

<form data-type="subscription" id="subscription-form">
```

### Event Handlers

For simple interactions, use inline handlers:

```html
<button onClick="toggleMobileMenu()">Menu</button>
```

For complex interactions, bind events in JavaScript:

```javascript
jQuery(function($) {
	$('#buy-button').on('click', function(e) {
		e.preventDefault();
		let product_id = $(this).data('product-id');
		// Handle click
	});
});
```

### AJAX Pattern

Standard AJAX request structure:

```javascript
$.ajax({
	url: '/api/endpoint',
	type: 'POST',
	dataType: 'json',
	data: {
		action: 'action_name',
		param: value
	},
	success: function(response) {
		if (response.success) {
			// Handle success
		}
	},
	error: function(xhr, status, error) {
		// Handle error
	}
});
```

---

## 7. Component Patterns

### Buttons

Standard button with hover states:

```html
<div class="w-48 h-8 flex justify-center items-center border border-dark hover:border-2 bg-white">
	<a class="no-underline w-full h-full flex items-center justify-center" href="#">
		<span class="lg-box-hyperlinks uppercase text-xs">Button Text</span>
	</a>
</div>
```

### Forms

Form structure with accessibility:

```html
<form class="mt-2 md:mt-5 sm:flex sm:items-center" id="form-id" method="POST" data-type="subscription">
	<div class="flex h-8 flex-row-reverse justify-center">
		<label for="email-input" class="sr-only">Email</label>
		<input
			type="email"
			name="email"
			id="email-input"
			class="block w-full border border-dark py-2 px-3 text-dark sm:text-xs sm:leading-6"
			placeholder="Email"
			required
		>
		<!-- Honeypot field for spam prevention -->
		<input type="text" name="email_confirm" class="hidden">
	</div>
	<button type="submit" class="mt-3 sm:mt-0 sm:ml-3 inline-flex items-center justify-center border border-dark px-3 py-2 text-xs text-dark hover:bg-dark hover:text-white">
		Subscribe
	</button>
</form>
```

### Modals

Modal structure with proper accessibility:

```html
<div id="modal-id" class="relative z-10 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
	<!-- Backdrop -->
	<div class="fixed inset-0 bg-dark bg-opacity-75 transition-opacity"></div>

	<!-- Modal container -->
	<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
		<div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
			<!-- Modal content -->
			<div class="relative transform overflow-hidden border border-white bg-dark bg-opacity-80 px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
				<h3 id="modal-title" class="text-lg font-semibold text-white">Modal Title</h3>
				<div class="mt-2">
					<p class="text-sm text-gray-300">Modal content here.</p>
				</div>
				<button type="button" onclick="closeModal()" class="mt-4 w-full border border-white px-3 py-2 text-white hover:bg-white hover:text-dark">
					Close
				</button>
			</div>
		</div>
	</div>
</div>
```

### Content Cards / Specification Tables

Grid-based content layout:

```html
<div class="w-full grid gap-2 grid-cols-6">
	<div class="col-span-3 bg-white border-t border-gray-200">
		<div class="m-2">
			<div class="lg-700 uppercase text-xs text-dark mb-1">Section Title</div>
			<div class="lg-normal text-xs text-dark hover:text-black mb-1">
				Content line 1<br>
				Content line 2<br>
				Content line 3
			</div>
		</div>
	</div>
	<div class="col-span-3 bg-white border-t border-gray-200">
		<div class="m-2">
			<div class="lg-700 uppercase text-xs text-dark mb-1">Another Section</div>
			<div class="lg-normal text-xs text-dark hover:text-black mb-1">
				More content here
			</div>
		</div>
	</div>
</div>
```

### Download Lists

```html
<ul class="list-disc">
	<li class="flex items-center justify-between py-2 pl-4 pr-5 text-xs leading-6">
		<div class="flex w-0 flex-1 items-center">
			<svg class="h-5 w-5 flex-shrink-0 text-gray-400"><!-- icon --></svg>
			<div class="ml-4 flex min-w-0 flex-1 gap-2">
				<span class="truncate font-medium">Document Name</span>
				<span class="flex-shrink-0 text-gray-400">10.5mb</span>
			</div>
		</div>
		<div class="ml-4 flex-shrink-0">
			<a href="/path/to/file.pdf" download="filename" class="font-medium text-dark hover:text-gray-500">
				Download
			</a>
		</div>
	</li>
</ul>
```

### Social Links

```html
<div class="flex flex-row border border-white my-1 items-center justify-center">
	<a href="https://www.instagram.com/cycle_instruments/" target="_blank" class="h-6 w-6 mr-1 hover:border hover:border-dark">
		<img src="instagram-icon.svg" alt="Instagram">
	</a>
	<a href="https://www.youtube.com/channel/..." target="_blank" class="h-6 w-6 ml-1 hover:border hover:border-dark">
		<img src="youtube-icon.svg" alt="YouTube">
	</a>
</div>
```

### Embedded Video (16:9 Aspect Ratio)

```html
<div style="padding:56.25% 0 0 0; position:relative;">
	<iframe
		src="https://player.vimeo.com/video/..."
		style="position:absolute; top:0; left:0; width:100%; height:100%;"
		frameborder="0"
		allow="autoplay; fullscreen; picture-in-picture"
		allowfullscreen
	></iframe>
</div>
```

---

## 8. Comments & Documentation

### Section Headers

Use ALL CAPS HTML comments to denote major sections:

```html
<!-- MOBILE -->
<nav class="block sm:hidden">
	...
</nav>

<!-- DESKTOP AND TABLET -->
<nav class="invisible sm:visible">
	...
</nav>

<!-- FOOTER -->
<footer>
	...
</footer>
```

### Inline Comments

Use sparingly for clarification:

```html
<!-- Current state classes for reference -->
<a class="text-white bg-gray-900">Active Link</a>

<!-- Default state classes for reference -->
<a class="text-gray-300 hover:bg-gray-700 hover:text-white">Inactive Link</a>
```

### Avoid

- Commented-out code in production files
- Excessive inline comments
- Comments that describe obvious functionality

---

## Quick Reference Checklist

Before submitting code, verify:

- [ ] HTML5 doctype with `lang="en-US"`
- [ ] Tab indentation (not spaces)
- [ ] Semantic HTML elements used appropriately
- [ ] IDs use kebab-case with descriptive names
- [ ] Form fields prefixed with breakpoint (`desk_`, `mob_`)
- [ ] Mobile-first responsive approach
- [ ] Visibility classes: `visible sm:hidden` / `invisible sm:visible`
- [ ] ARIA attributes on interactive elements
- [ ] `sr-only` class for screen reader text
- [ ] Section comments in ALL CAPS
- [ ] No commented-out code in final files
- [ ] Tailwind utilities preferred over custom CSS
- [ ] Custom typography uses `lg-*` prefix classes
