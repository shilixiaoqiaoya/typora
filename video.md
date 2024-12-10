角色：中间层

端---\--h5-----iframe视频



1、返回 教练讲解 一题多讲 护眼开关 音量调节  

用户touch告知端  clickhandler方法

```js
jsbridge.send('AndroidInterface', { type }, () => {});
type OptionType = 'Back' | 'ShowCoachExplain' | 'ShowMoreMedia' | 'EyeProtection' | 'ModifyVolume';
```



和h5通信

播放时长、总时长

播放、暂停

线路

倍速

```js
// 监听h5视频消息
window.addEventListener('message', getH5VideoMessage);

const getH5VideoMessage = (event: MessageEvent) => {
  if (event?.data?.type === h5VideoType) {
    if (sceneType.value === '0') {
      // 向父页面发送消息
      window.parent.postMessage(event.data, '*');
    } else if (sceneType.value === '1' || sceneType.value === '2') {
      // jsbridge发送消息到原生
      if (event.data?.data?.action && filterMessagesAction.includes(event.data.data.action)) return;
      jsbridge.send('AndroidInterface', event.data, () => {});
    }
  }
};
```



```js
// 端要给h5发消息
jsbridge.on('sendH5VideoMessage', sendH5VideoMessage);
const sendH5VideoMessage = (data: unknown) => {
  console.log('sendH5VideoMessage 学生端主动发的消息==>', data)
  const iframe = document.querySelector('.h5-iframe') as HTMLIFrameElement;
  // 向 iframe 发送消息
  iframe.contentWindow?.postMessage(data, '*');
};

```

教练端：  h5  我 iframe

学生端、课中：   端 我 iframe



线路: 找人要数据

倍速: 模版中ref不用.value,会自动解包

进度条：

点击暂停、播放逻辑

一题多讲