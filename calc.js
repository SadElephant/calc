var Fcalc = document.calc;
var Currents = 0;
var flagNewNum = false;
var PendingOp = "";


// обработчик нажатия 
// цифровой кнопки
function numPressed (num, th){
  if (th != null) th.blur();
  if (flagNewNum){
	Fcalc.ReadOut.value = num;
	flagNewNum = false;
  } else {
	if ((Fcalc.ReadOut.value == "0") || (Fcalc.ReadOut.value =='Ошибка вычислений')) {
	  Fcalc.ReadOut.value = num;
	} else {
	  Fcalc.ReadOut.value += num;
	}
  }
 }
	
// обработчик нажатия
// кнопки действия
function operation (Op, th) {
  var readout = Fcalc.ReadOut.value;
  
  if (th != null) th.blur();
  if (readout =='Ошибка вычислений') {
	readout = 0;
	Fcalc.ReadOut.value = 0;
  }
	
  if (flagNewNum && PendingOp != "=") {
	Fcalc.ReadOut.value = Currents + PendingOp;
  } else {
	flagNewNum = true;
	if ('+' == PendingOp ) {
	  Currents += parseFloat(readout);
	  Fcalc.ReadOut.value += PendingOp;
	} else if ('-' == PendingOp){
	  Fcalc.ReadOut.value += PendingOp;
	  Currents -= parseFloat(readout);
	} else if ('/' == PendingOp){
	  Currents /= parseFloat(readout);
	  Fcalc.ReadOut.value += PendingOp;
	} else if ('*' == PendingOp ){
	  Currents *= parseFloat(readout);
	  Fcalc.ReadOut.value += PendingOp;
	} else {
	  Currents = parseFloat(readout);
	}
	
	if (Op != "="){ 
		Fcalc.ReadOut.value = Currents + Op;
	} else {
		Fcalc.ReadOut.value = Currents;
	}
	PendingOp = Op;
  }
	
	//исключение NaN и Infinity
  if ((isNaN( Currents)) || (Currents == Infinity)) {
  Currents = 0;
  Fcalc.ReadOut.value ='Ошибка вычислений';
  return;		
  }	
}
// добавление десятичной точки с числу
function Decimal(th) {
  var curReadOut = Fcalc.ReadOut.value;
	
  if (th!=null) th.blur();
  if (flagNewNum) {
	curReadOut = "0.";
	flagNewNum = false;
  } else {
	if (curReadOut.indexOf(".") == -1)
	  curReadOut += ".";
  }
  Fcalc.ReadOut.value = curReadOut;
}
	
	
// Полная очистка всех результатов
function Clear (th) {
  if (th != null) th.blur();
  Currents = 0;
  PendingOp = "";
  Fcalc.ReadOut.value = "0";
  flagNewNum = false;
}


//обработчик нажатия клавиши клавиатуры
document.onkeypress = function pressed(event) {
  event = event || window.event;
  var key = event.keyCode;
  if ( event.keyCode == 0) key = event.which;
		
  if ((key >= 48) && (key <= 57)) { //обработка цифр
	numPressed( String.fromCharCode(key), null);
	return true;
  }
	//обработка знаков операций
  if ((key == 42) || (key == 43) || (key == 45) || (key == 47) || (key == 61)) {
	operation( String.fromCharCode(key), null);
	return true;
  }
	
  if (key == 46) {//обработка точки
	Decimal(null);
	return true;
  }

  if (key == 13) {//обработка нажатия клавиши ENTER
		operation('=', null);
		return true;
  }
  return false;
}