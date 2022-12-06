import require$$0 from 'http';
import require$$1 from 'fs';

!(function () {
  function e(e) {
    let t = '',
      s = '',
      o = e.indexOf('#');
    o >= 0 && ((t = e.slice(o)), (e = e.slice(0, o)));
    const i = e.indexOf('??');
    return (
      i >= 0
        ? i + 1 !== e.lastIndexOf('?') && (o = e.lastIndexOf('?'))
        : (o = e.indexOf('?')),
      o >= 0 && ((s = e.slice(o)), (e = e.slice(0, o))),
      { url: e, params: s, hash: t }
    );
  }
  function t(t) {
    if (!t) return '';
    let s;
    return (
      ({ url: t } = e(t)),
      (s =
        0 === t.indexOf('file://')
          ? t.replace(new RegExp('^file://(localhost)?'), '')
          : t.replace(new RegExp('^([^:]+:)?//([^:/]+)(:\\d*)?/'), '/')),
      decodeURIComponent(s)
    );
  }
  function s(e, t) {
    if (
      (e = e.replace(/^\/+/, '').toLowerCase()) ===
      (t = t.replace(/^\/+/, '').toLowerCase())
    )
      return 1e4;
    const s = e.split(/\/|\\/).reverse(),
      o = t.split(/\/|\\/).reverse(),
      i = Math.min(s.length, o.length);
    let r = 0;
    for (; r < i && s[r] === o[r]; ) ++r;
    return r;
  }
  function o(e, t) {
    return s(e, t) > 0;
  }
  const i = [
      { selector: 'background', styleNames: ['backgroundImage'] },
      {
        selector: 'border',
        styleNames: ['borderImage', 'webkitBorderImage', 'MozBorderImage'],
      },
    ],
    r = { stylesheetReloadTimeout: 15e3 };
  class n {
    constructor(e) {
      (this.func = e),
        (this.running = !1),
        (this.id = null),
        (this._handler = () => (
          (this.running = !1), (this.id = null), this.func()
        ));
    }
    start(e) {
      this.running && clearTimeout(this.id),
        (this.id = setTimeout(this._handler, e)),
        (this.running = !0);
    }
    stop() {
      this.running &&
        (clearTimeout(this.id), (this.running = !1), (this.id = null));
    }
  }
  n.start = (e, t) => setTimeout(t, e);
  var l = '[MINI SYNC]',
    a = new (class {
      constructor(e, t, s) {
        (this.window = e),
          (this.console = t),
          (this.Timer = s),
          (this.document = this.window.document),
          (this.importCacheWaitPeriod = 200),
          (this.plugins = []);
      }
      addPlugin(e) {
        return this.plugins.push(e);
      }
      analyze(e) {}
      reload(e, t = {}) {
        if (
          ((this.options = { ...r, ...t }),
          this.options.pluginOrder && this.options.pluginOrder.length)
        )
          this.runPluginsByOrder(e, t);
        else {
          for (const s of Array.from(this.plugins))
            if (s.reload && s.reload(e, t)) return;
          if (
            !(
              t.liveCSS &&
              e.match(/\.css(?:\.map)?$/i) &&
              this.reloadStylesheet(e)
            )
          )
            if (t.liveImg && e.match(/\.(jpe?g|png|gif)$/i))
              this.reloadImages(e);
            else {
              if (!t.isChromeExtension) return this.reloadPage();
              this.reloadChromeExtension();
            }
        }
      }
      runPluginsByOrder(e, t) {
        t.pluginOrder.some(
          (s) =>
            !!(
              'css' === s &&
              t.liveCSS &&
              e.match(/\.css(?:\.map)?$/i) &&
              this.reloadStylesheet(e)
            ) ||
            ('img' === s && t.liveImg && e.match(/\.(jpe?g|png|gif)$/i)
              ? (this.reloadImages(e), !0)
              : 'extension' === s && t.isChromeExtension
              ? (this.reloadChromeExtension(), !0)
              : 'others' === s
              ? (this.reloadPage(), !0)
              : 'external' === s
              ? this.plugins.some((s) => {
                  if (s.reload && s.reload(e, t)) return !0;
                })
              : this.plugins
                  .filter((e) => e.constructor.identifier === s)
                  .some((s) => {
                    if (s.reload && s.reload(e, t)) return !0;
                  }))
        );
      }
      reloadPage() {
        return this.window.document.location.reload();
      }
      reloadChromeExtension() {
        return this.window.chrome.runtime.reload();
      }
      reloadImages(e) {
        let s;
        const r = this.generateUniqueString();
        for (s of Array.from(this.document.images))
          o(e, t(s.src)) && (s.src = this.generateCacheBustUrl(s.src, r));
        if (this.document.querySelectorAll)
          for (const { selector: t, styleNames: o } of i)
            for (s of Array.from(
              this.document.querySelectorAll(`[style*=${t}]`)
            ))
              this.reloadStyleImages(s.style, o, e, r);
        if (this.document.styleSheets)
          return Array.from(this.document.styleSheets).map((t) =>
            this.reloadStylesheetImages(t, e, r)
          );
      }
      reloadStylesheetImages(e, t, s) {
        let o;
        try {
          o = (e || {}).cssRules;
        } catch (e) {}
        if (o)
          for (const e of Array.from(o))
            switch (e.type) {
              case CSSRule.IMPORT_RULE:
                this.reloadStylesheetImages(e.styleSheet, t, s);
                break;
              case CSSRule.STYLE_RULE:
                for (const { styleNames: o } of i)
                  this.reloadStyleImages(e.style, o, t, s);
                break;
              case CSSRule.MEDIA_RULE:
                this.reloadStylesheetImages(e, t, s);
            }
      }
      reloadStyleImages(e, s, i, r) {
        for (const n of s) {
          const s = e[n];
          if ('string' == typeof s) {
            const l = s.replace(new RegExp('\\burl\\s*\\(([^)]*)\\)'), (e, s) =>
              o(i, t(s)) ? `url(${this.generateCacheBustUrl(s, r)})` : e
            );
            l !== s && (e[n] = l);
          }
        }
      }
      reloadStylesheet(e) {
        const o = this.options || r;
        let i, n;
        const l = (() => {
            const e = [];
            for (n of Array.from(this.document.getElementsByTagName('link')))
              n.rel.match(/^stylesheet$/i) &&
                !n.__LiveReload_pendingRemoval &&
                e.push(n);
            return e;
          })(),
          a = [];
        for (i of Array.from(this.document.getElementsByTagName('style')))
          i.sheet && this.collectImportedStylesheets(i, i.sheet, a);
        for (n of Array.from(l)) this.collectImportedStylesheets(n, n.sheet, a);
        if (this.window.StyleFix && this.document.querySelectorAll)
          for (i of Array.from(
            this.document.querySelectorAll('style[data-href]')
          ))
            l.push(i);
        this.console.log(
          `LiveReload found ${l.length} LINKed stylesheets, ${a.length} @imported stylesheets`
        );
        const h = (function (e, t, o = (e) => e) {
          let i,
            r = { score: 0 };
          for (const n of t)
            (i = s(e, o(n))), i > r.score && (r = { object: n, score: i });
          return 0 === r.score ? null : r;
        })(e, l.concat(a), (e) => t(this.linkHref(e)));
        if (h)
          h.object.rule
            ? (this.console.log(
                'LiveReload is reloading imported stylesheet: ' + h.object.href
              ),
              this.reattachImportedRule(h.object))
            : (this.console.log(
                'LiveReload is reloading stylesheet: ' + this.linkHref(h.object)
              ),
              this.reattachStylesheetLink(h.object));
        else if (o.reloadMissingCSS)
          for (n of (this.console.log(
            `LiveReload will reload all stylesheets because path '${e}' did not match any specific one. To disable this behavior, set 'options.reloadMissingCSS' to 'false'.`
          ),
          Array.from(l)))
            this.reattachStylesheetLink(n);
        else
          this.console.log(
            `LiveReload will not reload path '${e}' because the stylesheet was not found on the page and 'options.reloadMissingCSS' was set to 'false'.`
          );
        return !0;
      }
      collectImportedStylesheets(e, t, s) {
        let o;
        try {
          o = (t || {}).cssRules;
        } catch (e) {}
        if (o && o.length)
          for (let t = 0; t < o.length; t++) {
            const i = o[t];
            switch (i.type) {
              case CSSRule.CHARSET_RULE:
                continue;
              case CSSRule.IMPORT_RULE:
                s.push({ link: e, rule: i, index: t, href: i.href }),
                  this.collectImportedStylesheets(e, i.styleSheet, s);
            }
          }
      }
      waitUntilCssLoads(e, t) {
        const s = this.options || r;
        let o = !1;
        const i = () => {
          if (!o) return (o = !0), t();
        };
        if (
          ((e.onload = () => (
            this.console.log(
              'LiveReload: the new stylesheet has finished loading'
            ),
            (this.knownToSupportCssOnLoad = !0),
            i()
          )),
          !this.knownToSupportCssOnLoad)
        ) {
          let t;
          (t = () =>
            e.sheet
              ? (this.console.log(
                  'LiveReload is polling until the new CSS finishes loading...'
                ),
                i())
              : this.Timer.start(50, t))();
        }
        return this.Timer.start(s.stylesheetReloadTimeout, i);
      }
      linkHref(e) {
        return e.href || (e.getAttribute && e.getAttribute('data-href'));
      }
      reattachStylesheetLink(e) {
        let t;
        if (e.__LiveReload_pendingRemoval) return;
        (e.__LiveReload_pendingRemoval = !0),
          'STYLE' === e.tagName
            ? ((t = this.document.createElement('link')),
              (t.rel = 'stylesheet'),
              (t.media = e.media),
              (t.disabled = e.disabled))
            : (t = e.cloneNode(!1)),
          (t.href = this.generateCacheBustUrl(this.linkHref(e)));
        const s = e.parentNode;
        return (
          s.lastChild === e
            ? s.appendChild(t)
            : s.insertBefore(t, e.nextSibling),
          this.waitUntilCssLoads(t, () => {
            let s;
            return (
              (s = /AppleWebKit/.test(this.window.navigator.userAgent)
                ? 5
                : 200),
              this.Timer.start(s, () => {
                if (e.parentNode)
                  return (
                    e.parentNode.removeChild(e),
                    (t.onreadystatechange = null),
                    this.window.StyleFix ? this.window.StyleFix.link(t) : void 0
                  );
              })
            );
          })
        );
      }
      reattachImportedRule({ rule: e, index: t, link: s }) {
        const o = e.parentStyleSheet,
          i = this.generateCacheBustUrl(e.href),
          r = e.media.length ? [].join.call(e.media, ', ') : '',
          n = `@import url("${i}") ${r};`;
        e.__LiveReload_newHref = i;
        const l = this.document.createElement('link');
        return (
          (l.rel = 'stylesheet'),
          (l.href = i),
          (l.__LiveReload_pendingRemoval = !0),
          s.parentNode && s.parentNode.insertBefore(l, s),
          this.Timer.start(this.importCacheWaitPeriod, () => {
            if (
              (l.parentNode && l.parentNode.removeChild(l),
              e.__LiveReload_newHref === i)
            )
              return (
                o.insertRule(n, t),
                o.deleteRule(t + 1),
                ((e = o.cssRules[t]).__LiveReload_newHref = i),
                this.Timer.start(this.importCacheWaitPeriod, () => {
                  if (e.__LiveReload_newHref === i)
                    return o.insertRule(n, t), o.deleteRule(t + 1);
                })
              );
          })
        );
      }
      generateUniqueString() {
        return 'livereload=' + Date.now();
      }
      generateCacheBustUrl(t, s) {
        const o = this.options || r;
        let i, n;
        if (
          (s || (s = this.generateUniqueString()),
          ({ url: t, hash: i, params: n } = e(t)),
          o.overrideURL && t.indexOf(o.serverURL) < 0)
        ) {
          const e = t;
          (t = o.serverURL + o.overrideURL + '?url=' + encodeURIComponent(t)),
            this.console.log(
              `LiveReload is overriding source URL ${e} with ${t}`
            );
        }
        let l = n.replace(/(\?|&)livereload=(\d+)/, (e, t) => `${t}${s}`);
        return (
          l === n && (l = 0 === n.length ? '?' + s : `${n}&${s}`), t + l + i
        );
      }
    })(window, { log: function () {} }, n),
    h = { liveCSS: !0, liveImg: !0 };
  !(function e() {
    var t = new EventSource(
      'http://' +
        window.location.hostname +
        ':' +
        window.location.port +
        '/__mini_sync__'
    );
    t.addEventListener('open', function () {
      console.info('%s Development server has connected.', l);
    }),
      t.addEventListener('error', function (s) {
        var o = t.readyState,
          i = o === EventSource.CONNECTING,
          r = o === EventSource.CLOSED;
        i || r
          ? (console.info('%s Lost connection. Trying to reconnect...', l),
            r && (t.close(), setTimeout(e, 1e4)))
          : console.error(s);
      }),
      t.addEventListener('reload', function (e) {
        var t = JSON.parse(e.data).file || '';
        t
          ? console.info('%s Reloading "%s".', l, t)
          : console.info('%s Reloading entire page.', l),
          a.reload(t, h);
      });
  })();
})();

