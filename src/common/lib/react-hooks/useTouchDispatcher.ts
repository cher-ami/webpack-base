import { MutableRefObject, useEffect, useMemo } from "react";
import { deleteWhere } from "../utils/arrayUtils";
import { TimerUtils } from "../utils/TimerUtils";

/**
 * @copyright Original TouchDispatcher by Alexis Bouhet - https://zouloux.com
 * @copyright Hook useTouchDispatcher write by Willy Brauner - https://willybrauner.com
 */

const name = "useTouchDispatcher";
const debug = require("debug")(`lib:${name}`);

// ----------------------------------------------------------------------------- STRUCT

/**
 * Allowed type of input
 */
export enum EInputTypes {
  TOUCH = 1,
  MOUSE = 2,
}

/**
 * Enumerating available directions for a drag
 */
export enum EInputDirection {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
  UNKNOWN = "unknown",
}

/**
 * Normalized point (not original event)
 */
export interface TouchPoint {
  // Identifying our touch
  id: number;
  // Input type, mouse or touch
  inputType: EInputTypes;
  // The target used
  target: HTMLElement;
  // Event creating this touch point
  originalEvent: UIEvent;
  // Position
  x: number;
  y: number;
  // Delta between current and previous frame
  deltaX: number;
  deltaY: number;
  // Velocity from deltas
  velocityX: number;
  velocityY: number;
}

/**
 * Fake touch event to convert mouse to touch
 */
interface FakeTouch {
  identifier: number;
  inputType: EInputTypes;
  clientX: number;
  clientY: number;
}

/**
 * interface to handle touch dragging events
 */
export interface ITouchInput {
  inputTap?(pTouchPoint: TouchPoint): void;
  inputDragLock?(pTouchPoint: TouchPoint): void;
  inputDragUnlock?(pTouchPoint: TouchPoint, pDirection: EInputDirection): void;
  inputDragging?(pTouchPoint: TouchPoint, pDirection: EInputDirection): void;
}

// ----------------------------------------------------------------------------- START

