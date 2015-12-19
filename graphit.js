var hasN = false, mouseIsDown = false, xPos,yPos,diffX,moving=false;
function preloadFormula(){
	var preload = [
		'pow(x,2)*cos(n)/n/sin(x)',
		'10*tan(x/n)',//
		'x*tan(n+x)',//
		'n*cos(n*x)',//
		'n*sin(x/n)*cos(x/4)*tan(n)',
		'100*tan(x/n)/sin(n/x)/n',//
		'3n*sin(x/n)*cos(n-x)/2',//
		'20*cos(x-n)/sin(n/x)/pow(x,2)',
		'10*sin(x/n)/cos(x-n)',//
		'10*sin(n/3)/tan(2x/n)-sin(n/x)',
		'20*(1-n)/x+ 1/n*(sin(n*x)-cos(x-n))',//
		'3*n*sin(x/2-n/3)/2',
		'pow(x,2)/pow(n,2)/tan(x) + 20*sin(x/n)'
		
	];
	var pick = preload[Math.floor(Math.random()*preload.length)];
	$('#formula').val(pick);
}
$(document).ready(function(){
	preloadFormula();
	$('#getSample').click(function(){
		preloadFormula();
	});
	$('#instructionsButton').click(function(){
		$('#instructionsText').toggleClass('hidden');
		$('#instructionsText').css({
			'margin-left':'370px',
			'margin-top':'102px'
		});
	});
	$('#instructionsText').click(function(e){
	}).mousedown(function(e){
		xPos = parseInt($('#instructionsText').css('margin-left'));
		yPos = parseInt($('#instructionsText').css('margin-top'));
		diffX = e.pageX - xPos;
		diffY = e.pageY - yPos;
		mouseIsDown = true;
		moving = true;
	}).mouseup(function(){
		if (mouseIsDown){
			if ( parseInt($('#instructionsText').css('margin-left')) == xPos && parseInt($('#instructionsText').css('margin-top')) == yPos){
				$('#instructionsText').addClass('hidden');
			}
		}
	});
	$(document).mousemove(function(e){
		if (mouseIsDown){
			$('#instructionsText').css({
				'margin-left':e.pageX-diffX+'px',
				'margin-top':e.pageY-diffY+'px'
			});
		}
	});
	$(document).mouseup(function(){
		mouseIsDown = false;
		moving = false;			
	});
	$('#generate').on('click',function(){
		hasN = false;
		$('#msgBox').html('');				
		
		function valCheck(xL,xU,xI,nL,nU,nI){
			if (!isNaN(xL) && !isNaN(xU) && !isNaN(xI) && !isNaN(nL) && !isNaN(nU) && !isNaN(nI)){
				return true;
			}
			else{
				return false;
			}
		}
		
		function formatFormula(formula){
			var accept_char = ['(',')','0','1','2','3','4','5','6','7','8','9','sin','cos','tan','pow',',','.','*','n','x','/','+','-',' '];
			var test_form = formula; 
			for (i = 0; i < accept_char.length; i++){		//ensure formula contains only acceptable characters/strings
				index = 0;
				do{
					index = test_form.indexOf(accept_char[i]);		
					if (index != -1){
						test_form = test_form.slice(0,index) + test_form.slice(index+accept_char[i].length,test_form.length);
						if (accept_char[i] == 'n'){						
							hasN = true;
						}				
					}
				} while (index != -1);					
			}
			if (test_form.length != 0){						//found invalid characters in formula
				$('#msgBox').html('Please ensure formula contains only valid characters');	
			}
			else{					
				index = 0;	
				var opList = ['sin','cos','tan','pow'];
				for (i = 0; i < opList.length; i++){		//prepend 'Math.' to javascriptize trig. functions
					index = -8; 
					do {
						index = formula.indexOf(opList[i],index+8);
						if (index != -1){
							formula = formula.slice(0,index)+'Math.'+formula.slice(index);	
						}
					} while (index != -1);				
				}
				
				var varList = ['x','n'];
				for (i = 0; i < varList.length; i++){		//add multiplication (*) symbols between any variables and adjacent numbers
					index = 0;
					do{
						index = formula.indexOf(varList[i],index);
						if (index != -1){
							if (index != 0 && !isNaN(formula[index - 1]) && formula[index-1] != ' '){
								formula = formula.slice(0,index)+ '*' + formula.slice(index,formula.length);
							}
							else if (index != formula.length -1 && !isNaN(formula[index+1]) && formula[index+1] != ' '){
								formula = formula.slice(0,index+1)+ '*' + formula.slice(index+1,formula.length);
							}
							else{
								index +=1;
							}
						}
					}while(index != -1);
				}
				var i = 0;
				while (i < formula.length){
					if (formula[i] == ' '){
						formula = formula.slice(0,i) + formula.slice(i+1,formula.length);
					}
					i++;
					
				}			
				try {
					var x = 1, n = 1, y = eval(formula);
					return formula;
				}
				catch(err){
					$('#msgBox').html('Please check formula for formatting errors');	//invalid formula (does contain valid characters)
					return null;
				}
			}
		}
		
		function formatpSize(pSize){
			if (isNaN(pSize) || !isNaN(pSize) && pSize < 1){
				pSize = 1;
			}
			else if (pSize > 20){
				pSize = 20;
			}	
			pSize = parseInt(pSize);
			$('#pointSizeInput').val(pSize);
			return pSize;
		}
		
		if ($('#std').is(':checked')){
			var formula = $('#formula').val(), xLower = $('#xLower').val(), xUpper = $('#xUpper').val(), xInc = $('#xInc').val();
			var nLower = $('#nLower').val(), nUpper = $('#nUpper').val(), nInc = $('#nInc').val(), pSize = $('#pointSizeInput').val();
			if (valCheck(xLower,xUpper,xInc,nLower,nUpper,nInc)){
				formula = formatFormula(formula);
				pSize = formatpSize(pSize);
				if (formula != null){
					showGraph(formula,xLower,xUpper,xInc,nLower,nUpper,nInc,pSize);
				}
			}
			else{
				$('#msgBox').html('Please ensure that inputs contain valid numbers');
			}					
		}
		else{
			showGraph2('showGraph');
		}	
	});
	
	function cursorOrigin(){
		$('#cursor').css({
			'margin-left':'400px',
			'margin-top':'400px'
		});
	}
	
	$('#clear').click(function(){
		while($('#graph').children().hasClass('points')){
			$('#graph').find('div.points').remove();
		}
	});
	$('#showAxes').on('click',function(){
		$('.axes').each(function(){
			$(this).toggleClass('showing');
		});
	});
	
});
function showGraph2(action){
	//parametric graphing
	var dotIDnum = 0;
	function drawDot(x,y){
		dot = document.createElement('div');
		dot.style.width = '2px';
		dot.style.height = '2px';
		dot.style.marginLeft = String(x+400+'px');
		dot.style.marginTop = String(400-y+'px');
		dot.style.backgroundColor = 'black';
		dot.style.zIndex = 200;
		dot.style.position = 'absolute';
		dot.className = 'dots';
		dot.id = String('dot'+ dotIDnum);
		dotIDnum++;
		$('#graph').append(dot);
	}
	
	var fibs = [1,1];
	var a = 1, b = 1;
	//c = a + b
	for (i = 0; i < 500; i++){
		c = a + b;
		fibs.push(c);
		a = b; b = c;
	}			
	
	var t = 0;
	var graphing = setInterval(function(action){
		$('#stop').on('click',function(){
			clearInterval(graphing);
		});

			y =t*Math.sin(t)*Math.tan(2*t);
			x = t*Math.cos(t)*Math.tan(2*t);
			$('#cursor').css({
				'margin-left':String(x+400+'px'),
				'margin-top':String(400-y+'px')
			});
			if (0 < x < 400 && 0 < y < 400){
				drawDot(x,y);
			}
			t+=.2;		
	},1);
}

