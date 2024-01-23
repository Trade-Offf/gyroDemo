/**
 * 限制旋转角度在指定范围内。
 * @param {number} degrees - 旋转角度。
 * @param {number} maxRotation - 最大旋转角度。
 * @returns {number} - 限制后的旋转角度。
 */
function limitRotation(degrees, maxRotation) {
  return Math.min(Math.max(degrees, -maxRotation), maxRotation);
}

/**
 * 计算平移位置
 * @param {number} num - 数字
 * @param {number} maxRotation - 最大旋转角度
 * @param {number} moveRatio - 移动比例
 * @returns {string} - 计算后的位置
 */
function computePosition(num, maxRotation, moveRatio) {
  return ((num + maxRotation) / (maxRotation * 2)) * moveRatio;
}

/**
 * 根据给定的 beta 和 gamma 值，倾斜容器。
 * @param {HTMLElement} element - 要应用旋转的元素。
 * @param {number} beta - 陀螺仪 beta 值。
 * @param {number} gamma - 陀螺仪 gamma 值。
 */
function applyRotation(element, beta, gamma, rotationConfig) {
  const limitedBeta = limitRotation(beta, rotationConfig.maxBetaRotation);
  const limitedGamma = limitRotation(gamma, rotationConfig.maxGammaRotation);
  element.style.transform = `rotateX(${limitedBeta}deg) rotateY(${limitedGamma}deg)`;
}

/**
 * 对元素应用基于 beta 和 gamma 值的移动。
 * @param {HTMLElement} element - 要应用移动的元素。
 * @param {number} beta - beta 值。
 * @param {number} gamma - gamma 值。
 * @param {object} movementConfig - 移动配置对象。
 * @param {boolean} [isBackground=false] - 指示元素是否为背景元素。
 */
function applyMovement(
  element,
  beta,
  gamma,
  movementConfig,
  isBackground = false
) {
  const smoothBeta = betaSmoother.smooth(beta);
  const smoothGamma = gammaSmoother.smooth(gamma);

  const positionX = computePosition(
    smoothGamma,
    movementConfig.maxGammaRotation,
    movementConfig.moveRatio
  );
  const positionY = computePosition(
    smoothBeta,
    movementConfig.maxBetaRotation,
    movementConfig.moveRatio
  );

  if (isBackground) {
    const percentageX = (50 - positionX).toFixed(1) + "%";
    const percentageY = (50 - positionY).toFixed(1) + "%";
    element.style.backgroundPosition = `${percentageX} ${percentageY}`;
  } else {
    const translateX = positionX.toFixed(1) + "px";
    const translateY = positionY.toFixed(1) + "px";
    const transformValue = `translateX(${translateX}) translateY(${translateY})`;
    element.style.transform = element.style.transform
      ? `${element.style.transform} ${transformValue}`
      : transformValue;
  }
}

class GyroController {
  constructor(characterConfig, backgroundConfig) {
    this.characterConfig = characterConfig;
    this.backgroundConfig = backgroundConfig;
  }

  applyBackgroundEffects(box, beta, gamma) {
    applyRotation(box, beta, gamma, this.backgroundConfig);
    applyMovement(box, beta, gamma, this.backgroundConfig, true);
  }

  applyCharacterEffects(img, beta, gamma) {
    applyRotation(img, beta, gamma, this.characterConfig);
    applyMovement(img, beta, gamma, this.characterConfig);
  }

  update(ref, gyroData, imgRef) {
    if (ref.current && imgRef.current) {
      const { beta, gamma } = gyroData;
      this.applyBackgroundEffects(ref.current, beta, gamma);
      this.applyCharacterEffects(imgRef.current, beta, gamma);
    }
  }
}

class Smoother {
  // smoothFactor 平滑因子（0到1之间）值越小，平滑的效果越强，抖动越少，但响应时间可能变慢；
  constructor(smoothFactor) {
    this.smoothFactor = smoothFactor;
    this.lastValue = null;
  }
  lerp(start, end) {
    return (1 - this.smoothFactor) * start + this.smoothFactor * end;
  }
  smooth(value) {
    // 如果是第一次获取值，直接返回当前值
    if (this.lastValue === null) {
      this.lastValue = value;
      return value;
    }
    // 进行线性插值，平滑传入的值
    const smoothedValue = this.lerp(this.lastValue, value);
    // 更新 lastValue 为当前插值后的值
    this.lastValue = smoothedValue;
    return smoothedValue;
  }
}
// 创建两个平滑器
const gammaSmoother = new Smoother(0.05);
const betaSmoother = new Smoother(0.05);

/**
 * 主函数，调用 GyroController 类
 * @param {object} ref - 背景图 ref
 * @param {number} beta - 陀螺仪 beta 值。
 * @param {number} gamma - 陀螺仪 gamma 值。
 */
function changePosition(ref, gyroData, imgRef) {
  // maxBetaRotation 控制前后倾斜
  // maxGammaRotation 控制左右倾斜
  // moveRatio 控制移动距离
  const gyroController = new GyroController(
    { maxBetaRotation: 18, maxGammaRotation: 18, moveRatio: 12 }, // 角色图 config
    { maxBetaRotation: 12, maxGammaRotation: 12, moveRatio: 10 } // 背景图 config
  );

  gyroController.update(ref, gyroData, imgRef);
}

export { changePosition };
