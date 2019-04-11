// create global s object based on data element in DTM.  Defaults to "s"
(function(){
  // global s object, make global at bottom
  var sObj = _satellite.getVar('s object') || 's';

  // report suite identification
  _satellite.sc_account = 'marriottglobal';
  if(_satellite.settings.isStaging==true){
    _satellite.sc_account = 'marriottglobaldev';
  }
  // customize report suite value by creating a data element named "rsid"
  if(_satellite.getVar('rsid')){
    _satellite.sc_account = _satellite.getVar('rsid');
  }

  var s = s_gi(_satellite.sc_account);
  s.qp = s.Util.getQueryParam; // for shorter syntax
  s.linkInternalFilters = 'javascript:,.marriot.co.,.marriott.com,.marriott.fr,.marriott.br,.marriottrewardinsiders.com,flexrez.com,investor.shareholder.com,marriott.de,marriott.hk,marriott.ie,marriottdevelopment.com,marriotdruidsglen.ie,marriott-email.com,marriotthotels,marriottrewards,shopmarriott,mi-,renaissance.com,renaissancehotels,usablenet.com,courtyard.,courtyardhotels.,courtyardmarriott.,ibahn.com,marriottassociatesweeps.dja.com,marriottconsumersweeps.dja.com,ritzcarlton-email.com,editionhotels.com,execustay.com,'+window.location.hostname;
  s.linkTrackVars = 'None';
  s.linkTrackVars = 'None';
  s.trackingServer = 'metrics.marriott.com';
  s.trackingServerSecure = 'smetrics.marriott.com';
  s.usePlugins = true;
  s._domain = window.location.hostname;
  s._cb = []; // callback array

  // dynamic cookie domain periods
  s.fpCookieDomainPeriods = 2;
  if(s._domain.match(/\.com\.|\.co\./ig)){
    s.fpCookieDomainPeriods = 3;
  }

  s.doPlugins = function(s){
    // define this in the custom code of DTM
    if(typeof s.top == 'function'){
      s.top();
    }
    
    //Marriott UAT Tracking
    if (s.c_r("MUAT")){
      try {
        var muatObj=JSON.parse(decodeURIComponent(s.c_r("MUAT")));
        var testerEid=muatObj.testerEid||"";
        var testReason=muatObj.testReason||"";
        var testCase=muatObj.testCase||"";
        var testSeq=muatObj.testSeq||0;
        if ( (testerEid != "")&&(testReason != "")&&(testCase != "") ){
          testSeq++;
          var uatString=testerEid.replace(/\|/g,'')+"|"
          +testReason.replace(/\|/g,'')+"|"
          +testCase.replace(/\|/g,'')+"|"
          +testSeq;
          s.eVar7=uatString;
          s.prop19=uatString;
          s.linkTrackVars=s.apl(s.linkTrackVars,"eVar7",",",2);
          s.linkTrackVars=s.apl(s.linkTrackVars,"prop19",",",2);
          s.events = s.apl(s.events,'event25',',',2);
          s.linkTrackEvents = s.apl(s.linkTrackEvents,'event25',',',2);

          muatObj.testSeq=testSeq;
          document.cookie = "MUAT="+encodeURIComponent(JSON.stringify(muatObj))+"; path=/"; //; domain=.marriott."+document.location.hostname.split(".").pop();
        }
      } catch(e){};
    }
    
    //SDI page timing plugIn
    var sdiTimingResults=_sdiTiming.getTimingInfo();
    if (sdiTimingResults.timingPageName) {
      s.eVar35=sdiTimingResults.timingPageName;
      s.eVar36=sdiTimingResults.timingBuckets;
      s.events=s.apl(s.events, "event150", ",", 2);
      s.events=s.apl(s.events, "event151="+sdiTimingResults.A_domainLookupEnd.ms, ",", 2);
      s.events=s.apl(s.events, "event152="+sdiTimingResults.B_connectEnd.ms, ",", 2);
      s.events=s.apl(s.events, "event153="+sdiTimingResults.C_responseStart.ms, ",", 2);
      s.events=s.apl(s.events, "event154="+sdiTimingResults.D_responseEnd.ms, ",", 2);
      s.events=s.apl(s.events, "event155="+sdiTimingResults.E_domInteractive.ms, ",", 2);
      s.events=s.apl(s.events, "event156="+sdiTimingResults.F_domComplete.ms, ",", 2);
      s.events=s.apl(s.events, "event157="+sdiTimingResults.G_loadEventEnd.ms, ",", 2);
    }	
    
    // set the dtm.no_block context variable for processing rules filtering
    s.contextData['dtm.no_block']="true";
    s.linkTrackVars = s.apl(s.linkTrackVars,'contextData.dtm.no_block',',',2);
    
    /* Site Name */
    if(s.eVar41 && !s.prop5){
      s.prop5 = 'D=v41';
    }

    /* Default Page Name */
    if(!s.pageName){
      s.pageName = s.marriottPageName();
    }

    /* External Campaign - use custom plugin */
    if(!s.campaign){
      s.campaign = s.marriottCampaign();
    }

    /* Product View */
    if(s.hasEvent('prodView')){
      s.addEvent('event1');
    }
    
    /* Time Parting */
    s.prop8 = s.getTimeParting('w','-5')+' : '+s.getTimeParting('d','-5')+' : '+s.getTimeParting('h','-5');
    
    /* Other */
    s.eVar43 = s.qp('nCK');
    
    // channel manager
    var o = s.channelManager(true);
    if(o && !s.campaign){
      if(o.channel == 'Other Websites'){
        o.referringDomain = o.referringDomain.split('/');
        var tempDomain = o.referringDomain[0];
        var socialMedia = ['blogspot.com', 'blogger.com', 'facebook.com', 'bebo.com', 'hi5.com', 'linkedin.com', 'ning.com', 'plaxo.com', 'twitter.com', 'lifestream.fm', 'yelp.com', 'youtube.com', 'metacafe.com', 'blip.tv,viddler.com', 'flicker.com', 'zvents.com', 'digg.com', 'reddit.com', 'newsvine.com'];
        for (var i = 0; i < socialMedia.length; i++) {
          if (tempDomain.indexOf(socialMedia[i]) > -1){
            s.campaign = 'Social Media: ' + tempDomain;
            i = socialMedia.length;
          }
          else {
            s.campaign = 'Unpaid Referrals: ' + tempDomain;
          }
        }
      }
      if(o.channel=='Natural'){
        s.campaign = 'Natural Search: '+o.partner;
      }
    }

    // set the campaign value for the duration of the visit
    //SMS-02-16-2016//s.campaign = s.getAndPersistValue(s.campaign, 'pc_campaign', 0);
    if(s.campaign){
      s.eVar16 = 'D=v0';
    }
    
    
    // define this in the custom code of DTM
    if(typeof s.bottom == 'function'){
      s.bottom();
    }

    // callback - add items to s._cb array as functions and they'll fire after data is sent
    s.q = function(){
      for(var i=0; i<s._cb.length; i++){
        s._cb[i]();
      }
      s._cb = [];

      // clear click data
      s.removeEvent('event2');
      s.eVar1 = '';
    }
  }

  /* ====== PLUGINS ====== */
  // marriottPageName - custom function for getting the Marriott specific pageName
  s.marriottPageName = function(){
    var w = window,
        l = w.location,
        p = l.hostname+l.pathname;
    if(p[p.length - 1] == '/'){
      p = p.substring(0, p.length-1);
    }
    return p;
  };
  // apl - append to list
  //  l = list/string to append to, v = value to append, d = delimiter to separate values with, u = case sensitivity.  1 = case sensitive, anything else is case insensitive
  s.apl=new Function("l","v","d","u",""
  +"var s=this,m=0;if(!l)l='';if(u){var i,n,a=s.split(l,d);for(i=0;i<a."
  +"length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCas"
  +"e()));}}if(!m)l=l?l+d+v:v;return l");
  // split - split a string to an array
  //  l = string to split, d = delimiter to split by
  s.split=new Function("l","d",""
  +"var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x"
  +"++]=l.substring(0,i);l=l.substring(i+d.length);}return a");
  // join - join 2 arrays
  //  v = first array, p = second array
  s.join = new Function("v", "p", "" 
  + "var s = this;var f,b,d,w;if(p){f=p.front?p.front:'';b=p.back?p.back" 
  + ":'';d=p.delim?p.delim:'';w=p.wrap?p.wrap:'';}var str='';for(var x=0" 
  + ";x<v.length;x++){if(typeof(v[x])=='object' )str+=s.join( v[x],p);el" 
  + "se str+=w+v[x]+w;if(x<v.length-1)str+=d;}return f+str+b;");
  // replace - SC version of replace
  //  x = haystack, o = needle, n = value to replace needle
  s.repl=new Function("x","o","n",""
  +"var i=x.indexOf(o),l=n.length;while(x&&i>=0){x=x.substring(0,i)+n+x."
  +"substring(i+o.length);i=x.indexOf(o,i+l)}return x");
  // getTimeParting - returns date/time info
  s.getTimeParting=new Function("t","z",""
  +"var s=this,d,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T;d=new Date();A"
  +"=d.getFullYear();if(A=='2015'){B='08';C='01'}if(A=='2016'){B='13';C"
  +"='06'}if(A=='2017'){B='12';C='05'}if(A=='2018'){B='11';C='04'}if(A="
  +"='2019'){B='10';C='03'}if(A=='2020'){B='08';C='01'}if(A=='2021'){B="
  +"'14';C='07'}if(A=='2022'){B='13';C='06'}if(A=='2023'){B='12';C='05'"
  +"}if(A=='2024'){B='10';C='03'}if(A=='2025'){B='09';C='02'}if(!B||!C){B='08"
  +"';C='01'}B='03/'+B+'/'+A;C='11/'+C+'/'+A;D=new Date('1/1/2000');if("
  +"D.getDay()!=6||D.getMonth()!=0){return'Data Not Available'}else{z=p"
  +"arseFloat(z);E=new Date(B);F=new Date(C);G=F;H=new Date();if(H>E&&H"
  +"<G){z=z+1}else{z=z};I=H.getTime()+(H.getTimezoneOffset()*60000);J=n"
  +"ew Date(I+(3600000*z));K=['Sunday','Monday','Tuesday','Wednesday','"
  +"Thursday','Friday','Saturday'];L=J.getHours();M=J.getMinutes();N=J."
  +"getDay();O=K[N];P='AM';Q='Weekday';R='00';if(M>30){R='30'}if(L>=12)"
  +"{P='PM';L=L-12};if(L==0){L=12};if(N==6||N==0){Q='Weekend'}T=L+':'+R"
  +"+P;if(t=='h'){return T}if(t=='d'){return O}if(t=='w'){return Q}}");
  // hasEvent - check to see if an event is set.  returns boolean
  //  evt = event name
  s.hasEvent = function(evt){
    var s = this;
    // no events are set
    if(!s.events || !evt || typeof evt !== 'string'){
      return false
    }
    var events = s.events.split(',');
    for(var i=0; i<events.length; i++){
      if(events[i]==evt || events[i].indexOf(evt+':') == 0 || events[i].indexOf(evt+'=') == 0){
        return true;
      }
    }
  };
  // setEvent - append an event to s.events
  s.setEvent = function(evt, opts) {
    var s = this,
      o = typeof opts == 'object' ? opts : {};
    if (!evt) {
      return '';
    }
    var tmpEvt = evt.split(':')[0].split('=')[0];
    if (!s.hasEvent(tmpEvt)) {
      s.events = s.apl(s.events, evt, ",", 2);
    }
    if (o.isLink == true || o.islink == true) {
      s.linkTrackVars = s.apl(s.linkTrackVars, 'events', ',', 2);
      s.linkTrackEvents = s.apl(s.linkTrackEvents, tmpEvt, ',', 2);
    }
  };
  // removeEvent - remove an event from s.events
  s.removeEvent = function(evt) {
    var s = this,
      evts;
    // make sure events exists
    s.events = s.events || '';
    // put events into an array
    evts = s.events.split(',');
    if (!evt) {
      return ''
    }
    // loop through events starting with the end
    if (s.hasEvent(evt)) {
      for (var i = evts.length - 1; i >= 0; i--) {
        if (evts[i] == event || (evts[i] + ',').indexOf(event + ',') > -1 || evts[i].indexOf(event + ':') > -1 || evts[i].indexOf(event + '=') > -1) {
          evts.splice(i, 1);
        }
      }
      // reset events
      s.events = evts.join(',');
    }
  };
  // addLinkVar - add a value to linkTrackVars
  s.addLinkVar = function() {
    var s = this;
    if (arguments.length == 0) {
      return ''
    }
    s.linkTrackVars = s.linkTrackVars || '';
    for (var i = 0; i < arguments.length; i++) {
      s.linkTrackVars = s.apl(s.linkTrackVars, arguments[i], ',', 2);
    }
  };
  // getQueryParam - adapted to work with AppMeasurement
  s.getQueryParam = function(q, d, u) {
    var s = this,
      qs = [],
      vals = [],
      delim = d || ':';
    if (!q) {
      return ''
    };
    qs = q.split(',');
    for (var i = 0; i < qs.length; i++) {
      if (s.Util.getQueryParam(qs[i],u)) {
        vals.push(s.Util.getQueryParam(qs[i],u));
      }
    }
    return vals.join(delim);
  };
  // getValOnce - get a value once by storing it in a cookie
  //  v = value, c = cookie, e = cookie expiration in days
  s.getValOnce=new Function("v","c","e",""
  +"var s=this,a=new Date,v=v?v:v='',c=c?c:c='s_gvo',e=e?e:0,k=s.c_r(c"
  +");if(v){a.setTime(a.getTime()+e*86400000);s.c_w(c,v,e?a:0);}return"
  +" v==k?'':v");
  // getPreviousValue - get a previous value by storing it in a cookie
  //  v = value, c = cookie, e = an event, m = default value
  s.getPreviousValue=new Function("v","c","e","m",""
  +"var s=this,t=new Date,i,j,r,x,y;t.setTime(t.getTime()+18E5);c=c?c:'"
  +"s_gpv';m=m?m:'no value';if(e){if(s.events){i=s.split(e,',');j=s.spl"
  +"it(s.events,',');for(x in i){for(y in j){if(i[x]==j[y]){if(s.c_r(c)"
  +"){r=s.c_r(c)}else{r=m}v?s.c_w(c,v,t):s.c_w(c,m,t);return r}}}}}else"
  +"{if(s.c_r(c)){r=s.c_r(c)}else{r=m}v?s.c_w(c,v,t):s.c_w(c,m,t);retur"
  +"n r}");
  /* channelManager */
  s.channelManager=new Function("p","f",""
  +"var dl='Direct Load',nr='No Referrer',ow='Other Websites';if(!this."
  +"p_fo('cm')) {return -1;}if(!this.isEntry()){return 0;}var s=this,r="
  +"s.referrer||typeof s.referrer!='undefined'?s.referrer:document.refe"
  +"rrer,e,k,c,w,_b=0,url=s.pageURL?s.pageURL:s.w.location,url=url+'',"
  +"rf='';s.__se=s.__se();var br=0;var ob=new Object;ob.debug=function("
  +"m){if(f){f(m);}};ob.channel='';ob.keyword='';ob.partner='';ob.toStr"
  +"ing=function(ar){var str='';var x=0;for(x in ar){str+=ar[x]+':\\\''"
  +"+ob[ar[x]]+'\\\',';}str='{'+str.substring(0,str.length-1)+'}';retur"
  +"n str;};ob.referrer=r?r:nr;ob.getReferringDomain=function(){if(this"
  +".referrer==''){return '';}if(r&&typeof r!='undefined'){var end=r.in"
  +"dexOf('?') >-1?r.indexOf('?'):r.substring(r.length-1,r.length)=='/'"
  +"?r.length-1:r.length;var start=r.indexOf('://')>-1?r.indexOf('://')"
  +"+3:0;return r.substring(start,end);}else{return nr;}};ob.clear=func"
  +"tion(ar){var x=0;for(x in ar){this[ar[x]]='';}this.referringDomain="
  +"this.getReferringDomain();};ob.referringDomain=ob.getReferringDomai"
  +"n();ob.campaignId=''; ob.isComplete=function(){var ar=['channel','k"
  +"eyword','partner','referrer','campaignId'];for(var i=0;i<ar.length;"
  +"i++){if(!ob[ar[i]]){return 0;}}if(p&&s.c_r('cmm')==ob.toString(ar))"
  +"{this.debug('Duplicate');this.clear(ar);return 1;}else if(p){s.c_w("
  +"'cmm',ob.toString(ar));return 1;}return 1;};ob.matcher=function(u,x"
  +"){if(!u){return false;}if(typeof s.__se[u].i!='undefined'&&(s.campa"
  +"ign||s.getQueryParam&&s.getQueryParam(ids[x]))){ob.campaignId=s.get"
  +"QueryParam(ids[x]);return true;}else if(typeof s.__se[u].p!='undefi"
  +"ned' &&(s.campaign||s.getQueryParam&&s.getQueryParam&&s.getQueryPar"
  +"am(ids[x].substring(0,ids[x].indexOf('='))))){var _ii=ids[x].substr"
  +"ing(ids[x].indexOf('=') +1,ids[x].length);var _id=s.campaign||s.get"
  +"QueryParam(ids[x].substring(0,ids[x].indexOf('=')));if (_ii==_id.su"
  +"bstring(0,_ii.length)){ob.campaignId=_id;return true;}}else{return "
  +"false;}};var ids='';var _p='';for(var i in s.__se){if(_p){break;}fo"
  +"r(var j in s.__se[i]){if(!(j=='p' ||j=='i')){_p=i;}}}for(var u in s"
  +".__se[_p]){if(u!='i' &&u!='p'){for(var h=0;h<s.__se[_p][u].tl.lengt"
  +"h;h++){if(s.__se[_p][u].tl[h]&&typeof s.__se[_p][u].tl[h]=='string'"
  +"){if(r.indexOf(s.__se[_p][u].tl[h])!=-1){ob.partner=u;br=1;break;}}"
  +"if(br){break;}}}else {ids=s.__se[_p][u];}if(br){for(var i=0;i<s.__s"
  +"e[_p][ob.partner].kw.length;i++){if(s.__se[_p][u].kw[i]&&typeof s._"
  +"_se[_p][u].kw[i]=='string') {var kwd=s.__se[_p][u].kw[i].substring("
  +"0,s.__se[_p][u].kw[i].length-1);ob.keyword=s.getQueryParam?s.getQue"
  +"ryParam(kwd,r):''; if(ob.keyword){break;}}}for(var x=0;x<ids.le"
  +"ngth;x++){if(ob.matcher(_p,x)){ob.channel=_p;if(!ob.keyword){ob.key"
  +"word='n/a'; }break;}};if(!ob.channel){ob.channel='Natural'; ob.camp"
  +"aignId='n/a';if(r.match(/r\.search\.yahoo\.com|www\.google\.*|www\.bing\.com/) && !ob.keyword){ob.keyword='n/a';}}break;}}if(ob.isComplete()){return ob;}for(var _u in"
  +" s.__se){if(_u==_p){continue;}for(var u in s.__se[_u]){ids=s.__se[_"
  +"u][u];for(var x=0;x<ids.length;x++){if(ob.matcher(_u,x)){ob.channel"
  +"=_u;ob.partner=_u;ob.keyword='n/a'; break;}}if(ob.isComplete()){ret"
  +"urn ob;}}}if(ob.isComplete()){return ob;}if(ob.referrer&&(ob.referr"
  +"er!=nr)){ob.channel=ow;ob.partner=ow;ob.keyword='n/a'; ob.campaignI"
  +"d='n/a'; }if(ob.isComplete()){return ob;}ob.channel=dl;ob.partner=d"
  +"l;ob.keyword='n/a'; ob.campaignId='n/a';return ob;");
  // __se has the default search engine config
  s.__se = new Function("" 
  + "var l={'~':'tl:[\\'','^': 'kw:[\\'','%': 'ahoo','|': '\\'],','>': '" 
  + "\\']}','*': '.com','$': 'search',';':'query','#':'land','`':'oogle'" 
  + ",'+':'http://www','<':'keyword'};var f=this.___se+'';var g='';for(v" 
  + "ar i=0;i<f.length;i++){if(l[f.substring(i,i+1)]&&typeof l[f.substri" 
  + "ng(i,i+1)]!='undefined'){g+=l[f.substring(i,i+1)];}else{g+=f.substr" 
  + "ing(i,i+1);}}return eval('('+g+')');");
  // ___se full list of custom search engines
  s.___se="{'Paid Search':{i:['ppc|'Sina - China':{^q=|~g`.cn/$?client="
  +"aff-sina>,'National Directory':{^;=|~$.NationalDirectory*>,'eerstek"
  +"euze.nl':{^Terms=|~+.eerstekeuze.nl/>,'Excite - Netscape':{^general"
  +"=','$=|~excite$.netscape*','$excite.netscape*>,'Andromeda Search':{"
  +"^<=|~p-$.virtualave.net>,'So-net':{^MT=|~so-net.$.goo.ne.jp>,'InfoS"
  +"eek - Japan':{^;=','qt=|~$.m.infoseek.co.jp>,'Goo (Japan)':{^MT=|~$"
  +".mobile.goo.ne.jp>,'AllSearchEngines':{^;=s|~all$engines.co.uk>,'zo"
  +"eken.nl':{^;=|~+.zoeken.nl/>,'Northern Light':{^qr=|~www.northernli"
  +"ght*>,'Biglobe':{^q=|~$.biglobe.ne.jp>,'track.nl':{^qr=|~+.track.nl"
  +"/>,'Baidu':{^wd=','s=|~+.baidu*>,'3721*':{^p=|~+.3721*/>,'Galaxy':{"
  +"^|~galaxy.tradewave*>,'G` - Norway (Startsiden)':{^q=|~g`.startside"
  +"n.no>,'NetSearch':{^Terms=','$=|~net$voyager*','net$.org>,'au.Anzwe"
  +"rs':{^p=|~au.anzwers.y%*>,'MSN - Latin America':{^q=|~$.latam.msn*>"
  +",'Searchteria':{^p=|~ad.$teria.co.jp>,'FreshEye':{^ord=','kw=|~$.fr"
  +"esheye*>,'Metacrawler':{^general=','/$/web/|~www.metacrawler*','$.m"
  +"etacrawler*>,'Y%! - Austria':{^p=|~at.$.y%*>,'Y%! - Spanish (US : T"
  +"elemundo)':{^p=|~telemundo.y%*','espanol.$.y%*>,'Business*':{^;=|~b"
  +"usiness*/$>,'Y%! - Switzer#':{^p=|~ch.$.y%*>,'Y%! - Fin#':{^p=|~fi."
  +"$.y%*>,'Dino Online':{^;=|~www.dino-online.de>,'Internet Times':{^$"
  +"=',';=|~internet-times*>,'TheYellowPages':{^$=|~theyellowpages*>,'W"
  +"eb-Search':{^q=|~www.web-$*>,'Y%! - Malaysia':{^p=|~malaysia.y%*','"
  +"malaysia.$.y%*>,'WebCrawler':{^$Text=','$=|~www.webcrawler*>,'Monst"
  +"er Crawler':{^qry=|~monstercrawler*>,'Sina - Hong Kong':{^word=|~g`"
  +".sina*.hk>,'Sina - Taiwan':{^kw=|~g`.sina*.tw>,'Y%Japan - Mobile':{"
  +"^p=|~mobile.y%.co.jp>,'Livedoor - Mobile':{^q=','<=|~dir.m.livedoor"
  +"*>,'Blue Window':{^q=','qry=|~$.bluewin.ch','$.bluewindow.ch>,'Gene"
  +"ral Search':{^<=|~general$*>,'InternetTrash':{^words=|~internettras"
  +"h*>,'MSN - United Kingdom':{^q=|~uk.$.msn*','msn.co.uk>,'Y%! - Chin"
  +"ese (US)':{^p=|~chinese.y%*>,'MSN - Singapore':{^q=|~$.msn*.sg>,'MS"
  +"N - Republic of the Phlippines':{^q=|~$.msn*.ph>,'MSN - Taiwan':{^q"
  +"=|~$.msn*.tw>,'MSN - Turkey':{^q=|~$.msn*.tr>,'MSN - People\\'s Rep"
  +"ublic of China':{^q=|~$.msn*.cn>,'MSN - Malaysia':{^q=|~$.msn*.my>,"
  +"'MSN - Hong Kong S.A.R.':{^q=|~$.msn*.hk>,'MSN - Brazil':{^q=|~$.ms"
  +"n*.br>,'G` @ EZweb':{^;=|~ezsch.ezweb.ne.jp>,'AltaVista - Nether#s'"
  +":{^q=|~nl.altavista*>,'AltaVista - Spain':{^q=','r=|~es.altavista*>"
  +",'AltaVista - Italy':{^q=','r=|~it.altavista*>,'AltaVista - Canada'"
  +":{^q=|~ca.altavista*>,'AltaVista - Switzer#':{^q=','r=|~ch.altavist"
  +"a*>,'AltaVista - France':{^q=','r=|~fr.altavista*>,'AltaVista - Uni"
  +"ted Kingdom':{^q=','r=|~uk.altavista*>,'AltaVista - Sweden':{^q=','"
  +"r=|~se.altavista*>,'DejaNews':{^QRY=|~www.dejanews*>,'Excite':{^/$/"
  +"web/','qkw=|~msxml.excite*>,'Globe Crawler':{^$=|~globecrawler*>,'H"
  +"otBot':{^MT=',';=|~hotbot.lycos*>,'InfoSeek':{^qt=|~www.infoseek*',"
  +"'infoseek.go*>,'MSN - South Africa':{^q=|~$.msn.co.za>,'MSN - Isrea"
  +"l':{^q=|~$.msn.co.il>,'MSN - Japan':{^q=|~$.msn.co.jp>,'MSN - Canad"
  +"a':{^q=|~sympatico.msn.ca','$.fr.msn.ca>,'MSN - Korea':{^q=',';=|~$"
  +".msn.co.kr>,'Search City':{^$=','<=|~$city.co.uk>,'Search Viking':{"
  +"^$=|~$viking*>,'Thunderstone':{^q=|~thunderstone*>,'Web Wombat (Au."
  +")':{^I=','ix=|~webwombat*.au>,'AltaVista - Norway':{^q=|~no.altavis"
  +"ta*>,'AltaVista - Denmark':{^q=|~dk.altavista*>,'MSN - India (Engli"
  +"sh)':{^q=|~$.msn.co.in>,'MSN - Indonesia (English)':{^q=|~$.msn.co."
  +"id>,'Nifty':{^Text=|~$.nifty*>,'ANZWERS':{^;=|~www.anzwers*>,'Buyer"
  +"sIndex':{^;=|~buyersindex*>,'CNET Search*':{^q=|~cnet.$*>,'Dmoz':{^"
  +"$=|~$.dmoz*','dmoz*>,'Final Search':{^pattern=|~final$*>,'FullWebin"
  +"fo Directory & Search Engine':{^k=','s=|~fullwebinfo*>,'Go (Infosee"
  +"k)':{^qt=|~infoseek.go*>,'GoEureka':{^q=','key=|~goeureka*.au>,'Liv"
  +"e*':{^q=|~$.live*>,'QuestFinder':{^s=|~questfinder*','questfinder.n"
  +"et>,'SearchHound':{^?|~$hound*>,'TopFile*':{^;=|~www.topfile*>,'Sin"
  +"a - North America':{^$_key=|~g`.sina*>,'AOL* Search':{^q=|~$.aol*',"
  +"'$.aol.ca>,'ByteSearch':{^$=','q=|~byte$*>,'ComFind':{^|~debriefing"
  +"*','allbusiness*find*>,'Dictionary*':{^term=',';=|~Dictionary*','Di"
  +"ctionary>,'ilse.nl':{^$_for=|~$.ilse.nl>,'Infoseek - Japan':{^qt=|~"
  +"infoseek.co.jp>,'InfoSeek':{^qt=|~infoseek.co.uk>,'Rex Search':{^te"
  +"rms=|~rex-$*','rex-$*>,'Search King':{^$term=','<=|~$king*>,'Search"
  +"alot':{^;=','q=|~$alot*>,'Web Trawler':{^|~webtrawler*>,'Y%! - Asia"
  +"':{^p=|~asia.y%*','asia.$.y%*>,'Y%! - Kids':{^p=|~kids.y%*','kids.y"
  +"%*/$>,'SmartPages*':{^QueryString=|~smartpages*>,'MetaGopher':{^;=|"
  +"~metagopher*>,'Froute':{^k=|~item.froute.jp','$.froute.jp>,'All The"
  +" Web':{^;=','q=|~alltheweb*>,'DirectHit':{^qry=','q=|~directhit*>,'"
  +"Excite Canada':{^$=','q=|~www.excite.ca','$.excite.ca>,'Excite - Ge"
  +"rmany':{^$=','q=|~www.excite.de>,'Excite - Dutch':{^$=|~nl.excite*>"
  +",'G` - Australia':{^q=|~g`*.au>,'G` - Brasil':{^q=|~g`*.br>,'InfoSp"
  +"ace':{^QKW=','qhqn=|~infospace*>,'InfoTiger':{^qs=|~infotiger*>,'Lo"
  +"okSmart':{^key=','qt=|~looksmart*','looksmart.co.uk>,'Lycos':{^;=|~"
  +"www.lycos*','$.lycos*>,'Excite - Australia':{^$=','key=|~excite*.au"
  +">,'Metacrawler - Germany':{^qry=|~216.15.219.34','216.15.192.226>,'"
  +"MSN - Nether#s':{^q=|~$.msn.nl>,'MSN - Belgium':{^q=|~$.msn.be>,'MS"
  +"N - Germany':{^q=|~$.msn.de>,'MSN - Austria':{^q=|~$.msn.at>,'MSN -"
  +" Spain':{^q=|~$.msn.es>,'MSN - Italy':{^q=|~$.msn.it>,'MSN - France"
  +"':{^q=|~$.msn.fr>,'MSN - Switzer#':{^q=|~$.msn.ch','fr.ch.msn*>,'MS"
  +"N - Sweden':{^q=|~$.msn.se>,'RageWorld*':{^$=|~rageworld*>,'ToggleB"
  +"ot!':{^$=',';=|~togglebot*>,'Web Wombat':{^I=','ix=|~webwombat*>,'M"
  +"SN - Norway':{^q=|~$.msn.no>,'MSN - Denmark':{^q=|~$.msn.dk>,'G` - "
  +"Nicaragua':{^q=|~g`*.ni>,'G` - Antigua and Barbuda':{^q=|~g`*.ag>,'"
  +"G` - Anguilla':{^q=|~g`*.ai>,'G` - Taiwan':{^q=|~g`*.tw>,'G` - Ukra"
  +"ine':{^q=|~g`*.ua>,'G` - Namibia':{^q=|~g`*.na>,'G` - Uruguay':{^q="
  +"|~g`*.uy>,'G` - Ecuador':{^q=|~g`*.ec>,'G` - Libya':{^q=|~g`*.ly>,'"
  +"G` - Norfolk Is#':{^q=|~g`*.nf>,'G` - Tajikistan':{^q=|~g`*.tj>,'G`"
  +" - Ethiopia':{^q=|~g`*.et>,'G` - Malta':{^q=|~g`*.mt>,'G` - Philipp"
  +"ines':{^q=|~g`*.ph>,'G` - Hong Kong':{^q=|~g`*.hk>,'G` - Singapore'"
  +":{^q=|~g`*.sg>,'G` - Jamaica':{^q=|~g`*.jm>,'G` - Paraguay':{^q=|~g"
  +"`*.py>,'G` - Panama':{^q=|~g`*.pa>,'G` - Guatemala':{^q=|~g`*.gt>,'"
  +"G` - Isle of Gibraltar':{^q=|~g`*.gi>,'G` - El Salvador':{^q=|~g`*."
  +"sv>,'G` - Colombia':{^q=|~g`*.co>,'G` - Turkey':{^q=|~g`*.tr>,'G` -"
  +" Peru':{^q=|~g`*.pe>,'G` - Afghanistan':{^q=|~g`*.af>,'G` - Malaysi"
  +"a':{^q=|~g`*.my>,'G` - Mexico':{^q=|~g`*.mx>,'G` - Viet Nam':{^q=|~"
  +"g`*.vn>,'G` - Nigeria':{^q=|~g`*.ng>,'G` - Nepal':{^q=|~g`*.np>,'G`"
  +" - Solomon Is#s':{^q=|~g`*.sb>,'G` - Belize':{^q=|~g`*.bz>,'G` - Pu"
  +"erto Rico':{^q=|~g`*.pr>,'G` - Oman':{^q=|~g`*.om>,'G` - Cuba':{^q="
  +"|~g`*.cu>,'G` - Bolivia':{^q=|~g`*.bo>,'G` - Bahrain':{^q=|~g`*.bh>"
  +",'G` - Bangladesh':{^q=|~g`*.bd>,'G` - Cambodia':{^q=|~g`*.kh>,'G` "
  +"- Argentina':{^q=|~g`*.ar>,'G` - Brunei':{^q=|~g`*.bn>,'G` - Fiji':"
  +"{^q=|~g`*.fj>,'G` - Saint Vincent and the Grenadine':{^q=|~g`*.vc>,"
  +"'G` - Qatar':{^q=|~g`*.qa>,'MSN - Ire#':{^q=|~$.msn.ie>,'G` - Pakis"
  +"tan':{^q=|~g`*.pk>,'G` - Dominican Republic':{^q=|~g`*.do>,'G` - Sa"
  +"udi Arabia':{^q=|~g`*.sa>,'G` - Egypt':{^q=|~g`*.eg>,'G` - Belarus'"
  +":{^q=|~g`*.by>,'Biglobe':{^extrakey=|~$.kbg.jp>,'AltaVista':{^q=','"
  +"r=|~altavista.co>,'AltaVista - Germany':{^q=','r=|~altavista.de>,'A"
  +"OL - Germany':{^q=|~suche.aol.de','suche.aolsvc.de>,'Excite - Japan"
  +"':{^$=','s=|~excite.co.jp>,'Fansites*':{^q1=|~fansites*>,'FindLink'"
  +":{^|~findlink*>,'GoButton':{^|~gobutton*>,'G` - India':{^q=|~g`.co."
  +"in>,'G` - New Zea#':{^q=|~g`.co.nz>,'G` - Costa Rica':{^q=|~g`.co.c"
  +"r>,'G` - Japan':{^q=|~g`.co.jp>,'G` - United Kingdom':{^q=|~g`.co.u"
  +"k>,'G` - Yugoslavia':{^q=|~g`.co.yu>,'Overture':{^Keywords=|~overtu"
  +"re*>,'Hotbot - United Kingdom':{^;=|~hotbot.co.uk>,'Loquax Open Dir"
  +"ectory':{^$=|~loquax.co.uk>,'MSN - Mexico':{^q=|~t1msn*.mx','$.prod"
  +"igy.msn*>,'Netscape Search':{^;=','$=|~netscape*>,'Y%! - Philippine"
  +"s':{^p=|~ph.y%*','ph.$.y%*>,'Y%! - Thai#':{^p=|~th.y%*','th.$.y%*>,"
  +"'Y%! - Argentina':{^p=|~ar.y%*','ar.$.y%*>,'Y%! - Indonesia':{^p=|~"
  +"id.y%*','id.$.y%*>,'Y%! - Hong Kong':{^p=|~hk.y%*','hk.$.y%*>,'Y%! "
  +"- Russia':{^p=|~ru.y%*','ru.$.y%*>,'Y%! - Canada':{^p=|~ca.y%*','ca"
  +".$.y%*>,'Y%! - Taiwan':{^p=|~tw.y%*','tw.$.y%*>,'Y%! - Catalan':{^p"
  +"=|~ct.y%*','ct.$.y%*>,'Y%! - Canada (French)':{^p=|~qc.y%*','cf.$.y"
  +"%*>,'Y%! - China':{^p=|~cn.y%*','$.cn.y%*>,'Y%! - India':{^p=|~in.y"
  +"%*','in.$.y%*>,'Y%! - Brazil':{^p=|~br.y%*','br.$.y%*>,'Y%! - Korea"
  +"':{^p=|~kr.y%*','kr.$.y%*>,'Y%! - Australia':{^p=|~au.y%*','au.$.y%"
  +"*>,'Y%! - Mexico':{^p=|~mx.y%*','mx.$.y%*>,'Y%! - Singapore':{^p=|~"
  +"sg.y%*','sg.$.y%*>,'Y%! - Denmark':{^p=|~dk.y%*','dk.$.y%*>,'Y%! - "
  +"Germany':{^p=|~de.y%*','de.$.y%*>,'Y%! - UK and Ire#':{^p=|~uk.y%*'"
  +",'uk.$.y%*>,'Y%! - Sweden':{^p=|~se.y%*','se.$.y%*>,'Y%! - Spain':{"
  +"^p=|~es.y%*','es.$.y%*>,'Y%! - Italy':{^p=|~it.y%*','it.$.y%*>,'Y%!"
  +" - France':{^p=|~fr.y%*','fr.$.y%*>,'Y%! - Norway':{^p=|~no.y%*','n"
  +"o.$.y%*>,'G` - Virgin Is#s':{^q=|~g`.co.vi>,'G` - Uzbekiston':{^q=|"
  +"~g`.co.uz>,'G` - Thai#':{^q=|~g`.co.th>,'G` - Israel':{^q=|~g`.co.i"
  +"l>,'G` - Korea':{^q=|~g`.co.kr>,'Y%! - Nether#s':{^p=|~nl.y%*','nl."
  +"$.y%*>,'Y%! - New Zea#':{^p=|~nz.y%*','nz.$.y%*>,'G` - Zambia':{^q="
  +"|~g`.co.zm>,'G` - South Africa':{^q=|~g`.co.za>,'G` - Zimbabwe':{^q"
  +"=|~g`.co.zw>,'Y%! - Viet Nam':{^p=|~vn.y%*','vn.$.y%*>,'G` - Uganda"
  +"':{^q=|~g`.co.ug>,'G` - Indonesia':{^q=|~g`.co.id>,'G` - Morocco':{"
  +"^q=|~g`.co.ma>,'G` - Lesotho':{^q=|~g`.co.ls>,'G` - Kenya':{^q=|~g`"
  +".co.ke>,'G` - Cook Is#s':{^q=|~g`.co.ck>,'G` - Botswana':{^q=|~g`.c"
  +"o.bw>,'G` - Venezuela':{^q=|~g`.co.ve>,'BeGuide*':{^$=|~beguide*>,'"
  +"dog*':{^$=|~doginfo*>,'Dogpile':{^q=','/$/web/|~dogpile*>,'Fireball"
  +"':{^q=',';=|~fireball.de>,'FishHoo!':{^;=|~fishhoo*>,'InfoSeek - Ge"
  +"rmany':{^qt=',';=|~infoseek.de>,'Lycos - United Kingdom':{^;=|~lyco"
  +"s.co.uk>,'MetaDog*':{^$=','<=|~metapro*','metadog*>,'TooCool':{^?|~"
  +"toocool*>,'Y%! - Japan':{^p=','va=|~y%.co.jp','$.y%.co.jp>,'Cafesta"
  +"':{^<=','<s=|~cafesta*>,'Oh! New? Mobile':{^k=|~ohnew.co.jp>,'Chubb"
  +"a':{^arg=|~chubba*>,'CyberBritain*':{^qry=|~hermia*','cyberbritain."
  +"co.uk>,'GeoBoz Search':{^$=|~geoboz*>,'Go2net Metacrawler':{^genera"
  +"l=|~go2net*>,'Tiscali':{^key=|~tiscali.it>,'TooZen':{^|~toozen*>,'W"
  +"AKWAK':{^MT=|~wakwak*>,'Webalta':{^q=|~webalta.ru>,'MSN LiveSearch "
  +"Mobile':{^q=|~m.live*>,'AOL - United Kingdom':{^;=|~aol.co.uk','$.a"
  +"ol.co.uk>,'Dazzo!':{^$=|~dazzo*>,'Deoji':{^$=','k=|~deoji*>,'Excite"
  +" - France':{^$=','q=|~excite.fr>,'Excite.ch':{^$=','q=|~excite.ch>,"
  +"'Godado':{^Keywords=|~godado.it>,'Goo (Jp.)':{^MT=|~goo.ne.jp>,'G` "
  +"- Po#':{^q=|~g`.pl>,'G` - United Arab Emirates':{^q=|~g`.ae>,'G` - "
  +"Luxembourg':{^q=|~g`.lu>,'G` - Slovakia':{^q=|~g`.sk>,'G` - Russia'"
  +":{^q=|~g`.ru>,'G` - Denmark':{^q=|~g`.dk>,'G` - Portugal':{^q=|~g`."
  +"pt>,'G` - Romania':{^q=|~g`.ro>,'G` - Fin#':{^q=|~g`.fi>,'G` - Latv"
  +"ia':{^q=|~g`.lv>,'G` - Guernsey':{^q=|~g`.gg>,'G` - Ire#':{^q=|~g`."
  +"ie>,'G` - Sweden':{^q=|~g`.se>,'G` - Lithuania':{^q=|~g`.lt>,'G` - "
  +"Canada':{^q=|~g`.ca>,'G` - Spain':{^q=|~g`.es>,'G`':{^q=|~g`.co','g"
  +"`syndication*>,'G` - Germany':{^q=|~g`.de>,'G` - Switzer#':{^q=|~g`"
  +".ch>,'G` - China':{^q=|~g`.cn>,'G` - Nether#s':{^q=|~g`.nl>,'G` - A"
  +"ustria':{^q=|~g`.at>,'G` - Belgium':{^q=|~g`.be>,'G` - Chile':{^q=|"
  +"~g`.cl>,'G` - France':{^q=|~g`.fr>,'G` - Italy':{^q=|~g`.it>,'Nexet"
  +" Open Directory':{^SEARCH=','q=|~nexet.net>,'Nomade':{^s=','MT=|~no"
  +"made.fr>,'Orbit.net':{^|~orbit.net>,'Search.ch':{^q=|~$.ch>,'Y%!':{"
  +"^p=|~y%*','$.y%*>,'G` - Norway':{^q=|~g`.no>,'G` - Haiti':{^q=|~g`."
  +"ht>,'G` - Vanuatu':{^q=|~g`.vu>,'G` - Repulic of Georgia':{^q=|~g`."
  +"ge>,'G` - The Gambia':{^q=|~g`.gm>,'G` - Timor-Leste':{^q=|~g`.tp>,"
  +"'G` - Armenia':{^q=|~g`.am>,'G` - British Virgin Is#s':{^q=|~g`.vg>"
  +",'G` - American Samoa':{^q=|~g`.as>,'G` - Turkmenistan':{^q=|~g`.tm"
  +">,'G` - Trinidad and Tobago':{^q=|~g`.tt>,'G` - Cote D\\'Ivoire':{^"
  +"q=|~g`.ci>,'G` - Seychelles':{^q=|~g`.sc>,'G` - Greece':{^q=|~g`.gr"
  +">,'G` - The Bahamas':{^q=|~g`.bs>,'G` - Kyrgyzstan':{^q=|~g`.kg>,'G"
  +"` - Saint Helena':{^q=|~g`.sh>,'G` - Burundi':{^q=|~g`.bi>,'G` - To"
  +"kelau':{^q=|~g`.tk>,'G` - Rep. du Congo':{^q=|~g`.cg>,'G` - Dominic"
  +"a':{^q=|~g`.dm>,'G` - Sao Tome and Principe':{^q=|~g`.st>,'G` - Rwa"
  +"nda':{^q=|~g`.rw>,'G` - Jordan':{^q=|~g`.jo>,'G` - Czech Republic':"
  +"{^q=|~g`.cz>,'Yandex.ru':{^text=|~yandex.ru>,'G` - Senegal':{^q=|~g"
  +"`.sn>,'G` - Jersey':{^q=|~g`.je>,'G` - Honduras':{^q=|~g`.hn>,'G` -"
  +" Green#':{^q=|~g`.gl>,'G` - Hungary':{^q=|~g`.hu>,'G` - Is#':{^q=|~"
  +"g`.is>,'G` - Pitcairn Is#s':{^q=|~g`.pn>,'G` - Mongolia':{^q=|~g`.m"
  +"n>,'G` - Malawi':{^q=|~g`.mw>,'G` - Montserrat':{^q=|~g`.ms>,'G` - "
  +"Liechtenstein':{^q=|~g`.li>,'G` - Micronesia':{^q=|~g`.fm>,'G` - Ma"
  +"uritius':{^q=|~g`.mu>,'G` - Moldova':{^q=|~g`.md>,'G` - Maldives':{"
  +"^q=|~g`.mv>,'G` - Niue':{^q=|~g`.nu>,'G` - Kazakhstan':{^q=|~g`.kz>"
  +",'G` - Kiribati':{^q=|~g`.ki>,'G` - Nauru':{^q=|~g`.nr>,'G` - Laos'"
  +":{^q=|~g`.la>,'G` - Isle of Man':{^q=|~g`.im>,'G` - Guyana':{^q=|~g"
  +"`.gy>,'G` - Croatia':{^q=|~g`.hr>,'G` - Slovenia':{^q=|~g`.si>,'G` "
  +"- Sri Lanka':{^q=|~g`.lk>,'G` - Azerbaijan':{^q=|~g`.az>,'G` - Bulg"
  +"aria':{^q=|~g`.bg>,'G` - Bosnia-Hercegovina':{^q=|~g`.ba>,'G` - Ton"
  +"ga':{^q=|~g`.to>,'G` - Rep. Dem. du Congo':{^q=|~g`.cd>,'MSN - New "
  +"Zea#':{^q=','mkt=en-nz|~msn.co.nz>,'G` - Djibouti':{^q=|~g`.dj>,'G`"
  +" - Guadeloupe':{^q=|~g`.gp>,'G` - Estonia':{^q=|~g`.ee>,'G` - Samoa"
  +"':{^q=|~g`.ws>,'G` - San Marino':{^q=|~g`.sm>,'MSN UK':{^q=|~msn.co"
  +".uk>,'Mobagee Search':{^q=|~s.mbga.jp>,'Lycos - Italy':{^;=|~lycos."
  +"it>,'Lycos - France':{^;=|~lycos.fr>,'Lycos - Spain':{^;=|~lycos.es"
  +">,'Lycos - Nether#s':{^;=|~lycol.nl>,'Lycos - Germany':{^;=|~lycol."
  +"de','$.lycos.de>,'Magellan':{^$=|~magellan>,'myGO':{^qry=|~mygo*>,'"
  +"NBCi':{^<=','qkw=|~nbci*>,'Nate*':{^;=|~nate*','$.nate*>,'Crooz':{^"
  +";=|~crooz.jp>,'Ask Jeeves':{^ask=','q=|~ask*','ask.co.uk>,'MSN':{^q"
  +"=|~msn*>,'AOL - France':{^q=|~aol.fr>,'MetaIQ*':{^$=','qry=|~metaiq"
  +">,'Web.de':{^su=|~web.de>,'Ask - Japan':{^q=|~ask.jp>,'Microsoft Bi"
  +"ng':{^q=|~bing*>}}";
  s.p_fo = new Function("n", "" 
  + "var s=this;if(!s.__fo){s.__fo=new Object;}if(!s.__fo[n]){s.__fo[n]=" 
  + "new Object;return 1;}else {return 0;}");
  s.isEntry=function(){try{var e,r,n,t=this,i=t.linkInternalFilters,f=t.referrer||"undefined"!=typeof t.referrer?t.referrer:document.referrer,s=i.indexOf(","),u=0,d="";if(!f)return 1;for(n=document.createElement("a"),n.href=f,e=n.hostname;s=i.indexOf(",");){if(d=s>-1?i.substring(0,s):i,d.indexOf("/")>-1){if(r.indexOf(d)>-1)return 0}else if("."==d||e.indexOf(d)>-1)return 0;if(-1==s)break;u=s+1,i=i.substring(u,i.length)}}catch(a){_satellite.notify("isEntry: "+a,1)}return 1};
  // getAndPersistValue - stores a value in a cookie and retrieves it if nothing is set
  //  v = value to store, c = cookie name to store in, e = how long to store in days
  s.getAndPersistValue=new Function("v","c","e",""
  +"var s=this,a=new Date;e=e?e:0;a.setTime(a.getTime()+e*86400000);if("
  +"v)s.c_w(c,v,e?a:0);return s.c_r(c);");
  // custom Marriot campaign tracking
  s.marriottCampaign = function(){
    /* 
     * Order of operations:
     * 1. Check specific referring domains
     * 2. Check cookie and overwrite existing value if set.
     * 3. Check query parameters and overwrite exiting value if set.
    */
    // check for the cookie
    var s = this,
      ref = document.referrer||s.referrer||'',
      // list of query parameters and the formats that follow.  bottom of the list has precedence
      q = [{params: ['mktcmp'], val: 'mktcmp=[mktcmp]'},
        {params: ['ck'], val: 'vedate=[vedate];vetype=[vetype];veseg=[veseg];veof=[veof];ck=[ck];nck=[nck];lk=[lk]'},
        {params: ['aff'], val: 'aff=[aff];affname=[affname];co=[co];nt=[nt]'},
        {params: ['aff','co','nt'], val: 'aff=[aff];affname=[affname];co=[co];nt=[nt]'},
        {params: ['pcamp'], val: 'pcamp=[pcamp]'},
        {params: ['vsretype'], val: 'vsretype=[vsretype];vsresect=[vsresect];vsrelink=[vsrelink];vsrebrand=[vsrebrand];vsremarsha=[vsremarsha]'},
        {params: ['app'], val: 'app=[app]'},
        {params: ['scid'], val: '[scid]'},
        {params: ['aid'], val: 'aid=[aid]'}
      ],
      domains = {
        'gifts.marriott.com':'Unpaid Referrals: gifts.marriott.com',
        'mgs.marriott.com':'Unpaid Referrals: mgs.marriott.com'
      },
      cookie = s.c_r('marketingCampaignTrackingData'),
      // placeholder for campaign
      cmp;

    // 1. DOMAINS
    for(var d in domains){
      if(ref.indexOf(d)>-1){
        cmp = domains[d];
      }
    }

    // 2. COOKIE
    if(cookie){
      // store each of the cookie pieces in "c"
      _satellite.each(cookie.split('&'), function(chip){
        var chp = chip.split('=');
        c[chp[0].toLowerCase()] = chp[1];
      });
      // remove the cookie
      // store campaign cookie and items in data elements
      _satellite.setVar('mkt_chips', c);
      _satellite.setVar('mkt_cookie', cookie);
      // remove cookie
      var exp = new Date();
      exp.setTime(exp.getTime() - 8640000);
      s.c_w('marketingCampaignTrackingData','',exp);

      // scid trumps all
      if(c.scid){
        cmp = c.scid;
        if(s.w.location.pathname == '/reservation/rateListMenu.mi'){
          s.eVar46 = 'External Campaign Referrer';
          s.setEvent('event88');
          s._cb.push(function(){
            s.removeEvent('event88');
            s.eVar46 = '';
          });
        }
      }
      else {
        if(c.pcamp && c.pcamp != 'null'){
          cmp = 'pCamp='+c.pcamp+';';
          if(c.pad && c.pad != 'null'){
            cmp+='pAd='+c.pad+';';
          }
          if(c.pid && c.pid != 'null'){
            cmp+='pId='+c.pid+';';
          }
        }
        if(c.aff){
          cmp = 'aff='+c.aff+';';
        }
        if(c.affname){
          cmp = 'affname='+c.affname+';';
        }
        if(c.vedate){
          cmp = 'vedate='+c.vedate+';vetype='+c.vetype||''+';vseg='+c.veseg||''+';veof='+c.veof||''+';ck='+c.ck||''+';';
          s.eVar39 = c.nck;
        }
        var rk = c.rk || '';
        if(rk && rk.indexOf('r')==0 && ref.length > 0 && ref.indexOf('roomkey') > -1){
          s.addLinkVar('events');
          s.setEvent('event84',{isLink:true});
        }
      }
      if(c.pid && c.pid != 'null'){
        s.eVar31 = c.pid;
        if(s.w.location.pathname == '/reservation/rateListMenu.mi'){
          s.eVar46 = 'External Non-Campaign Referrer';
          s.setEvent('event88');
          s._cb.push(function(){
            s.removeEvent('event88');
            s.eVar46 = '';
          });
        }
      }
      if(c.ppc && c.ppc != 'null'){
        s.pageURL = s.w.location+'?ppc='+c.ppc;
      }
    };
    // 3. QUERY PARAMETERS
    for(var i=0; i<q.length; i++){
      var qp = q[i],
          hasParams = true;
      for(var j=0; j<qp.params.length; j++){
        if(!_satellite.getQueryParamCaseInsensitive(qp.params[j])){
          hasParams = false;
        }
      }
      if(hasParams){
        cmp = qp.val.replace(/\[(.*?)\]/ig, function(m, p){
          return _satellite.getQueryParamCaseInsensitive(p)||'';
        });
      }
    }
    return cmp || '';
  };
  /* Combined Cookies */
  // updated cookie read function
  if(!s.__ccucr){s.c_rr=s.c_r;s.__ccucr=true;s.c_r=new Function("k",""
  +"var s=this,d=new Date,v=s.c_rr(k),c=s.c_rr('s_pers'),i,m,e;if(v)ret"
  +"urn v;k=s.escape(k);i=c.indexOf(' '+k+'=');c=i<0?s.c_rr('s_sess'):c;i="
  +"c.indexOf(' '+k+'=');m=i<0?i:c.indexOf('|',i);e=i<0?i:c.indexOf(';'"
  +",i);m=m>0?m:e;v=i<0?'':s.unescape(c.substring(i+2+k.length,m<0?c.length:"
  +"m));if(m>0&&m!=e)if(parseInt(c.substring(m+1,e<0?c.length:e))<d.get"
  +"Time()){d.setTime(d.getTime()-60000);s.c_w(s.unescape(k),'',d);v='';}ret"
  +"urn v;");}
  // updated cookie write function
  if(!s.__ccucw){s.c_wr=s.c_w;s.__ccucw=true;s.c_w=new Function("k","v","e",""
  +"this.new2 = true;"
  +"var s=this,d=new Date,ht=0,pn='s_pers',sn='s_sess',pc=0,sc=0,pv,sv,"
  +"c,i,t;d.setTime(d.getTime()-60000);if(s.c_rr(k)) s.c_wr(k,'',d);k=s"
  +".escape(k);pv=s.c_rr(pn);i=pv.indexOf(' '+k+'=');if(i>-1){pv=pv.substr"
  +"ing(0,i)+pv.substring(pv.indexOf(';',i)+1);pc=1;}sv=s.c_rr(sn);i=sv"
  +".indexOf(' '+k+'=');if(i>-1){sv=sv.substring(0,i)+sv.substring(sv.i"
  +"ndexOf(';',i)+1);sc=1;}d=new Date;if(e){if(e.getTime()>d.getTime())"
  +"{pv+=' '+k+'='+s.escape(v)+'|'+e.getTime()+';';pc=1;}}else{sv+=' '+k+'"
  +"='+s.escape(v)+';';sc=1;}if(sc) s.c_wr(sn,sv,0);if(pc){t=pv;while(t&&t"
  +".indexOf(';')!=-1){var t1=parseInt(t.substring(t.indexOf('|')+1,t.i"
  +"ndexOf(';')));t=t.substring(t.indexOf(';')+1);ht=ht<t1?t1:ht;}d.set"
  +"Time(ht);s.c_wr(pn,pv,d);}return v==s.c_r(s.unescape(k));");}
  // enhancedLinkTrack - track links easily and beautifully
  s.enhancedLinkTrack=function(e){
    try {var t,l,i=this,n=i.linkObject||i.j,a=(i.pageName||"[not set]",[]),r={},_=function(e,t){var l,i="";if(e.currentStyle)i=e.currentStyle[t];else if(window.getComputedStyle){var l=document.defaultView.getComputedStyle(e,null);try{l&&(i=l[t]?l[t]:l.getPropertyValue(t))}catch(n){}}return i},c=!1,o=!0,s=!1;if(i._elt=i._elt||{},"object"==typeof e)for(z in e)i._elt[z]=e[z];if(e.cookie||(i._elt.cookie=i._elt.cookie||"sc_links"),e.manual_clear||(i._elt.manual_clear=i._elt.manual_clear||!1),e.delim||(i._elt.delim=i._elt.delim||" | "),e.cookie_delim||(i._elt.cookie_delim=i._elt.cookie_delim||"^^"),e.link_track||"undefined"!==e.link_track||(i._elt.link_track=i._elt.link_track||!0),e.custom_attribute||(i._elt.custom_attribute="data-linkname"),i._elt.css_sections=i._elt.css_sections||{},e.section_required||(i._elt.section_required=!1,e.section_required=!1),e.return_obj||(i._elt.return_obj=!1),a[2]=e.default_section||"",i.linkType&&(i._elt.link_track?(i.linkTrackVars=i.linkTrackVars||"",i.linkTrackVars+=(i._elt.page?","+i._elt.page:"")+(i._elt.link?","+i._elt.link:"")+(i._elt.page_link?","+i._elt.page_link:"")):o=!1),o){var t=i.c_r(i._elt.cookie);if(t){var u=t.split(i._elt.cookie_delim);if((1==e.section_required&&a[2]||e.section_required===!1)&&(i._elt.page&&!i[i._elt.page]&&(i[i._elt.page]=u[0]),i._elt.link&&!i[i._elt.link]&&(i[i._elt.link]=u[1]),i._elt.section&&!i[i._elt.section]&&(i[i._elt.section]=u[2]),i._elt.page_link&&!i[i._elt.page_link]&&(i[i._elt.page_link]=u[0]+i._elt.delim+u[1])),!i._elt.manual_clear){var k=new Date;k.setTime(k.getTime()-864e4),i.c_w(i._elt.cookie,"",k)}if(i.linkType&&(s=!0),e.return_obj===!0)return r.page=u[0],r.link=u[1],r.section=u[2],r}}if(!n&&window.event)try{if(window.event.target.nodeName.match(/^SCRIPT$|^BODY$|^HEAD$/)||!window.event.target.nodeName)return;n=window.event.target||window.event.srcElement}catch(d){}if(n||l){if(n.nodeName){for(var m=!1,f=n;0==m;){var g=n.nodeName.toLowerCase(),p=f.nodeName.toLowerCase();("body"==p||"html"==p)&&(m=!0);for(var b in i._elt.css_sections){var v=i._elt.css_sections[b];if(_satellite.matchesCss(b,f)){a[2]=v,m=!0;break}}0==c&&("a"==g||"button"==g?c=!0:"pointer"==_(n,"cursor")?c=!0:n=n.parentNode||n.parentElement),f=f.parentNode||f.parentElement}if(!c)return}if(c){if(a[0]=i.pageName,i._elt.custom_attribute&&n.getAttribute(i._elt.custom_attribute))a[1]=n.getAttribute(i._elt.custom_attribute);else if(null!=n.getAttribute("name")){var w=n.getAttribute("name");w.indexOf("&lid=")>-1&&(a[1]=w.match("&lid=([^&]*)")[1])}else if(n)if(n.innerHTML.indexOf("<img")>-1){for(var T,y=n.children,h=0;h<y.length;h++)if("IMG"==y[h].nodeName){T=y[h];break}if(T.getAttribute("alt"))a[1]="IMG:"+_satellite.cleanText(T.getAttribute("alt"));else{var x=(T.src||T.getAttribute("src")).split("/");a[1]="IMG:"+x.pop()}l=_satellite.cleanText(_satellite.text(n))}else a[1]=_satellite.cleanText(_satellite.text(n));if(l&&(a[1]=_satellite.cleanText(l)),i._elt.exclude)try{var N=new RegExp(i._elt.exclude);a[1].match(N)&&(a[1]=!1)}catch(d){}if(a[0]&&a[1])if(!s&&i.linkType&&i._elt.link_track){if(1==e.section_required&&a[2]||e.section_required===!1){var r={};return r.page=a[0],r.link=a[1],r.section=a[2],r}}else i.c_w(i._elt.cookie,a.join(i._elt.cookie_delim),0)}}return{}
  } catch(err) {
    _satellite.notify("Error caught in s.enhancedLinkTrack : "+err, 1);
  }
};

  /* Media Module */
  window.AppMeasurement_Module_Media = function(q){var b=this;b.s=q;q=window;q.s_c_in||(q.s_c_il=[],q.s_c_in=0);b._il=q.s_c_il;b._in=q.s_c_in;b._il[b._in]=b;q.s_c_in++;b._c="s_m";b.list=[];b.open=function(d,c,e,k){var f={},a=new Date,l="",g;c||(c=-1);if(d&&e){b.list||(b.list={});b.list[d]&&b.close(d);k&&k.id&&(l=k.id);if(l)for(g in b.list)!Object.prototype[g]&&b.list[g]&&b.list[g].R==l&&b.close(b.list[g].name);f.name=d;f.length=c;f.offset=0;f.e=0;f.playerName=b.playerName?b.playerName:e;f.R=l;f.C=0;f.a=0;f.timestamp=
  Math.floor(a.getTime()/1E3);f.k=0;f.u=f.timestamp;f.c=-1;f.n="";f.g=-1;f.D=0;f.I={};f.G=0;f.m=0;f.f="";f.B=0;f.L=0;f.A=0;f.F=0;f.l=!1;f.v="";f.J="";f.K=0;f.r=!1;f.H="";f.complete=0;f.Q=0;f.p=0;f.q=0;b.list[d]=f}};b.openAd=function(d,c,e,k,f,a,l,g){var h={};b.open(d,c,e,g);if(h=b.list[d])h.l=!0,h.v=k,h.J=f,h.K=a,h.H=l};b.M=function(d){var c=b.list[d];b.list[d]=0;c&&c.monitor&&clearTimeout(c.monitor.interval)};b.close=function(d){b.i(d,0,-1)};b.play=function(d,c,e,k){var f=b.i(d,1,c,e,k);f&&!f.monitor&&
  (f.monitor={},f.monitor.update=function(){1==f.k&&b.i(f.name,3,-1);f.monitor.interval=setTimeout(f.monitor.update,1E3)},f.monitor.update())};b.click=function(d,c){b.i(d,7,c)};b.complete=function(d,c){b.i(d,5,c)};b.stop=function(d,c){b.i(d,2,c)};b.track=function(d){b.i(d,4,-1)};b.P=function(d,c){var e="a.media.",k=d.linkTrackVars,f=d.linkTrackEvents,a="m_i",l,g=d.contextData,h;c.l&&(e+="ad.",c.v&&(g["a.media.name"]=c.v,g[e+"pod"]=c.J,g[e+"podPosition"]=c.K),c.G||(g[e+"CPM"]=c.H));c.r&&(g[e+"clicked"]=
  !0,c.r=!1);g["a.contentType"]="video"+(c.l?"Ad":"");g["a.media.channel"]=b.channel;g[e+"name"]=c.name;g[e+"playerName"]=c.playerName;0<c.length&&(g[e+"length"]=c.length);g[e+"timePlayed"]=Math.floor(c.a);0<Math.floor(c.a)&&(g[e+"timePlayed"]=Math.floor(c.a));c.G||(g[e+"view"]=!0,a="m_s",b.Heartbeat&&b.Heartbeat.enabled&&(a=c.l?b.__primetime?"mspa_s":"msa_s":b.__primetime?"msp_s":"ms_s"),c.G=1);c.f&&(g[e+"segmentNum"]=c.m,g[e+"segment"]=c.f,0<c.B&&(g[e+"segmentLength"]=c.B),c.A&&0<c.a&&(g[e+"segmentView"]=
  !0));!c.Q&&c.complete&&(g[e+"complete"]=!0,c.S=1);0<c.p&&(g[e+"milestone"]=c.p);0<c.q&&(g[e+"offsetMilestone"]=c.q);if(k)for(h in g)Object.prototype[h]||(k+=",contextData."+h);l=g["a.contentType"];d.pe=a;d.pev3=l;var q,s;if(b.contextDataMapping)for(h in d.events2||(d.events2=""),k&&(k+=",events"),b.contextDataMapping)if(!Object.prototype[h]){a=h.length>e.length&&h.substring(0,e.length)==e?h.substring(e.length):"";l=b.contextDataMapping[h];if("string"==typeof l)for(q=l.split(","),s=0;s<q.length;s++)l=
  q[s],"a.contentType"==h?(k&&(k+=","+l),d[l]=g[h]):"view"==a||"segmentView"==a||"clicked"==a||"complete"==a||"timePlayed"==a||"CPM"==a?(f&&(f+=","+l),"timePlayed"==a||"CPM"==a?g[h]&&(d.events2+=(d.events2?",":"")+l+"="+g[h]):g[h]&&(d.events2+=(d.events2?",":"")+l)):"segment"==a&&g[h+"Num"]?(k&&(k+=","+l),d[l]=g[h+"Num"]+":"+g[h]):(k&&(k+=","+l),d[l]=g[h]);else if("milestones"==a||"offsetMilestones"==a)h=h.substring(0,h.length-1),g[h]&&b.contextDataMapping[h+"s"][g[h]]&&(f&&(f+=","+b.contextDataMapping[h+
  "s"][g[h]]),d.events2+=(d.events2?",":"")+b.contextDataMapping[h+"s"][g[h]]);g[h]&&(g[h]=0);"segment"==a&&g[h+"Num"]&&(g[h+"Num"]=0)}d.linkTrackVars=k;d.linkTrackEvents=f};b.i=function(d,c,e,k,f){var a={},l=(new Date).getTime()/1E3,g,h,q=b.trackVars,s=b.trackEvents,t=b.trackSeconds,u=b.trackMilestones,v=b.trackOffsetMilestones,w=b.segmentByMilestones,x=b.segmentByOffsetMilestones,p,n,r=1,m={},y;b.channel||(b.channel=b.s.w.location.hostname);if(a=d&&b.list&&b.list[d]?b.list[d]:0)if(a.l&&(t=b.adTrackSeconds,
  u=b.adTrackMilestones,v=b.adTrackOffsetMilestones,w=b.adSegmentByMilestones,x=b.adSegmentByOffsetMilestones),0>e&&(e=1==a.k&&0<a.u?l-a.u+a.c:a.c),0<a.length&&(e=e<a.length?e:a.length),0>e&&(e=0),a.offset=e,0<a.length&&(a.e=a.offset/a.length*100,a.e=100<a.e?100:a.e),0>a.c&&(a.c=e),y=a.D,m.name=d,m.ad=a.l,m.length=a.length,m.openTime=new Date,m.openTime.setTime(1E3*a.timestamp),m.offset=a.offset,m.percent=a.e,m.playerName=a.playerName,m.mediaEvent=0>a.g?"OPEN":1==c?"PLAY":2==c?"STOP":3==c?"MONITOR":
  4==c?"TRACK":5==c?"COMPLETE":7==c?"CLICK":"CLOSE",2<c||c!=a.k&&(2!=c||1==a.k)){f||(k=a.m,f=a.f);if(c){1==c&&(a.c=e);if((3>=c||5<=c)&&0<=a.g&&(r=!1,q=s="None",a.g!=e)){h=a.g;h>e&&(h=a.c,h>e&&(h=e));p=u?u.split(","):0;if(0<a.length&&p&&e>=h)for(n=0;n<p.length;n++)(g=p[n]?parseFloat(""+p[n]):0)&&h/a.length*100<g&&a.e>=g&&(r=!0,n=p.length,m.mediaEvent="MILESTONE",a.p=m.milestone=g);if((p=v?v.split(","):0)&&e>=h)for(n=0;n<p.length;n++)(g=p[n]?parseFloat(""+p[n]):0)&&h<g&&e>=g&&(r=!0,n=p.length,m.mediaEvent=
  "OFFSET_MILESTONE",a.q=m.offsetMilestone=g)}if(a.L||!f){if(w&&u&&0<a.length){if(p=u.split(","))for(p.push("100"),n=h=0;n<p.length;n++)if(g=p[n]?parseFloat(""+p[n]):0)a.e<g&&(k=n+1,f="M:"+h+"-"+g,n=p.length),h=g}else if(x&&v&&(p=v.split(",")))for(p.push(""+(0<a.length?a.length:"E")),n=h=0;n<p.length;n++)if((g=p[n]?parseFloat(""+p[n]):0)||"E"==p[n]){if(e<g||"E"==p[n])k=n+1,f="O:"+h+"-"+g,n=p.length;h=g}f&&(a.L=!0)}(f||a.f)&&f!=a.f&&(a.F=!0,a.f||(a.m=k,a.f=f),0<=a.g&&(r=!0));(2<=c||100<=a.e)&&a.c<e&&
  (a.C+=e-a.c,a.a+=e-a.c);if(2>=c||3==c&&!a.k)a.n+=(1==c||3==c?"S":"E")+Math.floor(e),a.k=3==c?1:c;!r&&0<=a.g&&3>=c&&(t=t?t:0)&&a.a>=t&&(r=!0,m.mediaEvent="SECONDS");a.u=l;a.c=e}if(!c||3>=c&&100<=a.e)2!=a.k&&(a.n+="E"+Math.floor(e)),c=0,q=s="None",m.mediaEvent="CLOSE";7==c&&(r=m.clicked=a.r=!0);if(5==c||b.completeByCloseOffset&&(!c||100<=a.e)&&0<a.length&&e>=a.length-b.completeCloseOffsetThreshold)r=m.complete=a.complete=!0;l=m.mediaEvent;"MILESTONE"==l?l+="_"+m.milestone:"OFFSET_MILESTONE"==l&&(l+=
  "_"+m.offsetMilestone);a.I[l]?m.eventFirstTime=!1:(m.eventFirstTime=!0,a.I[l]=1);m.event=m.mediaEvent;m.timePlayed=a.C;m.segmentNum=a.m;m.segment=a.f;m.segmentLength=a.B;b.monitor&&4!=c&&b.monitor(b.s,m);b.Heartbeat&&b.Heartbeat.enabled&&0<=a.g&&(r=!1);0==c&&b.M(d);r&&a.D==y&&(d={contextData:{}},d.linkTrackVars=q,d.linkTrackEvents=s,d.linkTrackVars||(d.linkTrackVars=""),d.linkTrackEvents||(d.linkTrackEvents=""),b.P(d,a),d.linkTrackVars||(d["!linkTrackVars"]=1),d.linkTrackEvents||(d["!linkTrackEvents"]=
  1),b.s.track(d),a.F?(a.m=k,a.f=f,a.A=!0,a.F=!1):0<a.a&&(a.A=!1),a.n="",a.p=a.q=0,a.a-=Math.floor(a.a),a.g=e,a.D++)}return a};b.O=function(d,c,e,k,f){var a=0;if(d&&(!b.autoTrackMediaLengthRequired||c&&0<c)){if(b.list&&b.list[d])a=1;else if(1==e||3==e)b.open(d,c,"HTML5 Video",f),a=1;a&&b.i(d,e,k,-1,0)}};b.attach=function(d){var c,e,k;d&&d.tagName&&"VIDEO"==d.tagName.toUpperCase()&&(b.o||(b.o=function(c,a,d){var e,h;b.autoTrack&&(e=c.currentSrc,(h=c.duration)||(h=-1),0>d&&(d=c.currentTime),b.O(e,h,a,
  d,c))}),c=function(){b.o(d,1,-1)},e=function(){b.o(d,1,-1)},b.j(d,"play",c),b.j(d,"pause",e),b.j(d,"seeking",e),b.j(d,"seeked",c),b.j(d,"ended",function(){b.o(d,0,-1)}),b.j(d,"timeupdate",c),k=function(){d.paused||d.ended||d.seeking||b.o(d,3,-1);setTimeout(k,1E3)},k())};b.j=function(b,c,e){b.attachEvent?b.attachEvent("on"+c,e):b.addEventListener&&b.addEventListener(c,e,!1)};void 0==b.completeByCloseOffset&&(b.completeByCloseOffset=1);void 0==b.completeCloseOffsetThreshold&&(b.completeCloseOffsetThreshold=
  1);b.Heartbeat={};b.N=function(){var d,c;if(b.autoTrack&&(d=b.s.d.getElementsByTagName("VIDEO")))for(c=0;c<d.length;c++)b.attach(d[c])};b.j(q,"load",b.N)}
  s.loadModule('Media');

  // create global s object
  window[sObj] = s;
})();

