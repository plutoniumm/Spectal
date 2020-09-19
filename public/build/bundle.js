
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.25.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/navbar.svelte generated by Svelte v3.25.1 */

    const file = "src/navbar.svelte";

    function create_fragment(ctx) {
    	let header;
    	let a0;
    	let img;
    	let img_src_value;
    	let t0;
    	let input;
    	let t1;
    	let label;
    	let span;
    	let t2;
    	let ul;
    	let li0;
    	let a1;
    	let t4;
    	let li1;
    	let a2;
    	let t6;
    	let li2;
    	let a3;
    	let t8;
    	let li3;
    	let a4;
    	let t10;
    	let li4;
    	let a5;
    	let svg0;
    	let path0;
    	let a5_href_value;
    	let t11;
    	let a6;
    	let svg1;
    	let path1;
    	let a6_href_value;
    	let t12;
    	let a7;
    	let svg2;
    	let path2;
    	let a7_href_value;
    	let t13;
    	let a8;
    	let svg3;
    	let path3;
    	let a8_href_value;
    	let t14;
    	let a9;
    	let svg4;
    	let path4;
    	let a9_href_value;

    	const block = {
    		c: function create() {
    			header = element("header");
    			a0 = element("a");
    			img = element("img");
    			t0 = space();
    			input = element("input");
    			t1 = space();
    			label = element("label");
    			span = element("span");
    			t2 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			a1.textContent = "About";
    			t4 = space();
    			li1 = element("li");
    			a2 = element("a");
    			a2.textContent = "Services";
    			t6 = space();
    			li2 = element("li");
    			a3 = element("a");
    			a3.textContent = "Team";
    			t8 = space();
    			li3 = element("li");
    			a4 = element("a");
    			a4.textContent = "Contact";
    			t10 = space();
    			li4 = element("li");
    			a5 = element("a");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t11 = space();
    			a6 = element("a");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t12 = space();
    			a7 = element("a");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t13 = space();
    			a8 = element("a");
    			svg3 = svg_element("svg");
    			path3 = svg_element("path");
    			t14 = space();
    			a9 = element("a");
    			svg4 = svg_element("svg");
    			path4 = svg_element("path");
    			if (img.src !== (img_src_value = logo)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "100px");
    			attr_dev(img, "height", "auto");
    			attr_dev(img, "alt", "Spectal");
    			add_location(img, file, 109, 4, 2770);
    			attr_dev(a0, "href", "./index.html");
    			attr_dev(a0, "class", "logo svelte-116l96f");
    			add_location(a0, file, 108, 2, 2729);
    			attr_dev(input, "class", "menu-btn svelte-116l96f");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", "menu-btn");
    			add_location(input, file, 111, 2, 2840);
    			attr_dev(span, "class", "navicon svelte-116l96f");
    			add_location(span, file, 112, 42, 2939);
    			attr_dev(label, "class", "menu-icon svelte-116l96f");
    			attr_dev(label, "for", "menu-btn");
    			add_location(label, file, 112, 2, 2899);
    			attr_dev(a1, "href", "./index.html");
    			attr_dev(a1, "class", "svelte-116l96f");
    			add_location(a1, file, 115, 8, 3001);
    			attr_dev(li0, "class", "svelte-116l96f");
    			add_location(li0, file, 115, 4, 2997);
    			attr_dev(a2, "href", "./index.html");
    			attr_dev(a2, "class", "svelte-116l96f");
    			add_location(a2, file, 116, 8, 3047);
    			attr_dev(li1, "class", "svelte-116l96f");
    			add_location(li1, file, 116, 4, 3043);
    			attr_dev(a3, "href", "./index.html");
    			attr_dev(a3, "class", "svelte-116l96f");
    			add_location(a3, file, 117, 8, 3096);
    			attr_dev(li2, "class", "svelte-116l96f");
    			add_location(li2, file, 117, 4, 3092);
    			attr_dev(a4, "href", "./index.html");
    			attr_dev(a4, "class", "svelte-116l96f");
    			add_location(a4, file, 118, 8, 3141);
    			attr_dev(li3, "class", "svelte-116l96f");
    			add_location(li3, file, 118, 4, 3137);
    			attr_dev(path0, "d", "M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z");
    			add_location(path0, file, 123, 32, 3345);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 320 512");
    			attr_dev(svg0, "class", "svelte-116l96f");
    			add_location(svg0, file, 121, 56, 3263);
    			attr_dev(a5, "href", a5_href_value = /*socials*/ ctx[0].fb);
    			set_style(a5, "display", "inline-block");
    			attr_dev(a5, "class", "svelte-116l96f");
    			add_location(a5, file, 121, 6, 3213);
    			attr_dev(path1, "d", "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z");
    			add_location(path1, file, 126, 70, 3680);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 448 512");
    			attr_dev(svg1, "class", "svelte-116l96f");
    			add_location(svg1, file, 126, 8, 3618);
    			attr_dev(a6, "href", a6_href_value = /*socials*/ ctx[0].ig);
    			set_style(a6, "display", "inline-block");
    			attr_dev(a6, "class", "svelte-116l96f");
    			add_location(a6, file, 125, 6, 3559);
    			attr_dev(path2, "d", "M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z");
    			add_location(path2, file, 130, 70, 4772);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "viewBox", "0 0 512 512");
    			attr_dev(svg2, "class", "svelte-116l96f");
    			add_location(svg2, file, 130, 8, 4710);
    			attr_dev(a7, "href", a7_href_value = /*socials*/ ctx[0].tw);
    			set_style(a7, "display", "inline-block");
    			attr_dev(a7, "class", "svelte-116l96f");
    			add_location(a7, file, 129, 6, 4651);
    			attr_dev(path3, "d", "M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z");
    			add_location(path3, file, 135, 32, 5744);
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "viewBox", "0 0 448 512");
    			attr_dev(svg3, "class", "svelte-116l96f");
    			add_location(svg3, file, 133, 56, 5662);
    			attr_dev(a8, "href", a8_href_value = /*socials*/ ctx[0].in);
    			set_style(a8, "display", "inline-block");
    			attr_dev(a8, "class", "svelte-116l96f");
    			add_location(a8, file, 133, 6, 5612);
    			attr_dev(path4, "d", "M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z");
    			add_location(path4, file, 140, 32, 6225);
    			attr_dev(svg4, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg4, "viewBox", "0 0 448 512");
    			attr_dev(svg4, "class", "svelte-116l96f");
    			add_location(svg4, file, 138, 56, 6143);
    			attr_dev(a9, "href", a9_href_value = /*socials*/ ctx[0].wa);
    			set_style(a9, "display", "inline-block");
    			attr_dev(a9, "class", "svelte-116l96f");
    			add_location(a9, file, 138, 6, 6093);
    			attr_dev(li4, "class", "socials svelte-116l96f");
    			add_location(li4, file, 120, 4, 3186);
    			attr_dev(ul, "class", "menu svelte-116l96f");
    			add_location(ul, file, 114, 2, 2975);
    			attr_dev(header, "id", "purecss_header");
    			attr_dev(header, "class", "header fixed svelte-116l96f");
    			add_location(header, file, 107, 0, 2677);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, a0);
    			append_dev(a0, img);
    			append_dev(header, t0);
    			append_dev(header, input);
    			append_dev(header, t1);
    			append_dev(header, label);
    			append_dev(label, span);
    			append_dev(header, t2);
    			append_dev(header, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a1);
    			append_dev(ul, t4);
    			append_dev(ul, li1);
    			append_dev(li1, a2);
    			append_dev(ul, t6);
    			append_dev(ul, li2);
    			append_dev(li2, a3);
    			append_dev(ul, t8);
    			append_dev(ul, li3);
    			append_dev(li3, a4);
    			append_dev(ul, t10);
    			append_dev(ul, li4);
    			append_dev(li4, a5);
    			append_dev(a5, svg0);
    			append_dev(svg0, path0);
    			append_dev(li4, t11);
    			append_dev(li4, a6);
    			append_dev(a6, svg1);
    			append_dev(svg1, path1);
    			append_dev(li4, t12);
    			append_dev(li4, a7);
    			append_dev(a7, svg2);
    			append_dev(svg2, path2);
    			append_dev(li4, t13);
    			append_dev(li4, a8);
    			append_dev(a8, svg3);
    			append_dev(svg3, path3);
    			append_dev(li4, t14);
    			append_dev(li4, a9);
    			append_dev(a9, svg4);
    			append_dev(svg4, path4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*socials*/ 1 && a5_href_value !== (a5_href_value = /*socials*/ ctx[0].fb)) {
    				attr_dev(a5, "href", a5_href_value);
    			}

    			if (dirty & /*socials*/ 1 && a6_href_value !== (a6_href_value = /*socials*/ ctx[0].ig)) {
    				attr_dev(a6, "href", a6_href_value);
    			}

    			if (dirty & /*socials*/ 1 && a7_href_value !== (a7_href_value = /*socials*/ ctx[0].tw)) {
    				attr_dev(a7, "href", a7_href_value);
    			}

    			if (dirty & /*socials*/ 1 && a8_href_value !== (a8_href_value = /*socials*/ ctx[0].in)) {
    				attr_dev(a8, "href", a8_href_value);
    			}

    			if (dirty & /*socials*/ 1 && a9_href_value !== (a9_href_value = /*socials*/ ctx[0].wa)) {
    				attr_dev(a9, "href", a9_href_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const logo = "/assets/logo.png";

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Navbar", slots, []);
    	let { socials } = $$props;
    	const writable_props = ["socials"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("socials" in $$props) $$invalidate(0, socials = $$props.socials);
    	};

    	$$self.$capture_state = () => ({ logo, socials });

    	$$self.$inject_state = $$props => {
    		if ("socials" in $$props) $$invalidate(0, socials = $$props.socials);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [socials];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { socials: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*socials*/ ctx[0] === undefined && !("socials" in props)) {
    			console.warn("<Navbar> was created without expected prop 'socials'");
    		}
    	}

    	get socials() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set socials(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/landing/video.svelte generated by Svelte v3.25.1 */

    const file$1 = "src/landing/video.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let video_1;
    	let source;
    	let source_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			video_1 = element("video");
    			source = element("source");
    			if (source.src !== (source_src_value = "/assets/video.mp4")) attr_dev(source, "src", source_src_value);
    			attr_dev(source, "type", "video/mp4");
    			add_location(source, file$1, 24, 4, 357);
    			video_1.loop = true;
    			video_1.autoplay = true;
    			attr_dev(video_1, "class", "videoBg svelte-1usleh7");
    			add_location(video_1, file$1, 23, 2, 315);
    			attr_dev(div, "class", "videoBgWrapper");
    			add_location(div, file$1, 22, 0, 284);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, video_1);
    			append_dev(video_1, source);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Video", slots, []);

    	setTimeout(
    		() => {
    			video.play();
    		},
    		0
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Video> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Video extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Video",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/landing/contact.svelte generated by Svelte v3.25.1 */

    const file$2 = "src/landing/contact.svelte";

    function create_fragment$2(ctx) {
    	let main;
    	let h1;
    	let span0;
    	let t1;
    	let p;
    	let t3;
    	let div9;
    	let div2;
    	let div0;
    	let svg0;
    	let path0;
    	let t4;
    	let div1;
    	let span1;
    	let t5_value = /*details*/ ctx[0].email + "";
    	let t5;
    	let t6;
    	let br0;
    	let t7;
    	let span2;
    	let t9;
    	let br1;
    	let t10;
    	let div5;
    	let div3;
    	let svg1;
    	let path1;
    	let t11;
    	let div4;
    	let span3;
    	let t12_value = /*details*/ ctx[0].address + "";
    	let t12;
    	let t13;
    	let br2;
    	let t14;
    	let span4;
    	let t16;
    	let br3;
    	let t17;
    	let div8;
    	let div6;
    	let svg2;
    	let path2;
    	let t18;
    	let div7;
    	let span5;
    	let t19_value = /*details*/ ctx[0].phone + "";
    	let t19;
    	let t20;
    	let br4;
    	let t21;
    	let span6;

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			span0 = element("span");
    			span0.textContent = "Get in Touch.";
    			t1 = space();
    			p = element("p");
    			p.textContent = "We're always on the lookout for exceptional talent. Please write to us to\n    get started!";
    			t3 = space();
    			div9 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t4 = space();
    			div1 = element("div");
    			span1 = element("span");
    			t5 = text(t5_value);
    			t6 = space();
    			br0 = element("br");
    			t7 = space();
    			span2 = element("span");
    			span2.textContent = "Email";
    			t9 = space();
    			br1 = element("br");
    			t10 = space();
    			div5 = element("div");
    			div3 = element("div");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t11 = space();
    			div4 = element("div");
    			span3 = element("span");
    			t12 = text(t12_value);
    			t13 = space();
    			br2 = element("br");
    			t14 = space();
    			span4 = element("span");
    			span4.textContent = "Address";
    			t16 = space();
    			br3 = element("br");
    			t17 = space();
    			div8 = element("div");
    			div6 = element("div");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t18 = space();
    			div7 = element("div");
    			span5 = element("span");
    			t19 = text(t19_value);
    			t20 = space();
    			br4 = element("br");
    			t21 = space();
    			span6 = element("span");
    			span6.textContent = "Phone";
    			attr_dev(span0, "class", "level1");
    			add_location(span0, file$2, 29, 6, 385);
    			attr_dev(h1, "class", "svelte-w91y8e");
    			add_location(h1, file$2, 29, 2, 381);
    			set_style(p, "font-size", "1.5em");
    			set_style(p, "font-weight", "400");
    			set_style(p, "padding", "0.25em");
    			add_location(p, file$2, 30, 2, 434);
    			attr_dev(path0, "d", "M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z");
    			add_location(path0, file$2, 38, 70, 791);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 512 512");
    			attr_dev(svg0, "class", "svelte-w91y8e");
    			add_location(svg0, file$2, 38, 8, 729);
    			add_location(div0, file$2, 37, 6, 715);
    			set_style(span1, "font-weight", "700");
    			set_style(span1, "line-height", "2em");
    			add_location(span1, file$2, 42, 8, 1069);
    			add_location(br0, file$2, 43, 8, 1147);
    			add_location(span2, file$2, 44, 8, 1162);
    			add_location(div1, file$2, 41, 6, 1055);
    			set_style(div2, "align-items", "center");
    			set_style(div2, "margin", "0 auto");
    			set_style(div2, "text-align", "center");
    			add_location(div2, file$2, 36, 4, 643);
    			add_location(br1, file$2, 47, 4, 1209);
    			attr_dev(path1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(path1, "d", "M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z");
    			add_location(path1, file$2, 51, 70, 1389);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 384 512");
    			attr_dev(svg1, "class", "svelte-w91y8e");
    			add_location(svg1, file$2, 51, 8, 1327);
    			add_location(div3, file$2, 50, 6, 1313);
    			set_style(span3, "font-weight", "700");
    			set_style(span3, "line-height", "2em");
    			add_location(span3, file$2, 56, 8, 1745);
    			add_location(br2, file$2, 57, 8, 1825);
    			add_location(span4, file$2, 58, 8, 1840);
    			add_location(div4, file$2, 55, 6, 1731);
    			set_style(div5, "align-items", "center");
    			set_style(div5, "margin", "0 auto");
    			set_style(div5, "text-align", "center");
    			add_location(div5, file$2, 49, 4, 1241);
    			add_location(br3, file$2, 60, 10, 1884);
    			attr_dev(path2, "d", "M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z");
    			add_location(path2, file$2, 64, 70, 2063);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "viewBox", "0 0 512 512");
    			attr_dev(svg2, "class", "svelte-w91y8e");
    			add_location(svg2, file$2, 64, 8, 2001);
    			add_location(div6, file$2, 63, 6, 1987);
    			set_style(span5, "font-weight", "700");
    			set_style(span5, "line-height", "2em");
    			add_location(span5, file$2, 68, 8, 2392);
    			add_location(br4, file$2, 69, 8, 2470);
    			add_location(span6, file$2, 70, 8, 2485);
    			add_location(div7, file$2, 67, 6, 2378);
    			set_style(div8, "align-items", "center");
    			set_style(div8, "margin", "0 auto");
    			set_style(div8, "text-align", "center");
    			add_location(div8, file$2, 62, 4, 1915);
    			attr_dev(div9, "class", "details svelte-w91y8e");
    			add_location(div9, file$2, 34, 2, 598);
    			attr_dev(main, "class", "svelte-w91y8e");
    			add_location(main, file$2, 28, 0, 372);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(h1, span0);
    			append_dev(main, t1);
    			append_dev(main, p);
    			append_dev(main, t3);
    			append_dev(main, div9);
    			append_dev(div9, div2);
    			append_dev(div2, div0);
    			append_dev(div0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, span1);
    			append_dev(span1, t5);
    			append_dev(div1, t6);
    			append_dev(div1, br0);
    			append_dev(div1, t7);
    			append_dev(div1, span2);
    			append_dev(div9, t9);
    			append_dev(div9, br1);
    			append_dev(div9, t10);
    			append_dev(div9, div5);
    			append_dev(div5, div3);
    			append_dev(div3, svg1);
    			append_dev(svg1, path1);
    			append_dev(div5, t11);
    			append_dev(div5, div4);
    			append_dev(div4, span3);
    			append_dev(span3, t12);
    			append_dev(div4, t13);
    			append_dev(div4, br2);
    			append_dev(div4, t14);
    			append_dev(div4, span4);
    			append_dev(div5, t16);
    			append_dev(div9, br3);
    			append_dev(div9, t17);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div6, svg2);
    			append_dev(svg2, path2);
    			append_dev(div8, t18);
    			append_dev(div8, div7);
    			append_dev(div7, span5);
    			append_dev(span5, t19);
    			append_dev(div7, t20);
    			append_dev(div7, br4);
    			append_dev(div7, t21);
    			append_dev(div7, span6);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*details*/ 1 && t5_value !== (t5_value = /*details*/ ctx[0].email + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*details*/ 1 && t12_value !== (t12_value = /*details*/ ctx[0].address + "")) set_data_dev(t12, t12_value);
    			if (dirty & /*details*/ 1 && t19_value !== (t19_value = /*details*/ ctx[0].phone + "")) set_data_dev(t19, t19_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Contact", slots, []);
    	let { details } = $$props;
    	const writable_props = ["details"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("details" in $$props) $$invalidate(0, details = $$props.details);
    	};

    	$$self.$capture_state = () => ({ details });

    	$$self.$inject_state = $$props => {
    		if ("details" in $$props) $$invalidate(0, details = $$props.details);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [details];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { details: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*details*/ ctx[0] === undefined && !("details" in props)) {
    			console.warn("<Contact> was created without expected prop 'details'");
    		}
    	}

    	get details() {
    		throw new Error("<Contact>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set details(value) {
    		throw new Error("<Contact>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var socials = {
    	fb: "https://fb.com/spectalmanagement/",
    	ig: "https://instagr.am/spectal.management/",
    	tw: "https://twitter.com/spectalmngmnt/",
    	"in": "https://linkedin.com/company/spectal-talent-management/",
    	wa: ""
    };
    var contact = {
    	email: "support.spectalmanagement.com",
    	phone: "+91 98765 43210",
    	address: "BITS Pilani, KK Birla Goa Campus"
    };
    var data = {
    	socials: socials,
    	contact: contact
    };

    /* src/App.svelte generated by Svelte v3.25.1 */
    const file$3 = "src/App.svelte";

    function create_fragment$3(ctx) {
    	let main;
    	let navbar;
    	let t0;
    	let video;
    	let t1;
    	let contact;
    	let current;

    	navbar = new Navbar({
    			props: { socials: data.socials },
    			$$inline: true
    		});

    	video = new Video({ $$inline: true });

    	contact = new Contact({
    			props: { details: data.contact },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			create_component(video.$$.fragment);
    			t1 = space();
    			create_component(contact.$$.fragment);
    			add_location(main, file$3, 10, 0, 204);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t0);
    			mount_component(video, main, null);
    			append_dev(main, t1);
    			mount_component(contact, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(video.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(video.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			destroy_component(video);
    			destroy_component(contact);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Navbar, Video, Contact, data });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
