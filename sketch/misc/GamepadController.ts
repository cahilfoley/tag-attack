interface WindowEventMap {
  gamepadconnected: GamepadEvent
  gamepaddisconnected: GamepadEvent
}

class GamepadController {
  private controllerIndexes: number[] = []

  get controllers(): Gamepad[] {
    const gamepads = navigator.getGamepads()
    return this.controllerIndexes.map((i) => gamepads[i])
  }

  registerController = (event: GamepadEvent) => {
    this.controllerIndexes.push(event.gamepad.index)
  }

  unregisterController = (event: GamepadEvent) => {
    this.controllerIndexes = this.controllerIndexes.filter(
      (x) => x !== event.gamepad.index
    )
  }

  get analogueStickVector() {
    return this.controllers.reduce(
      (vector, controller) =>
        vector.add(controller.axes[0], controller.axes[1]),
      createVector()
    )
  }

  isButtonPressed(index: number) {
    return this.controllers.some(
      (controller) => controller.buttons[index]?.pressed
    )
  }

  registerListeners() {
    this.unregisterListeners()
    window.addEventListener('gamepadconnected', this.registerController)
    window.addEventListener('gamepaddisconnected', this.unregisterController)
  }

  unregisterListeners() {
    window.removeEventListener('gamepadconnected', this.registerController)
    window.removeEventListener('gamepaddisconnected', this.unregisterController)
  }
}
