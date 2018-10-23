!
function(t) {
    function e(n) {
        if (i[n]) return i[n].exports;
        var a = i[n] = {
            exports: {},
            id: n,
            loaded: !1
        };
        return t[n].call(a.exports, a, a.exports, e),
        a.loaded = !0,
        a.exports
    }
    var i = {};
    return e.m = t,
    e.c = i,
    e.p = "",
    e(0)
} ([function(t, e) {
    var i = [],
    n = function() {
        function t(t) {
            this.init(t)
        }
        function e(t) {
            if (! (t instanceof Element)) throw Error("DomUtil: elem is not an element.");
            const e = getComputedStyle(t);
            if ("none" === e.display) return ! 1;
            if ("visible" !== e.visibility) return ! 1;
            if (e.opacity < .1) return ! 1;
            if (t.offsetWidth + t.offsetHeight + t.getBoundingClientRect().height + t.getBoundingClientRect().width === 0) return ! 1;
            const i = {
                x: t.getBoundingClientRect().left + t.offsetWidth / 2,
                y: t.getBoundingClientRect().top + t.offsetHeight / 2
            };
            if (i.x < 0) return ! 1;
            if (i.x > (document.documentElement.clientWidth || window.innerWidth)) return ! 1;
            if (i.y < 0) return ! 1;
            if (i.y > (document.documentElement.clientHeight || window.innerHeight)) return ! 1;
            var n = document.elementFromPoint(i.x, i.y);
            do
            if (n === t) return ! 0;
            while (n = n.parentNode);
            return ! 1
        }
        function n() {
            var t;
            return t = window.XMLHttpRequest ? new XMLHttpRequest: new ActiveXObject("Microsoft.XMLHTTP")
        }
        function a() {
            var t = document.getElementsByTagName("script");
            if (t) for (var e = 0; e < t.length; e++) if (t[e].hasAttribute("batmobi-data-adid")) return t[e].getAttribute("batmobi-data-adid");
            return ""
        }
        var r = {},
        o = {
            resolution: 200,
            iframes: [],
            interval: null,
            Iframe: function() {
                this.element = arguments[0],
                this.cb = arguments[1],
                this.hasTracked = !1
            },
            track: function(t, e) {
                if (this.iframes.push(new this.Iframe(t, e)), !this.interval) {
                    var i = this;
                    this.interval = setInterval(function() {
                        i.checkClick()
                    },
                    this.resolution)
                }
            },
            checkClick: function() {
                if (document.activeElement) {
                    var t = document.activeElement;
                    for (var e in this.iframes) t === this.iframes[e].element ? 0 == this.iframes[e].hasTracked && (this.iframes[e].cb.apply(window, []), this.iframes[e].hasTracked = !0) : this.iframes[e].hasTracked = !1
                }
            }
        },
        s = "",
        d = 15e3;
        t.prototype.init = function(t) {
            s = a(),
            this.getAdsData(t)
        },
        t.prototype.get = function(t, e) {
            var i = n();
            i.open("GET", t, !0),
            i.onreadystatechange = function() { (4 == i.readyState && 200 == i.status || 304 == i.status) && e && e.call(this, i.responseText)
            },
            i.send(null)
        },
        t.prototype.post = function(t, e, i) {
            var n = new XMLHttpRequest,
            a = "";
            n.open("POST", t, !0),
            n.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
            n.onreadystatechange = function() {
                4 != n.readyState || 200 != n.status && 304 != n.status || i && i.call(this, n.responseText)
            };
            for (var r in e) a += "&" + r + "=" + e[r];
            a = a.substr(1),
            n.send(a)
        },
        t.prototype.extend = function(t, e) {
            for (var i in e) t[i] = e[i];
            return t
        },
        t.prototype.getAdsData = function(t) {
            for (var i, n = this,
            a = document.querySelectorAll("ins.adsbybatmobi"), r = "http://dsp.batmobil.net/ads-dsp/banner/v1/recommend", o = 0; o < a.length; o++) if (!a[o].attributes["data-isloading"]) {
                i = a[o];
                break
            }
            if (!i) return void(i = document.body);
            if (i.attributes["data-ad-appkey"] && i.attributes["data-ad-appkey"].nodeValue && (t.appkey = i.attributes["data-ad-appkey"].nodeValue), i.attributes["data-ad-placementid"] && i.attributes["data-ad-placementid"].nodeValue && (t.placement_id = i.attributes["data-ad-placementid"].nodeValue), !t.appkey || !t.placement_id) return void console.log("[warn]:pls set data-ad-appkey and data-ad-placementid");
            var c = {
                appkey: t.appkey,
                placement_id: t.placement_id,
                sr: 3,
                pversion: 1,
                request_id: (new Date).getTime(),
                channel: "jssdk",
                local: "US",
                lang: "en",
                sys_name: "5.0.2",
                sys_code: "",
                pkg_name: "com.cool.cleaner",
                cversion: "1",
                cname: "",
                sdk_name: "",
                sdk_code: 200,
                net_type: "WIFI",
                ram: 2014,
                is_tablet: 0,
                operator: "",
                rom: 2,
                cpu: 1,
                mode: "xiaomi",
                tz: 1,
                adv_id: s
            };
            i.setAttribute("data-isloading", !0);
            var l = function() {
                e(i) && n.post(r, c,
                function(e) {
                    var a = JSON.parse(e);
                    return 200 == a.resp_code && a.offer ? (a.stat && a.stat.request_url && n.get(a.stat.request_url), a.offerc && a.offerc.jsl && (d = a.offerc.jsl), i.innerHTML = "", void n.setAdsHtml(a, i)) : (console.log("[adsbybatmobi][ERROR] code:" + a.resp_code + ",msg:" + a.resp_msg), void(t.backfill && t.backfill()))
                })
            };
            l(),
            setInterval(l, d)
        },
        t.prototype.setAdsHtml = function(t, e) {
            var i = t.offer,
            n = document.createElement("div");
            n.className = "adsbybatmobi",
            n.style = "display:block;border:none;height:" + i.h + "px;margin:0;padding:0;position:relative;visibility:visible;width:" + i.w + "px;background-color:transparent";
            var a = document.createElement("iframe");
            a.width = i.w,
            a.height = i.h,
            a.scrolling = "no",
            a.setAttribute("frameborder", 0),
            a.setAttribute("marginwidth", 0),
            a.setAttribute("marginheight", 0),
            a.setAttribute("vspace", 0),
            a.setAttribute("hspace", 0),
            a.setAttribute("allowtransparency", !0),
            a.setAttribute("allowfullscreen", !0),
            a.setAttribute("allowtransparency", !0),
            a.setAttribute("style", "left: 0;position: absolute;top: 0;width: " + i.w + "px;height: " + i.h + "px;"),
            a.srcdoc = i.html,
            e.appendChild(n),
            n.appendChild(a);
            var r = this;
            o.track(a,
            function() {
                i.click_callback_url && r.get(i.click_callback_url)
            }),
            a.onload = function() {
                t.stat && t.stat.imp_url && r.get(t.stat.imp_url)
            }
        };
        var r = {
            load: !0,
            push: function(e) {
                new t(e),
                i.push(e)
            }
        };
        return r
    } ();
    window.adsbybatmobi = n
}]);