function e({ modulePath: e = '.', importFunctionName: t = '__import__' } = {}) {
  try {
    self[t] = new Function('u', 'return import(u)');
  } catch (o) {
    const r = new URL(e, location),
      n = (e) => {
        URL.revokeObjectURL(e.src), e.remove();
      };
    (self[t] = (e) =>
      new Promise((o, a) => {
        const c = new URL(e, r);
        if (self[t].moduleMap[c]) return o(self[t].moduleMap[c]);
        const l = new Blob(
            [`import * as m from '${c}';`, `${t}.moduleMap['${c}']=m;`],
            { type: 'text/javascript' }
          ),
          m = Object.assign(document.createElement('script'), {
            type: 'module',
            src: URL.createObjectURL(l),
            onerror() {
              a(new Error(`Failed to import: ${e}`)), n(m);
            },
            onload() {
              o(self[t].moduleMap[c]), n(m);
            },
          });
        document.head.appendChild(m);
      })),
      (self[t].moduleMap = {});
  }
}
var t = Object.freeze({ initialize: e });

// This needs to be done before any dynamic imports are used
t.initialize({ modulePath: 'scripts/' });

var http = require$$0;
var fs = require$$1;
http
  .createServer(function (req, res) {
    fs.readFile('../_data/day-one-data.txt', function (err, data) {
      res.writeHead(200, {
        'Content-Type': 'text/html',
      });
    });
  })
  .listen(8080);
const file = '../_data/day-four-data.txt';
fs.readFile(file, function (err, data) {
  if (err) throw err;

  // read in text file, split on double line breaks.
  //each grouping of values represents one elf's inventory
  const raw = data.toString().split('\n');
  // console.log(raw)

  // DAY FOUR: Camp Cleanup
  // In how many assignment pairs does one range fully contain the other?

  const assignments = raw
    .map((d) => {
      return d.split(',', 2);
    })
    .map((d) => {
      let start = d[0].split('-', 2);
      let end = d[1].split('-', 2);
      return [start, end];
    });
  function rangeComparison(a) {
    let A = parseInt(a[0][0]);
    let B = parseInt(a[0][1]);
    let C = parseInt(a[1][0]);
    let D = parseInt(a[1][1]);

    //console.log(matches.length);

    if (A <= C && D <= B) {
      return 1;
    } else {
      return 0;
    }
  }
  let overlappingAssignments = 0;
  assignments.forEach((d) => {
    overlappingAssignments += rangeComparison(d);
  });
  console.log(overlappingAssignments); //413
});
//# sourceMappingURL=app.js.map
