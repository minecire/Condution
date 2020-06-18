let dbObj=require("./ObjectManager");const perspectiveHandler=function(){let a={taskFilter:/([^\w\d\s\[]{1,2}[\w\s]+)/gi,taskCaptureGroup:/\[(([^\w\d\s]{1,2}[\w\s]+) *)*?\]/gi,logicCaptureGroup:/(.*) *([<=>]) *(.*)/gi,globalCaptureGroup:/\[(([^\w\d\s]{1,2}[\w\s]+) *)*?\](\$\w+)* *[<=>]* * *(\$\w+)*/gi,clear:function(){this.taskFilter.lastIndex=0,this.taskCaptureGroup.lastIndex=0,this.logicCaptureGroup.lastIndex=0,this.globalCaptureGroup.lastIndex=0}},b=b=>b.match(a.globalCaptureGroup),c=a=>a.split("$").map(a=>a.trim()),d=function(...a){let b;switch(a[0]){case"today":b=new Date;}return b},e=async function(b,c,d,e){let f=e?[e]:[];return c.match(a.taskFilter).forEach(function(a){a=a.trim(),"!"===a[0]?a.includes(".")?f.push(["project","!=",d[0][1][a.slice(2,a.length)]]):f.push(["tags","!has",d[1][1][a.slice(2,a.length)]]):a.includes(".")?f.push(["project","==",d[0][1][a.slice(1,a.length)]]):f.push(["tags","has",d[1][1][a.slice(1,a.length)]]),f.push(["isComplete","==",!1])}),await dbObj.getTasksWithQuery(b,dbObj.util.select.all(...f))},f=async function(a,b,c,d,e){let f,g=await Promise.all(b[0].map(async function(b){return[await dbObj.getTaskInformation(a,b),b]}));b[1].includes("due")?f=g.map(a=>[a[1],a[0].due?new Date(1e3*a[0].due.seconds):void 0]):b[1].includes("defer")&&(f=g.map(a=>[a[1],a[0].defer?new Date(1e3*a[0].defer.seconds):void 0]));let h=function(a,b){return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate()};return"="===c?f=f.filter(a=>h(a[1],d)):">"===c?f=e?f.filter(a=>a[1]>d):f.filter(a=>a[1]<d):"<"===c?f=e?f.filter(a=>a[1]<d):f.filter(a=>a[1]>d):">="===c?f=e?f.filter(a=>a[1]>=d):f.filter(a=>a[1]<=d):"<="===c?f=e?f.filter(a=>a[1]<=d):f.filter(a=>a[1]>=d):void 0,f.map(a=>a[0])};return{calc:async function(g,h,i,j){let k=await dbObj.getProjectsandTags(g),l=await b(h);if(!l)return[];let m;"avail"===i?m=["defer","<",new Date().getTime()/1e3]:"flagged"===i?m=["isFlagged","==",!0]:void 0;let n=await Promise.all(l.map(async function(b){a.clear();let h,i=a.logicCaptureGroup.exec(b);if(i){let[,b,j,l]=i;[b,l]=[c(b),c(l)],a.taskCaptureGroup.test(b)?(b=[await e(g,b[0],k,m),b[1]],l=d(l[1]),h=await f(g,b,j,l,!0)):(l=[await e(g,l[0],k,m),l[1]],b=d(b[1]),h=await f(g,l,j,b,!1))}else h=await e(g,b,k,m);return h}));n=[...new Set(n.flat(1))];let o=await Promise.all(n.map(async function(a){return{id:a,...(await dbObj.getTaskInformation(g,a))}})).then(a=>a);"duas"===j?o.sort((c,a)=>(c.due?c.due.seconds:1e10)-(a.due?a.due.seconds:1e10)):"duds"===j?o.sort((c,a)=>(a.due?a.due.seconds:1)-(c.due?c.due.seconds:1)):"deas"===j?o.sort((c,a)=>(c.defer?c.defer.seconds:1e10)-(a.defer?a.defer.seconds:1e10)):"deds"===j?o.sort((c,a)=>(a.defer?a.defer.seconds:1)-(c.defer?c.defer.seconds:1)):void 0;let p=await dbObj.getItemAvailability(g);return"avail"===i&&(o=o.filter(a=>void 0!==p[a.id])),o.map(a=>a.id)}}}();module.exports=perspectiveHandler;