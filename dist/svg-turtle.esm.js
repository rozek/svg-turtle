//----------------------------------------------------------------------------//
/**** throwableError - simplifies construction of named errors ****/
function throwableError(Message) {
    var Match = /^([$a-zA-Z][$a-zA-Z0-9]*):\s*(\S.+)\s*$/.exec(Message);
    if (Match == null) {
        return new Error(Message);
    }
    else {
        var namedError = new Error(Match[2]);
        namedError.name = Match[1];
        return namedError;
    }
}
/**** throwError - throws a named error ****/
function throwError(Message) {
    throw throwableError(Message);
}
/**** ValueIsNumber ****/
function ValueIsNumber(Value) {
    return (typeof Value === 'number') || (Value instanceof Number);
}
/**** ValueIsFiniteNumber (pure "isFinite" breaks on objects) ****/
function ValueIsFiniteNumber(Value) {
    return ((typeof Value === 'number') || (Value instanceof Number)) && isFinite(Value.valueOf());
}
/**** ValueIsNumberInRange ****/
function ValueIsNumberInRange(Value, minValue, maxValue, withMin, withMax) {
    if (withMin === void 0) { withMin = true; }
    if (withMax === void 0) { withMax = true; }
    if (!ValueIsNumber(Value) || isNaN(Value)) {
        return false;
    }
    if (ValueIsFiniteNumber(minValue)) { // more robust than "isFinite" alone
        if (ValueIsFiniteNumber(maxValue)) { // more robust than "isFinite" alone
            if ((Value < minValue) || (!withMin && (Value === minValue)) ||
                (Value > maxValue) || (!withMax && (Value === maxValue))) {
                return false;
            }
        }
        else {
            if ((Value < minValue) || (!withMin && (Value === minValue))) {
                return false;
            }
        }
    }
    else {
        if (ValueIsFiniteNumber(maxValue)) { // more robust than "isFinite" alone
            if ((Value > maxValue) || (!withMax && (Value === maxValue))) {
                return false;
            }
        }
    }
    return true;
}
/**** ValueIsString ****/
function ValueIsString(Value) {
    return (typeof Value === 'string') || (Value instanceof String);
}
/**** ValueIsPlainObject ****/
function ValueIsPlainObject(Value) {
    return ((Value != null) && (typeof Value === 'object') &&
        (Object.getPrototypeOf(Value) === Object.prototype));
}
/**** ValueIsOneOf ****/
function ValueIsOneOf(Value, ValueList) {
    return (ValueList.indexOf(Value) >= 0);
} // no automatic unboxing of boxed values and vice-versa!
/**** ValueIsColor ****/
function ValueIsColor(Value) {
    return ValueIsString(Value) && (ColorSet.hasOwnProperty(Value) ||
        /^#[a-fA-F0-9]{6}$/.test(Value) ||
        /^#[a-fA-F0-9]{8}$/.test(Value) ||
        /^rgb\([0-9]+,\s*[0-9]+,\s*[0-9]+\)$/.test(Value) || // not perfect
        /^rgba\([0-9]+,\s*[0-9]+,\s*[0-9]+,([01]|[0]?[.][0-9]+)\)$/.test(Value) // dto.
    );
}
//------------------------------------------------------------------------------
//--                      Argument Validation Functions                       --
//------------------------------------------------------------------------------
var rejectNil = false;
var acceptNil = true;
/**** validatedArgument ****/
function validatedArgument(Description, Argument, ValueIsValid, NilIsAcceptable, Expectation) {
    if (Argument == null) {
        if (NilIsAcceptable) {
            return Argument;
        }
        else {
            throwError("MissingArgument: no " + escaped(Description) + " given");
        }
    }
    else {
        if (ValueIsValid(Argument)) {
            switch (true) {
                case Argument instanceof Boolean:
                case Argument instanceof Number:
                case Argument instanceof String:
                    return Argument.valueOf(); // unboxes any primitives
                default:
                    return Argument;
            }
        }
        else {
            throwError("InvalidArgument: the given " + escaped(Description) + " is no valid " + escaped(Expectation));
        }
    }
}
/**** ValidatorForClassifier ****/
function ValidatorForClassifier(Classifier, NilIsAcceptable, Expectation) {
    var Validator = function (Description, Argument) {
        return validatedArgument(Description, Argument, Classifier, NilIsAcceptable, Expectation);
    };
    var ClassifierName = Classifier.name;
    if ((ClassifierName != null) && /^ValueIs/.test(ClassifierName)) {
        var ValidatorName = ClassifierName.replace(// derive name from validator
        /^ValueIs/, NilIsAcceptable ? 'allow' : 'expect');
        return FunctionWithName(Validator, ValidatorName);
    }
    else {
        return Validator; // without any specific name
    }
}
/**** FunctionWithName (works with older JS engines as well) ****/
function FunctionWithName(originalFunction, desiredName) {
    if (originalFunction == null) {
        throwError('MissingArgument: no function given');
    }
    if (typeof originalFunction !== 'function') {
        throwError('InvalidArgument: the given 1st Argument is not a JavaScript function');
    }
    if (desiredName == null) {
        throwError('MissingArgument: no desired name given');
    }
    if ((typeof desiredName !== 'string') && !(desiredName instanceof String)) {
        throwError('InvalidArgument: the given desired name is not a string');
    }
    if (originalFunction.name === desiredName) {
        return originalFunction;
    }
    try {
        Object.defineProperty(originalFunction, 'name', { value: desiredName });
        if (originalFunction.name === desiredName) {
            return originalFunction;
        }
    }
    catch (signal) { /* ok - let's take the hard way */ }
    var renamed = new Function('originalFunction', 'return function ' + desiredName + ' () {' +
        'return originalFunction.apply(this,Array.prototype.slice.apply(arguments))' +
        '}');
    return renamed(originalFunction);
} // also works with older JavaScript engines
/**** allow/expect[ed]FiniteNumber ****/
var allowFiniteNumber = /*#__PURE__*/ ValidatorForClassifier(ValueIsFiniteNumber, acceptNil, 'finite numeric value');
var expectFiniteNumber = /*#__PURE__*/ ValidatorForClassifier(ValueIsFiniteNumber, rejectNil, 'finite numeric value');
/**** allow[ed]OneOf ****/
function allowOneOf(Description, Argument, ValueList) {
    return (Argument == null
        ? Argument
        : expectedOneOf(Description, Argument, ValueList));
}
/**** expect[ed]OneOf ****/
function expectOneOf(Description, Argument, ValueList) {
    if (Argument == null) {
        throwError("MissingArgument: no " + escaped(Description) + " given");
    }
    if (ValueIsOneOf(Argument, ValueList)) {
        return ( // unboxes any primitives
        (Argument == null) || (typeof Argument.valueOf !== 'function')
            ? Argument
            : Argument.valueOf());
    }
    else {
        throwError("InvalidArgument: the given " + escaped(Description) + " is not among the supported values");
    }
}
var expectedOneOf = expectOneOf;
/**** escaped - escapes all control characters in a given string ****/
function escaped(Text) {
    var EscapeSequencePattern = /\\x[0-9a-zA-Z]{2}|\\u[0-9a-zA-Z]{4}|\\[0bfnrtv'"\\\/]?/g;
    var CtrlCharCodePattern = /[\x00-\x1f\x7f-\x9f]/g;
    return Text
        .replace(EscapeSequencePattern, function (Match) {
        return (Match === '\\' ? '\\\\' : Match);
    })
        .replace(CtrlCharCodePattern, function (Match) {
        switch (Match) {
            case '\0': return '\\0';
            case '\b': return '\\b';
            case '\f': return '\\f';
            case '\n': return '\\n';
            case '\r': return '\\r';
            case '\t': return '\\t';
            case '\v': return '\\v';
            default: {
                var HexCode = Match.charCodeAt(0).toString(16);
                return '\\x' + '00'.slice(HexCode.length) + HexCode;
            }
        }
    });
}
//------------------------------------------------------------------------------
//--                             Color Utilities                              --
//------------------------------------------------------------------------------
// built-in color names (see http://www.w3.org/TR/SVG/types.html#ColorKeywords) ----
var ColorSet = {
    transparent: 'rgba(0,0,0,0,0.0)',
    aliceblue: 'rgba(240,248,255,1.0)', lightpink: 'rgba(255,182,193,1.0)',
    antiquewhite: 'rgba(250,235,215,1.0)', lightsalmon: 'rgba(255,160,122,1.0)',
    aqua: 'rgba(0,255,255,1.0)', lightseagreen: 'rgba(32,178,170,1.0)',
    aquamarine: 'rgba(127,255,212,1.0)', lightskyblue: 'rgba(135,206,250,1.0)',
    azure: 'rgba(240,255,255,1.0)', lightslategray: 'rgba(119,136,153,1.0)',
    beige: 'rgba(245,245,220,1.0)', lightslategrey: 'rgba(119,136,153,1.0)',
    bisque: 'rgba(255,228,196,1.0)', lightsteelblue: 'rgba(176,196,222,1.0)',
    black: 'rgba(0,0,0,1.0)', lightyellow: 'rgba(255,255,224,1.0)',
    blanchedalmond: 'rgba(255,235,205,1.0)', lime: 'rgba(0,255,0,1.0)',
    blue: 'rgba(0,0,255,1.0)', limegreen: 'rgba(50,205,50,1.0)',
    blueviolet: 'rgba(138,43,226,1.0)', linen: 'rgba(250,240,230,1.0)',
    brown: 'rgba(165,42,42,1.0)', magenta: 'rgba(255,0,255,1.0)',
    burlywood: 'rgba(222,184,135,1.0)', maroon: 'rgba(128,0,0,1.0)',
    cadetblue: 'rgba(95,158,160,1.0)', mediumaquamarine: 'rgba(102,205,170,1.0)',
    chartreuse: 'rgba(127,255,0,1.0)', mediumblue: 'rgba(0,0,205,1.0)',
    chocolate: 'rgba(210,105,30,1.0)', mediumorchid: 'rgba(186,85,211,1.0)',
    coral: 'rgba(255,127,80,1.0)', mediumpurple: 'rgba(147,112,219,1.0)',
    cornflowerblue: 'rgba(100,149,237,1.0)', mediumseagreen: 'rgba(60,179,113,1.0)',
    cornsilk: 'rgba(255,248,220,1.0)', mediumslateblue: 'rgba(123,104,238,1.0)',
    crimson: 'rgba(220,20,60,1.0)', mediumspringgreen: 'rgba(0,250,154,1.0)',
    cyan: 'rgba(0,255,255,1.0)', mediumturquoise: 'rgba(72,209,204,1.0)',
    darkblue: 'rgba(0,0,139,1.0)', mediumvioletred: 'rgba(199,21,133,1.0)',
    darkcyan: 'rgba(0,139,139,1.0)', midnightblue: 'rgba(25,25,112,1.0)',
    darkgoldenrod: 'rgba(184,134,11,1.0)', mintcream: 'rgba(245,255,250,1.0)',
    darkgray: 'rgba(169,169,169,1.0)', mistyrose: 'rgba(255,228,225,1.0)',
    darkgreen: 'rgba(0,100,0,1.0)', moccasin: 'rgba(255,228,181,1.0)',
    darkgrey: 'rgba(169,169,169,1.0)', navajowhite: 'rgba(255,222,173,1.0)',
    darkkhaki: 'rgba(189,183,107,1.0)', navy: 'rgba(0,0,128,1.0)',
    darkmagenta: 'rgba(139,0,139,1.0)', oldlace: 'rgba(253,245,230,1.0)',
    darkolivegreen: 'rgba(85,107,47,1.0)', olive: 'rgba(128,128,0,1.0)',
    darkorange: 'rgba(255,140,0,1.0)', olivedrab: 'rgba(107,142,35,1.0)',
    darkorchid: 'rgba(153,50,204,1.0)', orange: 'rgba(255,165,0,1.0)',
    darkred: 'rgba(139,0,0,1.0)', orangered: 'rgba(255,69,0,1.0)',
    darksalmon: 'rgba(233,150,122,1.0)', orchid: 'rgba(218,112,214,1.0)',
    darkseagreen: 'rgba(143,188,143,1.0)', palegoldenrod: 'rgba(238,232,170,1.0)',
    darkslateblue: 'rgba(72,61,139,1.0)', palegreen: 'rgba(152,251,152,1.0)',
    darkslategray: 'rgba(47,79,79,1.0)', paleturquoise: 'rgba(175,238,238,1.0)',
    darkslategrey: 'rgba(47,79,79,1.0)', palevioletred: 'rgba(219,112,147,1.0)',
    darkturquoise: 'rgba(0,206,209,1.0)', papayawhip: 'rgba(255,239,213,1.0)',
    darkviolet: 'rgba(148,0,211,1.0)', peachpuff: 'rgba(255,218,185,1.0)',
    deeppink: 'rgba(255,20,147,1.0)', peru: 'rgba(205,133,63,1.0)',
    deepskyblue: 'rgba(0,191,255,1.0)', pink: 'rgba(255,192,203,1.0)',
    dimgray: 'rgba(105,105,105,1.0)', plum: 'rgba(221,160,221,1.0)',
    dimgrey: 'rgba(105,105,105,1.0)', powderblue: 'rgba(176,224,230,1.0)',
    dodgerblue: 'rgba(30,144,255,1.0)', purple: 'rgba(128,0,128,1.0)',
    firebrick: 'rgba(178,34,34,1.0)', red: 'rgba(255,0,0,1.0)',
    floralwhite: 'rgba(255,250,240,1.0)', rosybrown: 'rgba(188,143,143,1.0)',
    forestgreen: 'rgba(34,139,34,1.0)', royalblue: 'rgba(65,105,225,1.0)',
    fuchsia: 'rgba(255,0,255,1.0)', saddlebrown: 'rgba(139,69,19,1.0)',
    gainsboro: 'rgba(220,220,220,1.0)', salmon: 'rgba(250,128,114,1.0)',
    ghostwhite: 'rgba(248,248,255,1.0)', sandybrown: 'rgba(244,164,96,1.0)',
    gold: 'rgba(255,215,0,1.0)', seagreen: 'rgba(46,139,87,1.0)',
    goldenrod: 'rgba(218,165,32,1.0)', seashell: 'rgba(255,245,238,1.0)',
    gray: 'rgba(128,128,128,1.0)', sienna: 'rgba(160,82,45,1.0)',
    green: 'rgba(0,128,0,1.0)', silver: 'rgba(192,192,192,1.0)',
    greenyellow: 'rgba(173,255,47,1.0)', skyblue: 'rgba(135,206,235,1.0)',
    grey: 'rgba(128,128,128,1.0)', slateblue: 'rgba(106,90,205,1.0)',
    honeydew: 'rgba(240,255,240,1.0)', slategray: 'rgba(112,128,144,1.0)',
    hotpink: 'rgba(255,105,180,1.0)', slategrey: 'rgba(112,128,144,1.0)',
    indianred: 'rgba(205,92,92,1.0)', snow: 'rgba(255,250,250,1.0)',
    indigo: 'rgba(75,0,130,1.0)', springgreen: 'rgba(0,255,127,1.0)',
    ivory: 'rgba(255,255,240,1.0)', steelblue: 'rgba(70,130,180,1.0)',
    khaki: 'rgba(240,230,140,1.0)', tan: 'rgba(210,180,140,1.0)',
    lavender: 'rgba(230,230,250,1.0)', teal: 'rgba(0,128,128,1.0)',
    lavenderblush: 'rgba(255,240,245,1.0)', thistle: 'rgba(216,191,216,1.0)',
    lawngreen: 'rgba(124,252,0,1.0)', tomato: 'rgba(255,99,71,1.0)',
    lemonchiffon: 'rgba(255,250,205,1.0)', turquoise: 'rgba(64,224,208,1.0)',
    lightblue: 'rgba(173,216,230,1.0)', violet: 'rgba(238,130,238,1.0)',
    lightcoral: 'rgba(240,128,128,1.0)', wheat: 'rgba(245,222,179,1.0)',
    lightcyan: 'rgba(224,255,255,1.0)', white: 'rgba(255,255,255,1.0)',
    lightgoldenrodyellow: 'rgba(250,250,210,1.0)', whitesmoke: 'rgba(245,245,245,1.0)',
    lightgray: 'rgba(211,211,211,1.0)', yellow: 'rgba(255,255,0,1.0)',
    lightgreen: 'rgba(144,238,144,1.0)', yellowgreen: 'rgba(154,205,50,1.0)',
    lightgrey: 'rgba(211,211,211,1.0)',
};

//----------------------------------------------------------------------------//
var TUR_Lineatures = ['solid', 'dotted', 'dashed'];
var TUR_Joins = ['bevel', 'miter', 'round'];
var TUR_Caps = ['butt', 'round', 'square'];
/**** ValueIsPosition ****/
function ValueIsPosition(Value) {
    return (ValueIsPlainObject(Value) &&
        ValueIsFiniteNumber(Value.x) &&
        ValueIsFiniteNumber(Value.y));
}
/**** allow/expect[ed]Position ****/
var allowPosition = ValidatorForClassifier(ValueIsPosition, acceptNil, 'turtle position'), allowedPosition = allowPosition;
var expectPosition = ValidatorForClassifier(ValueIsPosition, rejectNil, 'turtle position'), expectedPosition = expectPosition;
/**** ValueIsAlignment ****/
function ValueIsAlignment(Value) {
    return (ValueIsPlainObject(Value) &&
        ValueIsFiniteNumber(Value.x) &&
        ValueIsFiniteNumber(Value.y) &&
        ValueIsFiniteNumber(Value.Direction));
}
/**** allow/expect[ed]Alignment ****/
var allowAlignment = ValidatorForClassifier(ValueIsAlignment, acceptNil, 'turtle alignment'), allowedAlignment = allowAlignment;
var expectAlignment = ValidatorForClassifier(ValueIsAlignment, rejectNil, 'turtle alignment'), expectedAlignment = expectAlignment;
/**** ValueIsPathOptionSet ****/
function ValueIsPathOptionSet(Value) {
    return (ValueIsPlainObject(Value) &&
        ((Value.x == null) || ValueIsFiniteNumber(Value.x)) &&
        ((Value.y == null) || ValueIsFiniteNumber(Value.y)) &&
        ((Value.Direction == null) || ValueIsFiniteNumber(Value.Direction)) &&
        ((Value.Width == null) || ValueIsNumberInRange(Value.Width, 0)) &&
        ((Value.Color == null) || ValueIsColor(Value.Color)) &&
        ((Value.Lineature == null) || ValueIsOneOf(Value.Lineature, TUR_Lineatures)) &&
        ((Value.Join == null) || ValueIsOneOf(Value.Join, TUR_Joins)) &&
        ((Value.Cap == null) || ValueIsOneOf(Value.Cap, TUR_Caps)));
}
/**** allow/expect[ed]PathOptionSet ****/
var allowPathOptionSet = ValidatorForClassifier(ValueIsPathOptionSet, acceptNil, 'turtle path option set'), allowedPathOptionSet = allowPathOptionSet;
var expectPathOptionSet = ValidatorForClassifier(ValueIsPathOptionSet, rejectNil, 'turtle path option set'), expectedPathOptionSet = expectPathOptionSet;
/**** Graphic ****/
var Graphic = /** @class */ (function () {
    function Graphic() {
        this.SVGContent = '';
        this.currentPath = undefined;
        this.currentX = 0;
        this.currentY = 0;
        this.currentDirection = 0;
        this.currentWidth = 1;
        this.currentColor = '#000000';
        this.currentLineature = 'solid';
        this.currentJoin = 'round';
        this.currentCap = 'round';
    }
    /**** reset ****/
    Graphic.prototype.reset = function () {
        this.currentX = 0;
        this.currentY = 0;
        this.currentDirection = 0;
        this.currentWidth = 1;
        this.currentColor = '#000000';
        this.currentLineature = 'solid';
        this.currentJoin = 'round';
        this.currentCap = 'round';
        return this;
    };
    /**** beginPath ****/
    Graphic.prototype.beginPath = function (PathOptionSet) {
        allowPathOptionSet('option set', PathOptionSet);
        if (this.currentPath != null) {
            this.endPath();
        }
        if (PathOptionSet != null) {
            if ('x' in PathOptionSet) {
                this.currentX = PathOptionSet.x;
            }
            if ('y' in PathOptionSet) {
                this.currentY = PathOptionSet.y;
            }
            if ('Direction' in PathOptionSet) {
                this.currentDirection = PathOptionSet.Direction;
            }
            if ('Width' in PathOptionSet) {
                this.currentWidth = PathOptionSet.Width;
            }
            if ('Color' in PathOptionSet) {
                this.currentColor = PathOptionSet.Color;
            }
            if ('Lineature' in PathOptionSet) {
                this.currentLineature = PathOptionSet.Lineature;
            }
            if ('Join' in PathOptionSet) {
                this.currentJoin = PathOptionSet.Join;
            }
            if ('Cap' in PathOptionSet) {
                this.currentCap = PathOptionSet.Cap;
            }
        }
        if (this.minX == null) {
            this.minX = this.maxX = this.currentX;
            this.minY = this.maxY = this.currentY;
        }
        this.currentPath = '<path ' +
            'fill="none" ' +
            'stroke="' + this.currentColor + '" ' +
            'stroke-width="' + this.currentWidth + '" ' +
            'stroke-linejoin="' + this.currentJoin + '" ' +
            'stroke-linecap="' + this.currentCap + '" ';
        switch (this.currentLineature) {
            case 'dotted':
                this.currentPath += 'stroke-dasharray="1" ';
                break;
            case 'dashed':
                this.currentPath += 'stroke-dasharray="3 1" ';
                break;
            case 'solid':
            default:
                this.currentPath += 'stroke-dasharray="none" ';
        }
        this.currentPath += 'd="';
        if ((this.currentX !== 0) || (this.currentY !== 0)) {
            this.moveTo(this.currentX, this.currentY);
        }
        return this;
    };
    /**** turn ****/
    Graphic.prototype.turn = function (DirectionChange) {
        expectFiniteNumber('direction change', DirectionChange);
        this.currentDirection += DirectionChange;
        return this;
    };
    /**** turnTo ****/
    Graphic.prototype.turnTo = function (Direction) {
        expectFiniteNumber('direction', Direction);
        this.currentDirection = Direction;
        return this;
    };
    /**** turnLeft ****/
    Graphic.prototype.turnLeft = function (DirectionChange) {
        expectFiniteNumber('direction change', DirectionChange);
        this.currentDirection -= DirectionChange;
        return this;
    };
    /**** turnRight ****/
    Graphic.prototype.turnRight = function (DirectionChange) {
        expectFiniteNumber('direction change', DirectionChange);
        this.currentDirection += DirectionChange;
        return this;
    };
    /**** move ****/
    Graphic.prototype.move = function (Distance) {
        expectFiniteNumber('distance', Distance);
        var DirectionInRadians = this.currentDirection * Math.PI / 180;
        this.moveTo(// DRY approach
        (this.currentX || 0) + Distance * Math.cos(DirectionInRadians), (this.currentY || 0) + Distance * Math.sin(DirectionInRadians));
        return this;
    };
    /**** moveTo ****/
    Graphic.prototype.moveTo = function (x, y) {
        expectFiniteNumber('x coordinate', x);
        expectFiniteNumber('y coordinate', y);
        this.currentX = x;
        this.currentY = y;
        if (this.currentPath != null) {
            this.currentPath += 'M ' + rounded(x) + ',' + rounded(y) + ' ';
            this.updateBoundingBox();
        }
        return this;
    };
    /**** draw ****/
    Graphic.prototype.draw = function (Distance) {
        expectFiniteNumber('distance', Distance);
        var DirectionInRadians = this.currentDirection * Math.PI / 180;
        this.drawTo(// DRY approach
        (this.currentX || 0) + Distance * Math.cos(DirectionInRadians), (this.currentY || 0) + Distance * Math.sin(DirectionInRadians));
        return this;
    };
    /**** drawTo ****/
    Graphic.prototype.drawTo = function (x, y) {
        expectFiniteNumber('x coordinate', x);
        expectFiniteNumber('y coordinate', y);
        if (this.currentPath == null) {
            this.beginPath();
            if (this.minX == null) {
                this.moveTo(this.currentX, this.currentY);
            }
        }
        this.currentX = x;
        this.currentY = y;
        this.currentPath += 'L ' + rounded(x) + ',' + rounded(y) + ' ';
        this.updateBoundingBox();
        return this;
    };
    /**** curveLeft/Right ****/
    Graphic.prototype.curveLeft = function (Angle, rx, ry) {
        return this.curve(Angle, rx, ry, 0);
    };
    Graphic.prototype.curveRight = function (Angle, rx, ry) {
        return this.curve(Angle, rx, ry, 1);
    };
    /**** curve ****/
    Graphic.prototype.curve = function (Angle, rx, ry, clockwise) {
        expectFiniteNumber('turn angle', Angle);
        expectFiniteNumber('x radius', rx);
        allowFiniteNumber('y radius', ry);
        if (ry == null) {
            ry = rx;
        }
        if (this.currentPath == null) {
            this.beginPath();
            if (this.minX == null) {
                this.moveTo(this.currentX, this.currentY);
            }
        }
        var AngleInRadians = Angle * Math.PI / 180;
        Angle = Angle % 360;
        var largeArc = (Math.abs(Angle) < 180 ? 0 : 1);
        var x0 = this.currentX;
        var y0 = this.currentY;
        var Direction = this.currentDirection;
        var DirectionInRadians = Direction * Math.PI / 180;
        var cx = x0 + ry * Math.sin(DirectionInRadians) * (clockwise === 1 ? -1 : 1);
        var cy = y0 + ry * Math.cos(DirectionInRadians) * (clockwise === 1 ? 1 : -1);
        var x1 = cx + rx * Math.sin(DirectionInRadians + AngleInRadians);
        var y1 = cy + ry * Math.cos(DirectionInRadians + AngleInRadians) * (clockwise === 1 ? -1 : 1);
        this.currentPath += ('A ' + rounded(rx) + ' ' + rounded(ry) + ' ' +
            rounded(Direction) + ' ' + largeArc + ' ' +
            (Angle >= 0 ? clockwise : (clockwise === 0 ? 1 : 0)) + ' ' +
            rounded(x1) + ',' + rounded(y1) + ' ');
        this.currentDirection += (Angle >= 0 ? Angle : 180 + Angle) * (clockwise === 1 ? 1 : -1);
        this.currentX = x1;
        this.currentY = y1;
        this.updateBoundingBox(); // *C* not perfect
        return this;
    };
    /**** endPath ****/
    Graphic.prototype.endPath = function () {
        if (this.currentPath != null) {
            this.currentPath += '"/>';
            this.SVGContent += this.currentPath;
            this.currentPath = undefined;
        }
        return this;
    };
    /**** closePath ****/
    Graphic.prototype.closePath = function () {
        if (this.currentPath != null) {
            this.currentPath += 'Z';
            this.endPath();
        }
        return this;
    };
    /**** currentPosition ****/
    Graphic.prototype.currentPosition = function () {
        return { x: this.currentX, y: this.currentY };
    };
    /**** positionAt ****/
    Graphic.prototype.positionAt = function (Position) {
        allowPosition('turtle position', Position);
        if (this.currentPath == null) {
            this.currentX = Position.x;
            this.currentY = Position.y;
        }
        else {
            this.moveTo(Position.x, Position.y);
        }
        return this;
    };
    /**** currentAlignment ****/
    Graphic.prototype.currentAlignment = function () {
        return {
            x: this.currentX, y: this.currentY, Direction: this.currentDirection
        };
    };
    /**** alignAt ****/
    Graphic.prototype.alignAt = function (Alignment) {
        allowAlignment('turtle alignment', Alignment);
        this.currentDirection = Alignment.Direction;
        if (this.currentPath == null) {
            this.currentX = Alignment.x;
            this.currentY = Alignment.y;
        }
        else {
            this.moveTo(Alignment.x, Alignment.y);
        }
        return this;
    };
    /**** asSVG ****/
    Graphic.prototype.asSVG = function (Unit, xMin, yMin, xMax, yMax) {
        allowOneOf('SVG unit', Unit, ['px', 'mm', 'cm', 'in']);
        allowFiniteNumber('minimal x', xMin);
        allowFiniteNumber('maximal x', xMax);
        allowFiniteNumber('minimal y', yMin);
        allowFiniteNumber('maximal y', yMax);
        if (this.minX == null) { // very special case: nothing has been drawn yet
            this.minX = this.maxX = this.minY = this.maxY = 0;
        }
        if (Unit == null) {
            Unit = 'px';
        }
        if (xMin == null) {
            xMin = this.minX;
        }
        if (xMax == null) {
            xMax = this.maxX;
        }
        if (yMin == null) {
            yMin = this.minY;
        }
        if (yMax == null) {
            yMax = this.maxY;
        }
        // @ts-ignore TS2532 we know that xMax and xMin are defined
        var Width = xMax - xMin;
        // @ts-ignore TS2532 we know that yMax and yMin are defined
        var Height = yMax - yMin;
        if (Width < 0)
            throwError('InvalidArgument: invalid x range given');
        if (Height < 0)
            throwError('InvalidArgument: invalid y range given');
        if (this.currentPath != null) { // if need be: end an ongoing path
            this.endPath();
        }
        return ('<svg xmlns="http://www.w3.org/2000/svg" ' +
            'width="' + rounded(Width) + Unit + '" ' +
            'height="' + rounded(Height) + Unit + '" ' +
            // @ts-ignore TS2532 we know that xMin and yMin are defined
            'viewBox="' + floored(xMin) + ' ' + floored(yMin) + ' ' +
            ceiled(Width) + ' ' + ceiled(Height) + '" ' +
            'vector-effect="non-scaling-stroke"' +
            '>' +
            this.SVGContent +
            '</svg>');
    };
    /**** asSVGwith72dpi ****/
    Graphic.prototype.asSVGwith72dpi = function (Unit, xMin, yMin, xMax, yMax) {
        var SVG = this.asSVG(Unit, xMin, yMin, xMax, yMax); // also validates arg.s
        var Scale = 72 / {
            'px': 25.4, 'mm': 25.4, 'cm': 2.54, 'in': 1
        }[Unit || 'mm'];
        if (xMin == null) {
            xMin = this.minX;
        }
        if (xMax == null) {
            xMax = this.maxX;
        }
        if (yMin == null) {
            yMin = this.minY;
        }
        if (yMax == null) {
            yMax = this.maxY;
        }
        return ('<svg xmlns="http://www.w3.org/2000/svg" ' +
            // @ts-ignore TS2532 we know that xMin and yMin are defined
            'viewBox="' + floored(Scale * xMin) + ' ' + floored(Scale * yMin) + ' ' +
            // @ts-ignore TS2532 we know that xMin,xMax,yMin and yMax are defined
            ceiled(Scale * (xMax - xMin)) + ' ' + ceiled(Scale * (yMax - yMin)) + '" ' +
            'vector-effect="non-scaling-stroke"' +
            '>' +
            '<g transform="scale(' + Scale + ',' + Scale + ')">' +
            SVG +
            '</g></svg>');
    };
    /**** updateBoundingBox ****/
    Graphic.prototype.updateBoundingBox = function () {
        this.minX = Math.min(this.minX, this.currentX);
        this.maxX = Math.max(this.maxX, this.currentX);
        this.minY = Math.min(this.minY, this.currentY);
        this.maxY = Math.max(this.maxY, this.currentY);
    };
    return Graphic;
}());
/**** rounded ****/
function rounded(Value) {
    return Math.round(Value * 100) / 100;
}
/**** ceiled ****/
function ceiled(Value) {
    return Math.ceil(Value * 100) / 100;
}
/**** floored ****/
function floored(Value) {
    return Math.floor(Value * 100) / 100;
}

export { Graphic, TUR_Caps, TUR_Joins, TUR_Lineatures, ValueIsAlignment, ValueIsPathOptionSet, ValueIsPosition, allowAlignment, allowPathOptionSet, allowPosition, allowedAlignment, allowedPathOptionSet, allowedPosition, expectAlignment, expectPathOptionSet, expectPosition, expectedAlignment, expectedPathOptionSet, expectedPosition };
//# sourceMappingURL=svg-turtle.esm.js.map
