export default class {
    operatorsNames = ['LD', 'ST', 'S', 'R', 'AND', 'OR', 'XOR', 'ADD', 'SUB', 'MUL', 'DIV', 'GT', 'GE',
        'EQ', 'NE', 'LE', 'LT', 'ANDN', 'ANDE', 'ANDNE', 'ORN', 'ORE', 'ORNE', 'XORN',
        'XORE', 'XORNE', 'LDN', 'STN', 'ADDE', 'SUBE', 'MULE', 'DIVE', 'GTE', 'GEE', 'EQE',
        'NEE', 'LEE', 'LTE', 'JMP', 'JMPC', 'JMPCN', 'JMPBCK', 'RET', 'Expression End', 'Delay', 'Print', 'Println',
        'WiFiConnect', 'HttpGet', 'HttpPost', 'LoRaSend'
    ];

    operatorsNamesCompletion = ['LD', 'ST', 'S', 'R', 'AND', 'OR', 'XOR', 'ADD', 'SUB', 'MUL', 'DIV', 'GT', 'GE',
        'EQ', 'NE', 'LE', 'LT', 'ANDN', 'AND (\n${1:}\n)', 'ANDN (\n${1:}\n)', 'ORN', 'OR (\n${1:}\n)', 'ORN (\n${1:}\n)', 'XORN',
        'XOR (\n${1:}\n)', 'XORN (\n${1:}\n)', 'LDN', 'STN', 'ADD (\n${1:}\n)', 'SUB (\n${1:}\n)', 'MUL (\n${1:}\n)',
        'DIV (\n${1:}\n)', 'GT (\n${1:}\n)', 'GE (\n${1:}\n)', 'EQ (\n${1:}\n)',
        'NE (\n${1:}\n)', 'LE (\n${1:}\n)', 'LT (\n${1:}\n)', 'JMP', 'JMPC', 'JMPCN', 'JMPBCK', 'RET', '\)', 'Delay', 'Print', 'Println',
        'WiFiConnect', 'HttpGet', 'HttpPost', 'LoRaSend'
    ];

