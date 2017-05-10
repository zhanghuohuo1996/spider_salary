var mysql=require('mysql');
var fs=require('fs');
var db=mysql.createConnection({
	host:'localhost',
	port:'3306',
	database:'spider',
	user:'root',
	password:'789789'
});
db.connect();
var json={};
function computeAverage(city){
	//for(let j=0;j<citys.length;j++){
		//var city=citys[j];
		db.query('SELECT `lowSalary`,`highSalary` FROM `suanfa` WHERE `city`=?',[city],function(err,data){
			if(err) throw err;
			var alllow=0;
			var allhigh=0;
			var besthighstr=data[0].highSalary;
			var besthigh=parseInt(besthighstr.substring(0,besthighstr.length-1));
			for(let i=0;i<data.length;i++){
				var str=data[i].lowSalary;
				var num=parseInt(str.substring(0,str.length-1));
				alllow+=num;
				var str1=data[i].highSalary;
				var numhigh=parseInt(str1.substring(0,str1.length-1));
				if(numhigh>besthigh){
					besthigh=numhigh;
				}
				allhigh+=numhigh;
			}
			var average=((alllow+allhigh)/(2*(data.length))).toFixed(3);
			//console.log(city+':'+average+'k'+',最大值:'+besthigh+'k');
			json[city]={'average':average+'k','max':besthigh+'k'};
			if(city=="深圳"){
				console.log(json);
				fs.writeFile('suanfa.txt',JSON.stringify(json), {flag: 'a'}, function (err) {
				   if(err) {
					console.error(err);
					} else {
					   console.log('写入成功');
					}
				});
			}
		});
	//}
	
}
computeAverage("北京");
computeAverage("广州");
computeAverage("上海");
computeAverage("深圳");
db.end();
