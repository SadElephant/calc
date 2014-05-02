var Fcalc = document.calc;
var Currents = 0;
var flagNewNum = false;
var PendingOp = "";
//Обрабатываем переполнение строки
function overflow() {
  if (parseFloat (Fcalc.ReadOut.value.length) > 14) 
	return true;
}

// обработчик нажатия 
// цифровой кнопки
function numPressed (num, th){
  //убираем фокус с кнопки калькулятора, 
  //чтобы она не нажималась при нажатии ENTER
  if (th != null) th.blur(); 
  
  if (flagNewNum) {
	Fcalc.ReadOut.value = num;
	flagNewNum = false;
  } else if ((Fcalc.ReadOut.value == "0") || (Fcalc.ReadOut.value =='Ошибка'+
			' вычислений')) {
	Fcalc.ReadOut.value = num;
  } else {
	if (overflow()) 
	  return;
	Fcalc.ReadOut.value += num;
  }
 }
	
// обработчик нажатия
// кнопки действия
function operation (Op, th) {
  var readout = Fcalc.ReadOut.value;
  
  if (th != null) th.blur();
  if (readout == 'Ошибка вычислений') {
	readout = 0;
	Fcalc.ReadOut.value = 0;
  }
 
  if (flagNewNum && PendingOp != "=") {
	Fcalc.ReadOut.value = Currents + PendingOp;
  } else {
	flagNewNum = true;
	flagOverflow = false;
	switch (PendingOp){
      case '+':
	    Currents += parseFloat(readout);
	    Fcalc.ReadOut.value += PendingOp;
	    break;
	  case '-':
	    Fcalc.ReadOut.value += PendingOp;
	    Currents -= parseFloat(readout);
	    break;
	  case '/' :
	    Currents /= parseFloat(readout);
	    Fcalc.ReadOut.value += PendingOp;
	    break;
	  case '*':
	    Currents *= parseFloat(readout);
	    Fcalc.ReadOut.value += PendingOp;
	    break;
	  default:
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
  if ((isNaN(Currents)) || (Currents == Infinity)) {
  Currents = 0;
  Fcalc.ReadOut.value = 'Ошибка вычислений';
  return;		
  }	
}
// добавление десятичной точки с числу
function Decimal(th) {
  var curReadOut = Fcalc.ReadOut.value;
  
  if ( overflow()) return;
  if (th != null) th.blur();
  
  if (flagNewNum) {
	curReadOut = "0.";
	flagNewNum = false;
  } else if (curReadOut.indexOf(".") == -1){
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
  if (event.keyCode == 0) key = event.which;
		
  if ((key >= 48) && (key <= 57)) { //обработка цифр
	numPressed(String.fromCharCode(key), null);
	return true;
  }
	//обработка знаков операций
  switch(key) {
    case 13:
	  operation( '=', null);
	  return true;
    case 42:
    case 43:
    case 45:
    case 47: 
    case 61:
	  operation( String.fromCharCode(key), null);
	  return true;
    case 46: //обработка точки
	  Decimal(null);
	  return true;
  }
  return false;
}