export const useTouchDispatcher = ({
  ref,
  touchInput,
  inputType = EInputTypes.TOUCH | EInputTypes.MOUSE,
  passiveEventListener = false,
}: {
  ref: MutableRefObject<any>;
  touchInput: ITouchInput;
  inputType?: EInputTypes;
  passiveEventListener?: boolean;
}) => {
  // --------------------------------------------------------------------------- INIT

  // Mouse id is -1 because no touch will use this id
  let MOUSE_ID: number = -1;

  // Current direction for the first point
  // prettier-ignore
  let _currentDirection: EInputDirection = EInputDirection.UNKNOWN;

  // Current used points
  let _points: TouchPoint[] = [];

  // The last move event for external preventDefault
  let _lastMoveEvent: Event = null;

  // The delegate who honor handling
  let _delegate: ITouchInput = useMemo(() => touchInput, [touchInput]);

  // Each frame, velocity is going to delta value, divided by this number.
  let _velocityFactor: number = useMemo(() => 2, []);

  /**
   * Mouse handler
   */
  const mouseHandler = (pEvent: MouseEvent): void => {
    if (!(inputType & EInputTypes.MOUSE)) {
      debug("Not inputType MOUSE, aborting");
      return;
    }
    debug("inputType MOUSE, continue...");

    // Init mouse move listening on whole document
    // To be able to track mouse move when cursor is out of target
    if (pEvent.type === "mousedown") {
      document.addEventListener("mousemove", mouseHandler, {
        passive: passiveEventListener,
      });
    } else if (pEvent.type === "mouseup") {
      document.removeEventListener("mousemove", mouseHandler);
    }

    // If this is a move, check if we have the mouse point registered
    else if (pEvent.type === "mousemove") {
      let hasMouseInput = false;

      for (let i = 0; i < _points.length; i++) {
        if (_points[i].id == MOUSE_ID) {
          hasMouseInput = true;
          break;
        }
      }
      if (!hasMouseInput) return;
    }

    // Process this mouse as a touch by creating a false touch input object
    processTouchEvent(pEvent, {
      identifier: -1,
      inputType: MOUSE_ID,
      clientX: pEvent.clientX,
      clientY: pEvent.clientY,
    });
  };

  /**
   * Touch Handler
   */
  const touchHandler = (pEvent: TouchEvent) => {
    // Check
    if (!(inputType & EInputTypes.TOUCH)) {
      debug("Not inputType TOUCH, aborting");
      return;
    }
    debug("inputType TOUCH, continue...");

    // Get the original points
    let originalPoints = pEvent.changedTouches;

    // Browse our points
    for (let i = 0; i < originalPoints.length; i++) {
      processTouchEvent(pEvent, originalPoints[i]);
    }
  };

  /**
   * Process an event on a touch point entry
   */
  const processTouchEvent = (
    pEvent: UIEvent,
    pOriginalPoint: Touch | FakeTouch
  ): void => {
    // Current point
    let currentPoint: TouchPoint;

    // 1st step
    if (pEvent.type === "touchstart" || pEvent.type === "mousedown") {
      debug("touchstart ||  mousedown");

      const pointArray = {
        id: pOriginalPoint.identifier,
        originalEvent: pEvent,
        inputType:
          "inputType" in pOriginalPoint
            ? (pOriginalPoint as FakeTouch).inputType
            : EInputTypes.TOUCH,
        target: pEvent.target as HTMLElement,
        x: pOriginalPoint.clientX,
        y: pOriginalPoint.clientY,
        deltaX: 0,
        deltaY: 0,
        velocityX: 0,
        velocityY: 0,
      };

      debug("touchstart ||  mousedown > pointArray before push", pointArray);
      // Convert the point to a normalized one
      _points.push(pointArray);

      debug("touchstart ||  mousedown > _points AFTER push", _points);

      // If this is our first point
      if (_points.length === 1) {
        // We don't have direction yet
        _currentDirection = EInputDirection.UNKNOWN;
        // Notify the delegate
        _delegate?.inputDragLock?.(_points[0]);
        debug("touchstart ||  mousedown > lock");
      }
    }

    // -- 2de step, move
    else if (pEvent.type === "touchmove" || pEvent.type === "mousemove") {
      debug("touchmove || mousemove");

      // Record this event for external preventDefault
      _lastMoveEvent = pEvent;

      // Browse our current normalized points
      for (let i in _points) {
        // Target this point
        currentPoint = _points[i];

        debug("touchmove || mousemove -> currentPoint", currentPoint);

        // If ID matches
        if (currentPoint.id === pOriginalPoint.identifier) {
          // Compute velocity
          currentPoint.deltaX += currentPoint.x - pOriginalPoint.clientX;
          currentPoint.deltaY += currentPoint.y - pOriginalPoint.clientY;

          // Register new position
          currentPoint.x = pOriginalPoint.clientX;
          currentPoint.y = pOriginalPoint.clientY;

          // If we don't have direction yet
          if (_currentDirection == EInputDirection.UNKNOWN) {
            // Compute direciton from velocity
            if (Math.abs(currentPoint.deltaX) > Math.abs(currentPoint.deltaY)) {
              _currentDirection = EInputDirection.HORIZONTAL;
            } else if (
              Math.abs(currentPoint.deltaY) > Math.abs(currentPoint.deltaX)
            ) {
              _currentDirection = EInputDirection.VERTICAL;
            }
          }
        }
      }
    }

    // -- 3st step and last.
    else if (pEvent.type === "touchend" || pEvent.type === "mouseup") {
      debug("touchend || mouseup");
      // Cancel last event
      _lastMoveEvent = null;
      // If this is the last point
      if (_points.length === 1) {
        // Notify unlock
        _delegate?.inputDragUnlock?.(_points[0], _currentDirection);
        // If we don't have direction, this was a tap
        if (_currentDirection === EInputDirection.UNKNOWN) {
          _delegate?.inputTap?.(_points[0]);
        }
        // We don't have direction anymore
        _currentDirection = EInputDirection.UNKNOWN;
      }

      debug("touchend || mouseup > before remove _point", _points);
      // Remove this point
      _points = deleteWhere(_points, {
        id: pOriginalPoint.identifier,
      });
      debug("touchend || mouseup > after remove _point", _points);
    }
  };

  /**
   * Every frames
   */
  const frameHandler = (): void => {
    // If we have only one point and a direction
    if (_points.length === 1 && _currentDirection !== EInputDirection.UNKNOWN) {
      // Target the main point
      let mainPoint = _points[0];

      debug("frameHandler > mainPoint", mainPoint);
      debug("frameHandler > _currentDirection", _currentDirection);
      // And notify on the delegate
      _delegate?.inputDragging?.(mainPoint, _currentDirection);
    }
    // Cancel velocity on all points
    for (let i = 0; i < _points.length; i++) {
      // Target curret point
      let currentPoint = _points[i];
      // Compute velocity from delta
      currentPoint.velocityX = Math.round(
        (currentPoint.velocityX - currentPoint.deltaX) / _velocityFactor
      );
      currentPoint.velocityY = Math.round(
        (currentPoint.velocityY - currentPoint.deltaY) / _velocityFactor
      );
      // Reset delta
      currentPoint.deltaX = 0;
      currentPoint.deltaY = 0;
    }
  };

  /**
   * Start listening
   */
  useEffect(() => {
    const touchRef = ref?.current;

    // check and do not continue
    if (!touchRef) return;

    debug("_points array", _points);

    debug("Start to listening touch event...");
    touchRef.addEventListener("touchstart", touchHandler, {
      passive: passiveEventListener,
    });
    touchRef.addEventListener("touchmove", touchHandler, {
      passive: passiveEventListener,
    });
    touchRef.addEventListener("touchend", touchHandler, {
      passive: passiveEventListener,
    });

    debug("Start to listening mouse event...");
    touchRef.addEventListener("mousedown", mouseHandler, {
      passive: passiveEventListener,
    });
    document.addEventListener("mouseup", mouseHandler, {
      passive: passiveEventListener,
    });

    debug("Start to listening frame 60fps...");
    // Start frame based loop
    TimerUtils.addFrameHandler(this, frameHandler);

    return () => {
      debug("Start to listening touch event.");
      touchRef.removeEventListener("touchstart", touchHandler);
      touchRef.removeEventListener("touchmove", touchHandler);
      touchRef.removeEventListener("touchend", touchHandler);

      debug("Stop to listening mouse event.");
      touchRef.removeEventListener("mousedown", mouseHandler);
      document.removeEventListener("mousemove", mouseHandler);
      document.removeEventListener("mouseup", mouseHandler);

      debug("Stop to listening frame.");
      TimerUtils.removeFrameHandler(frameHandler);

      // kill inputs
      _delegate = null;
    };
  }, []);
};
