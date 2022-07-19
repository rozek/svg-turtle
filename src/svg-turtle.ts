//----------------------------------------------------------------------------//
//                                 SVG-Turtle                                 //
//----------------------------------------------------------------------------//

  import {
    throwError,
    ValueIsFiniteNumber, ValueIsNumberInRange, ValueIsPlainObject,
    ValueIsOneOf, ValueIsColor,
    ValidatorForClassifier, acceptNil, rejectNil,
    allowFiniteNumber, expectFiniteNumber, allowOneOf
  } from 'javascript-interface-library'

  export type TUR_Location  = number         // mainly for illustrative purposes
  export type TUR_Dimension = number                                     // dto.
  export type TUR_Angle     = number                                     // dto.
  export type TUR_Color     = string                                     // dto.

  export const TUR_Lineatures = ['solid','dotted','dashed']
  export type  TUR_Lineature  = typeof TUR_Lineatures[number]

  export const TUR_Joins = ['bevel','miter','round']
  export type  TUR_Join  = typeof TUR_Joins[number]

  export const TUR_Caps = ['butt','round','square']
  export type  TUR_Cap  = typeof TUR_Caps[number]

  export type TUR_PathOptionSet = {
    x?:TUR_Location, y?:TUR_Location, Direction?:TUR_Angle,
    Width?:TUR_Dimension, Color?:TUR_Color,
    Lineature?:TUR_Lineature, Join?:TUR_Join, Cap?:TUR_Cap
  }

  export type TUR_Position = {
    x:TUR_Location, y:TUR_Location
  }

  export type TUR_Alignment = {
    x:TUR_Location, y:TUR_Location, Direction:TUR_Angle
  }

/**** ValueIsPosition ****/

  export function ValueIsPosition (Value:any):boolean {
    return (
      ValueIsPlainObject(Value)    &&
      ValueIsFiniteNumber(Value.x) &&
      ValueIsFiniteNumber(Value.y)
    )
  }

/**** allow/expect[ed]Position ****/

  export const allowPosition = ValidatorForClassifier(
    ValueIsPosition, acceptNil, 'turtle position'
  ), allowedPosition = allowPosition

  export const expectPosition = ValidatorForClassifier(
    ValueIsPosition, rejectNil, 'turtle position'
  ), expectedPosition = expectPosition

/**** ValueIsAlignment ****/

  export function ValueIsAlignment (Value:any):boolean {
    return (
      ValueIsPlainObject(Value)    &&
      ValueIsFiniteNumber(Value.x) &&
      ValueIsFiniteNumber(Value.y) &&
      ValueIsFiniteNumber(Value.Direction)
    )
  }

/**** allow/expect[ed]Alignment ****/

  export const allowAlignment = ValidatorForClassifier(
    ValueIsAlignment, acceptNil, 'turtle alignment'
  ), allowedAlignment = allowAlignment

  export const expectAlignment = ValidatorForClassifier(
    ValueIsAlignment, rejectNil, 'turtle alignment'
  ), expectedAlignment = expectAlignment

/**** ValueIsPathOptionSet ****/

  export function ValueIsPathOptionSet (Value:any):boolean {
    return (
      ValueIsPlainObject(Value) &&
      ((Value.x == null)         || ValueIsFiniteNumber(Value.x)) &&
      ((Value.y == null)         || ValueIsFiniteNumber(Value.y)) &&
      ((Value.Direction == null) || ValueIsFiniteNumber(Value.Direction)) &&
      ((Value.Width == null)     || ValueIsNumberInRange(Value.Width, 0)) &&
      ((Value.Color == null)     || ValueIsColor(Value.Color)) &&
      ((Value.Lineature == null) || ValueIsOneOf(Value.Lineature,TUR_Lineatures)) &&
      ((Value.Join == null)      || ValueIsOneOf(Value.Join,TUR_Joins)) &&
      ((Value.Cap == null)       || ValueIsOneOf(Value.Cap,TUR_Caps))
    )
  }

