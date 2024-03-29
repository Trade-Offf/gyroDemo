# Mobile 3D Parallax Effect Using Gyroscope

<img src="public/final.gif" width="280" height="auto">

## 背景介绍

在浏览掘金时，我被一篇关于如何利用鼠标事件在 PC 端实现 CSS 视差效果的文章所吸引。这篇文章激发了我在移动端实现类似效果的想法，以提升未来营销活动的用户体验。

## 前置调研

在对原理进行研究后，我决定着手实现。然而，我很快遇到了一个问题：移动设备上没有鼠标！桌面端的鼠标移动事件（如`mousemove`）在移动端变成了触摸事件（如`touchmove`），显然需要不同的交互方式。因此，我选择了使用移动端的陀螺仪 API [`DeviceOrientationEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/DeviceOrientationEvent)。

## 陀螺仪介绍

大多数智能手机都配备了三轴陀螺仪，可以测量设备围绕其三个主轴的旋转速度。alpha（沿 Z 轴旋转）、beta（x 轴上的旋转）、gamma（y 轴上的旋转）是描述这些旋转的三个指标。

## 代码实现

实现此效果大致分为以下步骤：

1. 创建一个背景图容器，并使用`background-image`设置背景图。
2. 在容器中添加角色图，为其添加浮动效果。
3. 通过监听事件获取用户触摸屏幕的坐标。
4. 使用这些坐标值更新`transform`和`backgroundPosition`属性，产生倾斜和平移效果。
5. 通过不同程度地改变背景图和角色图的变化，创建视差效果，实现类裸眼 3D 体验。

## 遇到问题

在实现过程中，我遇到了一些问题，包括寻找可用的陀螺仪组件和处理敏感数据访问权限。  
使用细节请查看：[三轴陀螺仪：帮移动端实现3D动效](https://juejin.cn/post/7326985988768743461)

### 解决方案

- 在 HTTPS 环境中测试陀螺仪功能。
- 对于 iOS13+设备，确保请求权限以获取陀螺仪数据。

## 如何使用

请参考本仓库中的代码示例，以了解如何实现陀螺仪控制的视差效果。

## 支持与联系

如果你在使用过程中遇到任何问题或有改进建议，请通过[Issues](/issues)与我们联系。
