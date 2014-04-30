var Fcalc = document.calc;
var Currents = 0;
var FlagNewNum = false;
var PendingOp = "";

// обработчик нажатия 
// цифровой кнопки
function NumPressed (Num){
		if (FlagNewNum){
			Fcalc.ReadOut.value = Num;
			FlagNewNum = false;
		}else{
			if ((Fcalc.ReadOut.value == "0") || (Fcalc.ReadOut.value =='Ошибка вычислений'))
				Fcalc.ReadOut.value = Num;
			else
				Fcalc.ReadOut.value += Num;
		}
}
	
// обработчик нажатия
// кнопки действия
function Operation (Op){
	var Readout = Fcalc.ReadOut.value;

	if( Readout =='Ошибка вычислений'){
		Readout = 0;
		Fcalc.ReadOut.value = 0;
	}
	
	if (FlagNewNum && PendingOp != "="){
		Fcalc.ReadOut.value = Currents+PendingOp;
	}else{
		FlagNewNum = true;
		if ( '+' == PendingOp ){
		Currents += parseFloat(Readout);
		Fcalc.ReadOut.value+=PendingOp;
		}else if ( '-' == PendingOp ){
			Fcalc.ReadOut.value+=PendingOp;
			Currents -= parseFloat(Readout);
		}else if ( '/' == PendingOp ){
			Currents /= parseFloat(Readout);
			Fcalc.ReadOut.value+=PendingOp;
		}else if ( '*' == PendingOp ){
			Currents *= parseFloat(Readout);
			Fcalc.ReadOut.value+=PendingOp;
		}else
			Currents = parseFloat(Readout);
		if (Op != "=") Fcalc.ReadOut.value = Currents + Op;
		else Fcalc.ReadOut.value = Currents;
		PendingOp = Op;
	}
	
	//исключение NaN и Infinity
	if((isNaN(Currents))||(Currents==Infinity)) {
	Currents=0;
	Fcalc.ReadOut.value ='Ошибка вычислений';
	return;		
	}
	
	
}
// добавление десятичной точки с числу
function Decimal (){
	var curReadOut = Fcalc.ReadOut.value;
	if (FlagNewNum) {
		curReadOut = "0.";
		FlagNewNum = false;
	}else{
		if (curReadOut.indexOf(".") == -1)
				curReadOut += ".";
		}
	Fcalc.ReadOut.value = curReadOut;
}
	
// Очистка текущего результата
function ClearEntry (){
	if(PendingOp != ""){
		Fcalc.ReadOut.value = Currents;
		PendingOp = "";
		FlagNewNum = false;
		return;
	}
	Fcalc.ReadOut.value = "0";
	FlagNewNum = true;
}
	
// Полная очистка всех результатов
function Clear () {
	Currents = 0;
	PendingOp = "";
	Fcalc.ReadOut.value = "0";
	FlagNewNum = false;
}


//обработчик нажатия клавиши клавиатуры
document.onkeypress = function pressed(event){
	event = event || window.event;
	//обработка цифр
	var key = event.keyCode;
	if ( event.keyCode == 0) key = event.which;
	
	if ((key >= 48) && (key <= 57)){
		NumPressed( String.fromCharCode(key));
		return true;
	}
	
	//обработка знаков операций
	if ((key==42) || (key==43) || (key==45) || (key==47) || (key==61)){
		Operation( String.fromCharCode(key));
		return true;
	}
	
	//обработка точки
	if(key==46){
		Decimal();
		return true;
	}
	
	//обработка нажатия клавиши ENTER
	if (key==13){
		Operation('=');
		return true;
	}
	return false;
}