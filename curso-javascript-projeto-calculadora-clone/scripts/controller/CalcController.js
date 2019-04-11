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

	initialize() {
		this.setDisplayDateTime()

		setInterval(() => {
			this.setDisplayDateTime()
		}, 1000)
	}

	// Eventos customizados
	addEventListenerAll(element, events, fn) {
		events.split(' ').forEach(event => {
			element.addEventListener(event, fn, false) // O false impede do evento se repetir consecutivamente
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

	addOperation(value) {

		console.log('A:', isNaN(this.getLastOperation()))

		if (isNaN(this.getLastOperation())) {
			// String
			if (this.isOperator(value)) {
				// Troca o operador
				this.setLastOperation(value)
			} else if (isNaN(value)) {
				// Outra coisa
				console.log(value)
			} else {
				this._operation.push(value)
			}
		} else {
			// Number
			let newValue = this.getLastOperation().toString() + value.toString()
			this.setLastOperation(parseInt(newValue))
		}

		console.log(this._operation)
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
			case '.':
				this.addOperation('.')
				break			 
			case 'igual':
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

	initButtonsEvents() {
		let buttons = document.querySelectorAll('#buttons > g, #parts > g')

		buttons.forEach((btn, index) => {
			this.addEventListenerAll(btn, 'click drag', e => {
				let textBtn = btn.className.baseVal.replace('btn-', '')
				this.execBtn(textBtn)
			})

			this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {
				btn.style.cursor = 'pointer'
			})
		})
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