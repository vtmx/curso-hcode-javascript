class CalcController {

	constructor() {
		this._lastOperator = ''
		this._lastNumber = ''
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
		this._displayCalcEl.style.userSelect = 'none'
		this._timeEl.style.userSelect = 'none'
		this._timeEl.style.userSelect = 'none'

		this.setDisplayDateTime()
		setInterval(() => this.setDisplayDateTime(), 1000)

		this.setLastNumberToDisplay()
	}

	// Inicia eventos nos botões
	initButtonsEvents() {
		let buttons = document.querySelectorAll('#buttons > g, #parts > g')

		buttons.forEach((btn) => {
			this.addEventListenerAll(btn, 'click, drag', () => {
				let classBtn = btn.className.baseVal.replace('btn-', '')
				this.execBtn(classBtn)
				btn.style.opacity = '0.5'
				setInterval(() => btn.style.opacity = '1', 100)
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
		this._lastNumber = []
		this._lastOperator = []
		this.setLastNumberToDisplay()
	}

	// Apaga última entrada
	clearEntry() {
		this._operation.pop()
		this.setLastNumberToDisplay()
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

	getResult() {
		return eval(this._operation.join(''))
	}

	calc() {
		let last = ''
		this._lastOperator = this.getLastItem()

		if(this._operation.length < 3) {
			let firstItem = this._operation[0]
			this._operation = [firstItem, this._lastOperator, this._lastNumber]
		}

		if(this._operation.length > 3) {
			last = this._operation.pop()
			this._lastNumber = this.getResult()
		} else if(this._operation.length == 3) {
			this._lastNumber = this.getLastItem(false)
		}

		let result = this.getResult()
		
		if(last == '%') {
			result /= 100
			this._operation = [result]
		} else {
			this._operation = [result, last]

			if(last) {
				this._operation.push(last)
			}
		}

		last = this._operation.pop()
		this.setLastNumberToDisplay()
	}

	getLastItem(isOperator = true) {
		let lastItem = ''

		for (let i = this._operation.length - 1; i >= 0; i--) {
			if(this.isOperator(this._operation[i]) == isOperator) {
				lastItem = this._operation[i]
				break
			}
		}

		if(!lastItem) {
			lastItem = (isOperator) ? this._lastOperator : this._lastNumber
		}

		return lastItem
	}

	setLastNumberToDisplay() {
		let lastNumber = this.getLastItem(false)
		if(!lastNumber) lastNumber = '0'
		this.displayCalc = lastNumber
	}

	addOperation(value) {
		if(isNaN(this.getLastOperation(value))) {
			// String
			if(this.isOperator(value)) {
				// Troca operador
				this.setLastOperation(value)
			} else if (isNaN(value)) {
				// Igual ou ponto
			
			} else {
				this.pushOperation(value)

				// Atualizar display
				this.setLastNumberToDisplay()
			}
		} else {
			if(this.isOperator(value)) {
				this.pushOperation(value)
			} else {
				// Number
				let newValue = this.getLastOperation().toString() + value.toString()
				this.setLastOperation(parseFloat(newValue))

				// Atualizar display
				this.setLastNumberToDisplay()
			}
		}
	}
	
	setError() {
		this.displayCalc = 'Error'
	}

	addDot() {
		let lastOperation = this.getLastOperation()

		if(this.isOperator || !lastOperation) {
			this.pushOperation('0.')
		} else {
			this.setLastOperation(lastOperation.toString() + '.')
		}

		this.setLastNumberToDisplay()
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
				this.addDot()
				break			 
			case 'igual':
				this.calc()
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
		this._displayCalcEl.style.fill = 'rgba(255, 255, 255, 0)'
		setInterval(() => this._displayCalcEl.style.fill = 'black', 100)

		console.log(this._operation)
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