var cheerio=require('cheerio');
var debug=require('debug');
var Url=require('url');
var request=require('request');
var iconv=require('iconv-lite');
var http=require('http');
var fs=require('fs');   
var superagent=require('superagent');
var mysql=require('mysql');
var options = {
    'Host': 'www.lagou.com',
    'Connection': 'keep-alive',
    'Content-Length': 22,
    'Origin': 'https://www.lagou.com',
    'X-Anit-Forge-Code': 0,
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept': 'application/json, text/javascript, */*; q=0.01,',
    'X-Requested-With': 'XMLHttpRequest',
    'X-Anit-Forge-Token': 'None',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.8',
    'Cookie': 'user_trace_token=20161013181330-b0c236da-912d-11e6-ac65-5254005c3644; LGUID=20161013181330-b0c23a43-912d-11e6-ac65-5254005c3644; gr_user_id=795fa8ba-ae3c-4319-a14f-9cec4ed09b48; index_location_city=%E5%85%A8%E5%9B%BD; JSESSIONID=50C2FF7D087D03E6EFBC207D84033396; _gat=1; _ga=GA1.2.139182473.1476353609; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1485269301,1485269384,1485269772,1485352603; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1485352603; LGSID=20170125215645-1bb9a560-e306-11e6-bd12-525400f775ce; PRE_UTM=; PRE_HOST=www.baidu.com; PRE_SITE=https%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3DPZoDI8dJxNvTHYDeK5kbo1JCCEJ2LpFvrhJwkruObP7%26wd%3D%26eqid%3Dc8706819000b3969000000065888ae99; PRE_LAND=https%3A%2F%2Fwww.lagou.com%2F; LGRID=20170125215645-1bb9a749-e306-11e6-bd12-525400f775ce; TG-TRACK-CODE=index_search; SEARCH_ID=5c39eff232744101ab72da356abed36b'
};
var db=mysql.createConnection({
	host:'localhost',
	port:'3306',
	database:'spider',
	user:'root',
	password:'789789'
});

db.connect();
var pagesize=1;
var resultsize=0
function readlist(testurl,callback){
	var list=[];
	//console.log(testurl);
	var info=testurl.split('&');
	var city=info[1].split('=')[1];
	var position=info[2].split('=')[1];
	var page=info[3].split('=')[1];
	superagent.post(testurl).send({
		'pn':page,
		'kd':position,
		'first':true
	})
	.set(options)
	.end(function(err,res){
			if(err){throw err;}
			var length=15;
			//fs.writeFile('test.txt', JSON.parse(res.text), {flag: 'a'}, function (err) {
			//	if(err) {
			//		console.error(err);
			//	} else {
			//		console.log('写入成功');
			//}
			//});
			var response=JSON.parse(res.text);
			pagesize=parseInt(response.content.pageSize);
			resultsize=15;
			for(let i=0;i<length;i++){
				//var url=Url.parse(testurl)
				if(response.content.positionResult.result.length!=0){
				var city=response.content.positionResult.locationInfo.city;
				//var city=city;
				var company=response.content.positionResult.result[i].companyShortName;
				var lowSalary=response.content.positionResult.result[i].salary.split('-')[0];
				var highSalary=response.content.positionResult.result[i].salary.split('-')[1];
				var positionName=response.content.positionResult.result[i].positionName;
				var item={
					'city':city,
					'company':company,
					'lowSalary':lowSalary,
					'highSalary':highSalary,
					'positionName':positionName
				};
				list.push(item);
				}
			}
				callback(list,pagesize,resultsize);
				//writedb(list);
			})
}

//debug('read beijng front-end list');
       	//	headers: {
	//		"X-Requested-With": 'XMLHttpRequest',
	//		"User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36',
	//		"Origin": 'https://www.lagou.com',
	//		"Cookie": 'user_trace_token=20170211115515-2db01e4efbb24178989f2b6139d3698e; LGUID=20170211115515-e593a6c4-f00d-11e6-8f71-5254005c3644; showExpriedIndex=1; showExpriedCompanyHome=1; showExpriedMyPublish=1; hasDeliver=0; index_location_city=%E5%85%A8%E5%9B%BD; login=false; unick=""; _putrc=""; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1486785316; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1486789519; _ga=GA1.2.1374329991.1486785316; LGRID=20170211130519-af0ec03c-f017-11e6-a32c-525400f775ce; TG-TRACK-CODE=search_code; JSESSIONID=A5AC6E7C54130E13C1519ABA7F70BC3C; SEARCH_ID=053c985ab53e463eb5f747658872ef29',
	//		"Connection": 'keep-alive'
	//	}
	//},function(err,res){
	//	if(err){console.log('error');}
		//var $=cheerio.load(res.body.toString());
		//console.log($(this));
	//	var list=[];
		//$('.item_con_list li').each(function(){
			//var that=$(this);
			//var company=that.attr('data-company');
			//var p=Url.parse(testurl,true); 
			//var city='北京';
			//var salary=that.attr('data-salary');
			//var lowSalary=salary.split('-')[0];
			//var highSalary=salary.split('-')[1];
			//var positionName=that.attr('data-positionname');
		
		
		
				//fs.writeFile('test.txt', list, {flag: 'a'}, function (err) {
			  // if(err) {
			//	console.error(err);
				//} else {
			///	   console.log('写入成功');
			///	}
			//	});
		  //})
//function spider(){
//	db.connect();
//	for(let k=0;k<citys.length;k++){
	function read(keyword,city){
		readlist('https://www.lagou.com/jobs/positionAjax.json?needAddtionalResult=false&city='+city+'&kd='+keyword+'&pn=1',function(list,pagesize,resultsize){
				//console.log(list);
				//console.log(list);
				readother(pagesize,resultsize,city,keyword);
		})
	}
		//var a=0;
		function readother(num,resultsize,city,keyword){
			//db.connect();
			//var city=city;
			var key;
			switch(keyword){
				case '前端开发':
					key='frontEnd';
					break;
				case 'java开发':
					key='java';
					break;
				case '测试':
					key='test';
					break;
				case 'c++':
					key='c';
					break;
				case '算法':
					key='suanfa';
					break;
				default:
					break;
			}
			for(var j=1;j<num+1;j++){
				readlist('https://www.lagou.com/jobs/positionAjax.json?needAddtionalResult=false&city='+city+'&kd='+keyword+'&pn='+j,function(list,pagesize){
				//console.log(list);
				//console.log(j);
				for(let i=0;i<15;i++){
				if(list[i]!=null){
					var queryitem='INSERT INTO '+key+' (`city`,`lowSalary`,`highSalary`,`positionName`,`company`) VALUES (?,?,?,?,?)';
						db.query(queryitem,[list[i].city,list[i].lowSalary,list[i].highSalary,list[i].positionName,list[i].company],function(err){
						});
					}
				}
				//a=a+list.length;
				//console.log(a);
				})
			}
		};
	function main(){
		var citys=['北京','上海','深圳','广州'];
		var keyword=['前端开发','java开发','测试','c++','算法'];
		for(var j=0;j<keyword.length;j++){
			for(var i=0;i<citys.length;i++){
				read(keyword[j],citys[i]);
			}
		}
	}
	main();
//	}
//}
//spider();
	//https://www.lagou.com/jobs/positionAjax.json?needAddtionalResult=false&city=北京&kd=前端开发&pn=1
//https://www.lagou.com/jobs/positionAjax.json?needAddtionalResult=false&city=北京&kd=前端开发&pn=30
