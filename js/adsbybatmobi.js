var batmobiAds=[];
var adsbybatmobi = (function () {
  var adsbybatmobi = {};
  function Ads(params) {
//    console.log(params);
    this.init(params);
  }

 function checkVisible(elem) {
    // var rect = elm.getBoundingClientRect();
    // var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    // return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
     if (!(elem instanceof Element)) throw Error('DomUtil: elem is not an element.');
     const style = getComputedStyle(elem);
     if (style.display === 'none') return false;
     if (style.visibility !== 'visible') return false;
     if (style.opacity < 0.1) return false;
     if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
         elem.getBoundingClientRect().width === 0) {
         return false;
     }
     const elemCenter   = {
         x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
         y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
     };
     if (elemCenter.x < 0) return false;
     if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
     if (elemCenter.y < 0) return false;
     if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
     var pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
     do {
         if (pointContainer === elem) return true;
     } while (pointContainer = pointContainer.parentNode);
     return false;
 }

  //iframe click track start
  var IframeOnClick = {
      resolution: 200,
      iframes: [],
      interval: null,
      Iframe: function() {
          this.element = arguments[0];
          this.cb = arguments[1];
          this.hasTracked = false;
      },
      track: function(element, cb) {
          this.iframes.push(new this.Iframe(element, cb));
          if (!this.interval) {
              var _this = this;
              this.interval = setInterval(function() { _this.checkClick(); }, this.resolution);
          }
      },
      checkClick: function() {
          if (document.activeElement) {
              var activeElement = document.activeElement;
              for (var i in this.iframes) {
                  if (activeElement === this.iframes[i].element) { // user is in this Iframe
                      if (this.iframes[i].hasTracked == false) {
                          this.iframes[i].cb.apply(window, []);
                          this.iframes[i].hasTracked = true;
                      }
                  } else {
                      this.iframes[i].hasTracked = false;
                  }
              }
          }
      }
  };
  //iframe click track end

    //获取http对象
  function GetXmlHttpObject(){
    var _xmlhttp;
    if (window.XMLHttpRequest){
      // code for IE7+, Firefox, Chrome, Opera, Safari
      _xmlhttp=new XMLHttpRequest();
    }else{// code for IE6, IE5
      _xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    return _xmlhttp;
  }

  function getAdID() {
      var scriptTags=document.getElementsByTagName('script');
      if(scriptTags){
          for (var i=0;i<scriptTags.length;i++){
             if(scriptTags[i].hasAttribute('batmobi-data-adid')){
                 return scriptTags[i].getAttribute('batmobi-data-adid');
             }
          }
      }
      return '';
  }

  var batmobiAdid='';
  var itrvtime=15000;

  //广告获取初始化
  Ads.prototype.init = function (param) {
      batmobiAdid = getAdID();
      this.getAdsData(param);
  }
  //get
  Ads.prototype.get = function (url, fn) {
    var obj = GetXmlHttpObject();  // XMLHttpRequest对象用于在后台与服务器交换数据
    obj.open('GET', url, true);
    obj.onreadystatechange = function () {
      if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) { // readyState==4说明请求已完成
          if(fn) {
              fn.call(this, obj.responseText);  //从服务器获得数据
          }
      }
    };
    obj.send(null);
  }
  //post
  Ads.prototype.post = function (url,data,fn) {
    var obj = new XMLHttpRequest();
    var params="";
    obj.open("POST", url, true);
    obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // 发送信息至服务器时内容编码类型
    obj.onreadystatechange = function () {
      if (obj.readyState == 4 && (obj.status == 200 || obj.status == 304)) {  // 304未修改
          if(fn) {
              fn.call(this, obj.responseText);
          }
      }
    };
    for(var i in data){
      params += "&"+i+"="+data[i];
    }
    params = params.substr(1);
    obj.send(params);
  }
  //对象扩展
  Ads.prototype.extend = function (json1, json2) {
    for (var i in json2) {
      json1[i] = json2[i];
    }
    return json1;
  }
  //获取广告数据
  Ads.prototype.getAdsData = function (param) {
    var _this = this;
    var parenNode;
    //获取所有盒子节点
    var adsBox = document.querySelectorAll("ins.adsbybatmobi");
	var url = "http://adx.hasmobi.net/ads-dsp/banner/v1/recommend";
    //var url = "https://dsp.batmobi.net/ads-dsp/banner/v1/recommend";
    //获取渲染父节点
    for(var i=0;i<adsBox.length;i++){
      if(!adsBox[i].attributes["data-isloading"]){
        parenNode = adsBox[i];
        break;
      }
    }
    //存在节点存在参数则赋值，否则用js赋值
    if(parenNode){
        if(parenNode.attributes["data-ad-appkey"]) {
            parenNode.attributes["data-ad-appkey"].nodeValue && (param.appkey = parenNode.attributes["data-ad-appkey"].nodeValue);
        }
        if(parenNode.attributes["data-ad-placementid"]) {
            parenNode.attributes["data-ad-placementid"].nodeValue && (param.placement_id = parenNode.attributes["data-ad-placementid"].nodeValue);
        }
    }else {
      parenNode = document.body;
      //如果全部广告已经渲染广告节点不存在就不在加载数据
        return;
    }
    //参数缺少
    if(!param.appkey || !param.placement_id){
      console.log('[warn]:pls set data-ad-appkey and data-ad-placementid');
      return;
    }
    var params = {
      appkey:param.appkey,
      placement_id:param.placement_id,
      sr:3,
      pversion:1,
      request_id:new Date().getTime(),
      channel:'jssdk',
      local:'US',
      lang:"en",
      sys_name:"5.0.2",
      sys_code:"",
      pkg_name:"com.cool.cleaner",
      cversion:"1",
      cname:"",
      sdk_name:"",
      sdk_code:200,
      net_type:"WIFI",
      ram:2014,
      is_tablet:0,
      operator:"",
      rom:2,
      cpu:1,
      mode:"xiaomi",
      tz:1,
      adv_id:batmobiAdid,
      //美国ip,发布时要注释
      //i:"3.0.119.0",
    };
    parenNode.setAttribute("data-isloading",true);
    var loadads=function () {
        if (checkVisible(parenNode)) {
            _this.post(url, params, function (data) {
                var dataObj = JSON.parse(data);
                if (dataObj.resp_code != 200 || !dataObj.offer) {
                    console.log("[adsbybatmobi][ERROR] code:" + dataObj.resp_code + ",msg:" + dataObj.resp_msg);
                    if(param.backfill){
                        param.backfill();
                    }
                    return;
                }
                //record request
                if (dataObj.stat && dataObj.stat.request_url) {
                    _this.get(dataObj.stat.request_url);
                }
                //change the interval to refresh
                if (dataObj.offerc && dataObj.offerc.jsl) {
                    itrvtime = dataObj.offerc.jsl;
                }
                parenNode.innerHTML="";
                _this.setAdsHtml(dataObj, parenNode);
            });
        }
    };
    loadads();
    //60秒刷新一次
    setInterval(loadads,itrvtime);
  }
  //设置html代码
  Ads.prototype.setAdsHtml = function (data,parenNode) {
    var offer = data.offer;
    var div = document.createElement("div");
    //c创建一个div盒子做为父盒子
    div.className = "adsbybatmobi";
    div.style = "display:block;border:none;height:"+offer.h+"px;margin:0;padding:0;position:relative;visibility:visible;width:"+offer.w+"px;background-color:transparent";
    //创建iframe放广告
    var iframe = document.createElement("iframe");
    iframe.width = offer.w;
    iframe.height = offer.h;
    iframe.scrolling = "no";
    iframe.setAttribute('frameborder',0);
    iframe.setAttribute('marginwidth',0);
    iframe.setAttribute('marginheight',0);
    iframe.setAttribute('vspace',0);
    iframe.setAttribute('hspace',0);
    iframe.setAttribute('allowtransparency',true);
    iframe.setAttribute('allowfullscreen',true);
    iframe.setAttribute('allowtransparency',true);
    iframe.setAttribute('style',"left: 0;position: absolute;top: 0;width: "+offer.w+"px;height: "+offer.h+"px;");
    iframe.srcdoc = offer.html;
    parenNode.appendChild(div);
    div.appendChild(iframe);
    var _this=this;
    IframeOnClick.track(iframe, function() {
      //record click stat
        if(offer.click_callback_url){
            _this.get(offer.click_callback_url);
        }
    });
    iframe.onload=function () {
        //impression stat
        if (data.stat && data.stat.imp_url) {
            _this.get(data.stat.imp_url);
        }
    };
  }

  var adsbybatmobi = {
    load:true,
    push:function (params) {
        new Ads(params);
        batmobiAds.push(params);
    }
  }
  return adsbybatmobi;
})()
window.adsbybatmobi = adsbybatmobi;