/* 
	Page timing plug in for Adobe Analytics
	Author : Stewart Schilling - Search Discovey Inc.  10/10/2015
	================================================================
	Captures seven key timing measurements relative to navigationStart.
		-Timing info is recorded on the present page and persisted into sessionStorage.performanceTiming
		-On the next page sessionStorage.performanceTiming is processed and added to the next s.t() call.
		-Note that timing from the last page of a session will not be captured.
		-Note that sessionStorage does not span protocols or domains, so timing info will not either.
		-A TLD cookie solution would partially solve these limitations, but would add unwanted overhead.

	Required technology : (Will not capture on IE8, Opera Mini8, iOS Safari8.4)
		performance.timing (See: http://caniuse.com/#search=performance.timing)
		sessionStorage (See : http://caniuse.com/#search=sessionStorage)

		s.apl plugin in Adobe Analytics configuration (See : https://marketing.adobe.com/resources/help/en_US/sc/implement/appendList.html)
    
*/
window._sdiTiming={sObj : s}; //Modify to match your Adobe Analytics 's' object

if ((window.performance)&&(window.sessionStorage)){
  window._sdiTiming.loadChecker = setInterval(function(){ _sdiTiming.checkLoad() }, 250);
}
window._sdiTiming.checkLoad= function () {
	if (window.performance.timing.loadEventEnd > 0) {
			clearInterval(window._sdiTiming.loadChecker);
		_sdiTiming.processTimingData();
	}
}
window._sdiTiming.processTimingData = function () {
	var pt=window.performance.timing;
	var ptZero=pt.navigationStart;
	var ptObj= {
		A_domainLookupEnd	: {
			ms : pt.domainLookupEnd - ptZero,
			bucket : _sdiTiming.getTimeBucket(pt.domainLookupEnd - ptZero) 
		},
		B_connectEnd		: {
			ms : pt.connectEnd - ptZero,
			bucket : _sdiTiming.getTimeBucket(pt.connectEnd - ptZero) 
		},		
		C_responseStart		: {
			ms : pt.responseStart - ptZero,
			bucket : _sdiTiming.getTimeBucket(pt.responseStart - ptZero) 
		},	
		D_responseEnd		: {
			ms : pt.responseEnd - ptZero,
			bucket : _sdiTiming.getTimeBucket(pt.responseEnd - ptZero) 
		},	
		E_domInteractive	: {
			ms : pt.domInteractive - ptZero,
			bucket : _sdiTiming.getTimeBucket(pt.domInteractive - ptZero) 
		},	
		F_domComplete		: {
			ms : pt.domComplete - ptZero,
			bucket : _sdiTiming.getTimeBucket(pt.domComplete - ptZero) 
		},
		G_loadEventEnd		: {
			ms : pt.loadEventEnd - ptZero,
			bucket : _sdiTiming.getTimeBucket(pt.loadEventEnd - ptZero) 
		},
		timingPageName			: _sdiTiming.sObj.pageName||document.location.pathname,
		timingBuckets		: ""  
	};
	for (node in ptObj) {
		if (typeof ptObj[node].ms == "number"){
	  		ptObj.timingBuckets+=node[0]+ptObj[node].bucket;
		}
	}

	//Sanity check on the data.  G must be less than 5 minutes. Also G>=F>=E>=D>=C>=B>=A>=0
	if ((ptObj.G_loadEventEnd.ms<=300000)&&(ptObj.G_loadEventEnd.ms>=ptObj.F_domComplete.ms)&&(ptObj.F_domComplete.ms>=ptObj.E_domInteractive.ms)&&(ptObj.E_domInteractive.ms>=ptObj.D_responseEnd.ms)&&(ptObj.D_responseEnd.ms>=ptObj.C_responseStart.ms)&&(ptObj.C_responseStart.ms>=ptObj.B_connectEnd.ms)&&(ptObj.B_connectEnd.ms>=ptObj.A_domainLookupEnd.ms)&&(ptObj.A_domainLookupEnd.ms>=0)) {
		sessionStorage.setItem("performanceTiming", JSON.stringify(ptObj));
	}	
}
window._sdiTiming.getTimeBucket = function (time) {
	var bucket="";
	if (typeof time == "number"){
		if (time < 20000) {
			for (var i=1; i<=20; i++){
				if (time/(i*1000) < 1) {
					bucket="("+(i-1)+"-"+i+")";
					break;
				}
			}
		} else {
			bucket="(>20)";
		}
	} else {
		bucket="(999)";
	}
	return bucket;
}
window._sdiTiming.getTimingInfo = function () {
	var results={};
	if ((window.performance)&&(window.sessionStorage)){
	  if ((typeof s.linkType == "undefined")&&(typeof s.linkName == "undefined")){
	    if (sessionStorage.getItem("performanceTiming")){ 
	      try {
		      	results=JSON.parse(sessionStorage.getItem("performanceTiming"));
				sessionStorage.removeItem("performanceTiming");
	        } catch (e) {
	          if (window.console){
	          		console.log(e)
	          		console.log("Error _sdiTiming : Could not parse performance timing data from sessionStorage");
	        	};
	        }
	    } 
	  }
	}
	return results;
}
/*
 ============== DO NOT ALTER ANYTHING BELOW THIS LINE ! ===============

AppMeasurement for JavaScript version: 1.5.3
Copyright 1996-2016 Adobe, Inc. All Rights Reserved
More info available at http://www.omniture.com
*/
function AppMeasurement(){var a=this;a.version="1.5.3";var k=window;k.s_c_in||(k.s_c_il=[],k.s_c_in=0);a._il=k.s_c_il;a._in=k.s_c_in;a._il[a._in]=a;k.s_c_in++;a._c="s_c";var q=k.AppMeasurement.zb;q||(q=null);var r=k,n,t;try{for(n=r.parent,t=r.location;n&&n.location&&t&&""+n.location!=""+t&&r.location&&""+n.location!=""+r.location&&n.location.host==t.host;)r=n,n=r.parent}catch(u){}a.ob=function(a){try{console.log(a)}catch(b){}};a.za=function(a){return""+parseInt(a)==""+a};a.replace=function(a,b,d){return!a||
0>a.indexOf(b)?a:a.split(b).join(d)};a.escape=function(c){var b,d;if(!c)return c;c=encodeURIComponent(c);for(b=0;7>b;b++)d="+~!*()'".substring(b,b+1),0<=c.indexOf(d)&&(c=a.replace(c,d,"%"+d.charCodeAt(0).toString(16).toUpperCase()));return c};a.unescape=function(c){if(!c)return c;c=0<=c.indexOf("+")?a.replace(c,"+"," "):c;try{return decodeURIComponent(c)}catch(b){}return unescape(c)};a.gb=function(){var c=k.location.hostname,b=a.fpCookieDomainPeriods,d;b||(b=a.cookieDomainPeriods);if(c&&!a.cookieDomain&&
!/^[0-9.]+$/.test(c)&&(b=b?parseInt(b):2,b=2<b?b:2,d=c.lastIndexOf("."),0<=d)){for(;0<=d&&1<b;)d=c.lastIndexOf(".",d-1),b--;a.cookieDomain=0<d?c.substring(d):c}return a.cookieDomain};a.c_r=a.cookieRead=function(c){c=a.escape(c);var b=" "+a.d.cookie,d=b.indexOf(" "+c+"="),f=0>d?d:b.indexOf(";",d);c=0>d?"":a.unescape(b.substring(d+2+c.length,0>f?b.length:f));return"[[B]]"!=c?c:""};a.c_w=a.cookieWrite=function(c,b,d){var f=a.gb(),e=a.cookieLifetime,g;b=""+b;e=e?(""+e).toUpperCase():"";d&&"SESSION"!=
e&&"NONE"!=e&&((g=""!=b?parseInt(e?e:0):-60)?(d=new Date,d.setTime(d.getTime()+1E3*g)):1==d&&(d=new Date,g=d.getYear(),d.setYear(g+5+(1900>g?1900:0))));return c&&"NONE"!=e?(a.d.cookie=c+"="+a.escape(""!=b?b:"[[B]]")+"; path=/;"+(d&&"SESSION"!=e?" expires="+d.toGMTString()+";":"")+(f?" domain="+f+";":""),a.cookieRead(c)==b):0};a.G=[];a.ba=function(c,b,d){if(a.ta)return 0;a.maxDelay||(a.maxDelay=250);var f=0,e=(new Date).getTime()+a.maxDelay,g=a.d.visibilityState,m=["webkitvisibilitychange","visibilitychange"];
g||(g=a.d.webkitVisibilityState);if(g&&"prerender"==g){if(!a.ca)for(a.ca=1,d=0;d<m.length;d++)a.d.addEventListener(m[d],function(){var c=a.d.visibilityState;c||(c=a.d.webkitVisibilityState);"visible"==c&&(a.ca=0,a.delayReady())});f=1;e=0}else d||a.l("_d")&&(f=1);f&&(a.G.push({m:c,a:b,t:e}),a.ca||setTimeout(a.delayReady,a.maxDelay));return f};a.delayReady=function(){var c=(new Date).getTime(),b=0,d;for(a.l("_d")?b=1:a.na();0<a.G.length;){d=a.G.shift();if(b&&!d.t&&d.t>c){a.G.unshift(d);setTimeout(a.delayReady,
parseInt(a.maxDelay/2));break}a.ta=1;a[d.m].apply(a,d.a);a.ta=0}};a.setAccount=a.sa=function(c){var b,d;if(!a.ba("setAccount",arguments))if(a.account=c,a.allAccounts)for(b=a.allAccounts.concat(c.split(",")),a.allAccounts=[],b.sort(),d=0;d<b.length;d++)0!=d&&b[d-1]==b[d]||a.allAccounts.push(b[d]);else a.allAccounts=c.split(",")};a.foreachVar=function(c,b){var d,f,e,g,m="";e=f="";if(a.lightProfileID)d=a.K,(m=a.lightTrackVars)&&(m=","+m+","+a.ga.join(",")+",");else{d=a.c;if(a.pe||a.linkType)m=a.linkTrackVars,
f=a.linkTrackEvents,a.pe&&(e=a.pe.substring(0,1).toUpperCase()+a.pe.substring(1),a[e]&&(m=a[e].yb,f=a[e].xb));m&&(m=","+m+","+a.A.join(",")+",");f&&m&&(m+=",events,")}b&&(b=","+b+",");for(f=0;f<d.length;f++)e=d[f],(g=a[e])&&(!m||0<=m.indexOf(","+e+","))&&(!b||0<=b.indexOf(","+e+","))&&c(e,g)};a.B=function(c,b,d,f,e){var g="",m,p,k,w,n=0;"contextData"==c&&(c="c");if(b){for(m in b)if(!(Object.prototype[m]||e&&m.substring(0,e.length)!=e)&&b[m]&&(!d||0<=d.indexOf(","+(f?f+".":"")+m+","))){k=!1;if(n)for(p=
0;p<n.length;p++)m.substring(0,n[p].length)==n[p]&&(k=!0);if(!k&&(""==g&&(g+="&"+c+"."),p=b[m],e&&(m=m.substring(e.length)),0<m.length))if(k=m.indexOf("."),0<k)p=m.substring(0,k),k=(e?e:"")+p+".",n||(n=[]),n.push(k),g+=a.B(p,b,d,f,k);else if("boolean"==typeof p&&(p=p?"true":"false"),p){if("retrieveLightData"==f&&0>e.indexOf(".contextData."))switch(k=m.substring(0,4),w=m.substring(4),m){case "transactionID":m="xact";break;case "channel":m="ch";break;case "campaign":m="v0";break;default:a.za(w)&&("prop"==
k?m="c"+w:"eVar"==k?m="v"+w:"list"==k?m="l"+w:"hier"==k&&(m="h"+w,p=p.substring(0,255)))}g+="&"+a.escape(m)+"="+a.escape(p)}}""!=g&&(g+="&."+c)}return g};a.ib=function(){var c="",b,d,f,e,g,m,p,k,n="",r="",s=e="";if(a.lightProfileID)b=a.K,(n=a.lightTrackVars)&&(n=","+n+","+a.ga.join(",")+",");else{b=a.c;if(a.pe||a.linkType)n=a.linkTrackVars,r=a.linkTrackEvents,a.pe&&(e=a.pe.substring(0,1).toUpperCase()+a.pe.substring(1),a[e]&&(n=a[e].yb,r=a[e].xb));n&&(n=","+n+","+a.A.join(",")+",");r&&(r=","+r+",",
n&&(n+=",events,"));a.events2&&(s+=(""!=s?",":"")+a.events2)}if(a.visitor&&1.5<=parseFloat(a.visitor.version)&&a.visitor.getCustomerIDs){e=q;if(g=a.visitor.getCustomerIDs())for(d in g)Object.prototype[d]||(f=g[d],e||(e={}),f.id&&(e[d+".id"]=f.id),f.authState&&(e[d+".as"]=f.authState));e&&(c+=a.B("cid",e))}a.AudienceManagement&&a.AudienceManagement.isReady()&&(c+=a.B("d",a.AudienceManagement.getEventCallConfigParams()));for(d=0;d<b.length;d++){e=b[d];g=a[e];f=e.substring(0,4);m=e.substring(4);!g&&
"events"==e&&s&&(g=s,s="");if(g&&(!n||0<=n.indexOf(","+e+","))){switch(e){case "supplementalDataID":e="sdid";break;case "timestamp":e="ts";break;case "dynamicVariablePrefix":e="D";break;case "visitorID":e="vid";break;case "marketingCloudVisitorID":e="mid";break;case "analyticsVisitorID":e="aid";break;case "audienceManagerLocationHint":e="aamlh";break;case "audienceManagerBlob":e="aamb";break;case "authState":e="as";break;case "pageURL":e="g";255<g.length&&(a.pageURLRest=g.substring(255),g=g.substring(0,
255));break;case "pageURLRest":e="-g";break;case "referrer":e="r";break;case "vmk":case "visitorMigrationKey":e="vmt";break;case "visitorMigrationServer":e="vmf";a.ssl&&a.visitorMigrationServerSecure&&(g="");break;case "visitorMigrationServerSecure":e="vmf";!a.ssl&&a.visitorMigrationServer&&(g="");break;case "charSet":e="ce";break;case "visitorNamespace":e="ns";break;case "cookieDomainPeriods":e="cdp";break;case "cookieLifetime":e="cl";break;case "variableProvider":e="vvp";break;case "currencyCode":e=
"cc";break;case "channel":e="ch";break;case "transactionID":e="xact";break;case "campaign":e="v0";break;case "latitude":e="lat";break;case "longitude":e="lon";break;case "resolution":e="s";break;case "colorDepth":e="c";break;case "javascriptVersion":e="j";break;case "javaEnabled":e="v";break;case "cookiesEnabled":e="k";break;case "browserWidth":e="bw";break;case "browserHeight":e="bh";break;case "connectionType":e="ct";break;case "homepage":e="hp";break;case "events":s&&(g+=(""!=g?",":"")+s);if(r)for(m=
g.split(","),g="",f=0;f<m.length;f++)p=m[f],k=p.indexOf("="),0<=k&&(p=p.substring(0,k)),k=p.indexOf(":"),0<=k&&(p=p.substring(0,k)),0<=r.indexOf(","+p+",")&&(g+=(g?",":"")+m[f]);break;case "events2":g="";break;case "contextData":c+=a.B("c",a[e],n,e);g="";break;case "lightProfileID":e="mtp";break;case "lightStoreForSeconds":e="mtss";a.lightProfileID||(g="");break;case "lightIncrementBy":e="mti";a.lightProfileID||(g="");break;case "retrieveLightProfiles":e="mtsr";break;case "deleteLightProfiles":e=
"mtsd";break;case "retrieveLightData":a.retrieveLightProfiles&&(c+=a.B("mts",a[e],n,e));g="";break;default:a.za(m)&&("prop"==f?e="c"+m:"eVar"==f?e="v"+m:"list"==f?e="l"+m:"hier"==f&&(e="h"+m,g=g.substring(0,255)))}g&&(c+="&"+e+"="+("pev"!=e.substring(0,3)?a.escape(g):g))}"pev3"==e&&a.e&&(c+=a.e)}return c};a.u=function(a){var b=a.tagName;if("undefined"!=""+a.Cb||"undefined"!=""+a.sb&&"HTML"!=(""+a.sb).toUpperCase())return"";b=b&&b.toUpperCase?b.toUpperCase():"";"SHAPE"==b&&(b="");b&&(("INPUT"==b||
"BUTTON"==b)&&a.type&&a.type.toUpperCase?b=a.type.toUpperCase():!b&&a.href&&(b="A"));return b};a.va=function(a){var b=a.href?a.href:"",d,f,e;d=b.indexOf(":");f=b.indexOf("?");e=b.indexOf("/");b&&(0>d||0<=f&&d>f||0<=e&&d>e)&&(f=a.protocol&&1<a.protocol.length?a.protocol:l.protocol?l.protocol:"",d=l.pathname.lastIndexOf("/"),b=(f?f+"//":"")+(a.host?a.host:l.host?l.host:"")+("/"!=h.substring(0,1)?l.pathname.substring(0,0>d?0:d)+"/":"")+b);return b};a.H=function(c){var b=a.u(c),d,f,e="",g=0;return b&&
(d=c.protocol,f=c.onclick,!c.href||"A"!=b&&"AREA"!=b||f&&d&&!(0>d.toLowerCase().indexOf("javascript"))?f?(e=a.replace(a.replace(a.replace(a.replace(""+f,"\r",""),"\n",""),"\t","")," ",""),g=2):"INPUT"==b||"SUBMIT"==b?(c.value?e=c.value:c.innerText?e=c.innerText:c.textContent&&(e=c.textContent),g=3):c.src&&"IMAGE"==b&&(e=c.src):e=a.va(c),e)?{id:e.substring(0,100),type:g}:0};a.Ab=function(c){for(var b=a.u(c),d=a.H(c);c&&!d&&"BODY"!=b;)if(c=c.parentElement?c.parentElement:c.parentNode)b=a.u(c),d=a.H(c);
d&&"BODY"!=b||(c=0);c&&(b=c.onclick?""+c.onclick:"",0<=b.indexOf(".tl(")||0<=b.indexOf(".trackLink("))&&(c=0);return c};a.rb=function(){var c,b,d=a.linkObject,f=a.linkType,e=a.linkURL,g,m;a.ha=1;d||(a.ha=0,d=a.clickObject);if(d){c=a.u(d);for(b=a.H(d);d&&!b&&"BODY"!=c;)if(d=d.parentElement?d.parentElement:d.parentNode)c=a.u(d),b=a.H(d);b&&"BODY"!=c||(d=0);if(d&&!a.linkObject){var p=d.onclick?""+d.onclick:"";if(0<=p.indexOf(".tl(")||0<=p.indexOf(".trackLink("))d=0}}else a.ha=1;!e&&d&&(e=a.va(d));e&&
!a.linkLeaveQueryString&&(g=e.indexOf("?"),0<=g&&(e=e.substring(0,g)));if(!f&&e){var n=0,r=0,q;if(a.trackDownloadLinks&&a.linkDownloadFileTypes)for(p=e.toLowerCase(),g=p.indexOf("?"),m=p.indexOf("#"),0<=g?0<=m&&m<g&&(g=m):g=m,0<=g&&(p=p.substring(0,g)),g=a.linkDownloadFileTypes.toLowerCase().split(","),m=0;m<g.length;m++)(q=g[m])&&p.substring(p.length-(q.length+1))=="."+q&&(f="d");if(a.trackExternalLinks&&!f&&(p=e.toLowerCase(),a.ya(p)&&(a.linkInternalFilters||(a.linkInternalFilters=k.location.hostname),
g=0,a.linkExternalFilters?(g=a.linkExternalFilters.toLowerCase().split(","),n=1):a.linkInternalFilters&&(g=a.linkInternalFilters.toLowerCase().split(",")),g))){for(m=0;m<g.length;m++)q=g[m],0<=p.indexOf(q)&&(r=1);r?n&&(f="e"):n||(f="e")}}a.linkObject=d;a.linkURL=e;a.linkType=f;if(a.trackClickMap||a.trackInlineStats)a.e="",d&&(f=a.pageName,e=1,d=d.sourceIndex,f||(f=a.pageURL,e=0),k.s_objectID&&(b.id=k.s_objectID,d=b.type=1),f&&b&&b.id&&c&&(a.e="&pid="+a.escape(f.substring(0,255))+(e?"&pidt="+e:"")+
"&oid="+a.escape(b.id.substring(0,100))+(b.type?"&oidt="+b.type:"")+"&ot="+c+(d?"&oi="+d:"")))};a.jb=function(){var c=a.ha,b=a.linkType,d=a.linkURL,f=a.linkName;b&&(d||f)&&(b=b.toLowerCase(),"d"!=b&&"e"!=b&&(b="o"),a.pe="lnk_"+b,a.pev1=d?a.escape(d):"",a.pev2=f?a.escape(f):"",c=1);a.abort&&(c=0);if(a.trackClickMap||a.trackInlineStats){var b={},d=0,e=a.cookieRead("s_sq"),g=e?e.split("&"):0,m,p,k,e=0;if(g)for(m=0;m<g.length;m++)p=g[m].split("="),f=a.unescape(p[0]).split(","),p=a.unescape(p[1]),b[p]=
f;f=a.account.split(",");if(c||a.e){c&&!a.e&&(e=1);for(p in b)if(!Object.prototype[p])for(m=0;m<f.length;m++)for(e&&(k=b[p].join(","),k==a.account&&(a.e+=("&"!=p.charAt(0)?"&":"")+p,b[p]=[],d=1)),g=0;g<b[p].length;g++)k=b[p][g],k==f[m]&&(e&&(a.e+="&u="+a.escape(k)+("&"!=p.charAt(0)?"&":"")+p+"&u=0"),b[p].splice(g,1),d=1);c||(d=1);if(d){e="";m=2;!c&&a.e&&(e=a.escape(f.join(","))+"="+a.escape(a.e),m=1);for(p in b)!Object.prototype[p]&&0<m&&0<b[p].length&&(e+=(e?"&":"")+a.escape(b[p].join(","))+"="+
a.escape(p),m--);a.cookieWrite("s_sq",e)}}}return c};a.kb=function(){if(!a.wb){var c=new Date,b=r.location,d,f,e=f=d="",g="",m="",k="1.2",n=a.cookieWrite("s_cc","true",0)?"Y":"N",q="",s="";if(c.setUTCDate&&(k="1.3",(0).toPrecision&&(k="1.5",c=[],c.forEach))){k="1.6";f=0;d={};try{f=new Iterator(d),f.next&&(k="1.7",c.reduce&&(k="1.8",k.trim&&(k="1.8.1",Date.parse&&(k="1.8.2",Object.create&&(k="1.8.5")))))}catch(t){}}d=screen.width+"x"+screen.height;e=navigator.javaEnabled()?"Y":"N";f=screen.pixelDepth?
screen.pixelDepth:screen.colorDepth;g=a.w.innerWidth?a.w.innerWidth:a.d.documentElement.offsetWidth;m=a.w.innerHeight?a.w.innerHeight:a.d.documentElement.offsetHeight;try{a.b.addBehavior("#default#homePage"),q=a.b.Bb(b)?"Y":"N"}catch(u){}try{a.b.addBehavior("#default#clientCaps"),s=a.b.connectionType}catch(x){}a.resolution=d;a.colorDepth=f;a.javascriptVersion=k;a.javaEnabled=e;a.cookiesEnabled=n;a.browserWidth=g;a.browserHeight=m;a.connectionType=s;a.homepage=q;a.wb=1}};a.L={};a.loadModule=function(c,
b){var d=a.L[c];if(!d){d=k["AppMeasurement_Module_"+c]?new k["AppMeasurement_Module_"+c](a):{};a.L[c]=a[c]=d;d.Oa=function(){return d.Sa};d.Ta=function(b){if(d.Sa=b)a[c+"_onLoad"]=b,a.ba(c+"_onLoad",[a,d],1)||b(a,d)};try{Object.defineProperty?Object.defineProperty(d,"onLoad",{get:d.Oa,set:d.Ta}):d._olc=1}catch(f){d._olc=1}}b&&(a[c+"_onLoad"]=b,a.ba(c+"_onLoad",[a,d],1)||b(a,d))};a.l=function(c){var b,d;for(b in a.L)if(!Object.prototype[b]&&(d=a.L[b])&&(d._olc&&d.onLoad&&(d._olc=0,d.onLoad(a,d)),d[c]&&
d[c]()))return 1;return 0};a.mb=function(){var c=Math.floor(1E13*Math.random()),b=a.visitorSampling,d=a.visitorSamplingGroup,d="s_vsn_"+(a.visitorNamespace?a.visitorNamespace:a.account)+(d?"_"+d:""),f=a.cookieRead(d);if(b){f&&(f=parseInt(f));if(!f){if(!a.cookieWrite(d,c))return 0;f=c}if(f%1E4>v)return 0}return 1};a.M=function(c,b){var d,f,e,g,m,k;for(d=0;2>d;d++)for(f=0<d?a.oa:a.c,e=0;e<f.length;e++)if(g=f[e],(m=c[g])||c["!"+g]){if(!b&&("contextData"==g||"retrieveLightData"==g)&&a[g])for(k in a[g])m[k]||
(m[k]=a[g][k]);a[g]=m}};a.Ha=function(c,b){var d,f,e,g;for(d=0;2>d;d++)for(f=0<d?a.oa:a.c,e=0;e<f.length;e++)g=f[e],c[g]=a[g],b||c[g]||(c["!"+g]=1)};a.eb=function(a){var b,d,f,e,g,m=0,k,n="",q="";if(a&&255<a.length&&(b=""+a,d=b.indexOf("?"),0<d&&(k=b.substring(d+1),b=b.substring(0,d),e=b.toLowerCase(),f=0,"http://"==e.substring(0,7)?f+=7:"https://"==e.substring(0,8)&&(f+=8),d=e.indexOf("/",f),0<d&&(e=e.substring(f,d),g=b.substring(d),b=b.substring(0,d),0<=e.indexOf("google")?m=",q,ie,start,search_key,word,kw,cd,":
0<=e.indexOf("yahoo.co")&&(m=",p,ei,"),m&&k)))){if((a=k.split("&"))&&1<a.length){for(f=0;f<a.length;f++)e=a[f],d=e.indexOf("="),0<d&&0<=m.indexOf(","+e.substring(0,d)+",")?n+=(n?"&":"")+e:q+=(q?"&":"")+e;n&&q?k=n+"&"+q:q=""}d=253-(k.length-q.length)-b.length;a=b+(0<d?g.substring(0,d):"")+"?"+k}return a};a.Na=function(c){var b=a.d.visibilityState,d=["webkitvisibilitychange","visibilitychange"];b||(b=a.d.webkitVisibilityState);if(b&&"prerender"==b){if(c)for(b=0;b<d.length;b++)a.d.addEventListener(d[b],
function(){var b=a.d.visibilityState;b||(b=a.d.webkitVisibilityState);"visible"==b&&c()});return!1}return!0};a.Y=!1;a.D=!1;a.Ua=function(){a.D=!0;a.i()};a.W=!1;a.Q=!1;a.Ra=function(c){a.marketingCloudVisitorID=c;a.Q=!0;a.i()};a.T=!1;a.N=!1;a.Ja=function(c){a.analyticsVisitorID=c;a.N=!0;a.i()};a.V=!1;a.P=!1;a.La=function(c){a.audienceManagerLocationHint=c;a.P=!0;a.i()};a.U=!1;a.O=!1;a.Ka=function(c){a.audienceManagerBlob=c;a.O=!0;a.i()};a.Ma=function(c){a.maxDelay||(a.maxDelay=250);return a.l("_d")?
(c&&setTimeout(function(){c()},a.maxDelay),!1):!0};a.X=!1;a.C=!1;a.na=function(){a.C=!0;a.i()};a.isReadyToTrack=function(){var c=!0,b=a.visitor;a.Y||a.D||(a.Na(a.Ua)?a.D=!0:a.Y=!0);if(a.Y&&!a.D)return!1;b&&b.isAllowed()&&(a.W||a.marketingCloudVisitorID||!b.getMarketingCloudVisitorID||(a.W=!0,a.marketingCloudVisitorID=b.getMarketingCloudVisitorID([a,a.Ra]),a.marketingCloudVisitorID&&(a.Q=!0)),a.T||a.analyticsVisitorID||!b.getAnalyticsVisitorID||(a.T=!0,a.analyticsVisitorID=b.getAnalyticsVisitorID([a,
a.Ja]),a.analyticsVisitorID&&(a.N=!0)),a.V||a.audienceManagerLocationHint||!b.getAudienceManagerLocationHint||(a.V=!0,a.audienceManagerLocationHint=b.getAudienceManagerLocationHint([a,a.La]),a.audienceManagerLocationHint&&(a.P=!0)),a.U||a.audienceManagerBlob||!b.getAudienceManagerBlob||(a.U=!0,a.audienceManagerBlob=b.getAudienceManagerBlob([a,a.Ka]),a.audienceManagerBlob&&(a.O=!0)),a.W&&!a.Q&&!a.marketingCloudVisitorID||a.T&&!a.N&&!a.analyticsVisitorID||a.V&&!a.P&&!a.audienceManagerLocationHint||
a.U&&!a.O&&!a.audienceManagerBlob)&&(c=!1);a.X||a.C||(a.Ma(a.na)?a.C=!0:a.X=!0);a.X&&!a.C&&(c=!1);return c};a.k=q;a.o=0;a.callbackWhenReadyToTrack=function(c,b,d){var f;f={};f.Ya=c;f.Xa=b;f.Va=d;a.k==q&&(a.k=[]);a.k.push(f);0==a.o&&(a.o=setInterval(a.i,100))};a.i=function(){var c;if(a.isReadyToTrack()&&(a.o&&(clearInterval(a.o),a.o=0),a.k!=q))for(;0<a.k.length;)c=a.k.shift(),c.Xa.apply(c.Ya,c.Va)};a.Pa=function(c){var b,d,f=q,e=q;if(!a.isReadyToTrack()){b=[];if(c!=q)for(d in f={},c)f[d]=c[d];e={};
a.Ha(e,!0);b.push(f);b.push(e);a.callbackWhenReadyToTrack(a,a.track,b);return!0}return!1};a.hb=function(){var c=a.cookieRead("s_fid"),b="",d="",f;f=8;var e=4;if(!c||0>c.indexOf("-")){for(c=0;16>c;c++)f=Math.floor(Math.random()*f),b+="0123456789ABCDEF".substring(f,f+1),f=Math.floor(Math.random()*e),d+="0123456789ABCDEF".substring(f,f+1),f=e=16;c=b+"-"+d}a.cookieWrite("s_fid",c,1)||(c=0);return c};a.t=a.track=function(c,b){var d,f=new Date,e="s"+Math.floor(f.getTime()/108E5)%10+Math.floor(1E13*Math.random()),
g=f.getYear(),g="t="+a.escape(f.getDate()+"/"+f.getMonth()+"/"+(1900>g?g+1900:g)+" "+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds()+" "+f.getDay()+" "+f.getTimezoneOffset());a.visitor&&(a.visitor.fb&&(a.authState=a.visitor.fb()),!a.supplementalDataID&&a.visitor.getSupplementalDataID&&(a.supplementalDataID=a.visitor.getSupplementalDataID("AppMeasurement:"+a._in,a.expectSupplementalData?!1:!0)));a.l("_s");a.Pa(c)||(b&&a.M(b),c&&(d={},a.Ha(d,0),a.M(c)),a.mb()&&(a.analyticsVisitorID||a.marketingCloudVisitorID||
(a.fid=a.hb()),a.rb(),a.usePlugins&&a.doPlugins&&a.doPlugins(a),a.account&&(a.abort||(a.trackOffline&&!a.timestamp&&(a.timestamp=Math.floor(f.getTime()/1E3)),f=k.location,a.pageURL||(a.pageURL=f.href?f.href:f),a.referrer||a.Ia||(a.referrer=r.document.referrer),a.Ia=1,a.referrer=a.eb(a.referrer),a.l("_g")),a.jb()&&!a.abort&&(a.kb(),g+=a.ib(),a.qb(e,g),a.l("_t"),a.referrer=""))),c&&a.M(d,1));a.abort=a.supplementalDataID=a.timestamp=a.pageURLRest=a.linkObject=a.clickObject=a.linkURL=a.linkName=a.linkType=
k.s_objectID=a.pe=a.pev1=a.pev2=a.pev3=a.e=a.lightProfileID=0};a.tl=a.trackLink=function(c,b,d,f,e){a.linkObject=c;a.linkType=b;a.linkName=d;e&&(a.j=c,a.q=e);return a.track(f)};a.trackLight=function(c,b,d,f){a.lightProfileID=c;a.lightStoreForSeconds=b;a.lightIncrementBy=d;return a.track(f)};a.clearVars=function(){var c,b;for(c=0;c<a.c.length;c++)if(b=a.c[c],"prop"==b.substring(0,4)||"eVar"==b.substring(0,4)||"hier"==b.substring(0,4)||"list"==b.substring(0,4)||"channel"==b||"events"==b||"eventList"==
b||"products"==b||"productList"==b||"purchaseID"==b||"transactionID"==b||"state"==b||"zip"==b||"campaign"==b)a[b]=void 0};a.tagContainerMarker="";a.qb=function(c,b){var d,f=a.trackingServer;d="";var e=a.dc,g="sc.",k=a.visitorNamespace;f?a.trackingServerSecure&&a.ssl&&(f=a.trackingServerSecure):(k||(k=a.account,f=k.indexOf(","),0<=f&&(k=k.substring(0,f)),k=k.replace(/[^A-Za-z0-9]/g,"")),d||(d="2o7.net"),e=e?(""+e).toLowerCase():"d1","2o7.net"==d&&("d1"==e?e="112":"d2"==e&&(e="122"),g=""),f=k+"."+e+
"."+g+d);d=a.ssl?"https://":"http://";e=a.AudienceManagement&&a.AudienceManagement.isReady();d+=f+"/b/ss/"+a.account+"/"+(a.mobile?"5.":"")+(e?"10":"1")+"/JS-"+a.version+(a.vb?"T":"")+(a.tagContainerMarker?"-"+a.tagContainerMarker:"")+"/"+c+"?AQB=1&ndh=1&pf=1&"+(e?"callback=s_c_il["+a._in+"].AudienceManagement.passData&":"")+b+"&AQE=1";a.bb(d);a.da()};a.bb=function(c){a.g||a.lb();a.g.push(c);a.fa=a.r();a.Fa()};a.lb=function(){a.g=a.nb();a.g||(a.g=[])};a.nb=function(){var c,b;if(a.ka()){try{(b=k.localStorage.getItem(a.ia()))&&
(c=k.JSON.parse(b))}catch(d){}return c}};a.ka=function(){var c=!0;a.trackOffline&&a.offlineFilename&&k.localStorage&&k.JSON||(c=!1);return c};a.wa=function(){var c=0;a.g&&(c=a.g.length);a.v&&c++;return c};a.da=function(){if(!a.v)if(a.xa=q,a.ja)a.fa>a.J&&a.Da(a.g),a.ma(500);else{var c=a.Wa();if(0<c)a.ma(c);else if(c=a.ua())a.v=1,a.pb(c),a.tb(c)}};a.ma=function(c){a.xa||(c||(c=0),a.xa=setTimeout(a.da,c))};a.Wa=function(){var c;if(!a.trackOffline||0>=a.offlineThrottleDelay)return 0;c=a.r()-a.Ca;return a.offlineThrottleDelay<
c?0:a.offlineThrottleDelay-c};a.ua=function(){if(0<a.g.length)return a.g.shift()};a.pb=function(c){if(a.debugTracking){var b="AppMeasurement Debug: "+c;c=c.split("&");var d;for(d=0;d<c.length;d++)b+="\n\t"+a.unescape(c[d]);a.ob(b)}};a.Qa=function(){return a.marketingCloudVisitorID||a.analyticsVisitorID};a.S=!1;var s;try{s=JSON.parse('{"x":"y"}')}catch(x){s=null}s&&"y"==s.x?(a.S=!0,a.R=function(a){return JSON.parse(a)}):k.$&&k.$.parseJSON?(a.R=function(a){return k.$.parseJSON(a)},a.S=!0):a.R=function(){return null};
a.tb=function(c){var b,d,f;a.Qa()&&2047<c.length&&("undefined"!=typeof XMLHttpRequest&&(b=new XMLHttpRequest,"withCredentials"in b?d=1:b=0),b||"undefined"==typeof XDomainRequest||(b=new XDomainRequest,d=2),b&&a.AudienceManagement&&a.AudienceManagement.isReady()&&(a.S?b.pa=!0:b=0));!b&&a.Ga&&(c=c.substring(0,2047));!b&&a.d.createElement&&a.AudienceManagement&&a.AudienceManagement.isReady()&&(b=a.d.createElement("SCRIPT"))&&"async"in b&&((f=(f=a.d.getElementsByTagName("HEAD"))&&f[0]?f[0]:a.d.body)?
(b.type="text/javascript",b.setAttribute("async","async"),d=3):b=0);b||(b=new Image,b.alt="");b.ra=function(){try{a.la&&(clearTimeout(a.la),a.la=0),b.timeout&&(clearTimeout(b.timeout),b.timeout=0)}catch(c){}};b.onload=b.ub=function(){b.ra();a.ab();a.Z();a.v=0;a.da();if(b.pa){b.pa=!1;try{var c=a.R(b.responseText);a.AudienceManagement.passData(c)}catch(d){}}};b.onabort=b.onerror=b.cb=function(){b.ra();(a.trackOffline||a.ja)&&a.v&&a.g.unshift(a.$a);a.v=0;a.fa>a.J&&a.Da(a.g);a.Z();a.ma(500)};b.onreadystatechange=
function(){4==b.readyState&&(200==b.status?b.ub():b.cb())};a.Ca=a.r();if(1==d||2==d){var e=c.indexOf("?");f=c.substring(0,e);e=c.substring(e+1);e=e.replace(/&callback=[a-zA-Z0-9_.\[\]]+/,"");1==d?(b.open("POST",f,!0),b.send(e)):2==d&&(b.open("POST",f),b.send(e))}else if(b.src=c,3==d){if(a.Aa)try{f.removeChild(a.Aa)}catch(g){}f.firstChild?f.insertBefore(b,f.firstChild):f.appendChild(b);a.Aa=a.Za}b.abort&&(a.la=setTimeout(b.abort,5E3));a.$a=c;a.Za=k["s_i_"+a.replace(a.account,",","_")]=b;if(a.useForcedLinkTracking&&
a.F||a.q)a.forcedLinkTrackingTimeout||(a.forcedLinkTrackingTimeout=250),a.aa=setTimeout(a.Z,a.forcedLinkTrackingTimeout)};a.ab=function(){if(a.ka()&&!(a.Ba>a.J))try{k.localStorage.removeItem(a.ia()),a.Ba=a.r()}catch(c){}};a.Da=function(c){if(a.ka()){a.Fa();try{k.localStorage.setItem(a.ia(),k.JSON.stringify(c)),a.J=a.r()}catch(b){}}};a.Fa=function(){if(a.trackOffline){if(!a.offlineLimit||0>=a.offlineLimit)a.offlineLimit=10;for(;a.g.length>a.offlineLimit;)a.ua()}};a.forceOffline=function(){a.ja=!0};
a.forceOnline=function(){a.ja=!1};a.ia=function(){return a.offlineFilename+"-"+a.visitorNamespace+a.account};a.r=function(){return(new Date).getTime()};a.ya=function(a){a=a.toLowerCase();return 0!=a.indexOf("#")&&0!=a.indexOf("about:")&&0!=a.indexOf("opera:")&&0!=a.indexOf("javascript:")?!0:!1};a.setTagContainer=function(c){var b,d,f;a.vb=c;for(b=0;b<a._il.length;b++)if((d=a._il[b])&&"s_l"==d._c&&d.tagContainerName==c){a.M(d);if(d.lmq)for(b=0;b<d.lmq.length;b++)f=d.lmq[b],a.loadModule(f.n);if(d.ml)for(f in d.ml)if(a[f])for(b in c=
a[f],f=d.ml[f],f)!Object.prototype[b]&&("function"!=typeof f[b]||0>(""+f[b]).indexOf("s_c_il"))&&(c[b]=f[b]);if(d.mmq)for(b=0;b<d.mmq.length;b++)f=d.mmq[b],a[f.m]&&(c=a[f.m],c[f.f]&&"function"==typeof c[f.f]&&(f.a?c[f.f].apply(c,f.a):c[f.f].apply(c)));if(d.tq)for(b=0;b<d.tq.length;b++)a.track(d.tq[b]);d.s=a;break}};a.Util={urlEncode:a.escape,urlDecode:a.unescape,cookieRead:a.cookieRead,cookieWrite:a.cookieWrite,getQueryParam:function(c,b,d){var f;b||(b=a.pageURL?a.pageURL:k.location);d||(d="&");return c&&
b&&(b=""+b,f=b.indexOf("?"),0<=f&&(b=d+b.substring(f+1)+d,f=b.indexOf(d+c+"="),0<=f&&(b=b.substring(f+d.length+c.length+1),f=b.indexOf(d),0<=f&&(b=b.substring(0,f)),0<b.length)))?a.unescape(b):""}};a.A="supplementalDataID timestamp dynamicVariablePrefix visitorID marketingCloudVisitorID analyticsVisitorID audienceManagerLocationHint authState fid vmk visitorMigrationKey visitorMigrationServer visitorMigrationServerSecure charSet visitorNamespace cookieDomainPeriods fpCookieDomainPeriods cookieLifetime pageName pageURL referrer contextData currencyCode lightProfileID lightStoreForSeconds lightIncrementBy retrieveLightProfiles deleteLightProfiles retrieveLightData".split(" ");
a.c=a.A.concat("purchaseID variableProvider channel server pageType transactionID campaign state zip events events2 products audienceManagerBlob tnt".split(" "));a.ga="timestamp charSet visitorNamespace cookieDomainPeriods cookieLifetime contextData lightProfileID lightStoreForSeconds lightIncrementBy".split(" ");a.K=a.ga.slice(0);a.oa="account allAccounts debugTracking visitor trackOffline offlineLimit offlineThrottleDelay offlineFilename usePlugins doPlugins configURL visitorSampling visitorSamplingGroup linkObject clickObject linkURL linkName linkType trackDownloadLinks trackExternalLinks trackClickMap trackInlineStats linkLeaveQueryString linkTrackVars linkTrackEvents linkDownloadFileTypes linkExternalFilters linkInternalFilters useForcedLinkTracking forcedLinkTrackingTimeout trackingServer trackingServerSecure ssl abort mobile dc lightTrackVars maxDelay expectSupplementalData AudienceManagement".split(" ");
for(n=0;250>=n;n++)76>n&&(a.c.push("prop"+n),a.K.push("prop"+n)),a.c.push("eVar"+n),a.K.push("eVar"+n),6>n&&a.c.push("hier"+n),4>n&&a.c.push("list"+n);n="pe pev1 pev2 pev3 latitude longitude resolution colorDepth javascriptVersion javaEnabled cookiesEnabled browserWidth browserHeight connectionType homepage pageURLRest".split(" ");a.c=a.c.concat(n);a.A=a.A.concat(n);a.ssl=0<=k.location.protocol.toLowerCase().indexOf("https");a.charSet="UTF-8";a.contextData={};a.offlineThrottleDelay=0;a.offlineFilename=
"AppMeasurement.offline";a.Ca=0;a.fa=0;a.J=0;a.Ba=0;a.linkDownloadFileTypes="exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";a.w=k;a.d=k.document;try{if(a.Ga=!1,navigator){var y=navigator.userAgent;if("Microsoft Internet Explorer"==navigator.appName||0<=y.indexOf("MSIE ")||0<=y.indexOf("Trident/")&&0<=y.indexOf("Windows NT 6"))a.Ga=!0}}catch(z){}a.Z=function(){a.aa&&(k.clearTimeout(a.aa),a.aa=q);a.j&&a.F&&a.j.dispatchEvent(a.F);a.q&&("function"==typeof a.q?a.q():a.j&&a.j.href&&(a.d.location=
a.j.href));a.j=a.F=a.q=0};a.Ea=function(){a.b=a.d.body;a.b?(a.p=function(c){var b,d,f,e,g;if(!(a.d&&a.d.getElementById("cppXYctnr")||c&&c["s_fe_"+a._in])){if(a.qa)if(a.useForcedLinkTracking)a.b.removeEventListener("click",a.p,!1);else{a.b.removeEventListener("click",a.p,!0);a.qa=a.useForcedLinkTracking=0;return}else a.useForcedLinkTracking=0;a.clickObject=c.srcElement?c.srcElement:c.target;try{if(!a.clickObject||a.I&&a.I==a.clickObject||!(a.clickObject.tagName||a.clickObject.parentElement||a.clickObject.parentNode))a.clickObject=
0;else{var m=a.I=a.clickObject;a.ea&&(clearTimeout(a.ea),a.ea=0);a.ea=setTimeout(function(){a.I==m&&(a.I=0)},1E4);f=a.wa();a.track();if(f<a.wa()&&a.useForcedLinkTracking&&c.target){for(e=c.target;e&&e!=a.b&&"A"!=e.tagName.toUpperCase()&&"AREA"!=e.tagName.toUpperCase();)e=e.parentNode;if(e&&(g=e.href,a.ya(g)||(g=0),d=e.target,c.target.dispatchEvent&&g&&(!d||"_self"==d||"_top"==d||"_parent"==d||k.name&&d==k.name))){try{b=a.d.createEvent("MouseEvents")}catch(n){b=new k.MouseEvent}if(b){try{b.initMouseEvent("click",
c.bubbles,c.cancelable,c.view,c.detail,c.screenX,c.screenY,c.clientX,c.clientY,c.ctrlKey,c.altKey,c.shiftKey,c.metaKey,c.button,c.relatedTarget)}catch(q){b=0}b&&(b["s_fe_"+a._in]=b.s_fe=1,c.stopPropagation(),c.stopImmediatePropagation&&c.stopImmediatePropagation(),c.preventDefault(),a.j=c.target,a.F=b)}}}}}catch(r){a.clickObject=0}}},a.b&&a.b.attachEvent?a.b.attachEvent("onclick",a.p):a.b&&a.b.addEventListener&&(navigator&&(0<=navigator.userAgent.indexOf("WebKit")&&a.d.createEvent||0<=navigator.userAgent.indexOf("Firefox/2")&&
k.MouseEvent)&&(a.qa=1,a.useForcedLinkTracking=1,a.b.addEventListener("click",a.p,!0)),a.b.addEventListener("click",a.p,!1))):setTimeout(a.Ea,30)};a.Ea()}
function s_gi(a){var k,q=window.s_c_il,r,n,t=a.split(","),u,s,x=0;if(q)for(r=0;!x&&r<q.length;){k=q[r];if("s_c"==k._c&&(k.account||k.oun))if(k.account&&k.account==a)x=1;else for(n=k.account?k.account:k.oun,n=k.allAccounts?k.allAccounts:n.split(","),u=0;u<t.length;u++)for(s=0;s<n.length;s++)t[u]==n[s]&&(x=1);r++}x||(k=new AppMeasurement);k.setAccount?k.setAccount(a):k.sa&&k.sa(a);return k}AppMeasurement.getInstance=s_gi;window.s_objectID||(window.s_objectID=0);
function s_pgicq(){var a=window,k=a.s_giq,q,r,n;if(k)for(q=0;q<k.length;q++)r=k[q],n=s_gi(r.oun),n.setAccount(r.un),n.setTagContainer(r.tagContainerName);a.s_giq=0}s_pgicq();
