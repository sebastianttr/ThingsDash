export default class {
    operatorsNames = ['LD', 'ST', 'S', 'R', 'AND', 'OR', 'XOR', 'ADD', 'SUB', 'MUL', 'DIV', 'GT', 'GE',
        'EQ', 'NE', 'LE', 'LT', 'ANDN', 'ANDE', 'ANDNE', 'ORN', 'ORE', 'ORNE', 'XORN',
        'XORE', 'XORNE', 'LDN', 'STN', 'ADDE', 'SUBE', 'MULE', 'DIVE', 'GTE', 'GEE', 'EQE',
        'NEE', 'LEE', 'LTE', 'JMP', 'JMPC', 'JMPCN', 'Delay', 'Print', 'Println',
        'WiFiConnect', 'HttpGet', 'HttpPost', 'LoRaSend'
    ];

    operatorsNamesCompletion = ['LD', 'ST', 'S', 'R', 'AND', 'OR', 'XOR', 'ADD', 'SUB', 'MUL', 'DIV', 'GT', 'GE',
        'EQ', 'NE', 'LE', 'LT', 'ANDN', 'AND (\n)', 'ANDN (\n)', 'ORN', 'OR (\n)', 'ORN (\n)', 'XORN',
        'XOR (\n)', 'XORN (\n)', 'LDN', 'STN', 'ADD (\n)', 'SUB (\n)', 'MUL (\n)', 'DIV (\n)', 'GT (\n)', 'GE (\n)', 'EQ (\n)',
        'NE (\n)', 'LE (\n)', 'LT (\n)', 'JMP', 'JMPC', 'JMPCN', 'Delay', 'Print', 'Println',
        'WiFiConnect', 'HttpGet', 'HttpPost', 'LoRaSend'
    ];

    operatorsCodes = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '0A', '0B', '0C', '0D',
        '0E', '0F', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '1A', '1B', '1C',
        '1D', '1E', '1F', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', 'A0', 'A1',
        'A2', 'A3', 'A4', 'A5', 'A9'
    ];

    variables = ['%IO26', '%IO27', '%IO25', '%IADC0', '%TEMP', '%PRES', '%AX', '%AY', '%AZ', '%TOFM', '%TOFCM', '%TOFMM'];

    constructor() {}

    convertScriptToEIL(script) {
        var stringNLReplace = script.replaceAll("\n", ";");
        stringNLReplace = stringNLReplace.replace(/;+/g, ';'); //REGEX
        var splited = String(stringNLReplace).split(";");
        splited.pop(); //remove last element, cuz useless
        let stringComposed = "";
        splited.forEach((item, index) => {
            var operator = item.substring(0, item.indexOf(" "));
            stringComposed = stringComposed +
                this.operatorsCodes[this.operatorsNames.indexOf(operator)] +
                item.substring(item.indexOf(" ") + 1, item.length) +
                ";";
        })
        console.log(stringComposed);
    }
}