    operatorsCodes = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '0A', '0B', '0C', '0D',
        '0E', '0F', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '1A', '1B', '1C',
        '1D', '1E', '1F', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '2A', '2B', '30', 'A0', 'A1',
        'A2', 'A3', 'A4', 'A5', 'A9'
    ];

    variables = ['%IO26', '%IO27', '%IO25', '%IADC0', '%TEMP', '%PRES', '%AX', '%AY', '%AZ', '%TOFM', '%TOFCM', '%TOFMM'];

    getSplitedArray(script) {
        var stringNLReplace = script.replaceAll("\n", ";");
        stringNLReplace = stringNLReplace.replace(/;+/g, ';'); //REGEX
        var split = String(stringNLReplace).split(";");
        split.splice(split.length - 1, split.length - 1);
        return split;
    }

    getMarkerPosition(script, marker) {
        var splited = this.getSplitedArray(script);
        let indexMarker = 0;
        for (const [index, item] of splited.entries()) {
            if (item.replace(":", "") == marker) {
                indexMarker = index;
                break;
            }
        }
        return indexMarker;
    }

    getOperand(operation) {
        var op = operation.substr(operation.indexOf(" ") + 1, operation.length);
        op.replace(/a/);
        return operation.substr(operation.indexOf(" ") + 1, operation.length);
    }

    getInit(script) {
        var splited = this.getSplitedArray(script);
        var initScript = [];
        var initMarkerPos = this.getMarkerPosition(script, "INIT");

        for (var i = initMarkerPos + 1; i < splited.length; i++) {
            var item = splited[i];
            if (item == "!INIT") {
                break;
            } else initScript.push(item);
        }
        console.log("Init script: " + JSON.stringify(initScript))
        return initScript;
    }

    getLoop(script) {
        var splited = this.getSplitedArray(script);
        var loopScript = [];
        var loopMarkerPos = this.getMarkerPosition(script, "LOOP");

        for (var i = loopMarkerPos + 1; i < splited.length; i++) {
            var item = splited[i];
            if (item == "!LOOP") {
                break;
            } else loopScript.push(item);
        }
        console.log("Loop script: " + JSON.stringify(loopScript))
        return loopScript;
    }

    getScriptFromMarker(script, marker) {
        var start = this.getMarkerPosition(script, marker) + 1;
        var end = this.getMarkerPosition(script, "!" + marker)
        var splited = this.getSplitedArray(script);
        return splited.slice(start, end);
    }

    isMarker(item) {
        item = item.replaceAll(" ", "");
        return item.match(/.*\:\\n/)
    }

    isEndOfMarker(item) {
        item = item.replaceAll(" ", "");
        return item.match(/\!.*\\n/)
    }

    composeInitEIL(script) {
        var jumpBackIndices = [];
        var initMarkerPos = this.getMarkerPosition(script, "INIT");

        var splited = this.getInit(script);
        splited.push("JMP END");

        let stringComposed = "";
        for (var i = 0; i < splited.length; i++) {
            var [operator, operand] = "";
            var item = splited[i].toString();

            if (this.isMarker(item) || this.isEndOfMarker(item)) {
                console.log(item)
                continue;
            } else if (item.includes("(") || item.includes(")")) {
                operator = item.replace(" ", "").replace("(", "E");
                operator = (operator == ")") ? "Expression End" : operator;
                operand = "()";
            } else if (item.match(/(JMP|JMPC|JMPCN)/) &&
                !item.match(/(JMP END|JMPBCK)/)) {
                operator = item.substring(0, item.indexOf(" "));
                operand = splited.length;
                jumpBackIndices.push(i + 2);
                var op = this.getScriptFromMarker(script, this.getOperand(item))
                op.push("JMPBCK []");
                splited.push(...op);
            } else if (item.includes("RET")) {
                operator = "JMP";
                operand = jumpBackIndices.pop()
            } else {
                operator = item.toString().substring(0, item.indexOf(" "));
                operand = this.getOperand(item)
            }

            stringComposed = stringComposed +
                this.operatorsCodes[this.operatorsNames.indexOf(operator)] +
                operand +
                ";";
        }

        stringComposed = stringComposed.replace("27END", "27" + String(splited.length + 1))

        return stringComposed
    }

    composeLoopEIL(script) {
        var jumpBackIndices = [];
        var initMarkerPos = this.getMarkerPosition(script, "LOOP");
        var splited = this.getLoop(script);
        splited.push("JMP END");

        let stringComposed = "";
        for (var i = 0; i < splited.length; i++) {
            var [operator, operand] = "";
            var item = splited[i].toString();

            if (this.isMarker(item) || this.isEndOfMarker(item)) {
                continue;
            } else if (item.includes("(") || item.includes(")")) {
                operator = item.replace(" ", "").replace("(", "E");

                operator = (operator == ")") ? "Expression End" : operator;
                operand = "()";
            } else if (item.match(/(JMP|JMPC|JMPCN)/) &&
                !item.match(/(JMP END|JMPBCK)/)) {
                operator = item.substring(0, item.indexOf(" "));
                operand = splited.length;
                jumpBackIndices.push(i + 2);
                var op = this.getScriptFromMarker(script, this.getOperand(item))
                op.push("JMPBCK []");
                splited.push(...op);
            } else {
                operator = item.toString().substring(0, item.indexOf(" "));
                operand = this.getOperand(item)
            }

            stringComposed = stringComposed +
                this.operatorsCodes[this.operatorsNames.indexOf(operator)] +
                operand +
                ";";
        }

        stringComposed = stringComposed.replace("27END", "27" + String(splited.length + 1))

        return stringComposed
    }

    convertScriptToEIL(script) {

        var initScript = this.composeInitEIL(script)
        var loopScript = this.composeLoopEIL(script)


        console.log(JSON.stringify(initScript));
        console.log(JSON.stringify(loopScript));

    }
}