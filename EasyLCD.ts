/**
 * Easy LCD - Das einfachste Display-Plugin
 */
//% color="#03A9F4" icon="\uf108" block="Easy LCD"
namespace easyLCD {
    let i2cAddr = 39 // Standardadresse (0x27)

    function i2cWrite(value: number) {
        pins.i2cWriteNumber(i2cAddr, value, NumberFormat.Int8LE)
    }

    function send(value: number, mode: number) {
        let high = mode | (value & 0xF0) | 0x08
        let low = mode | ((value << 4) & 0xF0) | 0x08
        i2cWrite(high)
        i2cWrite(high | 0x04)
        i2cWrite(high)
        i2cWrite(low)
        i2cWrite(low | 0x04)
        i2cWrite(low)
    }

    /**
     * Startet das LCD und bereitet es vor.
     */
    //% block="LCD starten"
    export function init(): void {
        basic.pause(50)
        send(0x33, 0)
        basic.pause(5)
        send(0x32, 0)
        send(0x28, 0)
        send(0x0C, 0)
        send(0x01, 0)
        basic.pause(5)
    }

    /**
     * Schreibt Text in eine bestimmte Zeile.
     * @param text Der Text, max. 16 Zeichen, eg: "Hallo"
     * @param zeile Die Zeile (1 oder 2), eg: 1
     */
    //% block="LCD zeige %text in Zeile %zeile"
    //% zeile.min=1 zeile.max=2
    export function zeigeText(text: string, zeile: number): void {
        let pos = (zeile == 1) ? 0x80 : 0xC0
        send(pos, 0)
        for (let i = 0; i < 16; i++) {
            if (i < text.length) {
                send(text.charCodeAt(i), 1)
            } else {
                send(32, 1) // Leerzeichen auffüllen
            }
        }
    }

    /**
     * Löscht das Display komplett.
     */
    //% block="LCD Display leeren"
    export function leeren(): void {
        send(0x01, 0)
        basic.pause(5)
    }
}