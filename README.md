# Curso Javascript Hcode

Projetos do curso [Javascript da Hcode](https://www.udemy.com/javascript-curso-completo) na [Udemy](https://www.udemy.com).

## Aprendizado

- Objeto `window` é a janela inteira, objeto `document` é dentro da página.
- Função `dir(document)` no console, permite ver todos os objetos do DOM.
- Refatoração: Otimizar código
- https://forum.imasters.com.br/topic/521868-variáveis-com-cifrões-e-underlines/
- Template String `${var} texto`

Atributo privado
```js
this._valor = 'valor'
```
Converções
```js
v.toString() // Converte para string
v.parseInt() // Converte para inteiro
```

Métodos Array
```js
array.push('iten') // Adiciona item no array ao final
array.pop()        // Remove último elemento no array
```

Método get retorna valor
```js
getValor() {
  return this._valor
}
```

Método set adiciona valor
```js
setValor(v) {
  this._valor = v
}
```

Método eval transforma qualquer string em JS
```js
eval('var v = 10')
// > v
// > 10
```

Diferenças método join e toString
```js
[10, '+', 10].toString()
// > '10,+,10'

[10, '+', 10].join()
// > '10,+,10'

[10, '+', 10].join('')
// > '10+10'
```