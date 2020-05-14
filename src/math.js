const calcularProp = (total, percent = .1) =>  total + total*percent


const suma = (a, b) => {
    return new Promise( (ok, bad) => {
        setTimeout( () => {
            if (a < 0 || b < 0) {
                return bad('Numero a sumar solamente positivos...')
            }
            ok( a + b )
        }, 2000)
    })
}

module.exports = {
    calcularProp,
    suma
}