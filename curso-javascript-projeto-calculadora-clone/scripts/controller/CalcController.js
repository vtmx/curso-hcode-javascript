class CalcController {

	constructor() {
		this._operation = []
		this._locale = 'pt-BR'
		this._displayCalcEl = document.querySelector('#display')
		this._dateEl = document.querySelector('#data')
		this._timeEl = document.querySelector('#hora')
		this.initialize()
		this.initButtonsEvents()
	}

	// Inicializa data, hora e display
	initialize() {
		this.setDisplayDateTime()
		setInterval(() => this.setDisplayDateTime(), 1000)
	}

	// Inicia eventos nos botões
	initButtonsEvents() {
		let buttons = document.querySelectorAll('#buttons > g, #parts > g')

		buttons.forEach((btn, index) => {
			this.addEventListenerAll(btn, 'click, drag', () => {
				let classBtn = btn.className.baseVal.replace('btn-', '')
				this.execBtn(classBtn)
			})

			this.addEventListenerAll(btn, 'mouseover, mouseup, mousedown', () => {
				btn.style.cursor = 'pointer'
			})
		})
	}

	// Eventos customizados
	addEventListenerAll(el, e, fn) {
		e.split(', ').forEach(e => {
			el.addEventListener(e, fn, false) // O false impede do evento se repetir consecutivamente
		})
	}

	// Apaga todo display
	clearAll() {
		this._operation = []
	}

	// Apaga última entrada
	clearEntry() {
		this._operation.pop()
	}

	getLastOperation() {
		return this._operation[this._operation.length - 1]
	}

	setLastOperation(value) {
		this._operation[this._operation.length - 1] = value
	}

	isOperator(value) {
		return (['+', '-', '*', '%', '/'].indexOf(value) > - 1)
	}

	pushOperation(value) {
		this._operation.push(value)

		if(this._operation.length > 3) {
			this.calc()
		}
	}

	calc() {
		let last = this._operation.pop()
		console.log(this._operation)
		let result = eval(this._operation.join(''))
		this._operation = [result, last]
		this.setLastNumberToDisplay()
	}

	setLastNumberToDisplay() {
		let lastNumber

		for(let i = this._operation.length; i >= 0; i--) {
			if(!this.isOperator(this._operation[i])) {
				lastNumber = this._operation[i]
				break
			}
		}

		this.displayCalc = lastNumber
	}

	addOperation(value) {
		console.log('A', value, isNaN(this.getLastOperation()))
		
		if(isNaN(this.getLastOperation(value))) {
			// String
			if(this.isOperator(value)) {
				// Troca operador
				this.setLastOperation(value)
			} else if (isNaN(value)) {
			
			} else {
				// Igual ou ponto
				this._operation.push(value)
			}
		} else {
			if(this.isOperator(value)) {
				this._operation.push(value)
			} else {
				// Number
				let newValue = this.getLastOperation().toString() + value.toString()
				this.setLastOperation(parseInt(newValue))
			}
		}
		
		console.log(this._operation)
	
	
	
	
	
		// String
		// if(isNaN(this.getLastOperation())) {
		// 	if(this.isOperator(value)) {
		// 		this.setLastOperation(value)
		// 		console.log(value)
		// 	} else if(isNaN(value)) {
		// 		console.log('Outra coisa', value)
		// 	} else {
		// 		this.pushOperation(value)
		// 		this.setLastNumberToDisplay()
		// 		this.displayCalc = value
		// 	}
		// 	// Number
		// } else {
		// 	if(this.isOperator(value)) {
		// 		this.pushOperation(value)
		// 		console.log(value)
		// 	} else {
		// 		let newValue = this.getLastOperation().toString() + value.toString()
		// 		this.setLastOperation(parseInt(newValue))
		// 		this.setLastNumberToDisplay()
		// 		console.log(value)
		// 	}
		// }
	}

	setError() {
		this.displayCalc = 'Error'
	}

	execBtn(value) {
		switch (value) {
			case 'ac':
				this.clearAll()
				break
			case 'ce':
				this.clearEntry()
				break
			case 'soma':
				this.addOperation('+')
				break
			case 'subtracao':
				this.addOperation('-')
				break
			case 'divisao':
				this.addOperation('/')
				break
			case 'multiplicacao':
				this.addOperation('*')
				break
			case 'porcento':
				this.addOperation('%')
				break
			case 'ponto':
				this.addOperation('.')
				break			 
			case 'igual':
				this.addOperation('=')
				break
			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				this.addOperation(parseInt(value))
				break
			default:
				this.setError()
				break			 
		}
	}

	setDisplayDateTime() {
		this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		})
		
		this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
	}

	// Time
	get displayTime() {
		return this._timeEl.textContent
	}

	set displayTime(value) {
		return this._timeEl.textContent = value
	}

	// Date
	get displayDate() {
		return this._dateEl.textContent
	}

	set displayDate(value) {
		return this._dateEl.textContent = value
	}

	// Display calc
	get displayCalc() {
		return this._displayCalcEl.textContent
	}

	set displayCalc(value) {
		return this._displayCalcEl.textContent = value
	}

	// Current date
	get currentDate() {
		return new Date()
	}

	set currentDate(value) {
		this._currentDate = value
	}
	
}