/* SCEditor v1.4.5 | (C) 2011-2013, Sam Clarke | sceditor.com/license */
!function (a, b, c){
    "use strict";
    var d = a.sceditor.escapeEntities, e = a.sceditor.escapeUriScheme, f = a.sceditor.ie, g = f && 11 > f;
    a.sceditor.BBCodeParser = function (b){
        if(!(this instanceof a.sceditor.BBCodeParser))return new a.sceditor.BBCodeParser(b);
        var e, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v = this, w = {
            open: "open", content: "content", newline: "newline", close: "close"
        }, x = function (a, b, c, d, e, f){
            var g = this;
            g.type = a, g.name = b, g.val = c, g.attrs = d || {}, g.children = e || [], g.closing = f || null
        };
        x.prototype = {
            clone: function (a){
                var b = this;
                return new x(b.type, b.name, b.val, b.attrs, a ? b.children : [], b.closing ? b.closing.clone() : null)
            }, splitAt: function (b){
                var c, d = this, e = 0, f = d.children.length;
                if("number" != typeof b && (b = a.inArray(b, d.children)), 0 > b || b > f)return null;
                for(; f--;)f >= b ? e++ : f = 0;
                return c = d.clone(), c.children = d.children.splice(b, e), c
            }
        }, e = function (){
            v.opts = a.extend({}, a.sceditor.BBCodeParser.defaults, b), v.bbcodes = a.sceditor.plugins.bbcode.bbcodes
        }, v.tokenize = function (a){
            var b, c, d, e = [], f = [{type: "close", regex: /^\[\/[^\[\]]+\]/}, {
                type: "open", regex: /^\[[^\[\]]+\]/
            }, {type: "newline", regex: /^(\r\n|\r|\n)/}, {type: "content", regex: /^([^\[\r\n]+|\[)/}];
            f.reverse();
            a:for(; a.length;){
                for(d = f.length; d--;)if(c = f[d].type, (b = a.match(f[d].regex)) && b[0]){
                    e.push(h(c, b[0])), a = a.substr(b[0].length);
                    continue a
                }
                a.length && e.push(h(w.content, a)), a = ""
            }
            return e
        }, h = function (b, c){
            var d, e, f;
            return "open" === b && (d = c.match(/\[([^\]\s=]+)(?:([^\]]+))?\]/)) ? (f = t(d[1]), d[2] && (d[2] = a.trim(d[2])) && (e = i(d[2]))) : "close" === b && (d = c.match(/\[\/([^\[\]]+)\]/)) ? f = t(d[1]) : "newline" === b && (f = "#newline"), f && ("open" !== b && "close" !== b || a.sceditor.plugins.bbcode.bbcodes[f]) || (b = "content", f = "#"), new x(b, f, c, e)
        }, i = function (b){
            var c, d = /([^\s=]+)=(?:(?:(["'])((?:\\\2|[^\2])*?)\2)|((?:.(?!\s\S+=))*.))/g, e = a.sceditor.plugins.bbcode.stripQuotes, f = {};
            if("=" === b.charAt(0) && b.indexOf("=", 1) < 0)f.defaultattr = e(b.substr(1));else for("=" === b.charAt(0) && (b = "defaultattr" + b); c = d.exec(b);)f[t(c[1])] = e(c[3]) || c[4];
            return f
        }, v.parse = function (a, b){
            var c = j(v.tokenize(a));
            return v.opts.fixInvalidChildren && o(c), v.opts.removeEmptyTags && n(c), v.opts.fixInvalidNesting && l(c), k(c, null, b), v.opts.removeEmptyTags && n(c), c
        }, r = function (a, b, c){
            for(var d = c.length; d--;)if(c[d].type === b && c[d].name === a)return !0;
            return !1
        }, m = function (b, c){
            var d = b ? v.bbcodes[b.name] : null, e = d ? d.allowedChildren : null;
            return v.opts.fixInvalidChildren && e && e && a.inArray(c.name || "#", e) < 0 ? !1 : !0
        }, j = function (b){
            for(var c, d, e, f, g, h, i, j = [], k = [], l = [], m = function (){
                return u(l)
            }, n = function (a){
                m() ? m().children.push(a) : k.push(a)
            }, o = function (b){
                return m() && (d = v.bbcodes[m().name]) && d.closedBy && a.inArray(b, d.closedBy) > -1
            }; c = b.shift();){
                switch(i = b[0], c.type){
                    case w.open:
                        o(c.name) && l.pop(), n(c), d = v.bbcodes[c.name], d && d.isSelfClosing || !d.closedBy && !r(c.name, w.close, b) ? d && d.isSelfClosing || (c.type = w.content) : l.push(c);
                        break;
                    case w.close:
                        if(m() && c.name !== m().name && o("/" + c.name) && l.pop(), m() && c.name === m().name)m().closing = c, l.pop();else
                            if(r(c.name, w.open, l)){
                                for(; e = l.pop();){
                                    if(e.name === c.name){
                                        e.closing = c;
                                        break
                                    }
                                    f = e.clone(), j.length > 1 && f.children.push(u(j)), j.push(f)
                                }
                                for(n(u(j)), g = j.length; g--;)l.push(j[g]);
                                j.length = 0
                            }else c.type = w.content, n(c);
                        break;
                    case w.newline:
                        m() && i && o((i.type === w.close ? "/" : "") + i.name) && (i.type !== w.close || i.name !== m().name) && (d = v.bbcodes[m().name], d && d.breakAfter ? l.pop() : d && d.isInline === !1 && v.opts.breakAfterBlock && d.breakAfter !== !1 && l.pop()), n(c);
                        break;
                    default:
                        n(c)
                }
                h = c
            }
            return k
        }, k = function (a, b, c){
            var d, e, f, g, h, i, j, l, m = a.length, n = m;
            for(b && (g = v.bbcodes[b.name]); n--;)if(d = a[n])if(d.type === w.newline){
                if(e = n > 0 ? a[n - 1] : null, f = m - 1 > n ? a[n + 1] : null, l = !1, !c && g && g.isSelfClosing !== !0 && (e ? i || f || (g.isInline === !1 && v.opts.breakEndBlock && g.breakEnd !== !1 && (l = !0), g.breakEnd && (l = !0), i = l) : (g.isInline === !1 && v.opts.breakStartBlock && g.breakStart !== !1 && (l = !0), g.breakStart && (l = !0))), e && e.type === w.open && (h = v.bbcodes[e.name]) && (c ? h.isInline === !1 && (l = !0) : (h.isInline === !1 && v.opts.breakAfterBlock && h.breakAfter !== !1 && (l = !0), h.breakAfter && (l = !0))), !c && !j && f && f.type === w.open && (h = v.bbcodes[f.name]) && (h.isInline === !1 && v.opts.breakBeforeBlock && h.breakBefore !== !1 && (l = !0), h.breakBefore && (l = !0), j = l, l)){
                    a.splice(n, 1);
                    continue
                }
                l && a.splice(n, 1), j = !1
            }else d.type === w.open && k(d.children, d, c)
        }, l = function (b, c, d, e){
            var f, g, h, i, j, k, m = function (a){
                var b = v.bbcodes[a.name];
                return !b || b.isInline !== !1
            };
            for(c = c || [], e = e || b, g = 0; g < b.length; g++)if((f = b[g]) && f.type === w.open){
                if(!m(f) && d && (h = u(c), k = h.splitAt(f), j = c.length > 1 ? c[c.length - 2].children : e, (i = a.inArray(h, j)) > -1))return k.children.splice(a.inArray(f, k.children), 1), void j.splice(i + 1, 0, f, k);
                c.push(f), l(f.children, c, d || m(f), e), c.pop(f)
            }
        }, o = function (a, b){
            for(var c, d, e = a.length; e--;)(c = a[e]) && (m(b, c) || (c.name = null, c.type = w.content, m(b, c) ? (d = [e + 1, 0].concat(c.children), c.closing && (c.closing.name = null, c.closing.type = w.content, d.push(c.closing)), e += d.length - 1, Array.prototype.splice.apply(a, d)) : b.children.splice(e, 1)), c.type === w.open && o(c.children, c))
        }, n = function (b){
            var c, d, e, f = b.length;
            for(e = function (a){
                for(var b = a.length; b--;){
                    if(a[b].type === w.open)return !1;
                    if(a[b].type === w.close)return !1;
                    if(a[b].type === w.content && a[b].val && /\S|\u00A0/.test(a[b].val))return !1
                }
                return !0
            }; f--;)(c = b[f]) && c.type === w.open && (d = v.bbcodes[c.name], n(c.children), e(c.children) && d && !d.isSelfClosing && !d.allowsEmpty && b.splice.apply(b, a.merge([f, 1], c.children)))
        }, v.toHTML = function (a, b){
            return p(v.parse(a, b), !0)
        }, p = function (b, e){
            var h, i, j, k, l, m, n, o, q = [];
            for(n = function (a){
                return (!a || ("undefined" != typeof a.isHtmlInline ? a.isHtmlInline : a.isInline)) !== !1
            }; b.length > 0;)if(h = b.shift()){
                if(h.type === w.open)o = h.children[h.children.length - 1] || {}, i = v.bbcodes[h.name], l = e && n(i), j = p(h.children, !1), i && i.html ? (n(i) || !n(v.bbcodes[o.name]) || i.isPreFormatted || i.skipLastLineBreak || g || (j += "<br />"), a.isFunction(i.html) ? k = i.html.call(v, h, h.attrs, j) : (h.attrs[0] = j, k = a.sceditor.plugins.bbcode.formatBBCodeString(i.html, h.attrs))) : k = h.val + j + (h.closing ? h.closing.val : "");else{
                    if(h.type === w.newline){
                        if(!e){
                            q.push("<br />");
                            continue
                        }
                        m || (q.push("<div>"), (c.documentMode && c.documentMode < 8 || 8 > f) && q.push(" ")), g || q.push("<br />"), b.length || q.push("<br />"), q.push("</div>\n"), m = !1;
                        continue
                    }
                    l = e, k = d(h.val, !0)
                }
                l && !m ? (q.push("<div>"), m = !0) : !l && m && (q.push("</div>\n"), m = !1), q.push(k)
            }
            return m && q.push("</div>\n"), q.join("")
        }, v.toBBCode = function (a, b){
            return q(v.parse(a, b))
        }, q = function (b){
            for(var c, d, e, f, g, h, i, j, k, l, m = []; b.length > 0;)if(c = b.shift())if(e = v.bbcodes[c.name], f = !(!e || e.isInline !== !1), g = e && e.isSelfClosing, i = f && v.opts.breakBeforeBlock && e.breakBefore !== !1 || e && e.breakBefore, j = f && !g && v.opts.breakStartBlock && e.breakStart !== !1 || e && e.breakStart, k = f && v.opts.breakEndBlock && e.breakEnd !== !1 || e && e.breakEnd, l = f && v.opts.breakAfterBlock && e.breakAfter !== !1 || e && e.breakAfter, h = (e ? e.quoteType : null) || v.opts.quoteType || a.sceditor.BBCodeParser.QuoteType.auto, e || c.type !== w.open)if(c.type === w.open){
                if(i && m.push("\n"), m.push("[" + c.name), c.attrs){
                    c.attrs.defaultattr && (m.push("=" + s(c.attrs.defaultattr, h, "defaultattr")), delete c.attrs.defaultattr);
                    for(d in c.attrs)c.attrs.hasOwnProperty(d) && m.push(" " + d + "=" + s(c.attrs[d], h, d))
                }
                m.push("]"), j && m.push("\n"), c.children && m.push(q(c.children)), g || e.excludeClosing || (k && m.push("\n"), m.push("[/" + c.name + "]")), l && m.push("\n"), c.closing && g && m.push(c.closing.val)
            }else m.push(c.val);else m.push(c.val), c.children && m.push(q(c.children)), c.closing && m.push(c.closing.val);
            return m.join("")
        }, s = function (b, c, d){
            var e = a.sceditor.BBCodeParser.QuoteType, f = /\s|=/.test(b);
            return a.isFunction(c) ? c(b, d) : c === e.never || c === e.auto && !f ? b : '"' + b.replace("\\", "\\\\").replace('"', '\\"') + '"'
        }, u = function (a){
            return a.length ? a[a.length - 1] : null
        }, t = function (a){
            return a.toLowerCase()
        }, e()
    }, a.sceditor.BBCodeParser.QuoteType = {
        always: 1, never: 2, auto: 3
    }, a.sceditor.BBCodeParser.defaults = {
        breakBeforeBlock: !1,
        breakStartBlock: !1,
        breakEndBlock: !1,
        breakAfterBlock: !0,
        removeEmptyTags: !0,
        fixInvalidNesting: !0,
        fixInvalidChildren: !0,
        quoteType: a.sceditor.BBCodeParser.QuoteType.auto
    }, a.sceditorBBCodePlugin = a.sceditor.plugins.bbcode = function (){
        var b, d, e, f, h, i, j = this;
        f = a.sceditor.plugins.bbcode.formatString, j.bbcodes = a.sceditor.plugins.bbcode.bbcodes, j.stripQuotes = a.sceditor.plugins.bbcode.stripQuotes;
        var k = {}, l = {}, m = {
            ul: ["li", "ol", "ul"], ol: ["li", "ol", "ul"], table: ["tr"], tr: ["td", "th"], code: ["br", "p", "div"]
        };
        j.init = function (){
            j.opts = this.opts, b(), h(this), this.toBBCode = j.signalToSource, this.fromBBCode = j.signalToWysiwyg
        }, h = function (b){
            var c = a.sceditor.command.get, d = {
                bold: {txtExec: ["[b]", "[/b]"]},
                italic: {txtExec: ["[i]", "[/i]"]},
                underline: {txtExec: ["[u]", "[/u]"]},
                strike: {txtExec: ["[s]", "[/s]"]},
                subscript: {txtExec: ["[sub]", "[/sub]"]},
                superscript: {txtExec: ["[sup]", "[/sup]"]},
                left: {txtExec: ["[left]", "[/left]"]},
                center: {txtExec: ["[center]", "[/center]"]},
                right: {txtExec: ["[right]", "[/right]"]},
                justify: {txtExec: ["[justify]", "[/justify]"]},
                font: {
                    txtExec: function (a){
                        var b = this;
                        c("font")._dropDown(b, a, function (a){
                            b.insertText("[font=" + a + "]", "[/font]")
                        })
                    }
                },
                size: {
                    txtExec: function (a){
                        var b = this;
                        c("size")._dropDown(b, a, function (a){
                            b.insertText("[size=" + a + "]", "[/size]")
                        })
                    }
                },
                color: {
                    txtExec: function (a){
                        var b = this;
                        c("color")._dropDown(b, a, function (a){
                            b.insertText("[color=" + a + "]", "[/color]")
                        })
                    }
                },
                bulletlist: {
                    txtExec: function (c, d){
                        var e = "";
                        a.each(d.split(/\r?\n/), function (){
                            e += (e ? "\n" : "") + "[li]" + this + "[/li]"
                        }), b.insertText("[ul]\n" + e + "\n[/ul]")
                    }
                },
                orderedlist: {
                    txtExec: function (c, d){
                        var e = "";
                        a.each(d.split(/\r?\n/), function (){
                            e += (e ? "\n" : "") + "[li]" + this + "[/li]"
                        }), a.sceditor.plugins.bbcode.bbcode.get(""), b.insertText("[ol]\n" + e + "\n[/ol]")
                    }
                },
                table: {txtExec: ["[table][tr][td]", "[/td][/tr][/table]"]},
                horizontalrule: {txtExec: ["[hr]"]},
                code: {txtExec: ["[code]", "[/code]"]},
                image: {
                    txtExec: function (a, b){
                        var c = prompt(this._("Enter the image URL:"), b);
                        c && this.insertText("[img]" + c + "[/img]")
                    }
                },
                email: {
                    txtExec: function (a, b){
                        var c = b && b.indexOf("@") > -1 ? null : b, d = prompt(this._("Enter the e-mail address:"), c ? "" : b), e = prompt(this._("Enter the displayed text:"), c || d) || d;
                        d && this.insertText("[email=" + d + "]" + e + "[/email]")
                    }
                },
                link: {
                    txtExec: function (b, c){
                        var d = /^[a-z]+:\/\//i.test(a.trim(c)) ? null : c, e = prompt(this._("Enter URL:"), d ? "http://" : a.trim(c)), f = prompt(this._("Enter the displayed text:"), d || e) || e;
                        e && this.insertText("[url=" + e + "]" + f + "[/url]")
                    }
                },
                quote: {txtExec: ["[quote]", "[/quote]"]},
                youtube: {
                    txtExec: function (a){
                        var b = this;
                        c("youtube")._dropDown(b, a, function (a){
                            b.insertText("[youtube]" + a + "[/youtube]")
                        })
                    }
                },
                rtl: {txtExec: ["[rtl]", "[/rtl]"]},
                ltr: {txtExec: ["[ltr]", "[/ltr]"]}
            };
            b.commands = a.extend(!0, {}, d, b.commands)
        }, b = function (){
            a.each(j.bbcodes, function (b){
                j.bbcodes[b].tags && a.each(j.bbcodes[b].tags, function (a, c){
                    var d = j.bbcodes[b].isInline === !1;
                    k[a] = k[a] || {}, k[a][d] = k[a][d] || {}, k[a][d][b] = c
                }), j.bbcodes[b].styles && a.each(j.bbcodes[b].styles, function (a, c){
                    var d = j.bbcodes[b].isInline === !1;
                    l[d] = l[d] || {}, l[d][a] = l[d][a] || {}, l[d][a][b] = c
                })
            })
        }, d = function (b, c, d){
            var e, g, h = a.sceditor.dom.getStyle;
            return d = !!d, l[d] ? (a.each(l[d], function (d, i){
                e = h(b[0], d), e && h(b.parent()[0], d) !== e && a.each(i, function (d, h){
                    (!h || a.inArray(e.toString(), h) > -1) && (g = j.bbcodes[d].format, c = a.isFunction(g) ? g.call(j, b, c) : f(g, c))
                })
            }), c) : c
        }, e = function (b, c, d){
            var e, h, i = b[0], l = i.nodeName.toLowerCase();
            d = !!d, k[l] && k[l][d] && a.each(k[l][d], function (d, g){
                (!g || (e = !1, a.each(g, function (c, d){
                    return !b.attr(c) || d && a.inArray(b.attr(c), d) < 0 ? void 0 : (e = !0, !1)
                }), e)) && (h = j.bbcodes[d].format, c = a.isFunction(h) ? h.call(j, b, c) : f(h, c))
            });
            var m = a.sceditor.dom.isInline;
            if(d && (!m(i, !0) || "br" === l)){
                for(var n = i.parentNode, o = n.lastChild, p = i.previousSibling, q = m(n, !0); p && (a(p).hasClass("sceditor-ignore") || 1 === p.nodeType && m(p, !0) && !p.firstChild);)p = p.previousSibling;
                for(; a(o).hasClass("sceditor-ignore");)o = o.previousSibling;
                (q || o !== i || "li" === l || "br" === l && g) && (c += "\n"), "br" !== l && p && "br" !== p.nodeName.toLowerCase() && m(p, !0) && (c = "\n" + c)
            }
            return c
        }, j.signalToSource = function (b, d){
            var e, f, g = new a.sceditor.BBCodeParser(j.opts.parserOptions);
            return d || ("string" == typeof b ? (e = a("<div />").css("visibility", "hidden").appendTo(c.body).html(b), d = e) : d = a(b)), d && d.jquery ? (a.sceditor.dom.removeWhiteSpace(d[0]), f = j.elementToBbcode(d), e && e.remove(), f = g.toBBCode(f, !0), j.opts.bbcodeTrim && (f = a.trim(f)), f) : ""
        }, j.elementToBbcode = function (b){
            return function c(b, f){
                var h = "";
                return a.sceditor.dom.traverse(b, function (b){
                    var i = a(b), j = "", k = b.nodeType, l = b.nodeName.toLowerCase(), n = m[l], o = b.firstChild, p = !0;
                    if("object" == typeof f && (p = a.inArray(l, f) > -1, i.is("img") && i.data("sceditor-emoticon") && (p = !0), p || (n = f)), 3 === k || 1 === k)if(1 === k){
                        if(i.hasClass("sceditor-ignore"))return;
                        if(i.hasClass("sceditor-nlf") && (!o || !g && 1 === b.childNodes.length && /br/i.test(o.nodeName)))return;
                        "iframe" !== l && (j = c(b, n)), p ? ("code" !== l && (j = d(i, j), j = e(i, j), j = d(i, j, !0)), h += e(i, j, !0)) : h += j
                    }else!b.wholeText || b.previousSibling && 3 === b.previousSibling.nodeType ? b.wholeText || (h += b.nodeValue) : h += 0 === i.parents("code").length ? b.wholeText.replace(/ +/g, " ") : b.wholeText
                }, !1, !0), h
            }(b[0])
        }, j.signalToWysiwyg = function (b, c){
            var d = new a.sceditor.BBCodeParser(j.opts.parserOptions), e = d.toHTML(j.opts.bbcodeTrim ? a.trim(b) : b);
            return c ? i(e) : e
        }, i = function (b){
            var d, e, f, h = a("<div />").hide().appendTo(c.body), i = h[0];
            return f = function (b, d){
                if(!a.sceditor.dom.hasStyling(b)){
                    if(g || 1 !== b.childNodes.length || !a(b.firstChild).is("br"))for(; e = b.firstChild;)i.insertBefore(e, b);
                    if(d){
                        var f = i.lastChild;
                        b !== f && a(f).is("div") && b.nextSibling === f && i.insertBefore(c.createElement("br"), b)
                    }
                    i.removeChild(b)
                }
            }, i.innerHTML = b.replace(/<\/div>\n/g, "</div>"), (d = i.firstChild) && a(d).is("div") && f(d, !0), (d = i.lastChild) && a(d).is("div") && f(d), i = i.innerHTML, h.remove(), i
        }
    }, a.sceditor.plugins.bbcode.stripQuotes = function (a){
        return a ? a.replace(/\\(.)/g, "$1").replace(/^(["'])(.*?)\1$/, "$2") : a
    }, a.sceditor.plugins.bbcode.formatString = function (){
        var a, b = arguments;
        return b[0].replace(/\{(\d+)\}/g, function (c, d){
            return b[d - 0 + 1] !== a ? b[d - 0 + 1] : "{" + d + "}"
        })
    }, a.sceditor.plugins.bbcode.formatBBCodeString = function (a, b){
        return a.replace(/\{(!?[^}]+)\}/g, function (a, c){
            var e, f = !0;
            return "!" === c[0] && (f = !1, c = c.substring(1)), "0" === c[0] && (f = !1), b[c] === e ? a : f ? d(b[c], !0) : b[c]
        })
    };
    var h = a.sceditor.plugins.bbcode.normaliseColour = function (a){
        var b, c;
        return c = function (a){
            return a = parseInt(a, 10), isNaN(a) ? "00" : (a = Math.max(0, Math.min(a, 255)).toString(16), a.length < 2 ? "0" + a : a)
        }, a = a || "#000", (b = a.match(/rgb\((\d{1,3}),\s*?(\d{1,3}),\s*?(\d{1,3})\)/i)) ? "#" + c(b[1]) + c(b[2] - 0) + c(b[3] - 0) : (b = a.match(/#([0-f])([0-f])([0-f])\s*?$/i)) ? "#" + b[1] + b[1] + b[2] + b[2] + b[3] + b[3] : a
    };
    a.sceditor.plugins.bbcode.bbcodes = {
        b: {
            tags: {b: null, strong: null},
            styles: {"font-weight": ["bold", "bolder", "401", "700", "800", "900"]},
            format: "[b]{0}[/b]",
            html: "<strong>{0}</strong>"
        },
        i: {
            tags: {i: null, em: null},
            styles: {"font-style": ["italic", "oblique"]},
            format: "[i]{0}[/i]",
            html: "<em>{0}</em>"
        },
        u: {tags: {u: null}, styles: {"text-decoration": ["underline"]}, format: "[u]{0}[/u]", html: "<u>{0}</u>"},
        s: {
            tags: {s: null, strike: null},
            styles: {"text-decoration": ["line-through"]},
            format: "[s]{0}[/s]",
            html: "<s>{0}</s>"
        },
        sub: {tags: {sub: null}, format: "[sub]{0}[/sub]", html: "<sub>{0}</sub>"},
        sup: {tags: {sup: null}, format: "[sup]{0}[/sup]", html: "<sup>{0}</sup>"},
        font: {
            tags: {font: {face: null}},
            styles: {"font-family": null},
            quoteType: a.sceditor.BBCodeParser.QuoteType.never,
            format: function (a, b){
                var c;
                return "font" === a[0].nodeName.toLowerCase() && (c = a.attr("face")) || (c = a.css("font-family")), "[font=" + this.stripQuotes(c) + "]" + b + "[/font]"
            },
            html: '<font face="{defaultattr}">{0}</font>'
        },
        size: {
            tags: {font: {size: null}}, styles: {"font-size": null}, format: function (a, b){
                var c = a.attr("size"), d = 2;
                return c || (c = a.css("fontSize")), c.indexOf("px") > -1 ? (c = c.replace("px", "") - 0, 12 > c && (d = 1), c > 15 && (d = 3), c > 17 && (d = 4), c > 23 && (d = 5), c > 31 && (d = 6), c > 47 && (d = 7)) : d = c, "[size=" + d + "]" + b + "[/size]"
            }, html: '<font size="{defaultattr}">{!0}</font>'
        },
        color: {
            tags: {font: {color: null}},
            styles: {color: null},
            quoteType: a.sceditor.BBCodeParser.QuoteType.never,
            format: function (a, b){
                var c, d = a[0];
                return "font" === d.nodeName.toLowerCase() && (c = a.attr("color")) || (c = d.style.color || a.css("color")), "[color=" + h(c) + "]" + b + "[/color]"
            },
            html: function (a, b, c){
                return '<font color="' + d(h(b.defaultattr), !0) + '">' + c + "</font>"
            }
        },
        ul: {
            tags: {ul: null},
            breakStart: !0,
            isInline: !1,
            skipLastLineBreak: !0,
            format: "[ul]{0}[/ul]",
            html: "<ul>{0}</ul>"
        },
        list: {breakStart: !0, isInline: !1, skipLastLineBreak: !0, html: "<ul>{0}</ul>"},
        ol: {
            tags: {ol: null},
            breakStart: !0,
            isInline: !1,
            skipLastLineBreak: !0,
            format: "[ol]{0}[/ol]",
            html: "<ol>{0}</ol>"
        },
        li: {
            tags: {li: null},
            isInline: !1,
            closedBy: ["/ul", "/ol", "/list", "*", "li"],
            format: "[li]{0}[/li]",
            html: "<li>{0}</li>"
        },
        "*": {isInline: !1, closedBy: ["/ul", "/ol", "/list", "*", "li"], html: "<li>{0}</li>"},
        table: {
            tags: {table: null},
            isInline: !1,
            isHtmlInline: !0,
            skipLastLineBreak: !0,
            format: "[table]{0}[/table]",
            html: "<table>{0}</table>"
        },
        tr: {tags: {tr: null}, isInline: !1, skipLastLineBreak: !0, format: "[tr]{0}[/tr]", html: "<tr>{0}</tr>"},
        th: {tags: {th: null}, allowsEmpty: !0, isInline: !1, format: "[th]{0}[/th]", html: "<th>{0}</th>"},
        td: {tags: {td: null}, allowsEmpty: !0, isInline: !1, format: "[td]{0}[/td]", html: "<td>{0}</td>"},
        emoticon: {
            allowsEmpty: !0, tags: {img: {src: null, "data-sceditor-emoticon": null}}, format: function (a, b){
                return a.data("sceditor-emoticon") + b
            }, html: "{0}"
        },
        hr: {tags: {hr: null}, allowsEmpty: !0, isSelfClosing: !0, isInline: !1, format: "[hr]{0}", html: "<hr />"},
        img: {
            allowsEmpty: !0,
            tags: {img: {src: null}},
            allowedChildren: ["#"],
            quoteType: a.sceditor.BBCodeParser.QuoteType.never,
            format: function (a, b){
                var c, d, e = "", f = a[0], g = function (a){
                    return f.style ? f.style[a] : null
                };
                return a.attr("data-sceditor-emoticon") ? b : (c = a.attr("width") || g("width"), d = a.attr("height") || g("height"), (f.complete && (c || d) || c && d) && (e = "=" + a.width() + "x" + a.height()), "[img" + e + "]" + a.attr("src") + "[/img]")
            },
            html: function (a, b, c){
                var f, g, h, i, j = "";
                return b.width !== f && (g = b.width), b.height !== f && (h = b.height), b.defaultattr && (i = b.defaultattr.split(/x/i), g = i[0], h = 2 === i.length ? i[1] : i[0]), g !== f && (j += ' width="' + d(g, !0) + '"'), h !== f && (j += ' height="' + d(h, !0) + '"'), "<img" + j + ' src="' + e(c) + '" />'
            }
        },
        url: {
            allowsEmpty: !0,
            tags: {a: {href: null}},
            quoteType: a.sceditor.BBCodeParser.QuoteType.never,
            format: function (a, b){
                var c = a.attr("href");
                return "mailto:" === c.substr(0, 7) ? '[email="' + c.substr(7) + '"]' + b + "[/email]" : "[url=" + c + "]" + b + "[/url]"
            },
            html: function (a, b, c){
                return b.defaultattr = d(b.defaultattr, !0) || c, '<a href="' + e(b.defaultattr) + '">' + c + "</a>"
            }
        },
        email: {
            quoteType: a.sceditor.BBCodeParser.QuoteType.never, html: function (a, b, c){
                return '<a href="mailto:' + (d(b.defaultattr, !0) || c) + '">' + c + "</a>"
            }
        },
        quote: {
            tags: {blockquote: null},
            isInline: !1,
            quoteType: a.sceditor.BBCodeParser.QuoteType.never,
            format: function (b, c){
                var d = "", e = a(b), f = e.children("cite").first();
                return (1 === f.length || e.data("author")) && (d = f.text() || e.data("author"), e.data("author", d), f.remove(), c = this.elementToBbcode(a(b)), d = "=" + d, e.prepend(f)), "[quote" + d + "]" + c + "[/quote]"
            },
            html: function (a, b, c){
                return b.defaultattr && (c = "<cite>" + d(b.defaultattr) + "</cite>" + c), "<blockquote>" + c + "</blockquote>"
            }
        },
        code: {
            tags: {code: null},
            isInline: !1,
            allowedChildren: ["#", "#newline"],
            format: "[code]{0}[/code]",
            html: "<code>{0}</code>"
        },
        left: {
            styles: {"text-align": ["left", "-webkit-left", "-moz-left", "-khtml-left"]},
            isInline: !1,
            format: "[left]{0}[/left]",
            html: '<div align="left">{0}</div>'
        },
        center: {
            styles: {"text-align": ["center", "-webkit-center", "-moz-center", "-khtml-center"]},
            isInline: !1,
            format: "[center]{0}[/center]",
            html: '<div align="center">{0}</div>'
        },
        right: {
            styles: {"text-align": ["right", "-webkit-right", "-moz-right", "-khtml-right"]},
            isInline: !1,
            format: "[right]{0}[/right]",
            html: '<div align="right">{0}</div>'
        },
        justify: {
            styles: {"text-align": ["justify", "-webkit-justify", "-moz-justify", "-khtml-justify"]},
            isInline: !1,
            format: "[justify]{0}[/justify]",
            html: '<div align="justify">{0}</div>'
        },
        youtube: {
            allowsEmpty: !0,
            tags: {iframe: {"data-youtube-id": null}},
            format: function (a, b){
                return a = a.attr("data-youtube-id"), a ? "[youtube]" + a + "[/youtube]" : b
            },
            html: '<iframe width="560" height="315" src="http://www.youtube.com/embed/{0}?wmode=opaque" data-youtube-id="{0}" frameborder="0" allowfullscreen></iframe>'
        },
        rtl: {styles: {direction: ["rtl"]}, format: "[rtl]{0}[/rtl]", html: '<div style="direction: rtl">{0}</div>'},
        ltr: {styles: {direction: ["ltr"]}, format: "[ltr]{0}[/ltr]", html: '<div style="direction: ltr">{0}</div>'},
        ignore: {}
    }, a.sceditor.plugins.bbcode.bbcode = {
        get: function (b){
            return a.sceditor.plugins.bbcode.bbcodes[b] || null
        }, set: function (b, c){
            var d = a.sceditor.plugins.bbcode.bbcodes;
            return b && c ? (c = a.extend(d[b] || {}, c), c.remove = function (){
                delete d[b]
            }, d[b] = c, this) : !1
        }, rename: function (b, c){
            var d = a.sceditor.plugins.bbcode.bbcodes;
            return b in d ? (d[c] = d[b], delete d[b], this) : !1
        }, remove: function (b){
            var c = a.sceditor.plugins.bbcode.bbcodes;
            return b in c && delete c[b], this
        }
    }, a.fn.sceditorBBCodePlugin = function (b){
        return b = b || {}, a.isPlainObject(b) && (b.plugins = (b.plugins ? b.plugins : "") + "bbcode"), this.sceditor(b)
    }
}(jQuery, window, document);