/**** allow/expect[ed]PathOptionSet ****/

  export const allowPathOptionSet = ValidatorForClassifier(
    ValueIsPathOptionSet, acceptNil, 'turtle path option set'
  ), allowedPathOptionSet = allowPathOptionSet

  export const expectPathOptionSet = ValidatorForClassifier(
    ValueIsPathOptionSet, rejectNil, 'turtle path option set'
  ), expectedPathOptionSet = expectPathOptionSet

/**** Graphic ****/

  export class Graphic {
    private SVGContent:string            = ''
    private currentPath:string|undefined = undefined

    private minX:TUR_Location|undefined;  private maxX:TUR_Location|undefined
    private minY:TUR_Location|undefined;  private maxY:TUR_Location|undefined

    private currentX:TUR_Location          = 0
    private currentY:TUR_Location          = 0
    private currentDirection:TUR_Angle     = 0

    private currentWidth:TUR_Dimension     = 1
    private currentColor:TUR_Color         = '#000000'
    private currentLineature:TUR_Lineature = 'solid'
    private currentJoin:TUR_Join           = 'round'
    private currentCap:TUR_Cap             = 'round'

  /**** _initialize ****/

    private _initialize ():void {
      if (this.currentX         == null) { this.currentX         = 0 }
      if (this.currentY         == null) { this.currentY         = 0 }
      if (this.currentDirection == null) { this.currentDirection = 0 }

      if (this.currentWidth     == null) { this.currentWidth     = 1 }
      if (this.currentColor     == null) { this.currentColor     = '#000000' }
      if (this.currentLineature == null) { this.currentLineature = 'solid' }
      if (this.currentJoin      == null) { this.currentJoin      = 'round' }
      if (this.currentCap       == null) { this.currentCap       = 'round' }
    }

  /**** reset ****/

    public reset ():Graphic {
      this.currentX         = 0
      this.currentY         = 0
      this.currentDirection = 0

      this.currentWidth     = 1
      this.currentColor     = '#000000'
      this.currentLineature = 'solid'
      this.currentJoin      = 'round'
      this.currentCap       = 'round'

      return this
    }

  /**** beginPath ****/

    public beginPath (PathOptionSet?:TUR_PathOptionSet):Graphic {
      allowPathOptionSet('option set',PathOptionSet)

      if (this.currentPath != null) {
        this.endPath()
      }

      this._initialize()

      if (PathOptionSet != null) {
        if (PathOptionSet.x         != null) { this.currentX         = PathOptionSet.x as TUR_Location }
        if (PathOptionSet.y         != null) { this.currentY         = PathOptionSet.y as TUR_Location }
        if (PathOptionSet.Direction != null) { this.currentDirection = PathOptionSet.Direction as TUR_Angle }
        if (PathOptionSet.Width     != null) { this.currentWidth     = PathOptionSet.Width as TUR_Dimension }
        if (PathOptionSet.Color     != null) { this.currentColor     = PathOptionSet.Color as TUR_Color }
        if (PathOptionSet.Lineature != null) { this.currentLineature = PathOptionSet.Lineature as TUR_Lineature }
        if (PathOptionSet.Join      != null) { this.currentJoin      = PathOptionSet.Join as TUR_Join }
        if (PathOptionSet.Cap       != null) { this.currentCap       = PathOptionSet.Cap as TUR_Cap }
      }

      if (this.minX == null) {
        this.minX = this.maxX = this.currentX
        this.minY = this.maxY = this.currentY
      }

      this.currentPath = '<path ' +
        'fill="none" ' +
        'stroke="'          + this.currentColor + '" ' +
        'stroke-width="'    + this.currentWidth + '" ' +
        'stroke-linejoin="' + this.currentJoin  + '" ' +
        'stroke-linecap="'  + this.currentCap   + '" '

        switch (this.currentLineature) {
          case 'dotted':
            this.currentPath += 'stroke-dasharray="1" '
            break
          case 'dashed':
            this.currentPath += 'stroke-dasharray="3 1" '
            break
          case 'solid': default:
            this.currentPath += 'stroke-dasharray="none" '
        }
      this.currentPath += 'd="'

      this.moveTo(this.currentX,this.currentY)

      return this
    }

  /**** turn ****/

    public turn (DirectionChange:TUR_Angle):Graphic {
      expectFiniteNumber('direction change',DirectionChange)

      this.currentDirection += DirectionChange

      return this
    }

  /**** turnTo ****/

    public turnTo (Direction:TUR_Angle):Graphic {
      expectFiniteNumber('direction',Direction)

      this.currentDirection = Direction

      return this
    }

  /**** turnLeft ****/

    public turnLeft (DirectionChange:TUR_Angle):Graphic {
      expectFiniteNumber('direction change',DirectionChange)

      this.currentDirection -= DirectionChange

      return this
    }

  /**** turnRight ****/

    public turnRight (DirectionChange:TUR_Angle):Graphic {
      expectFiniteNumber('direction change',DirectionChange)

      this.currentDirection += DirectionChange

      return this
    }

  /**** move ****/

    public move (Distance:TUR_Location):Graphic {
      expectFiniteNumber('distance',Distance)

      let DirectionInRadians = this.currentDirection * Math.PI/180
      this.moveTo(                                               // DRY approach
        (this.currentX || 0) + Distance * Math.cos(DirectionInRadians),
        (this.currentY || 0) + Distance * Math.sin(DirectionInRadians)
      )

      return this
    }

  /**** moveTo ****/

    public moveTo (x:TUR_Location, y:TUR_Location):Graphic {
      expectFiniteNumber('x coordinate',x)
      expectFiniteNumber('y coordinate',y)

      this.currentX = x
      this.currentY = y

      if (this.currentPath != null) {
        this.currentPath += 'M ' + rounded(x) + ',' + rounded(y) + ' '
      }

      return this
    }

  /**** draw ****/

    public draw (Distance:TUR_Location):Graphic {
      expectFiniteNumber('distance',Distance)

      let DirectionInRadians = this.currentDirection * Math.PI/180
      this.drawTo(                                               // DRY approach
        (this.currentX || 0) + Distance * Math.cos(DirectionInRadians),
        (this.currentY || 0) + Distance * Math.sin(DirectionInRadians)
      )

      return this
    }

  /**** drawTo ****/

    public drawTo (x:TUR_Location, y:TUR_Location):Graphic {
      expectFiniteNumber('x coordinate',x)
      expectFiniteNumber('y coordinate',y)

      if (this.currentPath == null) {
        this.beginPath()
      }

      this._updateBoundingBox(
        this.currentX-this.currentWidth, this.currentX+this.currentWidth,
        this.currentY-this.currentWidth, this.currentY+this.currentWidth
      )

      this.currentX = x
      this.currentY = y

      this.currentPath += 'L ' + rounded(x) + ',' + rounded(y) + ' '

      this._updateBoundingBox(
        this.currentX-this.currentWidth, this.currentX+this.currentWidth,
        this.currentY-this.currentWidth, this.currentY+this.currentWidth
      )

      return this
    }

  /**** curveLeft/Right ****/

    public curveLeft (
      Angle:TUR_Angle, rx:TUR_Dimension, ry?:TUR_Dimension
    ):Graphic {
      return this._curve(Angle, rx,ry, false)
    }

    public curveRight (
      Angle:TUR_Angle, rx:TUR_Dimension, ry?:TUR_Dimension
    ):Graphic {
      return this._curve(Angle, rx,ry, true)
    }

  /**** _curve ****/

    private _curve (
      Angle:TUR_Angle, rx:TUR_Dimension, ry:TUR_Dimension|undefined,
      clockwise:boolean
    ):Graphic {
      expectFiniteNumber('turn angle',Angle)
      expectFiniteNumber  ('x radius',rx)
      allowFiniteNumber   ('y radius',ry)
        if (ry == null) { ry = rx }

      let absAngle = Math.abs(Angle)
      if (absAngle < 1e-6) { return this }

      const pi      = Math.PI;    const sin = Math.sin
      const deg2rad = pi/180;     const cos = Math.cos

      if (this.currentPath == null) {
        this.beginPath()
      }

    /**** fix ellipse starting point ****/

      let x0 = this.currentX
      let y0 = this.currentY

      this._updateBoundingBox(
        x0-this.currentWidth, x0+this.currentWidth,
        y0-this.currentWidth, y0+this.currentWidth
      )

    /**** compute ellipse center ****/

      let Direction          = this.currentDirection
      let DirectionInRadians = Direction * deg2rad

      let NormalInRadians = DirectionInRadians + (clockwise ? pi/2 : -pi/2)

      let cx = x0 + ry * cos(NormalInRadians)                // "ry" is correct!
      let cy = y0 + ry * sin(NormalInRadians)                            // dto.

    /**** compute ellipse end point ****/

      let AngleInRadians = (
        clockwise ? -pi/2 + Angle * deg2rad : pi/2 - Angle * deg2rad
      )

      let auxX = rx * cos(AngleInRadians)
      let auxY = ry * sin(AngleInRadians)

      let x1 = cx + auxX * cos(DirectionInRadians) - auxY * sin(DirectionInRadians)
      let y1 = cy + auxX * sin(DirectionInRadians) + auxY * cos(DirectionInRadians)

    /**** construct SVG path ****/

      let fullEllipse  = (absAngle >= 360)
      let largeArcFlag = (absAngle >= 180 ? 1 : 0)
      let SweepFlag    = (clockwise ? (Angle >= 0 ? 1 : 0) : (Angle >= 0 ? 0 : 1))

      if (fullEllipse) {
        auxX = cx + (cx-x0)
        auxY = cy + (cy-y0)

        this.currentPath += (
          'A ' + rounded(rx) + ' ' + rounded(ry) + ' ' +
          rounded(Direction) + ' 1 ' + SweepFlag + ' ' +
          rounded(auxX) + ' ' + rounded(auxY) + ' '
        ) + (
          'A ' + rounded(rx) + ' ' + rounded(ry) + ' ' +
          rounded(Direction) + ' 1 ' + SweepFlag + ' ' +
          rounded(x0) + ' ' + rounded(y0) + ' '
        ) + 'M ' + rounded(x1) + ' ' + rounded(y1) + ' '
      } else {
        this.currentPath += (
          'A ' + rounded(rx) + ' ' + rounded(ry) + ' ' +
          rounded(Direction) + ' ' + largeArcFlag + ' ' + SweepFlag + ' ' +
          rounded(x1) + ' ' + rounded(y1) + ' '
        )
      }

    /**** compute ellipse x/y bounds in rotated coordinate system ****/

      let xMax = Math.sqrt(               // still centered at origin, not cx/cy
        rx*rx * Math.pow(cos(DirectionInRadians),2) +
        ry*ry * Math.pow(sin(DirectionInRadians),2)
      )
      let yMax = Math.sqrt(                                              // dto.
        rx*rx * Math.pow(sin(DirectionInRadians),2) +
        ry*ry * Math.pow(cos(DirectionInRadians),2)
      )

console.log(' ')
      for (let i = 0; i < 4; i++) {
        let xSign = (i % 2 === 0 ? 1 : -1)
        let ySign = (i < 2       ? 1 : -1)

        let x = xSign*xMax
        let y = ySign*yMax

        let PointShouldBeUsed
        if (fullEllipse) {
          PointShouldBeUsed = true
        } else {
        /**** rotate extremal points back into ellipse coordinates ****/

          let maxX = x * cos(-DirectionInRadians) - y * sin(-DirectionInRadians)
          let maxY = x * sin(-DirectionInRadians) + y * cos(-DirectionInRadians)

          maxX = maxX / rx
          maxY = maxY / ry

        /**** compute extremal point angles and check if within arc ****/

          let PointAngleInRadians = Math.atan2(maxY,maxX)

          let StartAngleInRadians = (clockwise ? -pi/2 : pi/2)
          let EndAngleInRadians   = AngleInRadians           // already computed

          if ((StartAngleInRadians < -pi) || (EndAngleInRadians < -pi)) {
            StartAngleInRadians += 2*pi         // that's sufficient, because...
            EndAngleInRadians   += 2*pi        // ..."fullEllipse" is false here
          }

          if (StartAngleInRadians > EndAngleInRadians) {
            let temp = StartAngleInRadians
            StartAngleInRadians = EndAngleInRadians
            EndAngleInRadians = temp
          }

          PointShouldBeUsed = (                                  // common cases
            (StartAngleInRadians <= PointAngleInRadians) &&
            (PointAngleInRadians <= EndAngleInRadians)
          ) || (                                                   // rare cases
            (PointAngleInRadians < 0) &&
            (StartAngleInRadians <= PointAngleInRadians + 2*pi) &&
            (PointAngleInRadians + 2*pi <= EndAngleInRadians)
          )
        }

        if (PointShouldBeUsed) {
          this._updateBoundingBox(
            cx + x-this.currentWidth, cx + x+this.currentWidth,
            cy + y-this.currentWidth, cy + y+this.currentWidth
          )
        }
      }

    /**** update turtle ****/

      this.currentDirection += (Angle >= 0 ? Angle : 180+Angle) * (clockwise ? 1 : -1)

      this.currentX = x1
      this.currentY = y1

      this._updateBoundingBox(
        x1-this.currentWidth, x1+this.currentWidth,
        y1-this.currentWidth, y1+this.currentWidth
      )

      return this
    }

  /**** endPath ****/

    public endPath ():Graphic {
      if (this.currentPath != null) {
        this.currentPath += '"/>'

        this.SVGContent += this.currentPath
        this.currentPath = undefined
      }

      return this
    }

  /**** closePath ****/

    public closePath ():Graphic {
      if (this.currentPath != null) {
        this.currentPath += 'Z'
        this.endPath()
      }

      return this
    }

  /**** currentPosition ****/

    public currentPosition ():TUR_Position {
      return { x:this.currentX, y:this.currentY }
    }

  /**** positionAt ****/

    public positionAt (Position:TUR_Position):Graphic {
      allowPosition('turtle position',Position)

      if (this.currentPath == null) {
        this.currentX = Position.x
        this.currentY = Position.y
      } else {
        this.moveTo(Position.x,Position.y)
      }

      return this
    }

  /**** currentAlignment ****/

    public currentAlignment ():TUR_Alignment {
      return {
        x:this.currentX, y:this.currentY, Direction:this.currentDirection
      }
    }

  /**** alignAt ****/

    public alignAt (Alignment:TUR_Alignment):Graphic {
      allowAlignment('turtle alignment',Alignment)

      this.currentDirection = Alignment.Direction

      if (this.currentPath == null) {
        this.currentX = Alignment.x
        this.currentY = Alignment.y
      } else {
        this.moveTo(Alignment.x,Alignment.y)
      }

      return this
    }

  /**** Limits ****/

    public Limits ():{
      xMin:number, yMin:number, xMax:number,yMax:number
    } {
      return {
        xMin:this.minX || 0, yMin:this.minY || 0,
        xMax:this.maxX || 0, yMax:this.maxY || 0
      }
    }

  /**** asSVG ****/

    public asSVG (
      Unit?:'px'|'mm'|'cm'|'in',
      xMin?:number,yMin?:number, xMax?:number,yMax?:number
    ):string {
      allowOneOf('SVG unit',Unit, ['px','mm','cm','in'])
      allowFiniteNumber('minimal x',xMin)
      allowFiniteNumber('maximal x',xMax)
      allowFiniteNumber('minimal y',yMin)
      allowFiniteNumber('maximal y',yMax)

      if (this.minX == null) {  // very special case: nothing has been drawn yet
        this.minX = this.maxX = this.minY = this.maxY = 0
      }

      if (Unit == null) { Unit = 'px' }
      if (xMin == null) { xMin = this.minX }
      if (xMax == null) { xMax = this.maxX }
      if (yMin == null) { yMin = this.minY }
      if (yMax == null) { yMax = this.maxY }

// @ts-ignore TS2532 we know that xMax and xMin are defined
      let Width  = xMax-xMin
// @ts-ignore TS2532 we know that yMax and yMin are defined
      let Height = yMax-yMin

      if (Width  < 0) throwError('InvalidArgument: invalid x range given')
      if (Height < 0) throwError('InvalidArgument: invalid y range given')

      if (this.currentPath != null) {         // if need be: end an ongoing path
        this.endPath()
      }

      return (
        '<svg xmlns="http://www.w3.org/2000/svg" ' +
          'width="'  + rounded(Width)  + Unit + '" ' +
          'height="' + rounded(Height) + Unit + '" ' +
// @ts-ignore TS2532 we know that xMin and yMin are defined
          'viewBox="' + floored(xMin) + ' ' + floored(yMin) + ' ' +
            ceiled(Width) + ' ' + ceiled(Height) + '" ' +
          'vector-effect="non-scaling-stroke"' +
        '>' +
          this.SVGContent +
        '</svg>'
      )
    }

  /**** asSVGwith72dpi ****/

    public asSVGwith72dpi (
      Unit?:'px'|'mm'|'cm'|'in',
      xMin?:number,yMin?:number, xMax?:number,yMax?:number
    ):string {
      let SVG = this.asSVG(Unit, xMin,yMin, xMax,yMax)   // also validates arg.s

      let Scale = 72 / {
        'px':25.4, 'mm':25.4, 'cm':2.54, 'in':1
      }[Unit || 'mm']

      if (xMin == null) { xMin = this.minX }
      if (xMax == null) { xMax = this.maxX }
      if (yMin == null) { yMin = this.minY }
      if (yMax == null) { yMax = this.maxY }

      return (
        '<svg xmlns="http://www.w3.org/2000/svg" ' +
// @ts-ignore TS2532 we know that xMin and yMin are defined
          'viewBox="' + floored(Scale*xMin) + ' ' + floored(Scale*yMin) + ' ' +
// @ts-ignore TS2532 we know that xMin,xMax,yMin and yMax are defined
            ceiled(Scale*(xMax-xMin)) + ' ' + ceiled(Scale*(yMax-yMin)) + '" ' +
          'vector-effect="non-scaling-stroke"' +
        '>' +
        '<g transform="scale(' + Scale + ',' + Scale + ')">' +
          SVG +
        '</g></svg>'
      )
    }

  /**** _updateBoundingBox ****/

    private _updateBoundingBox (
      minX:TUR_Location, maxX:TUR_Location,
      minY:TUR_Location, maxY:TUR_Location
    ):void {
      this.minX = Math.min(this.minX as TUR_Location,minX)
      this.maxX = Math.max(this.maxX as TUR_Location,maxX)

      this.minY = Math.min(this.minY as TUR_Location,minY)
      this.maxY = Math.max(this.maxY as TUR_Location,maxY)
    }
  }

/**** rounded ****/

  function rounded (Value:number):number {
    return Math.round(Value*100)/100
  }

/**** ceiled ****/

  function ceiled (Value:number):number {
    return Math.ceil(Value*100)/100
  }

/**** floored ****/

  function floored (Value:number):number {
    return Math.floor(Value*100)/100
  }

