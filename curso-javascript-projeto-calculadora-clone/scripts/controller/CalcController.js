class CalcController {

	constructor() {
		this._audioOnOf = false
		this._audio = new Audio('click.mp3')
		this._lastOperator = ''
		this._lastNumber = ''
		this._operation = []
		this._locale = 'pt-BR'
		this._displayCalcEl = document.querySelector('#display')
		this._dateEl = document.querySelector('#data')
		this._timeEl = document.querySelector('#hora')
		this.initialize()
		this.initButtonsEvents()
		this.initKeyboard()
	}

	// Inicializa data, hora e display
	initialize() {
		this._displayCalcEl.style.userSelect = 'none'
		this._dateEl.style.userSelect = 'none'
		this._timeEl.style.userSelect = 'none'

		this.setDisplayDateTime()
		setInterval(() => this.setDisplayDateTime(), 1000)

		this.setLastNumberToDisplay()
		this.pasteFromClipboard()

		document.querySelectorAll('.btn-ac').forEach(btn => {
			btn.addEventListener('dblclick', e => {
				this.toggleAudio()
			})
		})
	}

	toggleAudio() {
		// this._audioOnOf = (this._audioOnOf) ? true : false
		this._audioOnOf = !this._audioOnOf
	}

	playAudio() {
		if(this._audioOnOf) {
			this._audio.currentTime = 0
			this._audio.play()
		}
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

	// Copiar para clipboard
	copyToClipboard() {
		let input = document.createElement('input')
		input.value = this.displayCalc
		document.body.appendChild(input)
		
		input.select()
		document.execCommand('Copy')

		input.remove()
		this.blinkDisplayCalc()
	}

	// Cola para clipboard
	pasteFromClipboard() {
		document.addEventListener('paste', e => {
			let text = e.clipboardData.getData('Text')
			this.displayCalc = parseFloat(text)
		})
	}

	// Apaga todo display
	clearAll() {
		this._operation = []
		this._lastNumber = ''
		this._lastOperator = ''
		this.setLastNumberToDisplay()
		console.clear()
	}

	// Apaga última entrada
	clearEntry() {
		this._operation.pop()
		this.setLastNumberToDisplay()
	}

	// Captura a ultima operação
	getLastOperation() {
		return this._operation[this._operation.length - 1]
	}

	// Pegue a última operação
	setLastOperation(value) {
		this._operation[this._operation.length - 1] = value
	}

	// É um operador
	isOperator(value) {
		return (['+', '-', '*', '%', '/'].indexOf(value) > - 1)
	}

	// Captura operação
	pushOperation(value) {
		this._operation.push(value)

		if(this._operation.length > 3) {
			this.calc()
		}
	}

	// Pega resultado
	getResult() {
		try {
			return eval(this._operation.join(''))
		} catch(e) {
			setTimeout(() => {
				this.setError()
			}, 1)
		}
	}

	// Calcula
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

	// Pegue o último item do vetor
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

	// Exibe o último número no display
	setLastNumberToDisplay() {
		let lastNumber = this.getLastItem(false)
		if(!lastNumber) lastNumber = '0'
		this.displayCalc = lastNumber
	}

	// Adiciona sua operação
	addOperation(value) {
		if(isNaN(this.getLastOperation(value))) {
			// String
			if(this.isOperator(value)) {
				// Troca operador
				this.setLastOperation(value)
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
				this.setLastOperation(newValue)

				// Atualizar display
				this.setLastNumberToDisplay()
			}
		}
	}
	
	// Exibe erros
	setError() {
		this.displayCalc = 'Error'
	}

	// Adiciona pontos
	addDot() {
		let lastOperation = this.getLastOperation()

		if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return

		if(this.isOperator(lastOperation) || !lastOperation) {
			this.pushOperation('0.')
		} else {
			this.setLastOperation(lastOperation.toString() + '.')
		}

		this.setLastNumberToDisplay()
	}

	// Inicia eventos de teclado
	initKeyboard() {
		window.addEventListener('keyup', e => {
			this.playAudio()

			switch (e.key) {
				case 'Escape':
				case 'Delete':
					this.clearAll()
					break

				case 'Backspace':
					this.clearEntry()
					break

				case '+':
				case '-':
				case '/':
				case '*':
				case '%':
					this.addOperation(e.key)
					break

				case '.':
				case ',':
					this.addDot()
					break

				case 'Enter':
				case '=':
					this.calc()
					break

				case 'c':
					if (e.ctrlKey) this.copyToClipboard()
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
					this.addOperation(parseInt(e.key))
					break
			}
		})
	}

	// Executa botões
	execBtn(value) {
		this.playAudio()

		switch(value) {
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

	// Exibe data e hora no display
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
		if (value.toString().length > 10) {
			this.setError()
			return false
		}

		this.blinkDisplayCalc()
		console.log(this._operation)
		return this._displayCalcEl.textContent = value
	}

	// Pisca display quando algum evento é executado
	blinkDisplayCalc() {
		this._displayCalcEl.style.fill = 'rgba(255, 255, 255, 0)'
		setInterval(() => this._displayCalcEl.style.fill = 'black', 100)
	}

	// Current date
	get currentDate() {
		return new Date()
	}

	set currentDate(value) {
		this._currentDate = value
	}
	
}