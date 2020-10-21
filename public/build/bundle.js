
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
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
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
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

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
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
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
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
    			add_location(img, file, 109, 4, 2774);
    			attr_dev(a0, "href", "./index.html");
    			attr_dev(a0, "class", "logo svelte-bfvj5v");
    			add_location(a0, file, 108, 2, 2733);
    			attr_dev(input, "class", "menu-btn svelte-bfvj5v");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", "menu-btn");
    			add_location(input, file, 111, 2, 2844);
    			attr_dev(span, "class", "navicon svelte-bfvj5v");
    			add_location(span, file, 112, 42, 2943);
    			attr_dev(label, "class", "menu-icon svelte-bfvj5v");
    			attr_dev(label, "for", "menu-btn");
    			add_location(label, file, 112, 2, 2903);
    			attr_dev(a1, "href", "./index.html");
    			attr_dev(a1, "class", "svelte-bfvj5v");
    			add_location(a1, file, 115, 8, 3005);
    			attr_dev(li0, "class", "svelte-bfvj5v");
    			add_location(li0, file, 115, 4, 3001);
    			attr_dev(a2, "href", "./index.html");
    			attr_dev(a2, "class", "svelte-bfvj5v");
    			add_location(a2, file, 116, 8, 3051);
    			attr_dev(li1, "class", "svelte-bfvj5v");
    			add_location(li1, file, 116, 4, 3047);
    			attr_dev(a3, "href", "./index.html");
    			attr_dev(a3, "class", "svelte-bfvj5v");
    			add_location(a3, file, 117, 8, 3100);
    			attr_dev(li2, "class", "svelte-bfvj5v");
    			add_location(li2, file, 117, 4, 3096);
    			attr_dev(a4, "href", "./index.html");
    			attr_dev(a4, "class", "svelte-bfvj5v");
    			add_location(a4, file, 118, 8, 3145);
    			attr_dev(li3, "class", "svelte-bfvj5v");
    			add_location(li3, file, 118, 4, 3141);
    			attr_dev(path0, "d", "M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z");
    			add_location(path0, file, 122, 32, 3304);
    			attr_dev(svg0, "viewBox", "0 0 320 512");
    			attr_dev(svg0, "class", "svelte-bfvj5v");
    			add_location(svg0, file, 121, 56, 3267);
    			attr_dev(a5, "href", a5_href_value = /*socials*/ ctx[0].fb);
    			set_style(a5, "display", "inline-block");
    			attr_dev(a5, "class", "svelte-bfvj5v");
    			add_location(a5, file, 121, 6, 3217);
    			attr_dev(path1, "d", "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z");
    			add_location(path1, file, 125, 35, 3604);
    			attr_dev(svg1, "viewBox", "0 0 448 512");
    			attr_dev(svg1, "class", "svelte-bfvj5v");
    			add_location(svg1, file, 125, 8, 3577);
    			attr_dev(a6, "href", a6_href_value = /*socials*/ ctx[0].ig);
    			set_style(a6, "display", "inline-block");
    			attr_dev(a6, "class", "svelte-bfvj5v");
    			add_location(a6, file, 124, 6, 3518);
    			attr_dev(path2, "d", "M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z");
    			add_location(path2, file, 129, 35, 4661);
    			attr_dev(svg2, "viewBox", "0 0 512 512");
    			attr_dev(svg2, "class", "svelte-bfvj5v");
    			add_location(svg2, file, 129, 8, 4634);
    			attr_dev(a7, "href", a7_href_value = /*socials*/ ctx[0].tw);
    			set_style(a7, "display", "inline-block");
    			attr_dev(a7, "class", "svelte-bfvj5v");
    			add_location(a7, file, 128, 6, 4575);
    			attr_dev(path3, "d", "M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z");
    			add_location(path3, file, 133, 32, 5588);
    			attr_dev(svg3, "viewBox", "0 0 448 512");
    			attr_dev(svg3, "class", "svelte-bfvj5v");
    			add_location(svg3, file, 132, 56, 5551);
    			attr_dev(a8, "href", a8_href_value = /*socials*/ ctx[0].in);
    			set_style(a8, "display", "inline-block");
    			attr_dev(a8, "class", "svelte-bfvj5v");
    			add_location(a8, file, 132, 6, 5501);
    			attr_dev(path4, "d", "M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z");
    			add_location(path4, file, 137, 32, 6024);
    			attr_dev(svg4, "viewBox", "0 0 448 512");
    			attr_dev(svg4, "class", "svelte-bfvj5v");
    			add_location(svg4, file, 136, 56, 5987);
    			attr_dev(a9, "href", a9_href_value = /*socials*/ ctx[0].wa);
    			set_style(a9, "display", "inline-block");
    			attr_dev(a9, "class", "svelte-bfvj5v");
    			add_location(a9, file, 136, 6, 5937);
    			attr_dev(li4, "class", "socials svelte-bfvj5v");
    			add_location(li4, file, 120, 4, 3190);
    			attr_dev(ul, "class", "menu svelte-bfvj5v");
    			add_location(ul, file, 114, 2, 2979);
    			attr_dev(header, "id", "purecss_header");
    			attr_dev(header, "class", "header fixed svelte-bfvj5v");
    			add_location(header, file, 107, 0, 2681);
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

    const logo = "./assets/logo.png";

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

    /* src/components/video.svelte generated by Svelte v3.25.1 */

    const file$1 = "src/components/video.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let video_1;
    	let track;
    	let source;
    	let source_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			video_1 = element("video");
    			track = element("track");
    			source = element("source");
    			attr_dev(track, "kind", "captions");
    			add_location(track, file$1, 24, 4, 360);
    			if (source.src !== (source_src_value = "./assets/video.mp4")) attr_dev(source, "src", source_src_value);
    			attr_dev(source, "type", "video/mp4");
    			add_location(source, file$1, 25, 4, 390);
    			video_1.loop = true;
    			video_1.autoplay = true;
    			attr_dev(video_1, "class", "videoBg svelte-1n3ihkd");
    			add_location(video_1, file$1, 23, 2, 318);
    			attr_dev(div, "class", "videoBgWrapper");
    			add_location(div, file$1, 22, 0, 287);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, video_1);
    			append_dev(video_1, track);
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

    /* src/components/about.svelte generated by Svelte v3.25.1 */

    const file$2 = "src/components/about.svelte";

    function create_fragment$2(ctx) {
    	let section;
    	let h1;
    	let t1;
    	let p0;
    	let t2_value = /*data*/ ctx[0].big + "";
    	let t2;
    	let t3;
    	let p1;
    	let t4_value = /*data*/ ctx[0].small + "";
    	let t4;

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "This is Us.";
    			t1 = space();
    			p0 = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			p1 = element("p");
    			t4 = text(t4_value);
    			set_style(h1, "font-size", "4em");
    			set_style(h1, "line-height", "0.25em");
    			add_location(h1, file$2, 29, 2, 522);
    			set_style(p0, "font-size", "1.5em");
    			set_style(p0, "line-height", "1.5em");
    			set_style(p0, "font-weight", "600");
    			add_location(p0, file$2, 30, 2, 586);
    			set_style(p1, "font-size", "1.25em");
    			set_style(p1, "line-height", "1.5em");
    			set_style(p1, "font-weight", "300");
    			add_location(p1, file$2, 31, 2, 664);
    			attr_dev(section, "class", "svelte-b7jgh0");
    			add_location(section, file$2, 28, 0, 510);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(section, t1);
    			append_dev(section, p0);
    			append_dev(p0, t2);
    			append_dev(section, t3);
    			append_dev(section, p1);
    			append_dev(p1, t4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data*/ 1 && t2_value !== (t2_value = /*data*/ ctx[0].big + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*data*/ 1 && t4_value !== (t4_value = /*data*/ ctx[0].small + "")) set_data_dev(t4, t4_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
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
    	validate_slots("About", slots, []);
    	let { data } = $$props;
    	const writable_props = ["data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ data });

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !("data" in props)) {
    			console.warn("<About> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<About>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<About>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/micro/counter.svelte generated by Svelte v3.25.1 */

    const file$3 = "src/micro/counter.svelte";

    function create_fragment$3(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let t1;
    	let t2;
    	let div1;
    	let t3_value = /*name*/ ctx[1].toUpperCase() + "";
    	let t3;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(/*value*/ ctx[0]);
    			t1 = text("+");
    			t2 = space();
    			div1 = element("div");
    			t3 = text(t3_value);
    			set_style(div0, "font-size", "2.5em");
    			add_location(div0, file$3, 15, 6, 275);
    			add_location(div1, file$3, 16, 6, 326);
    			attr_dev(div2, "class", "counter svelte-w1b93l");
    			add_location(div2, file$3, 14, 0, 247);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, t3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 1) set_data_dev(t0, /*value*/ ctx[0]);
    			if (dirty & /*name*/ 2 && t3_value !== (t3_value = /*name*/ ctx[1].toUpperCase() + "")) set_data_dev(t3, t3_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
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
    	validate_slots("Counter", slots, []);
    	let { value } = $$props, { name } = $$props;
    	const writable_props = ["value", "name"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Counter> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ value, name });

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, name];
    }

    class Counter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { value: 0, name: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Counter",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[0] === undefined && !("value" in props)) {
    			console.warn("<Counter> was created without expected prop 'value'");
    		}

    		if (/*name*/ ctx[1] === undefined && !("name" in props)) {
    			console.warn("<Counter> was created without expected prop 'name'");
    		}
    	}

    	get value() {
    		throw new Error("<Counter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Counter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Counter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Counter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/events.svelte generated by Svelte v3.25.1 */
    const file$4 = "src/components/events.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (73:4) {#each data as ctr}
    function create_each_block_1(ctx) {
    	let counter;
    	let current;

    	counter = new Counter({
    			props: {
    				name: /*ctr*/ ctx[7].name,
    				value: /*ctr*/ ctx[7].value
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(counter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(counter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const counter_changes = {};
    			if (dirty & /*data*/ 1) counter_changes.name = /*ctr*/ ctx[7].name;
    			if (dirty & /*data*/ 1) counter_changes.value = /*ctr*/ ctx[7].value;
    			counter.$set(counter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(counter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(counter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(counter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(73:4) {#each data as ctr}",
    		ctx
    	});

    	return block;
    }

    // (82:6) {#if ob.name == currOb}
    function create_if_block(ctx) {
    	let div;
    	let h1;
    	let t0_value = /*ob*/ ctx[4].name + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(h1, "class", "svelte-3vg2bq");
    			add_location(h1, file$4, 83, 10, 1711);
    			set_style(div, "background", /*ob*/ ctx[4].color);
    			attr_dev(div, "class", "svelte-3vg2bq");
    			add_location(div, file$4, 82, 8, 1664);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(div, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(82:6) {#if ob.name == currOb}",
    		ctx
    	});

    	return block;
    }

    // (81:4) {#each evns as ob}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*ob*/ ctx[4].name == /*currOb*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*ob*/ ctx[4].name == /*currOb*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(81:4) {#each evns as ob}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let section;
    	let h10;
    	let span;
    	let t1;
    	let div0;
    	let t2;
    	let div2;
    	let div1;
    	let h11;
    	let t4;
    	let current;
    	let each_value_1 = /*data*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*evns*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			h10 = element("h1");
    			span = element("span");
    			span.textContent = "Our Events.";
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			div2 = element("div");
    			div1 = element("div");
    			h11 = element("h1");
    			h11.textContent = "Bookings";
    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span, "class", "level1");
    			add_location(span, file$4, 70, 6, 1335);
    			attr_dev(h10, "class", "svelte-3vg2bq");
    			add_location(h10, file$4, 70, 2, 1331);
    			attr_dev(div0, "class", "counters svelte-3vg2bq");
    			add_location(div0, file$4, 71, 2, 1382);
    			attr_dev(h11, "class", "svelte-3vg2bq");
    			add_location(h11, file$4, 78, 6, 1574);
    			set_style(div1, "background", "DarkViolet");
    			attr_dev(div1, "class", "svelte-3vg2bq");
    			add_location(div1, file$4, 77, 4, 1531);
    			attr_dev(div2, "class", "whatwedo svelte-3vg2bq");
    			add_location(div2, file$4, 76, 2, 1504);
    			attr_dev(section, "class", "svelte-3vg2bq");
    			add_location(section, file$4, 69, 0, 1319);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h10);
    			append_dev(h10, span);
    			append_dev(section, t1);
    			append_dev(section, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(section, t2);
    			append_dev(section, div2);
    			append_dev(div2, div1);
    			append_dev(div1, h11);
    			append_dev(div2, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data*/ 1) {
    				each_value_1 = /*data*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*evns, currOb*/ 6) {
    				each_value = /*evns*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Events", slots, []);
    	let i = 0;
    	const evns = [{ name: "Production", color: "red" }, { name: "College", color: "orange" }];

    	setInterval(
    		() => {
    			$$invalidate(3, i = (i + 1) % evns.length);
    		},
    		3000
    	);

    	let { data } = $$props;
    	const writable_props = ["data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Events> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ Counter, i, evns, data, currOb });

    	$$self.$inject_state = $$props => {
    		if ("i" in $$props) $$invalidate(3, i = $$props.i);
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    		if ("currOb" in $$props) $$invalidate(1, currOb = $$props.currOb);
    	};

    	let currOb;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*i*/ 8) {
    			 $$invalidate(1, currOb = evns[i].name);
    		}
    	};

    	return [data, currOb, evns];
    }

    class Events extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Events",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !("data" in props)) {
    			console.warn("<Events> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<Events>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Events>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    var options = [
    	{
    		name: "learn",
    		path: "M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 7-5 12-12 12h-92v92c0 7-5 12-12 12h-56c-7 0-12-5-12-12v-92h-92c-7 0-12-5-12-12v-56c0-7 5-12 12-12h92v-92c0-7 5-12 12-12h56c7 0 12 5 12 12v92h92c7 0 12 5 12 12v56z"
    	},
    	{
    		name: "insta",
    		path: "M224 141c-64 0-115 51-115 115s51 115 115 115S339 320 339 256 288 141 224 141zm0 190c-41 0-75-33-75-75s34-75 75-75 75 34 75 75-34 75-75 75zm146-194c0 15-12 27-27 27-15 0-27-12-27-27s12-27 27-27 27 12 27 27zm76 27c-2-36-10-68-36-94-26-26-58-34-94-36-37-2-148-2-185 0-36 2-68 10-94 36s-34 58-36 94c-2 37-2 148 0 185 2 36 10 68 36 94s58 34 94 36c37 2 148 2 185 0 36-2 68-10 94-36 26-26 34-58 36-94 2-37 2-148 0-185zM399 388c-8 20-23 35-43 43-29 12-99 9-132 9s-103 3-132-9c-20-8-35-23-43-43-12-29-9-99-9-132s-3-103 9-132c8-20 23-35 43-43 30-12 100-9 132-9s103-3 132 9c20 8 35 23 43 43 12 30 9 100 9 132s3 103-9 132z"
    	},
    	{
    		name: "fb",
    		path: "M279 288l14-93h-89v-60c0-25 12-50 52-50h40V6S260 0 225 0c-73 0-121 44-121 125v71H23V288h81v224h100V288z"
    	},
    	{
    		name: "twt",
    		path: "M459 151.716c.3 4.5.3 9.1.3 14 0 139-106 299-299 299-59 0-115-17-161-47 8.5.9 17 1 25 1 49 0 94-17 130-45-46-1-85-31-98-73 6.5.9 13 2 20 2 9.421 0 19-1 28-4-48-10-84-51-84-103v-1c14 8 30 13 47 13-28-19-47-51-47-87 0-19 5-37 14-53 52 64 129 105 216 110-2-8-3-16-3-24 0-58 47-105 105-105 30 0 57 12 76 33 24-5 46-13 66.599-25-8 24-24 45-46 58 21-2 42-8 60-16-14 21-32 39-53 54z"
    	},
    	{
    		name: "web",
    		path: "M337 160C322 71 288 8 248 8s-74 63-88 152h177zM152 256c0 22 1 44 3 64h185c2-20 3-42 3-64s-1-43-3-64H155c-2 21-3 42-3 64zm325-96c-29-68-86-120-158-142 24 34 41 85 50 142h108zM177 18C106 40 48 92 19 160h108c9-57 26-108 50-142zM487 192H373c2 21 3 43 3 64s-1 43-3 64h115c6-20 9-42 9-64s-3-43-8-64zM120 256c0-21 1-43 3-64H9C3 213 0 234 0 256s3 44 9 64h115c-2-21-3-42-3-64zm40 96c15 89 49 152 89 152s74-63 89-152h-177zm159 142c71-21 129-74 158-142h-108c-9 57-26 108-50 142zM19 352c29 68 87 120 158 142-24-34-41-85-50-142h-108z"
    	},
    	{
    		name: "apple",
    		path: "M319 269c0-37 16-64 50-85-19-27-47-42-85-45-35-3-74 21-88 21-15 0-49-20-76-20C63 141 4 185 4 274q0 39 14 81c13 37 59 127 107 125 25-1 43-18 76-18 32 0 48 18 76 18 49-1 90-82 103-119-65-31-62-90-62-92zm-57-164c27-32 25-62 24-72-24 1-52 16-68 35-17 20-28 44-26 72 26 2 50-11 70-34z"
    	},
    	{
    		name: "spotify",
    		path: "M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm101 365c-4 0-7-1-11-4-62-38-135-39-207-24-4 1-9 3-12 3-10 0-16-8-16-16 0-10 6-15 14-17 82-18 166-16 237 26 6 4 10 7 10 17s-7 15-15 15zm27-66c-5 0-9-2-12-4-62-37-156-52-239-29-5 1-7 3-12 3-11 0-19-9-19-19s5-18 16-21c28-8 56-14 98-14 65 0 128 16 177 46 8 5 11 11 11 20 0 11-8 20-19 20zm31-76c-5 0-8-1-13-4-71-42-198-53-281-30-4 1-8 3-13 3-13 0-23-10-23-24 0-14 8-21 17-24 35-10 75-15 118-15 73 0 150 15 205 48 8 5 13 11 13 23 0 14-11 23-23 23z"
    	},
    	{
    		name: "amzn",
    		path: "M257 163c-49 2-169 16-169 118 0 110 138 114 184 43 7 10 35 38 45 47l57-56S341 289 341 261V114C341 89 317 32 229 32 141 32 94 87 94 136l74 7c16-49 54-49 54-49 41 0 36 30 36 69zm0 87c0 80-84 68-84 17 0-47 51-57 84-58v41zm136 164c-8 10-70 67-174 67S34 409 10 379c-7-8 1-11 6-8C89 415 203 489 388 401c8-4 13 2 6 12zm40 2c-6 16-16 27-21 31-5 5-9 3-6-4s19-46 13-55c-6-8-37-4-48-3-11 1-13 2-14 0-2-6 22-15 38-17 16-2 41-1 46 6 4 5 0 27-6 43z"
    	},
    	{
    		name: "merch",
    		path: "M631 97L437 0C416 28 372 47 320 47S224 28 204 0L9 97c-8 4-11 14-7 22l57 115c4 8 14 11 22 7l57-28c11-5 23 3 23 14V480c0 18 14 32 32 32h256c18 0 32-14 32-32V226c0-12 12-20 23-14l57 28c8 4 18 22-7L638 118c4-8-18-7-21z"
    	}
    ];

    /* src/micro/tags.svelte generated by Svelte v3.25.1 */
    const file$5 = "src/micro/tags.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (16:12) {#if tags[opt.name]}
    function create_if_block$1(ctx) {
    	let a;
    	let svg;
    	let path;
    	let path_d_value;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", path_d_value = /*opt*/ ctx[1].path);
    			add_location(path, file$5, 16, 70, 388);
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			attr_dev(svg, "class", "svelte-e8dxz");
    			add_location(svg, file$5, 16, 43, 361);
    			attr_dev(a, "href", a_href_value = /*tags*/ ctx[0][/*opt*/ ctx[1].name]);
    			add_location(a, file$5, 16, 18, 336);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, svg);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tags*/ 1 && a_href_value !== (a_href_value = /*tags*/ ctx[0][/*opt*/ ctx[1].name])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(16:12) {#if tags[opt.name]}",
    		ctx
    	});

    	return block;
    }

    // (15:6) {#each options as opt}
    function create_each_block$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*tags*/ ctx[0][/*opt*/ ctx[1].name] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*tags*/ ctx[0][/*opt*/ ctx[1].name]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(15:6) {#each options as opt}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let each_value = options;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(div, "display", "flex");
    			set_style(div, "justify-content", "space-around");
    			add_location(div, file$5, 13, 0, 200);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tags, options*/ 1) {
    				each_value = options;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tags", slots, []);
    	let { tags } = $$props;
    	const writable_props = ["tags"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tags> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("tags" in $$props) $$invalidate(0, tags = $$props.tags);
    	};

    	$$self.$capture_state = () => ({ tags, options });

    	$$self.$inject_state = $$props => {
    		if ("tags" in $$props) $$invalidate(0, tags = $$props.tags);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tags];
    }

    class Tags extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { tags: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tags",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*tags*/ ctx[0] === undefined && !("tags" in props)) {
    			console.warn("<Tags> was created without expected prop 'tags'");
    		}
    	}

    	get tags() {
    		throw new Error("<Tags>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tags(value) {
    		throw new Error("<Tags>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/artists.svelte generated by Svelte v3.25.1 */
    const file$6 = "src/components/artists.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (149:8) {#if art.name == artist}
    function create_if_block$2(ctx) {
    	let li;
    	let img;
    	let img_src_value;
    	let t0;
    	let li_intro;
    	let t1;
    	let div;
    	let t2_value = /*art*/ ctx[7].name + "";
    	let t2;
    	let t3;
    	let button;
    	let current;
    	let if_block = window.innerWidth > 768 && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			img = element("img");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			button = element("button");
    			button.textContent = "Learn More";
    			if (img.src !== (img_src_value = /*art*/ ctx[7].img)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1bjdu3l");
    			add_location(img, file$6, 150, 12, 3789);
    			attr_dev(li, "class", "svelte-1bjdu3l");
    			add_location(li, file$6, 149, 10, 3764);
    			attr_dev(button, "class", "learnMore svelte-1bjdu3l");
    			add_location(button, file$6, 161, 12, 4132);
    			attr_dev(div, "class", "bottomBox svelte-1bjdu3l");
    			add_location(div, file$6, 159, 10, 4073);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, img);
    			append_dev(li, t0);
    			if (if_block) if_block.m(li, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t2);
    			append_dev(div, t3);
    			append_dev(div, button);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*data*/ 1 && img.src !== (img_src_value = /*art*/ ctx[7].img)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (window.innerWidth > 768) if_block.p(ctx, dirty);
    			if ((!current || dirty & /*data*/ 1) && t2_value !== (t2_value = /*art*/ ctx[7].name + "")) set_data_dev(t2, t2_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			if (!li_intro) {
    				add_render_callback(() => {
    					li_intro = create_in_transition(li, fade, {});
    					li_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(149:8) {#if art.name == artist}",
    		ctx
    	});

    	return block;
    }

    // (152:12) {#if window.innerWidth > 768}
    function create_if_block_1(ctx) {
    	let div;
    	let h1;
    	let t0_value = /*art*/ ctx[7].name + "";
    	let t0;
    	let t1;
    	let p;
    	let t2_value = /*art*/ ctx[7].desc + "";
    	let t2;
    	let t3;
    	let tags;
    	let current;

    	tags = new Tags({
    			props: { tags: /*art*/ ctx[7].links },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			create_component(tags.$$.fragment);
    			attr_dev(h1, "class", "svelte-1bjdu3l");
    			add_location(h1, file$6, 153, 16, 3912);
    			add_location(p, file$6, 154, 16, 3948);
    			attr_dev(div, "class", "databox svelte-1bjdu3l");
    			add_location(div, file$6, 152, 14, 3874);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    			append_dev(div, t3);
    			mount_component(tags, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*data*/ 1) && t0_value !== (t0_value = /*art*/ ctx[7].name + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*data*/ 1) && t2_value !== (t2_value = /*art*/ ctx[7].desc + "")) set_data_dev(t2, t2_value);
    			const tags_changes = {};
    			if (dirty & /*data*/ 1) tags_changes.tags = /*art*/ ctx[7].links;
    			tags.$set(tags_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tags.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tags.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(tags);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(152:12) {#if window.innerWidth > 768}",
    		ctx
    	});

    	return block;
    }

    // (148:6) {#each data as art}
    function create_each_block$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*art*/ ctx[7].name == /*artist*/ ctx[1] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*art*/ ctx[7].name == /*artist*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*data, artist*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(148:6) {#each data as art}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let section;
    	let div0;
    	let h1;
    	let span;
    	let t1;
    	let p;
    	let t3;
    	let ul;
    	let div1;
    	let t4;
    	let button0;
    	let svg0;
    	let path0;
    	let t5;
    	let button1;
    	let svg1;
    	let path1;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			h1 = element("h1");
    			span = element("span");
    			span.textContent = "Our Artists.";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro, qui? Lorem\n      ipsum dolor sit amet.";
    			t3 = space();
    			ul = element("ul");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			button0 = element("button");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t5 = space();
    			button1 = element("button");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			attr_dev(span, "class", "level1");
    			add_location(span, file$6, 139, 8, 3397);
    			attr_dev(h1, "class", "svelte-1bjdu3l");
    			add_location(h1, file$6, 139, 4, 3393);
    			set_style(p, "font-size", "1.5em");
    			set_style(p, "font-weight", "400");
    			set_style(p, "padding", "0.25em");
    			add_location(p, file$6, 140, 4, 3447);
    			set_style(div0, "z-index", "1");
    			set_style(div0, "padding", "1em");
    			add_location(div0, file$6, 138, 2, 3350);
    			attr_dev(path0, "d", "M20 30 L8 16 20 2");
    			add_location(path0, file$6, 167, 10, 4311);
    			attr_dev(svg0, "viewBox", "0 0 32 32");
    			attr_dev(svg0, "class", "svelte-1bjdu3l");
    			add_location(svg0, file$6, 166, 8, 4275);
    			attr_dev(button0, "class", "left svelte-1bjdu3l");
    			add_location(button0, file$6, 165, 6, 4229);
    			attr_dev(path1, "d", "M12 30 L24 16 12 2");
    			add_location(path1, file$6, 172, 10, 4463);
    			attr_dev(svg1, "viewBox", "0 0 32 32");
    			attr_dev(svg1, "class", "svelte-1bjdu3l");
    			add_location(svg1, file$6, 171, 8, 4427);
    			attr_dev(button1, "class", "right svelte-1bjdu3l");
    			add_location(button1, file$6, 170, 6, 4379);
    			attr_dev(div1, "class", "artists svelte-1bjdu3l");
    			add_location(div1, file$6, 146, 4, 3673);
    			set_style(ul, "position", "relative");
    			attr_dev(ul, "class", "svelte-1bjdu3l");
    			add_location(ul, file$6, 145, 2, 3636);
    			attr_dev(section, "class", "svelte-1bjdu3l");
    			add_location(section, file$6, 137, 0, 3338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(div0, h1);
    			append_dev(h1, span);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(section, t3);
    			append_dev(section, ul);
    			append_dev(ul, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t4);
    			append_dev(div1, button0);
    			append_dev(button0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div1, t5);
    			append_dev(div1, button1);
    			append_dev(button1, svg1);
    			append_dev(svg1, path1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*left*/ ctx[2], false, false, false),
    					listen_dev(button1, "click", /*right*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data, window, artist*/ 3) {
    				each_value = /*data*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, t4);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Artists", slots, []);
    	let { data } = $$props;
    	var x = setInterval(() => right(), 3000);

    	const artists = data.map(el => {
    		return el.name;
    	});

    	const left = () => {
    		$$invalidate(5, i = (i - 1 + artists.length) % artists.length);
    		clearInterval(x);
    		x = setInterval(() => right(), 3000);
    	};

    	const right = () => {
    		$$invalidate(5, i = (i + 1 + artists.length) % artists.length);
    		clearInterval(x);
    		x = setInterval(() => right(), 3000);
    	};

    	const writable_props = ["data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Artists> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		Tags,
    		data,
    		x,
    		artists,
    		left,
    		right,
    		i,
    		artist
    	});

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    		if ("x" in $$props) x = $$props.x;
    		if ("i" in $$props) $$invalidate(5, i = $$props.i);
    		if ("artist" in $$props) $$invalidate(1, artist = $$props.artist);
    	};

    	let i;
    	let artist;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*i*/ 32) {
    			 $$invalidate(1, artist = artists[i]);
    		}
    	};

    	 $$invalidate(5, i = 0);
    	return [data, artist, left, right];
    }

    class Artists extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Artists",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !("data" in props)) {
    			console.warn("<Artists> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<Artists>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Artists>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/brands.svelte generated by Svelte v3.25.1 */
    const file$7 = "src/components/brands.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (112:8) {:else}
    function create_else_block(ctx) {
    	let li;

    	const block = {
    		c: function create() {
    			li = element("li");
    			set_style(li, "color", "#333");
    			attr_dev(li, "class", "svelte-13dq68i");
    			add_location(li, file$7, 112, 10, 2310);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(112:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (110:8) {#if idx == i}
    function create_if_block_1$1(ctx) {
    	let li;

    	const block = {
    		c: function create() {
    			li = element("li");
    			set_style(li, "color", "orange");
    			attr_dev(li, "class", "svelte-13dq68i");
    			add_location(li, file$7, 110, 10, 2254);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(110:8) {#if idx == i}",
    		ctx
    	});

    	return block;
    }

    // (109:6) {#each data as bnd, idx}
    function create_each_block_1$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*idx*/ ctx[4] == /*i*/ ctx[1]) return create_if_block_1$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(109:6) {#each data as bnd, idx}",
    		ctx
    	});

    	return block;
    }

    // (118:6) {#if idx == i}
    function create_if_block$3(ctx) {
    	let div2;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let t2;
    	let div1;
    	let t3_value = /*bnd*/ ctx[2].desc.slice(0, 180) + "";
    	let t3;
    	let t4;
    	let p;
    	let t6;
    	let div2_intro;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = " ";
    			t2 = space();
    			div1 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			p = element("p");
    			p.textContent = "Learn More";
    			t6 = space();
    			set_style(img, "width", "20%");
    			set_style(img, "max-height", "10em");
    			set_style(img, "flex", "10");
    			set_style(img, "padding", "1em");
    			set_style(img, "object-fit", "contain");
    			if (img.src !== (img_src_value = /*bnd*/ ctx[2].img)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "brandlogo");
    			add_location(img, file$7, 119, 10, 2481);
    			set_style(div0, "flex", "0.25");
    			attr_dev(div0, "class", "bar svelte-13dq68i");
    			add_location(div0, file$7, 123, 10, 2639);
    			attr_dev(p, "class", "learn svelte-13dq68i");
    			add_location(p, file$7, 126, 12, 2817);
    			set_style(div1, "flex", "20");
    			set_style(div1, "padding", "2em 1em");
    			set_style(div1, "font-weight", "500");
    			set_style(div1, "font-size", "1.5em");
    			add_location(div1, file$7, 124, 10, 2697);
    			attr_dev(div2, "class", "slide-content svelte-13dq68i");
    			add_location(div2, file$7, 118, 8, 2435);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, img);
    			append_dev(div2, t0);
    			append_dev(div2, div0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			append_dev(div1, p);
    			append_dev(div2, t6);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && img.src !== (img_src_value = /*bnd*/ ctx[2].img)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*data*/ 1 && t3_value !== (t3_value = /*bnd*/ ctx[2].desc.slice(0, 180) + "")) set_data_dev(t3, t3_value);
    		},
    		i: function intro(local) {
    			if (!div2_intro) {
    				add_render_callback(() => {
    					div2_intro = create_in_transition(div2, fade, {});
    					div2_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(118:6) {#if idx == i}",
    		ctx
    	});

    	return block;
    }

    // (117:4) {#each data as bnd, idx}
    function create_each_block$3(ctx) {
    	let if_block_anchor;
    	let if_block = /*idx*/ ctx[4] == /*i*/ ctx[1] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*idx*/ ctx[4] == /*i*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*i*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			transition_in(if_block);
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(117:4) {#each data as bnd, idx}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let section;
    	let h1;
    	let span;
    	let t1;
    	let p;
    	let t3;
    	let div;
    	let ul;
    	let t4;
    	let each_value_1 = /*data*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let each_value = /*data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			span = element("span");
    			span.textContent = "Our Brands.";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro, qui? Lorem\n    ipsum dolor sit amet.";
    			t3 = space();
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span, "class", "level1");
    			add_location(span, file$7, 101, 6, 1909);
    			attr_dev(h1, "class", "svelte-13dq68i");
    			add_location(h1, file$7, 101, 2, 1905);
    			set_style(p, "font-size", "1.5em");
    			set_style(p, "font-weight", "400");
    			set_style(p, "padding", "0.25em");
    			add_location(p, file$7, 102, 2, 1956);
    			set_style(ul, "position", "relative");
    			attr_dev(ul, "class", "svelte-13dq68i");
    			add_location(ul, file$7, 107, 4, 2157);
    			attr_dev(div, "class", "carousel svelte-13dq68i");
    			add_location(div, file$7, 106, 2, 2130);
    			attr_dev(section, "class", "svelte-13dq68i");
    			add_location(section, file$7, 100, 0, 1893);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(h1, span);
    			append_dev(section, t1);
    			append_dev(section, p);
    			append_dev(section, t3);
    			append_dev(section, div);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(ul, null);
    			}

    			append_dev(div, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*i, data*/ 3) {
    				each_value_1 = /*data*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*data, i*/ 3) {
    				each_value = /*data*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Brands", slots, []);
    	let i = 0;

    	setInterval(
    		() => {
    			$$invalidate(1, i = (i + 1) % data.length);
    		},
    		3000
    	);

    	let { data } = $$props;
    	const writable_props = ["data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Brands> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ fade, i, data });

    	$$self.$inject_state = $$props => {
    		if ("i" in $$props) $$invalidate(1, i = $$props.i);
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, i];
    }

    class Brands extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Brands",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !("data" in props)) {
    			console.warn("<Brands> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<Brands>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Brands>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/team.svelte generated by Svelte v3.25.1 */

    const file$8 = "src/components/team.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (100:4) {#each team as me}
    function create_each_block$4(ctx) {
    	let div4;
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div1;
    	let span0;
    	let t1_value = /*me*/ ctx[1].text.slice(0, 180) + "";
    	let t1;
    	let t2;
    	let div3;
    	let span1;
    	let t3_value = /*me*/ ctx[1].name + "";
    	let t3;
    	let t4;
    	let t5;
    	let t6_value = /*me*/ ctx[1].pos + "";
    	let t6;
    	let t7;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			span0 = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			div3 = element("div");
    			span1 = element("span");
    			t3 = text(t3_value);
    			t4 = text(" |");
    			t5 = space();
    			t6 = text(t6_value);
    			t7 = space();
    			if (img.src !== (img_src_value = /*me*/ ctx[1].img)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*me*/ ctx[1].name);
    			attr_dev(img, "class", "svelte-li6rt2");
    			add_location(img, file$8, 102, 39, 2047);
    			attr_dev(div0, "class", "flip-card-front svelte-li6rt2");
    			add_location(div0, file$8, 102, 10, 2018);
    			set_style(span0, "padding", "1.5em");
    			set_style(span0, "text-align", "left");
    			set_style(span0, "font-weight", "500");
    			set_style(span0, "line-height", "1.5em");
    			add_location(span0, file$8, 104, 12, 2139);
    			attr_dev(div1, "class", "flip-card-back svelte-li6rt2");
    			add_location(div1, file$8, 103, 10, 2098);
    			attr_dev(div2, "class", "flip-card-inner svelte-li6rt2");
    			add_location(div2, file$8, 101, 8, 1978);
    			set_style(span1, "font-weight", "600");
    			set_style(span1, "font-size", "0.9em");
    			add_location(span1, file$8, 111, 10, 2362);
    			attr_dev(div3, "class", "meDeets svelte-li6rt2");
    			add_location(div3, file$8, 110, 8, 2330);
    			attr_dev(div4, "class", "flip-card svelte-li6rt2");
    			add_location(div4, file$8, 100, 6, 1946);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, span0);
    			append_dev(span0, t1);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			append_dev(div3, span1);
    			append_dev(span1, t3);
    			append_dev(span1, t4);
    			append_dev(div3, t5);
    			append_dev(div3, t6);
    			append_dev(div4, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*team*/ 1 && img.src !== (img_src_value = /*me*/ ctx[1].img)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*team*/ 1 && img_alt_value !== (img_alt_value = /*me*/ ctx[1].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*team*/ 1 && t1_value !== (t1_value = /*me*/ ctx[1].text.slice(0, 180) + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*team*/ 1 && t3_value !== (t3_value = /*me*/ ctx[1].name + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*team*/ 1 && t6_value !== (t6_value = /*me*/ ctx[1].pos + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(100:4) {#each team as me}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let section;
    	let h1;
    	let span;
    	let t1;
    	let p;
    	let t3;
    	let div;
    	let each_value = /*team*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			span = element("span");
    			span.textContent = "Bomb Squad.";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Meet the people behind spectal who put the world's toughest machines to\n    shame";
    			t3 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span, "class", "level1");
    			add_location(span, file$8, 93, 6, 1690);
    			attr_dev(h1, "class", "svelte-li6rt2");
    			add_location(h1, file$8, 93, 2, 1686);
    			set_style(p, "font-size", "1.5em");
    			set_style(p, "font-weight", "400");
    			set_style(p, "padding", "0.25em");
    			add_location(p, file$8, 94, 2, 1737);
    			attr_dev(div, "class", "meContainer svelte-li6rt2");
    			add_location(div, file$8, 98, 2, 1891);
    			attr_dev(section, "class", "svelte-li6rt2");
    			add_location(section, file$8, 92, 0, 1674);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(h1, span);
    			append_dev(section, t1);
    			append_dev(section, p);
    			append_dev(section, t3);
    			append_dev(section, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*team*/ 1) {
    				each_value = /*team*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Team", slots, []);
    	let { team = [] } = $$props;
    	const writable_props = ["team"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Team> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("team" in $$props) $$invalidate(0, team = $$props.team);
    	};

    	$$self.$capture_state = () => ({ team });

    	$$self.$inject_state = $$props => {
    		if ("team" in $$props) $$invalidate(0, team = $$props.team);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [team];
    }

    class Team extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { team: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Team",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get team() {
    		throw new Error("<Team>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set team(value) {
    		throw new Error("<Team>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, basedir, module) {
    	return module = {
    	  path: basedir,
    	  exports: {},
    	  require: function (path, base) {
          return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
        }
    	}, fn(module, module.exports), module.exports;
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    var siema_min = createCommonjsModule(function (module, exports) {
    !function(e,t){module.exports=t();}("undefined"!=typeof self?self:commonjsGlobal,function(){return function(e){function t(r){if(i[r])return i[r].exports;var n=i[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,t),n.l=!0,n.exports}var i={};return t.m=e,t.c=i,t.d=function(e,i,r){t.o(e,i)||Object.defineProperty(e,i,{configurable:!1,enumerable:!0,get:r});},t.n=function(e){var i=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(i,"a",i),i},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,i){function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s=function(){function e(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r);}}return function(t,i,r){return i&&e(t.prototype,i),r&&e(t,r),t}}(),l=function(){function e(t){var i=this;if(r(this,e),this.config=e.mergeSettings(t),this.selector="string"==typeof this.config.selector?document.querySelector(this.config.selector):this.config.selector,null===this.selector)throw new Error("Something wrong with your selector 😭");this.resolveSlidesNumber(),this.selectorWidth=this.selector.offsetWidth,this.innerElements=[].slice.call(this.selector.children),this.currentSlide=this.config.loop?this.config.startIndex%this.innerElements.length:Math.max(0,Math.min(this.config.startIndex,this.innerElements.length-this.perPage)),this.transformProperty=e.webkitOrNot(),["resizeHandler","touchstartHandler","touchendHandler","touchmoveHandler","mousedownHandler","mouseupHandler","mouseleaveHandler","mousemoveHandler","clickHandler"].forEach(function(e){i[e]=i[e].bind(i);}),this.init();}return s(e,[{key:"attachEvents",value:function(){window.addEventListener("resize",this.resizeHandler),this.config.draggable&&(this.pointerDown=!1,this.drag={startX:0,endX:0,startY:0,letItGo:null,preventClick:!1},this.selector.addEventListener("touchstart",this.touchstartHandler),this.selector.addEventListener("touchend",this.touchendHandler),this.selector.addEventListener("touchmove",this.touchmoveHandler),this.selector.addEventListener("mousedown",this.mousedownHandler),this.selector.addEventListener("mouseup",this.mouseupHandler),this.selector.addEventListener("mouseleave",this.mouseleaveHandler),this.selector.addEventListener("mousemove",this.mousemoveHandler),this.selector.addEventListener("click",this.clickHandler));}},{key:"detachEvents",value:function(){window.removeEventListener("resize",this.resizeHandler),this.selector.removeEventListener("touchstart",this.touchstartHandler),this.selector.removeEventListener("touchend",this.touchendHandler),this.selector.removeEventListener("touchmove",this.touchmoveHandler),this.selector.removeEventListener("mousedown",this.mousedownHandler),this.selector.removeEventListener("mouseup",this.mouseupHandler),this.selector.removeEventListener("mouseleave",this.mouseleaveHandler),this.selector.removeEventListener("mousemove",this.mousemoveHandler),this.selector.removeEventListener("click",this.clickHandler);}},{key:"init",value:function(){this.attachEvents(),this.selector.style.overflow="hidden",this.selector.style.direction=this.config.rtl?"rtl":"ltr",this.buildSliderFrame(),this.config.onInit.call(this);}},{key:"buildSliderFrame",value:function(){var e=this.selectorWidth/this.perPage,t=this.config.loop?this.innerElements.length+2*this.perPage:this.innerElements.length;this.sliderFrame=document.createElement("div"),this.sliderFrame.style.width=e*t+"px",this.enableTransition(),this.config.draggable&&(this.selector.style.cursor="-webkit-grab");var i=document.createDocumentFragment();if(this.config.loop)for(var r=this.innerElements.length-this.perPage;r<this.innerElements.length;r++){var n=this.buildSliderFrameItem(this.innerElements[r].cloneNode(!0));i.appendChild(n);}for(var s=0;s<this.innerElements.length;s++){var l=this.buildSliderFrameItem(this.innerElements[s]);i.appendChild(l);}if(this.config.loop)for(var o=0;o<this.perPage;o++){var a=this.buildSliderFrameItem(this.innerElements[o].cloneNode(!0));i.appendChild(a);}this.sliderFrame.appendChild(i),this.selector.innerHTML="",this.selector.appendChild(this.sliderFrame),this.slideToCurrent();}},{key:"buildSliderFrameItem",value:function(e){var t=document.createElement("div");return t.style.cssFloat=this.config.rtl?"right":"left",t.style.float=this.config.rtl?"right":"left",t.style.width=(this.config.loop?100/(this.innerElements.length+2*this.perPage):100/this.innerElements.length)+"%",t.appendChild(e),t}},{key:"resolveSlidesNumber",value:function(){if("number"==typeof this.config.perPage)this.perPage=this.config.perPage;else if("object"===n(this.config.perPage)){this.perPage=1;for(var e in this.config.perPage)window.innerWidth>=e&&(this.perPage=this.config.perPage[e]);}}},{key:"prev",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments[1];if(!(this.innerElements.length<=this.perPage)){var i=this.currentSlide;if(this.config.loop){if(this.currentSlide-e<0){this.disableTransition();var r=this.currentSlide+this.innerElements.length,n=this.perPage,s=r+n,l=(this.config.rtl?1:-1)*s*(this.selectorWidth/this.perPage),o=this.config.draggable?this.drag.endX-this.drag.startX:0;this.sliderFrame.style[this.transformProperty]="translate3d("+(l+o)+"px, 0, 0)",this.currentSlide=r-e;}else this.currentSlide=this.currentSlide-e;}else this.currentSlide=Math.max(this.currentSlide-e,0);i!==this.currentSlide&&(this.slideToCurrent(this.config.loop),this.config.onChange.call(this),t&&t.call(this));}}},{key:"next",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments[1];if(!(this.innerElements.length<=this.perPage)){var i=this.currentSlide;if(this.config.loop){if(this.currentSlide+e>this.innerElements.length-this.perPage){this.disableTransition();var r=this.currentSlide-this.innerElements.length,n=this.perPage,s=r+n,l=(this.config.rtl?1:-1)*s*(this.selectorWidth/this.perPage),o=this.config.draggable?this.drag.endX-this.drag.startX:0;this.sliderFrame.style[this.transformProperty]="translate3d("+(l+o)+"px, 0, 0)",this.currentSlide=r+e;}else this.currentSlide=this.currentSlide+e;}else this.currentSlide=Math.min(this.currentSlide+e,this.innerElements.length-this.perPage);i!==this.currentSlide&&(this.slideToCurrent(this.config.loop),this.config.onChange.call(this),t&&t.call(this));}}},{key:"disableTransition",value:function(){this.sliderFrame.style.webkitTransition="all 0ms "+this.config.easing,this.sliderFrame.style.transition="all 0ms "+this.config.easing;}},{key:"enableTransition",value:function(){this.sliderFrame.style.webkitTransition="all "+this.config.duration+"ms "+this.config.easing,this.sliderFrame.style.transition="all "+this.config.duration+"ms "+this.config.easing;}},{key:"goTo",value:function(e,t){if(!(this.innerElements.length<=this.perPage)){var i=this.currentSlide;this.currentSlide=this.config.loop?e%this.innerElements.length:Math.min(Math.max(e,0),this.innerElements.length-this.perPage),i!==this.currentSlide&&(this.slideToCurrent(),this.config.onChange.call(this),t&&t.call(this));}}},{key:"slideToCurrent",value:function(e){var t=this,i=this.config.loop?this.currentSlide+this.perPage:this.currentSlide,r=(this.config.rtl?1:-1)*i*(this.selectorWidth/this.perPage);e?requestAnimationFrame(function(){requestAnimationFrame(function(){t.enableTransition(),t.sliderFrame.style[t.transformProperty]="translate3d("+r+"px, 0, 0)";});}):this.sliderFrame.style[this.transformProperty]="translate3d("+r+"px, 0, 0)";}},{key:"updateAfterDrag",value:function(){var e=(this.config.rtl?-1:1)*(this.drag.endX-this.drag.startX),t=Math.abs(e),i=this.config.multipleDrag?Math.ceil(t/(this.selectorWidth/this.perPage)):1,r=e>0&&this.currentSlide-i<0,n=e<0&&this.currentSlide+i>this.innerElements.length-this.perPage;e>0&&t>this.config.threshold&&this.innerElements.length>this.perPage?this.prev(i):e<0&&t>this.config.threshold&&this.innerElements.length>this.perPage&&this.next(i),this.slideToCurrent(r||n);}},{key:"resizeHandler",value:function(){this.resolveSlidesNumber(),this.currentSlide+this.perPage>this.innerElements.length&&(this.currentSlide=this.innerElements.length<=this.perPage?0:this.innerElements.length-this.perPage),this.selectorWidth=this.selector.offsetWidth,this.buildSliderFrame();}},{key:"clearDrag",value:function(){this.drag={startX:0,endX:0,startY:0,letItGo:null,preventClick:this.drag.preventClick};}},{key:"touchstartHandler",value:function(e){-1!==["TEXTAREA","OPTION","INPUT","SELECT"].indexOf(e.target.nodeName)||(e.stopPropagation(),this.pointerDown=!0,this.drag.startX=e.touches[0].pageX,this.drag.startY=e.touches[0].pageY);}},{key:"touchendHandler",value:function(e){e.stopPropagation(),this.pointerDown=!1,this.enableTransition(),this.drag.endX&&this.updateAfterDrag(),this.clearDrag();}},{key:"touchmoveHandler",value:function(e){if(e.stopPropagation(),null===this.drag.letItGo&&(this.drag.letItGo=Math.abs(this.drag.startY-e.touches[0].pageY)<Math.abs(this.drag.startX-e.touches[0].pageX)),this.pointerDown&&this.drag.letItGo){e.preventDefault(),this.drag.endX=e.touches[0].pageX,this.sliderFrame.style.webkitTransition="all 0ms "+this.config.easing,this.sliderFrame.style.transition="all 0ms "+this.config.easing;var t=this.config.loop?this.currentSlide+this.perPage:this.currentSlide,i=t*(this.selectorWidth/this.perPage),r=this.drag.endX-this.drag.startX,n=this.config.rtl?i+r:i-r;this.sliderFrame.style[this.transformProperty]="translate3d("+(this.config.rtl?1:-1)*n+"px, 0, 0)";}}},{key:"mousedownHandler",value:function(e){-1!==["TEXTAREA","OPTION","INPUT","SELECT"].indexOf(e.target.nodeName)||(e.preventDefault(),e.stopPropagation(),this.pointerDown=!0,this.drag.startX=e.pageX);}},{key:"mouseupHandler",value:function(e){e.stopPropagation(),this.pointerDown=!1,this.selector.style.cursor="-webkit-grab",this.enableTransition(),this.drag.endX&&this.updateAfterDrag(),this.clearDrag();}},{key:"mousemoveHandler",value:function(e){if(e.preventDefault(),this.pointerDown){"A"===e.target.nodeName&&(this.drag.preventClick=!0),this.drag.endX=e.pageX,this.selector.style.cursor="-webkit-grabbing",this.sliderFrame.style.webkitTransition="all 0ms "+this.config.easing,this.sliderFrame.style.transition="all 0ms "+this.config.easing;var t=this.config.loop?this.currentSlide+this.perPage:this.currentSlide,i=t*(this.selectorWidth/this.perPage),r=this.drag.endX-this.drag.startX,n=this.config.rtl?i+r:i-r;this.sliderFrame.style[this.transformProperty]="translate3d("+(this.config.rtl?1:-1)*n+"px, 0, 0)";}}},{key:"mouseleaveHandler",value:function(e){this.pointerDown&&(this.pointerDown=!1,this.selector.style.cursor="-webkit-grab",this.drag.endX=e.pageX,this.drag.preventClick=!1,this.enableTransition(),this.updateAfterDrag(),this.clearDrag());}},{key:"clickHandler",value:function(e){this.drag.preventClick&&e.preventDefault(),this.drag.preventClick=!1;}},{key:"remove",value:function(e,t){if(e<0||e>=this.innerElements.length)throw new Error("Item to remove doesn't exist 😭");var i=e<this.currentSlide,r=this.currentSlide+this.perPage-1===e;(i||r)&&this.currentSlide--,this.innerElements.splice(e,1),this.buildSliderFrame(),t&&t.call(this);}},{key:"insert",value:function(e,t,i){if(t<0||t>this.innerElements.length+1)throw new Error("Unable to inset it at this index 😭");if(-1!==this.innerElements.indexOf(e))throw new Error("The same item in a carousel? Really? Nope 😭");var r=t<=this.currentSlide>0&&this.innerElements.length;this.currentSlide=r?this.currentSlide+1:this.currentSlide,this.innerElements.splice(t,0,e),this.buildSliderFrame(),i&&i.call(this);}},{key:"prepend",value:function(e,t){this.insert(e,0),t&&t.call(this);}},{key:"append",value:function(e,t){this.insert(e,this.innerElements.length+1),t&&t.call(this);}},{key:"destroy",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=arguments[1];if(this.detachEvents(),this.selector.style.cursor="auto",e){for(var i=document.createDocumentFragment(),r=0;r<this.innerElements.length;r++)i.appendChild(this.innerElements[r]);this.selector.innerHTML="",this.selector.appendChild(i),this.selector.removeAttribute("style");}t&&t.call(this);}}],[{key:"mergeSettings",value:function(e){var t={selector:".siema",duration:200,easing:"ease-out",perPage:1,startIndex:0,draggable:!0,multipleDrag:!0,threshold:20,loop:!1,rtl:!1,onInit:function(){},onChange:function(){}},i=e;for(var r in i)t[r]=i[r];return t}},{key:"webkitOrNot",value:function(){return "string"==typeof document.documentElement.style.transform?"transform":"WebkitTransform"}}]),e}();t.default=l,e.exports=t.default;}])});
    });

    /* node_modules/.pnpm/@beyonk/svelte-carousel@2.8.0/node_modules/@beyonk/svelte-carousel/src/Carousel.svelte generated by Svelte v3.25.1 */
    const file$9 = "node_modules/.pnpm/@beyonk/svelte-carousel@2.8.0/node_modules/@beyonk/svelte-carousel/src/Carousel.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[31] = list[i];
    	child_ctx[33] = i;
    	return child_ctx;
    }

    const get_right_control_slot_changes = dirty => ({});
    const get_right_control_slot_context = ctx => ({});
    const get_left_control_slot_changes = dirty => ({});
    const get_left_control_slot_context = ctx => ({});

    // (6:1) {#if controls}
    function create_if_block_1$2(ctx) {
    	let button0;
    	let t;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;
    	const left_control_slot_template = /*#slots*/ ctx[23]["left-control"];
    	const left_control_slot = create_slot(left_control_slot_template, ctx, /*$$scope*/ ctx[22], get_left_control_slot_context);
    	const right_control_slot_template = /*#slots*/ ctx[23]["right-control"];
    	const right_control_slot = create_slot(right_control_slot_template, ctx, /*$$scope*/ ctx[22], get_right_control_slot_context);

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			if (left_control_slot) left_control_slot.c();
    			t = space();
    			button1 = element("button");
    			if (right_control_slot) right_control_slot.c();
    			attr_dev(button0, "class", "left svelte-1ppqxio");
    			attr_dev(button0, "aria-label", "left");
    			add_location(button0, file$9, 6, 1, 105);
    			attr_dev(button1, "class", "right svelte-1ppqxio");
    			attr_dev(button1, "aria-label", "right");
    			add_location(button1, file$9, 9, 1, 209);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);

    			if (left_control_slot) {
    				left_control_slot.m(button0, null);
    			}

    			insert_dev(target, t, anchor);
    			insert_dev(target, button1, anchor);

    			if (right_control_slot) {
    				right_control_slot.m(button1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*left*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*right*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (left_control_slot) {
    				if (left_control_slot.p && dirty[0] & /*$$scope*/ 4194304) {
    					update_slot(left_control_slot, left_control_slot_template, ctx, /*$$scope*/ ctx[22], dirty, get_left_control_slot_changes, get_left_control_slot_context);
    				}
    			}

    			if (right_control_slot) {
    				if (right_control_slot.p && dirty[0] & /*$$scope*/ 4194304) {
    					update_slot(right_control_slot, right_control_slot_template, ctx, /*$$scope*/ ctx[22], dirty, get_right_control_slot_changes, get_right_control_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(left_control_slot, local);
    			transition_in(right_control_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(left_control_slot, local);
    			transition_out(right_control_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (left_control_slot) left_control_slot.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(button1);
    			if (right_control_slot) right_control_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(6:1) {#if controls}",
    		ctx
    	});

    	return block;
    }

    // (14:4) {#if dots}
    function create_if_block$4(ctx) {
    	let ul;
    	let each_value = { length: /*totalDots*/ ctx[9] };
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-1ppqxio");
    			add_location(ul, file$9, 14, 1, 339);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*isDotActive, currentIndex, go, currentPerPage, totalDots*/ 868) {
    				each_value = { length: /*totalDots*/ ctx[9] };
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(14:4) {#if dots}",
    		ctx
    	});

    	return block;
    }

    // (16:2) {#each {length: totalDots} as _, i}
    function create_each_block$5(ctx) {
    	let li;
    	let li_class_value;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[25](/*i*/ ctx[33], ...args);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");

    			attr_dev(li, "class", li_class_value = "" + (null_to_empty(/*isDotActive*/ ctx[2](/*currentIndex*/ ctx[6], /*i*/ ctx[33])
    			? "active"
    			: "") + " svelte-1ppqxio"));

    			add_location(li, file$9, 16, 2, 384);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*currentIndex*/ 64 && li_class_value !== (li_class_value = "" + (null_to_empty(/*isDotActive*/ ctx[2](/*currentIndex*/ ctx[6], /*i*/ ctx[33])
    			? "active"
    			: "") + " svelte-1ppqxio"))) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(16:2) {#each {length: totalDots} as _, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[23].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[22], null);
    	let if_block0 = /*controls*/ ctx[1] && create_if_block_1$2(ctx);
    	let if_block1 = /*dots*/ ctx[0] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div0, "class", "slides");
    			add_location(div0, file$9, 2, 1, 25);
    			attr_dev(div1, "class", "carousel svelte-1ppqxio");
    			add_location(div1, file$9, 1, 0, 1);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div0_binding*/ ctx[24](div0);
    			append_dev(div1, t0);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t1);
    			if (if_block1) if_block1.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 4194304) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[22], dirty, null, null);
    				}
    			}

    			if (/*controls*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*controls*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div1, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*dots*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$4(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			/*div0_binding*/ ctx[24](null);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Carousel", slots, ['default','left-control','right-control']);
    	let { perPage = 3 } = $$props;
    	let { loop = true } = $$props;
    	let { autoplay = 0 } = $$props;
    	let { duration = 200 } = $$props;
    	let { easing = "ease-out" } = $$props;
    	let { startIndex = 0 } = $$props;
    	let { draggable = true } = $$props;
    	let { multipleDrag = true } = $$props;
    	let { dots = true } = $$props;
    	let { controls = true } = $$props;
    	let { threshold = 20 } = $$props;
    	let { rtl = false } = $$props;
    	let currentIndex = startIndex;
    	let siema;
    	let controller;
    	let timer;
    	const dispatch = createEventDispatcher();

    	onMount(() => {
    		$$invalidate(26, controller = new siema_min({
    				selector: siema,
    				perPage: typeof perPage === "object" ? perPage : Number(perPage),
    				loop,
    				duration,
    				easing,
    				startIndex,
    				draggable,
    				multipleDrag,
    				threshold,
    				rtl,
    				onChange: handleChange
    			}));

    		if (autoplay) {
    			timer = setInterval(right, autoplay);
    		}

    		return () => {
    			autoplay && clearInterval(timer);
    			controller.destroy();
    		};
    	});

    	function isDotActive(currentIndex, dotIndex) {
    		if (currentIndex < 0) currentIndex = pips.length + currentIndex;
    		return currentIndex >= dotIndex * currentPerPage && currentIndex < dotIndex * currentPerPage + currentPerPage;
    	}

    	function left() {
    		controller.prev();
    	}

    	function right() {
    		controller.next();
    	}

    	function go(index) {
    		controller.goTo(index);
    	}

    	function pause() {
    		clearInterval(timer);
    	}

    	function resume() {
    		if (autoplay) {
    			timer = setInterval(right, autoplay);
    		}
    	}

    	function handleChange(event) {
    		$$invalidate(6, currentIndex = controller.currentSlide);

    		dispatch("change", {
    			currentSlide: controller.currentSlide,
    			slideCount: controller.innerElements.length
    		});
    	}

    	const writable_props = [
    		"perPage",
    		"loop",
    		"autoplay",
    		"duration",
    		"easing",
    		"startIndex",
    		"draggable",
    		"multipleDrag",
    		"dots",
    		"controls",
    		"threshold",
    		"rtl"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Carousel> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			siema = $$value;
    			$$invalidate(7, siema);
    		});
    	}

    	const click_handler = i => go(i * currentPerPage);

    	$$self.$$set = $$props => {
    		if ("perPage" in $$props) $$invalidate(10, perPage = $$props.perPage);
    		if ("loop" in $$props) $$invalidate(11, loop = $$props.loop);
    		if ("autoplay" in $$props) $$invalidate(12, autoplay = $$props.autoplay);
    		if ("duration" in $$props) $$invalidate(13, duration = $$props.duration);
    		if ("easing" in $$props) $$invalidate(14, easing = $$props.easing);
    		if ("startIndex" in $$props) $$invalidate(15, startIndex = $$props.startIndex);
    		if ("draggable" in $$props) $$invalidate(16, draggable = $$props.draggable);
    		if ("multipleDrag" in $$props) $$invalidate(17, multipleDrag = $$props.multipleDrag);
    		if ("dots" in $$props) $$invalidate(0, dots = $$props.dots);
    		if ("controls" in $$props) $$invalidate(1, controls = $$props.controls);
    		if ("threshold" in $$props) $$invalidate(18, threshold = $$props.threshold);
    		if ("rtl" in $$props) $$invalidate(19, rtl = $$props.rtl);
    		if ("$$scope" in $$props) $$invalidate(22, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Siema: siema_min,
    		onMount,
    		createEventDispatcher,
    		perPage,
    		loop,
    		autoplay,
    		duration,
    		easing,
    		startIndex,
    		draggable,
    		multipleDrag,
    		dots,
    		controls,
    		threshold,
    		rtl,
    		currentIndex,
    		siema,
    		controller,
    		timer,
    		dispatch,
    		isDotActive,
    		left,
    		right,
    		go,
    		pause,
    		resume,
    		handleChange,
    		pips,
    		currentPerPage,
    		totalDots
    	});

    	$$self.$inject_state = $$props => {
    		if ("perPage" in $$props) $$invalidate(10, perPage = $$props.perPage);
    		if ("loop" in $$props) $$invalidate(11, loop = $$props.loop);
    		if ("autoplay" in $$props) $$invalidate(12, autoplay = $$props.autoplay);
    		if ("duration" in $$props) $$invalidate(13, duration = $$props.duration);
    		if ("easing" in $$props) $$invalidate(14, easing = $$props.easing);
    		if ("startIndex" in $$props) $$invalidate(15, startIndex = $$props.startIndex);
    		if ("draggable" in $$props) $$invalidate(16, draggable = $$props.draggable);
    		if ("multipleDrag" in $$props) $$invalidate(17, multipleDrag = $$props.multipleDrag);
    		if ("dots" in $$props) $$invalidate(0, dots = $$props.dots);
    		if ("controls" in $$props) $$invalidate(1, controls = $$props.controls);
    		if ("threshold" in $$props) $$invalidate(18, threshold = $$props.threshold);
    		if ("rtl" in $$props) $$invalidate(19, rtl = $$props.rtl);
    		if ("currentIndex" in $$props) $$invalidate(6, currentIndex = $$props.currentIndex);
    		if ("siema" in $$props) $$invalidate(7, siema = $$props.siema);
    		if ("controller" in $$props) $$invalidate(26, controller = $$props.controller);
    		if ("timer" in $$props) timer = $$props.timer;
    		if ("pips" in $$props) pips = $$props.pips;
    		if ("currentPerPage" in $$props) $$invalidate(8, currentPerPage = $$props.currentPerPage);
    		if ("totalDots" in $$props) $$invalidate(9, totalDots = $$props.totalDots);
    	};

    	let pips;
    	let currentPerPage;
    	let totalDots;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*controller*/ 67108864) {
    			 pips = controller ? controller.innerElements : [];
    		}

    		if ($$self.$$.dirty[0] & /*controller, perPage*/ 67109888) {
    			 $$invalidate(8, currentPerPage = controller ? controller.perPage : perPage);
    		}

    		if ($$self.$$.dirty[0] & /*controller, currentPerPage*/ 67109120) {
    			 $$invalidate(9, totalDots = controller
    			? Math.ceil(controller.innerElements.length / currentPerPage)
    			: []);
    		}
    	};

    	return [
    		dots,
    		controls,
    		isDotActive,
    		left,
    		right,
    		go,
    		currentIndex,
    		siema,
    		currentPerPage,
    		totalDots,
    		perPage,
    		loop,
    		autoplay,
    		duration,
    		easing,
    		startIndex,
    		draggable,
    		multipleDrag,
    		threshold,
    		rtl,
    		pause,
    		resume,
    		$$scope,
    		slots,
    		div0_binding,
    		click_handler
    	];
    }

    class Carousel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$9,
    			create_fragment$9,
    			safe_not_equal,
    			{
    				perPage: 10,
    				loop: 11,
    				autoplay: 12,
    				duration: 13,
    				easing: 14,
    				startIndex: 15,
    				draggable: 16,
    				multipleDrag: 17,
    				dots: 0,
    				controls: 1,
    				threshold: 18,
    				rtl: 19,
    				isDotActive: 2,
    				left: 3,
    				right: 4,
    				go: 5,
    				pause: 20,
    				resume: 21
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Carousel",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get perPage() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set perPage(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loop() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loop(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoplay() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoplay(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get easing() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set easing(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get startIndex() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set startIndex(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get draggable() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set draggable(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multipleDrag() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multipleDrag(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dots() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dots(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get controls() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set controls(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get threshold() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set threshold(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rtl() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rtl(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDotActive() {
    		return this.$$.ctx[2];
    	}

    	set isDotActive(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get left() {
    		return this.$$.ctx[3];
    	}

    	set left(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get right() {
    		return this.$$.ctx[4];
    	}

    	set right(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get go() {
    		return this.$$.ctx[5];
    	}

    	set go(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pause() {
    		return this.$$.ctx[20];
    	}

    	set pause(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get resume() {
    		return this.$$.ctx[21];
    	}

    	set resume(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/.pnpm/svelte-feather-icons@3.2.2/node_modules/svelte-feather-icons/src/icons/ChevronLeftIcon.svelte generated by Svelte v3.25.1 */

    const file$a = "node_modules/.pnpm/svelte-feather-icons@3.2.2/node_modules/svelte-feather-icons/src/icons/ChevronLeftIcon.svelte";

    function create_fragment$a(ctx) {
    	let svg;
    	let polyline;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			polyline = svg_element("polyline");
    			attr_dev(polyline, "points", "15 18 9 12 15 6");
    			add_location(polyline, file$a, 12, 237, 493);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "class", svg_class_value = "feather feather-chevron-left " + /*customClass*/ ctx[1]);
    			add_location(svg, file$a, 12, 0, 256);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, polyline);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*customClass*/ 2 && svg_class_value !== (svg_class_value = "feather feather-chevron-left " + /*customClass*/ ctx[1])) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ChevronLeftIcon", slots, []);
    	let { size = "100%" } = $$props;
    	let { class: customClass = "" } = $$props;

    	if (size !== "100%") {
    		size = size.slice(-1) === "x"
    		? size.slice(0, size.length - 1) + "em"
    		: parseInt(size) + "px";
    	}

    	const writable_props = ["size", "class"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ChevronLeftIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("class" in $$props) $$invalidate(1, customClass = $$props.class);
    	};

    	$$self.$capture_state = () => ({ size, customClass });

    	$$self.$inject_state = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("customClass" in $$props) $$invalidate(1, customClass = $$props.customClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, customClass];
    }

    class ChevronLeftIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { size: 0, class: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChevronLeftIcon",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get size() {
    		throw new Error("<ChevronLeftIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ChevronLeftIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<ChevronLeftIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ChevronLeftIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/.pnpm/svelte-feather-icons@3.2.2/node_modules/svelte-feather-icons/src/icons/ChevronRightIcon.svelte generated by Svelte v3.25.1 */

    const file$b = "node_modules/.pnpm/svelte-feather-icons@3.2.2/node_modules/svelte-feather-icons/src/icons/ChevronRightIcon.svelte";

    function create_fragment$b(ctx) {
    	let svg;
    	let polyline;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			polyline = svg_element("polyline");
    			attr_dev(polyline, "points", "9 18 15 12 9 6");
    			add_location(polyline, file$b, 12, 238, 494);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "class", svg_class_value = "feather feather-chevron-right " + /*customClass*/ ctx[1]);
    			add_location(svg, file$b, 12, 0, 256);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, polyline);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*customClass*/ 2 && svg_class_value !== (svg_class_value = "feather feather-chevron-right " + /*customClass*/ ctx[1])) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ChevronRightIcon", slots, []);
    	let { size = "100%" } = $$props;
    	let { class: customClass = "" } = $$props;

    	if (size !== "100%") {
    		size = size.slice(-1) === "x"
    		? size.slice(0, size.length - 1) + "em"
    		: parseInt(size) + "px";
    	}

    	const writable_props = ["size", "class"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ChevronRightIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("class" in $$props) $$invalidate(1, customClass = $$props.class);
    	};

    	$$self.$capture_state = () => ({ size, customClass });

    	$$self.$inject_state = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("customClass" in $$props) $$invalidate(1, customClass = $$props.customClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, customClass];
    }

    class ChevronRightIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { size: 0, class: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChevronRightIcon",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get size() {
    		throw new Error("<ChevronRightIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ChevronRightIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<ChevronRightIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ChevronRightIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/tmons.svelte generated by Svelte v3.25.1 */
    const file$c = "src/components/tmons.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (67:4) <span class="control" slot="left-control">
    function create_left_control_slot(ctx) {
    	let span;
    	let chevronlefticon;
    	let current;
    	chevronlefticon = new ChevronLeftIcon({ $$inline: true });

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(chevronlefticon.$$.fragment);
    			attr_dev(span, "class", "control svelte-ymw1gl");
    			attr_dev(span, "slot", "left-control");
    			add_location(span, file$c, 66, 4, 1356);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(chevronlefticon, span, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevronlefticon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevronlefticon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			destroy_component(chevronlefticon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_left_control_slot.name,
    		type: "slot",
    		source: "(67:4) <span class=\\\"control\\\" slot=\\\"left-control\\\">",
    		ctx
    	});

    	return block;
    }

    // (70:4) {#each tmons as tmn}
    function create_each_block$6(ctx) {
    	let div;
    	let h2;
    	let t0_value = /*tmn*/ ctx[1].text.slice(0, 180) + "";
    	let t0;
    	let t1;
    	let p;
    	let t2_value = /*tmn*/ ctx[1].name + "";
    	let t2;
    	let t3;
    	let span;
    	let t4;
    	let t5_value = /*tmn*/ ctx[1].via + "";
    	let t5;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			span = element("span");
    			t4 = text(", ");
    			t5 = text(t5_value);
    			attr_dev(h2, "class", "tmonText svelte-ymw1gl");
    			add_location(h2, file$c, 71, 8, 1504);
    			set_style(span, "font-weight", "600");
    			set_style(span, "font-size", "0.9em");
    			add_location(span, file$c, 74, 10, 1612);
    			attr_dev(p, "class", "tmnBy svelte-ymw1gl");
    			add_location(p, file$c, 72, 8, 1563);
    			attr_dev(div, "class", "slide-content svelte-ymw1gl");
    			add_location(div, file$c, 70, 6, 1468);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t0);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, span);
    			append_dev(span, t4);
    			append_dev(span, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tmons*/ 1 && t0_value !== (t0_value = /*tmn*/ ctx[1].text.slice(0, 180) + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*tmons*/ 1 && t2_value !== (t2_value = /*tmn*/ ctx[1].name + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*tmons*/ 1 && t5_value !== (t5_value = /*tmn*/ ctx[1].via + "")) set_data_dev(t5, t5_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(70:4) {#each tmons as tmn}",
    		ctx
    	});

    	return block;
    }

    // (79:4) <span class="control" slot="right-control">
    function create_right_control_slot(ctx) {
    	let span;
    	let chevronrighticon;
    	let current;
    	chevronrighticon = new ChevronRightIcon({ $$inline: true });

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(chevronrighticon.$$.fragment);
    			attr_dev(span, "class", "control svelte-ymw1gl");
    			attr_dev(span, "slot", "right-control");
    			add_location(span, file$c, 78, 4, 1721);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(chevronrighticon, span, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevronrighticon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevronrighticon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			destroy_component(chevronrighticon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_right_control_slot.name,
    		type: "slot",
    		source: "(79:4) <span class=\\\"control\\\" slot=\\\"right-control\\\">",
    		ctx
    	});

    	return block;
    }

    // (66:2) <Carousel perPage="1">
    function create_default_slot(ctx) {
    	let t0;
    	let t1;
    	let each_value = /*tmons*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tmons*/ 1) {
    				each_value = /*tmons*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t1.parentNode, t1);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(66:2) <Carousel perPage=\\\"1\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let section;
    	let h1;
    	let t1;
    	let carousel;
    	let current;

    	carousel = new Carousel({
    			props: {
    				perPage: "1",
    				$$slots: {
    					default: [create_default_slot],
    					"right-control": [create_right_control_slot],
    					"left-control": [create_left_control_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "Testimonials";
    			t1 = space();
    			create_component(carousel.$$.fragment);
    			attr_dev(h1, "class", "title svelte-ymw1gl");
    			add_location(h1, file$c, 64, 2, 1291);
    			attr_dev(section, "class", "tmonCar svelte-ymw1gl");
    			add_location(section, file$c, 63, 0, 1263);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(section, t1);
    			mount_component(carousel, section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const carousel_changes = {};

    			if (dirty & /*$$scope, tmons*/ 17) {
    				carousel_changes.$$scope = { dirty, ctx };
    			}

    			carousel.$set(carousel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(carousel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(carousel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(carousel);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tmons", slots, []);
    	let { tmons = [] } = $$props;
    	const writable_props = ["tmons"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tmons> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("tmons" in $$props) $$invalidate(0, tmons = $$props.tmons);
    	};

    	$$self.$capture_state = () => ({
    		tmons,
    		Carousel,
    		ChevronLeftIcon,
    		ChevronRightIcon
    	});

    	$$self.$inject_state = $$props => {
    		if ("tmons" in $$props) $$invalidate(0, tmons = $$props.tmons);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tmons];
    }

    class Tmons extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { tmons: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tmons",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get tmons() {
    		throw new Error("<Tmons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tmons(value) {
    		throw new Error("<Tmons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/contact.svelte generated by Svelte v3.25.1 */

    const file$d = "src/components/contact.svelte";

    function create_fragment$d(ctx) {
    	let section;
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
    			section = element("section");
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
    			add_location(span0, file$d, 43, 6, 618);
    			attr_dev(h1, "class", "svelte-18200ka");
    			add_location(h1, file$d, 43, 2, 614);
    			set_style(p, "font-size", "1.5em");
    			set_style(p, "font-weight", "400");
    			set_style(p, "padding", "0.25em");
    			add_location(p, file$d, 44, 2, 667);
    			attr_dev(path0, "d", "M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z");
    			add_location(path0, file$d, 54, 35, 1014);
    			attr_dev(svg0, "viewBox", "0 0 512 512");
    			attr_dev(svg0, "class", "svelte-18200ka");
    			add_location(svg0, file$d, 54, 8, 987);
    			add_location(div0, file$d, 53, 6, 973);
    			set_style(span1, "font-weight", "700");
    			set_style(span1, "line-height", "2em");
    			add_location(span1, file$d, 58, 8, 1292);
    			add_location(br0, file$d, 59, 8, 1370);
    			add_location(span2, file$d, 60, 8, 1385);
    			add_location(div1, file$d, 57, 6, 1278);
    			attr_dev(div2, "class", "deet svelte-18200ka");
    			set_style(div2, "align-items", "center");
    			set_style(div2, "margin", "0 auto");
    			set_style(div2, "text-align", "center");
    			add_location(div2, file$d, 50, 4, 876);
    			add_location(br1, file$d, 63, 4, 1432);
    			attr_dev(path1, "d", "M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z");
    			add_location(path1, file$d, 69, 35, 1602);
    			attr_dev(svg1, "viewBox", "0 0 384 512");
    			attr_dev(svg1, "class", "svelte-18200ka");
    			add_location(svg1, file$d, 69, 8, 1575);
    			add_location(div3, file$d, 68, 6, 1561);
    			set_style(span3, "font-weight", "700");
    			set_style(span3, "line-height", "2em");
    			add_location(span3, file$d, 73, 8, 1911);
    			add_location(br2, file$d, 74, 8, 1991);
    			add_location(span4, file$d, 75, 8, 2006);
    			add_location(div4, file$d, 72, 6, 1897);
    			attr_dev(div5, "class", "deet svelte-18200ka");
    			set_style(div5, "align-items", "center");
    			set_style(div5, "margin", "0 auto");
    			set_style(div5, "text-align", "center");
    			add_location(div5, file$d, 65, 4, 1464);
    			add_location(br3, file$d, 77, 10, 2050);
    			attr_dev(path2, "d", "M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z");
    			add_location(path2, file$d, 83, 35, 2219);
    			attr_dev(svg2, "viewBox", "0 0 512 512");
    			attr_dev(svg2, "class", "svelte-18200ka");
    			add_location(svg2, file$d, 83, 8, 2192);
    			add_location(div6, file$d, 82, 6, 2178);
    			set_style(span5, "font-weight", "700");
    			set_style(span5, "line-height", "2em");
    			add_location(span5, file$d, 87, 8, 2548);
    			add_location(br4, file$d, 88, 8, 2626);
    			add_location(span6, file$d, 89, 8, 2641);
    			add_location(div7, file$d, 86, 6, 2534);
    			attr_dev(div8, "class", "deet svelte-18200ka");
    			set_style(div8, "align-items", "center");
    			set_style(div8, "margin", "0 auto");
    			set_style(div8, "text-align", "center");
    			add_location(div8, file$d, 79, 4, 2081);
    			attr_dev(div9, "class", "details svelte-18200ka");
    			add_location(div9, file$d, 48, 2, 831);
    			attr_dev(section, "class", "svelte-18200ka");
    			add_location(section, file$d, 42, 0, 602);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(h1, span0);
    			append_dev(section, t1);
    			append_dev(section, p);
    			append_dev(section, t3);
    			append_dev(section, div9);
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
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { details: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$d.name
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
    var about = {
    	big: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit, vitae. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, recusandae. Lorem ipsum dolor sit amet ",
    	small: " corporis nulla voluptas laudantium, sunt fugiat nihil atque. Molestiae, at? Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, odit! Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil natus eius tenetur fuga pariatur magni."
    };
    var events = [
    	{
    		name: "Shows",
    		value: 100
    	},
    	{
    		name: "Artists",
    		value: 50
    	},
    	{
    		name: "Cities",
    		value: 80
    	},
    	{
    		name: "Audience",
    		value: "1L"
    	}
    ];
    var contact = {
    	email: "support.spectalmanagement.com",
    	phone: "+91 98765 43210",
    	address: "BITS Pilani, KK Birla Goa Campus"
    };
    var team = [
    	{
    		name: "Urvi Varmani",
    		pos: "Social Media",
    		img: "./assets/team/chow.jpeg",
    		text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, suscipit? Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, suscipit?"
    	},
    	{
    		name: "Himanshu Chowdhary",
    		pos: "Founder",
    		img: "./assets/team/chow.jpeg",
    		text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, suscipit? Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, suscipit?"
    	},
    	{
    		name: "Riddhi Diwan",
    		pos: "Artist Manager",
    		img: "./assets/team/chow.jpeg",
    		text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, suscipit? Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, suscipit?"
    	}
    ];
    var tmons = [
    	{
    		name: "Siddhesh Dalvi",
    		via: "Waves 2019",
    		text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, suscipit?"
    	},
    	{
    		name: "Akshat Adarsh",
    		via: "Twitter",
    		text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, suscipit?"
    	},
    	{
    		name: "Debapriya Kar",
    		via: "Instagram",
    		text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, suscipit? Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, suscipit? This makes it 180 chars."
    	},
    	{
    		name: "Test Name",
    		via: "Facebook",
    		text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, suscipit?"
    	}
    ];
    var brands = [
    	{
    		name: "Realme",
    		img: "../assets/brands/realme.png",
    		desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora tenetur veniam optio corporis magnam corrupti!. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora tenetur veniam optio corporis magnam corrupti! magnam corrupti elit. Tempora tenetu!"
    	},
    	{
    		name: "Gaana",
    		img: "../assets/brands/gaana.png",
    		desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora tenetur veniam optio corporis magnam corrupti! magnam corrupti elit. Tempora tenetu!"
    	},
    	{
    		name: "Monster",
    		img: "../assets/brands/monster.png",
    		desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora tenetur veniam optio corporis magnam corrupti! magnam corrupti elit. Tempora tenetu!"
    	}
    ];
    var artists = [
    	{
    		name: "The Local Train",
    		img: "./assets/artists/tlt.png",
    		desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora tenetur veniam optio corporis magnam corrupti!. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora tenetur veniam optio corporis magnam corrupti! magnam corrupti elit. Tempora tenetu!",
    		links: {
    			apple: "insta",
    			spotify: "insta",
    			amzn: "insta",
    			learn: "insta",
    			insta: "insta",
    			fb: "insta",
    			twt: "insta",
    			web: "insta",
    			merch: "insta"
    		}
    	},
    	{
    		name: "When Chai Met Toast",
    		img: "../assets/brands/gaana.png",
    		desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora tenetur veniam optio corporis magnam corrupti! magnam corrupti elit. Tempora tenetu!",
    		links: {
    			apple: "insta",
    			spotify: "insta",
    			amzn: "insta",
    			learn: "insta",
    			insta: "insta",
    			fb: "insta",
    			twt: "insta"
    		}
    	}
    ];
    var data = {
    	socials: socials,
    	about: about,
    	events: events,
    	contact: contact,
    	team: team,
    	tmons: tmons,
    	brands: brands,
    	artists: artists
    };

    /* src/App.svelte generated by Svelte v3.25.1 */
    const file$e = "src/App.svelte";

    function create_fragment$e(ctx) {
    	let main;
    	let navbar;
    	let t0;
    	let video;
    	let t1;
    	let about;
    	let t2;
    	let events;
    	let t3;
    	let artists;
    	let t4;
    	let brands;
    	let t5;
    	let tmons;
    	let t6;
    	let team;
    	let t7;
    	let contact;
    	let current;

    	navbar = new Navbar({
    			props: { socials: data.socials },
    			$$inline: true
    		});

    	video = new Video({ $$inline: true });

    	about = new About({
    			props: { data: data.about },
    			$$inline: true
    		});

    	events = new Events({
    			props: { data: data.events },
    			$$inline: true
    		});

    	artists = new Artists({
    			props: { data: data.artists },
    			$$inline: true
    		});

    	brands = new Brands({
    			props: { data: data.brands },
    			$$inline: true
    		});

    	tmons = new Tmons({
    			props: { tmons: data.tmons },
    			$$inline: true
    		});

    	team = new Team({
    			props: { team: data.team },
    			$$inline: true
    		});

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
    			create_component(about.$$.fragment);
    			t2 = space();
    			create_component(events.$$.fragment);
    			t3 = space();
    			create_component(artists.$$.fragment);
    			t4 = space();
    			create_component(brands.$$.fragment);
    			t5 = space();
    			create_component(tmons.$$.fragment);
    			t6 = space();
    			create_component(team.$$.fragment);
    			t7 = space();
    			create_component(contact.$$.fragment);
    			add_location(main, file$e, 16, 0, 514);
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
    			mount_component(about, main, null);
    			append_dev(main, t2);
    			mount_component(events, main, null);
    			append_dev(main, t3);
    			mount_component(artists, main, null);
    			append_dev(main, t4);
    			mount_component(brands, main, null);
    			append_dev(main, t5);
    			mount_component(tmons, main, null);
    			append_dev(main, t6);
    			mount_component(team, main, null);
    			append_dev(main, t7);
    			mount_component(contact, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(video.$$.fragment, local);
    			transition_in(about.$$.fragment, local);
    			transition_in(events.$$.fragment, local);
    			transition_in(artists.$$.fragment, local);
    			transition_in(brands.$$.fragment, local);
    			transition_in(tmons.$$.fragment, local);
    			transition_in(team.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(video.$$.fragment, local);
    			transition_out(about.$$.fragment, local);
    			transition_out(events.$$.fragment, local);
    			transition_out(artists.$$.fragment, local);
    			transition_out(brands.$$.fragment, local);
    			transition_out(tmons.$$.fragment, local);
    			transition_out(team.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			destroy_component(video);
    			destroy_component(about);
    			destroy_component(events);
    			destroy_component(artists);
    			destroy_component(brands);
    			destroy_component(tmons);
    			destroy_component(team);
    			destroy_component(contact);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Navbar,
    		Video,
    		About,
    		Events,
    		Artists,
    		Brands,
    		Team,
    		Tmons,
    		Contact,
    		data
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    const app = new App( { target: document.body } );

    return app;

}());
