let baseUrl = ''
//let baseUrl ='';
if(process.env.NODE_ENV === 'production'){
	baseUrl='';
}else{
	//baseUrl='http://192.168.1.200:8086';
}
export {baseUrl};
