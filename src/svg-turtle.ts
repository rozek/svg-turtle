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

/**** TUR_Graphic ****/

  export class TUR_Graphic {
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

  /**** beginPath ****/

    public beginPath (PathOptionSet?:TUR_PathOptionSet):TUR_Graphic {
      allowPathOptionSet('option set',PathOptionSet)

      if (PathOptionSet != null) {
        if ('x'         in PathOptionSet) { this.currentX         = PathOptionSet.x as TUR_Location }
        if ('y'         in PathOptionSet) { this.currentY         = PathOptionSet.y as TUR_Location }
        if ('Direction' in PathOptionSet) { this.currentDirection = PathOptionSet.Direction as TUR_Angle }
        if ('Width'     in PathOptionSet) { this.currentWidth     = PathOptionSet.Width as TUR_Dimension }
        if ('Color'     in PathOptionSet) { this.currentColor     = PathOptionSet.Color as TUR_Color }
        if ('Lineature' in PathOptionSet) { this.currentLineature = PathOptionSet.Lineature as TUR_Lineature }
        if ('Join'      in PathOptionSet) { this.currentJoin      = PathOptionSet.Join as TUR_Join }
        if ('Cap'       in PathOptionSet) { this.currentCap       = PathOptionSet.Cap as TUR_Cap }
      }

      if (this.minX == null) {
        this.minX = this.maxX = this.currentX
        this.minY = this.maxY = this.currentY
      }

      this.currentPath = '<path ' +
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

      if ((this.currentX !== 0) || (this.currentY !== 0)) {
        this.moveTo(this.currentX,this.currentY)
      }

      return this
    }

  /**** turn ****/

    public turn (DirectionChange:TUR_Angle):TUR_Graphic {
      expectFiniteNumber('direction change',DirectionChange)

      this.currentDirection += DirectionChange

      return this
    }

  /**** turnTo ****/

    public turnTo (Direction:TUR_Angle):TUR_Graphic {
      expectFiniteNumber('direction',Direction)

      this.currentDirection = Direction

      return this
    }

  /**** move ****/

    public move (Distance:TUR_Location):TUR_Graphic {
      expectFiniteNumber('distance',Distance)

      let Direction = this.currentDirection
      this.moveTo(                                               // DRY approach
        (this.currentX || 0) + Distance * Math.cos(Direction),
        (this.currentY || 0) + Distance * Math.sin(Direction)
      )

      return this
    }

  /**** moveTo ****/

    public moveTo (x:TUR_Location, y:TUR_Location):TUR_Graphic {
      expectFiniteNumber('x coordinate',x)
      expectFiniteNumber('y coordinate',y)

      this.currentX = x
      this.currentY = y

      if (this.currentPath != null) {
        this.currentPath += 'D ' + x + ',' + y + ' '
        this.updateBoundingBox()
      }

      return this
    }

  /**** draw ****/

    public draw (Distance:TUR_Location):TUR_Graphic {
      expectFiniteNumber('distance',Distance)

      let Direction = this.currentDirection
      this.drawTo(                                               // DRY approach
        (this.currentX || 0) + Distance * Math.cos(Direction),
        (this.currentY || 0) + Distance * Math.sin(Direction)
      )

      return this
    }

  /**** drawTo ****/

    public drawTo (x:TUR_Location, y:TUR_Location):TUR_Graphic {
      expectFiniteNumber('x coordinate',x)
      expectFiniteNumber('y coordinate',y)

      if (this.currentPath == null) {
        this.beginPath()
      }

      this.currentX = x;  this.currentPath += 'L ' + x + ',' + y + ' '
      this.currentY = y

      this.updateBoundingBox()

      return this
    }

  /**** curveLeft/Right ****/

    public curveLeft (
      Angle:TUR_Angle, rx:TUR_Dimension, ry?:TUR_Dimension
    ):TUR_Graphic {
      return this.curve(Angle, rx,ry, 0 )
    }

    public curveRight (
      Angle:TUR_Angle, rx:TUR_Dimension, ry?:TUR_Dimension
    ):TUR_Graphic {
      return this.curve(Angle, rx,ry, 1 )
    }

  /**** curve ****/

    private curve (
      Angle:TUR_Angle, rx:TUR_Dimension, ry:TUR_Dimension|undefined, clockwise:0|1
    ):TUR_Graphic {
      expectFiniteNumber('turn angle',Angle)
      expectFiniteNumber  ('x radius',rx)
      allowFiniteNumber   ('y radius',ry)

      if (ry == null) { ry = rx }

      if (this.currentPath == null) {
        this.beginPath()
      }

      Angle = Angle % 360
      if (clockwise === 1) { Angle = -Angle }

      let largeArc = (Angle < 180 ? 0 : 1)

      let x0 = this.currentX
      let y0 = this.currentY

      let dx = rx * Math.cos(Angle) - ry * Math.sin(Angle)
      let dy = rx * Math.sin(Angle) + ry * Math.cos(Angle)

      let Direction = this.currentDirection

      let x1 = x0 + dx * Math.cos(Direction) - dy * Math.sin(Direction)
      let y1 = y0 + dx * Math.sin(Direction) + dy * Math.cos(Direction)

      this.currentPath += (
        'A ' + rx + ' ' + ry + ' ' + largeArc + ' ' + clockwise + ' ' +
        x1 + ',' + y1
      )

      this.currentX = x1
      this.currentY = y1

      this.updateBoundingBox()                                // *C* not perfect

      return this
    }

  /**** endPath ****/

    public endPath ():TUR_Graphic {
      if (this.currentPath != null) {
        this.currentPath += '"/>'

        this.SVGContent += this.currentPath
        this.currentPath = undefined
      }

      return this
    }

  /**** closePath ****/

    public closePath ():TUR_Graphic {
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

    public positionAt (Position:TUR_Position):TUR_Graphic {
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

    public alignAt (Alignment:TUR_Alignment):TUR_Graphic {
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

      if (Unit == null) { Unit = 'mm' }
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

      return (
        '<svg xmlns="http://www.w3.org/2000/svg" ' +
          'width="'  + Width  + Unit + '" ' +
          'height="' + Height + Unit + '" ' +
          'viewbox="' + xMin + ' ' + yMin + ' ' + Width + ' ' + Height + '"' +
        '>' +
          this.SVGContent +
        '</svg>'
      )
    }

  /**** updateBoundingBox ****/

    private updateBoundingBox ():void {
      this.minX = Math.min(this.minX as TUR_Location,this.currentX)
      this.maxX = Math.max(this.maxX as TUR_Location,this.currentX)

      this.minY = Math.min(this.minY as TUR_Location,this.currentY)
      this.maxY = Math.max(this.maxY as TUR_Location,this.currentY)
    }
  }

