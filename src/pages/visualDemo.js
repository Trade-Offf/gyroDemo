import { useState, useEffect, useRef, useCallback } from "react";
import { changePosition } from "./utils";

function VisualDemo(props) {
  const { className } = props;
  const [isListening, setIsListening] = useState(false);
  const [gyroData, setGyroData] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const boxRef = useRef(null);
  const imgRef = useRef(null);

  // 实时更新陀螺仪参数的值到state中
  const handleOrientationEvent = useCallback((event) => {
    setGyroData({
      alpha: parseFloat(event.alpha.toFixed(2)),
      beta: parseFloat(event.beta.toFixed(2)),
      gamma: parseFloat(event.gamma.toFixed(2)),
    });
  }, []);

  // 启用陀螺仪
  function enableGyroscope() {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      // iOS 13+ 设备需鉴权
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          // 如果用户同意，就可以监听陀螺仪数据
          if (permissionState === "granted") {
            setIsListening(true);
          } else {
            // 用户不同意，无法使用陀螺仪
            console.error("设备不支持访问陀螺仪");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // 安卓与iOS13版本前的设备，直接设置为监听
      setIsListening(true);
    }
  }
  useEffect(() => {
    // 当陀螺仪数据更新时，更新元素样式ƒ
    changePosition(boxRef, gyroData, imgRef);
  }, [gyroData]);

  // 添加与移除监听事件
  useEffect(() => {
    if (isListening) {
      window.addEventListener("deviceorientation", handleOrientationEvent);
    }
    return () => {
      if (isListening) {
        window.removeEventListener("deviceorientation", handleOrientationEvent);
      }
    };
  }, [isListening, handleOrientationEvent]);

  return (
    <>
      <div className={className.wrapDom} ref={boxRef}>
        {/* 角色图片 */}
        <img
          ref={imgRef}
          src={"/role.png"}
          style={{
            position: "absolute",
            width: "250px",
            height: "340px",
            bottom: "-20px",
            left: "-30px",
          }}
        />
      </div>
      <div className={className.gyroController}>
        <p>
          Alpha: <span>{gyroData.alpha}</span>
        </p>
        <p>
          Beta: <span>{gyroData.beta}</span>
        </p>
        <p>
          Gamma: <span>{gyroData.gamma}</span>
        </p>
        <button onClick={enableGyroscope}>启用陀螺仪</button>
      </div>
    </>
  );
}

export default VisualDemo;
