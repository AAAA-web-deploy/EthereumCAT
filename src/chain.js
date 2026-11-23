
/** Non-custodial read-only RPC polling. Never invent a block number. */
class BlockMonitor {
  constructor(){this.latest=null;this.lastUpdated=0;this.pollTimer=null;this.ageTimer=null;this.inFlight=false;this.lastGoodRpc=null}
  async fetchFrom(url){
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),CONFIG.blockRequestTimeoutMs);
    try{
      const resp=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'eth_blockNumber',params:[]}),signal:controller.signal,cache:'no-store'});
      if(!resp.ok)throw new Error(`HTTP ${resp.status}`);
      const data=await resp.json();
      if(!/^0x[0-9a-f]+$/i.test(data?.result||''))throw new Error('Invalid RPC result');
      const n=Number.parseInt(data.result,16);
      if(!Number.isSafeInteger(n)||n<1)throw new Error('Invalid block number');
      return n;
    }finally{clearTimeout(timeout)}
  }
  async refresh(){
    if(this.inFlight || document.hidden)return;
    this.inFlight=true;
    try{
      const endpoints=this.lastGoodRpc?[this.lastGoodRpc,...CONFIG.rpcUrls.filter(x=>x!==this.lastGoodRpc)]:CONFIG.rpcUrls;
      let found=false;
      for(const endpoint of endpoints){
        try{
          const block=await this.fetchFrom(endpoint);
          if(this.latest===null||block>=this.latest){this.latest=block;this.lastUpdated=Date.now()}
          this.lastGoodRpc=endpoint;found=true;break;
        }catch(err){/* endpoints can reject CORS or be unavailable; next endpoint is tried */}
      }
      if(!found && this.latest===null)this.display('Live RPC unavailable','Connect to an Ethereum RPC',false);
      else if(found)this.render();
    }finally{this.inFlight=false}
  }
  display(label,sub,online){
    const desktop=document.getElementById('live-block'),age=document.getElementById('live-age'),mobile=document.getElementById('mobile-live-block'),mobileAge=document.getElementById('mobile-block-age');
    if(desktop)desktop.textContent=label;
    if(age)age.textContent=sub;
    if(mobile)mobile.textContent=label;
    if(mobileAge)mobileAge.textContent=sub;
    document.getElementById('live-dot')?.classList.toggle('online',online);
  }
  render(){
    if(this.latest===null)return;
    const since=Math.max(0,Math.round((Date.now()-this.lastUpdated)/1000));
    // This is the time since our last observation, not a promised next-block countdown.
    const age=since<25?'just observed':`${since}s since update`;
    this.display(`Block #${this.latest.toLocaleString('en-US')}`,age,true);
  }
  start(){this.refresh();this.pollTimer=setInterval(()=>this.refresh(),CONFIG.blockPollMs);this.ageTimer=setInterval(()=>this.render(),5000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)this.refresh()})}
  stop(){clearInterval(this.pollTimer);clearInterval(this.ageTimer)}
}
