// 监听消息容器
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // 检查是否是消息元素
          const messageEl = node.querySelector('.chat-item-text');
          if (node.closest('.chat.chat-secondary') && messageEl) {
            // 发送消息到插件
            chrome.runtime.sendMessage({ type: 'UserReply', data: messageEl.textContent });
          }
        }
      });
    }
  });
});

let messageContainer;
// 开始观察消息容器
function startObserving() {
  messageContainer = document.querySelector('#chat-message-layout.chatroom');
  if (messageContainer) {
    observer.observe(messageContainer, { childList: true, subtree: true });
  }
}

/** 处理用户回复 */
function handleUserReply() {
  const messageEls = Array.from(document.querySelectorAll('.chat'));
  let data = []
  if (messageEls.length) {
    // 找到最后一个响应消息的索引
    const lastIndex = messageEls.findLastIndex((el) => el.classList.contains('chat-reverse'));
    // 获取用户回复
    data = (lastIndex !== -1 ? messageEls.slice(lastIndex + 1) : messageEls).map((el) =>
      Array.from(el.querySelectorAll('.chat-item-text'))
        .map((item) => item.textContent)
        .join(' '),
    );
    // 发送消息到插件
    data.length && chrome.runtime.sendMessage({ type: 'UserReply', data });
  }
}

const handleUserReply1 = () => {
  setTimeout(() => {
    handleUserReply();
    startObserving();
  
    const chatlist = document.querySelector('.chatlist');
    if (chatlist) {
      chatlist.addEventListener(
        'click',
        (e) => {
          if (!e.target.closest('.list-group-item')) return;
          if (messageContainer) observer.disconnect();
          // 切换用户后，获取未回复的内容
          setTimeout(() => {
            handleUserReply();
            startObserving();
          }, 3000);
        },
        true,
      );
    }
  }, 2000);
}

handleUserReply1()

// 使用事件委托监听所有 .dropdown-item 的点击事件
document.addEventListener('click', (e) => {
  if (e.target.closest('.dropdown-item')) {
    setTimeout(() => {
      handleUserReply1()
    }, 500);
  }
}, true);