function showGraph(formula,xLower,xUpper,xInc,nLower,nUpper,nInc,pSize){
	var index = nInc.indexOf('.');
	var decimalCount = nInc.substring(index+1,nInc.length).length;
	console.log('decimalCount',decimalCount,'nInc',nInc);
	var n = nInc*Math.pow(10,decimalCount);
	var y=0, n=1, x=0;		
	if (hasN == true){
		var n = Math.ceil(nLower*1.);
		nInc = 1.*nInc;
		console.log(nLower,nUpper,nInc);
		var graphing = setInterval(function(){
			
			$('.clearStop').on('click',function(){
				$('#showN').css({'background-color':'white'});
				clearInterval(graphing);
			});
			if (n > nUpper*1.){
				$('#showN').css({'background-color':'white'});
				clearInterval(graphing);
			}
			if (n <= nUpper){
				$('#showN').css({'background-color':'rgb(214,251,214)'});
				for (x = 1.*xLower; x < 1.*xUpper; x += 1.*xInc){
					y=eval(formula);
					addPoint(x,y,pSize);
				}
				$('#showN').html((String(n).substring(0,5)));
				n += nInc;
				n = String(n);
				var decimals = n.substring(n.indexOf('.')+1,n.length);
				if (decimals.length > decimalCount){							
					n = Math.round(n*Math.pow(10.,decimalCount))/Math.pow(10.,decimalCount);	//round n to appropriate decimal
				}
				n = Number(n);
			}					
		},10);
	}
	else{
		$('#showN').html('');
		for (x = 1.*xLower; x < 1.*xUpper; x += 1.*xInc){
			y=eval(formula);
			addPoint(x,y,pSize);
		}
	}
}

function addPoint(x,y,pSize){
	pLeft = x*10+400;
	pTop = 400-y*10;
	if (pLeft > 0 && pLeft < 800 && pTop > 0 && pTop < 800){
		var point = document.createElement('div');
		point.style.height = String(pSize) + 'px';
		point.style.width = String(pSize) + 'px';
		point.style.marginLeft = pLeft + 'px';
		point.style.marginTop = pTop + 'px';
		point.style.backgroundColor = 'black';
		point.style.position = 'absolute';
		point.style.zIndex = 200;	
		point.className = 'points';		
		$('#graph').append(point);
	}
}