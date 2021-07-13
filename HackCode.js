let Hack = setInterval(function(){
	var elements = document.getElementsByClassName('link_fnt01');
	if(elements.length == 0) return;
	clearInterval(Hack);
	document.getElementById('fetchResourceForm').action = "SCORM_fetchResource.php";
}, 500);
document.getElementById('fetchResourceForm').action = "javascript:alert('已封鎖自動載入');";
