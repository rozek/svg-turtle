export type TUR_Location = number;
export type TUR_Dimension = number;
export type TUR_Angle = number;
export type TUR_Color = string;
export declare const TUR_Lineatures: string[];
export type TUR_Lineature = typeof TUR_Lineatures[number];
export declare const TUR_Joins: string[];
export type TUR_Join = typeof TUR_Joins[number];
export declare const TUR_Caps: string[];
export type TUR_Cap = typeof TUR_Caps[number];
export type TUR_PathOptionSet = {
    x?: TUR_Location;
    y?: TUR_Location;
    Direction?: TUR_Angle;
    Width?: TUR_Dimension;
    Color?: TUR_Color;
    Fill?: TUR_Color;
    Lineature?: TUR_Lineature;
    Join?: TUR_Join;
    Cap?: TUR_Cap;
};
export type TUR_Position = {
    x: TUR_Location;
    y: TUR_Location;
};
export type TUR_Alignment = {
    x: TUR_Location;
    y: TUR_Location;
    Direction: TUR_Angle;
};
/**** ValueIsPosition ****/
export declare function ValueIsPosition(Value: any): boolean;
/**** allow/expect[ed]Position ****/
export declare const allowPosition: Function, allowedPosition: Function;
export declare const expectPosition: Function, expectedPosition: Function;
/**** ValueIsAlignment ****/
export declare function ValueIsAlignment(Value: any): boolean;
/**** allow/expect[ed]Alignment ****/
export declare const allowAlignment: Function, allowedAlignment: Function;
export declare const expectAlignment: Function, expectedAlignment: Function;
/**** ValueIsPathOptionSet ****/
export declare function ValueIsPathOptionSet(Value: any): boolean;
/**** allow/expect[ed]PathOptionSet ****/
export declare const allowPathOptionSet: Function, allowedPathOptionSet: Function;
export declare const expectPathOptionSet: Function, expectedPathOptionSet: Function;
/**** Graphic ****/
export declare class Graphic {
    private SVGContent;
    private currentPath;
    private minX;
    private maxX;
    private minY;
    private maxY;
    private currentX;
    private currentY;
    private currentDirection;
    private currentWidth;
    private currentColor;
    private currentFill;
    private currentLineature;
    private currentJoin;
    private currentCap;
    /**** _initialize ****/
    private _initialize;
    /**** reset ****/
    reset(): Graphic;
    /**** beginPath ****/
    beginPath(PathOptionSet?: TUR_PathOptionSet): Graphic;
    /**** turn ****/
    turn(DirectionChange: TUR_Angle): Graphic;
    /**** turnTo ****/
    turnTo(Direction: TUR_Angle): Graphic;
    /**** turnLeft ****/
    turnLeft(DirectionChange: TUR_Angle): Graphic;
    /**** turnRight ****/
    turnRight(DirectionChange: TUR_Angle): Graphic;
    /**** move ****/
    move(Distance: TUR_Location): Graphic;
    /**** moveTo ****/
    moveTo(x: TUR_Location, y: TUR_Location): Graphic;
    /**** draw ****/
    draw(Distance: TUR_Location): Graphic;
    /**** drawTo ****/
    drawTo(x: TUR_Location, y: TUR_Location): Graphic;
    /**** curveLeft/Right ****/
    curveLeft(Angle: TUR_Angle, rx: TUR_Dimension, ry?: TUR_Dimension): Graphic;
    curveRight(Angle: TUR_Angle, rx: TUR_Dimension, ry?: TUR_Dimension): Graphic;
    /**** _curve ****/
    private _curve;
    /**** endPath ****/
    endPath(): Graphic;
    /**** closePath ****/
    closePath(): Graphic;
    /**** currentPosition ****/
    currentPosition(): TUR_Position;
    /**** positionAt ****/
    positionAt(Position: TUR_Position): Graphic;
    /**** currentAlignment ****/
    currentAlignment(): TUR_Alignment;
    /**** alignAt ****/
    alignAt(Alignment: TUR_Alignment): Graphic;
    /**** Limits ****/
    Limits(): {
        xMin: number;
        yMin: number;
        xMax: number;
        yMax: number;
    };
    /**** asSVG ****/
    asSVG(Unit?: 'px' | 'mm' | 'cm' | 'in', xMin?: number, yMin?: number, xMax?: number, yMax?: number): string;
    /**** asSVGwith72dpi ****/
    asSVGwith72dpi(Unit?: 'px' | 'mm' | 'cm' | 'in', xMin?: number, yMin?: number, xMax?: number, yMax?: number): string;
    /**** _updateBoundingBox ****/
    private _updateBoundingBox;
}
